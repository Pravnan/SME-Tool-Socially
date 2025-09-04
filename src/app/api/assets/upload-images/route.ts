import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import mime from "mime";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // avoid caching of route handler

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const files = form.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files received" }, { status: 400 });
    }

    console.log("[upload-images] received files:", files.map(f => `${f.name} (${f.type || "unknown"})`));

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ email });
    if (!user?._id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const bucket = process.env.WASABI_BUCKET_ASSETS!;
    const endpoint = process.env.WASABI_ENDPOINT!; // e.g. https://s3.ap-northeast-1.wasabisys.com
    if (!bucket || !endpoint) {
      return NextResponse.json({ error: "Wasabi env vars missing" }, { status: 500 });
    }

    const userHash = crypto.createHash("sha1").update(email).digest("hex");

    const docs: Array<{
      userId: ObjectId;
      type: "image";
      imageName: string;
      mime?: string;
      size: number;
      sha256: string;
      key: string;
      url: string;
      createdAt: Date;
    }> = [];

    // dedupe within the same request (exact binary match)
    const seen = new Set<string>();

    for (const f of files) {
      const buf = Buffer.from(await f.arrayBuffer());

      const sha256 = crypto.createHash("sha256").update(buf).digest("hex");
      if (seen.has(sha256)) {
        console.log(`[upload-images] skip duplicate in request: ${f.name}`);
        continue;
      }
      seen.add(sha256);

      // Determine extension
      let ext = mime.getExtension(f.type || "") || path.extname(f.name).replace(".", "");
      if (!ext) ext = "bin";

      const key = `prod/users/${userHash}/assets/${sha256}.${ext}`;

      // Upload to Wasabi (private)
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buf,
          ContentType: f.type || "application/octet-stream",
          ACL: "private",
        })
      );

      const url = `${endpoint}/${bucket}/${key}`;
      console.log("[upload-images] uploaded:", key);

      docs.push({
        userId: new ObjectId(user._id),
        type: "image",
        imageName: f.name,
        mime: f.type,
        size: f.size,
        sha256,
        key,
        url,
        createdAt: new Date(),
      });
    }

    if (docs.length === 0) {
      return NextResponse.json({ error: "All files were duplicates or empty" }, { status: 400 });
    }

    await db.collection("brandAssets").insertMany(docs);

    return NextResponse.json({
      ok: true,
      count: docs.length,
      items: docs.map(({ imageName, key, url, sha256, size, mime }) => ({
        imageName,
        key,
        url,
        sha256,
        size,
        mime,
      })),
    });
  } catch (err: any) {
    console.error("[upload-images] error:", err);
    return NextResponse.json(
      { error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
