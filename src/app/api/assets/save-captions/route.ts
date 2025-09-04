// src/app/api/assets/save-captions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

export const runtime = "nodejs";

// Build a simple CSV: one caption per line, quotes escaped
function toCsv(captions: string[]): Buffer {
  const rows = captions
    .map((c) => `"${String(c).replace(/"/g, '""')}"`)
    .join("\n");
  return Buffer.from(rows, "utf8");
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // read and validate
  const body = await req.json().catch(() => null);
  const input: string[] =
    (body?.captions as string[] | undefined)?.map((s) => String(s).trim()) || [];

  if (!input.length) {
    return NextResponse.json({ error: "No captions" }, { status: 400 });
  }

  // de-duplicate + length guard (8..400 like your UI hint)
  const seen = new Set<string>();
  const captions = input.filter((s) => {
    if (s.length < 8 || s.length > 400) return false;
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  });

  if (!captions.length) {
    return NextResponse.json({ error: "No valid captions after filtering" }, { status: 400 });
  }

  // find user
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ email });
  if (!user?._id) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Wasabi details
  const bucket = process.env.WASABI_BUCKET_ASSETS!;
  const endpoint = process.env.WASABI_ENDPOINT!; // e.g. https://s3.ap-northeast-1.wasabisys.com
  const userHash = crypto.createHash("sha1").update(email).digest("hex");
  const ts = Date.now();
  const key = `prod/users/${userHash}/captions/${ts}.csv`;
  const url = `${endpoint}/${bucket}/${key}`;

  // Upload CSV to Wasabi (private)
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: toCsv(captions),
      ContentType: "text/csv",
      ACL: "private",
    })
  );

  // Store ONE metadata doc for this CSV in your existing collection
  await db.collection("brandAssets").insertOne({
    userId: new ObjectId(user._id),
    type: "captions_csv",
    key,
    url,
    count: captions.length,
    createdAt: new Date(),
  });

  // (Optional) If you ALSO want individual caption docs, uncomment:
  /*
  const docs = captions.map((text) => ({
    userId: new ObjectId(user._id),
    type: "caption" as const,
    text,
    createdAt: new Date(),
  }));
  if (docs.length) await db.collection("brandAssets").insertMany(docs);
  */

  return NextResponse.json({ ok: true, key, url, count: captions.length });
}
