import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3 = new S3Client({
  region: process.env.WASABI_REGION!,
  endpoint: process.env.WASABI_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY_ID!,
    secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("image") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Ensure JPG
  if (!file.type.includes("jpeg")) {
    return NextResponse.json({ error: "Only JPG allowed" }, { status: 400 });
  }

  // Unique key
  const key = `temp/${crypto.randomBytes(16).toString("hex")}.jpg`;

  try {
    // Upload file to Wasabi
    const buffer = Buffer.from(await file.arrayBuffer());
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.WASABI_BUCKET_GENERATIONS!,
        Key: key,
        Body: buffer,
        ContentType: "image/jpeg",
      })
    );

    // ✅ Generate signed URL for downloading/previewing
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: process.env.WASABI_BUCKET_GENERATIONS!,
        Key: key,
      }),
      { expiresIn: 3600 } // 1 hour
    );

    return NextResponse.json({
      ok: true,
      key,
      url,
    });
  } catch (err: any) {
    console.error("upload-temp error:", err);
    return NextResponse.json(
      { error: "Upload failed", details: err.message },
      { status: 500 }
    );
  }
}
