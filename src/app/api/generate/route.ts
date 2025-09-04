// src/app/api/generate/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { s3 } from "@/lib/s3";
import {
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GoogleAuth } from "google-auth-library";
import sharp from "sharp";
import crypto from "crypto";

export const runtime = "nodejs";

// -----------------------------
// Config
// -----------------------------
const EXPANDER_URL =
  process.env.EXPANDER_URL || "http://127.0.0.1:8000/expand";
const WASABI_BUCKET_ASSETS = process.env.WASABI_BUCKET_ASSETS!;
const WASABI_BUCKET_GENERATIONS =
  process.env.WASABI_BUCKET_GENERATIONS || WASABI_BUCKET_ASSETS;

const USE_GEMINI_IMAGES =
  (process.env.USE_GEMINI_IMAGES || "false").toLowerCase() === "true";

const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID!;
const GOOGLE_LOCATION = process.env.GOOGLE_LOCATION || "us-central1";
const IMAGEN_MODEL =
  process.env.GEMINI_IMAGE_MODEL || "imagen-4.0-generate-001";

// -----------------------------
// Helpers
// -----------------------------
async function getPresignedAssetUrls(userId: any, db: any) {
  const items = await db
    .collection("brandAssets")
    .find({ userId, type: "image" })
    .project({ key: 1, _id: 0 })
    .limit(20)
    .toArray();

  const urls: string[] = [];
  for (const it of items) {
    if (!it?.key) continue;
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: WASABI_BUCKET_ASSETS, Key: it.key }),
      { expiresIn: 3600 }
    );
    urls.push(url);
  }
  return urls;
}

// -----------------------------
// Imagen 4 via Vertex AI
// -----------------------------
async function generateWithImagen4(expanded: string): Promise<Uint8Array> {
  // ✅ ensure Imagen always gets non-empty prompt
  const safePrompt =
    expanded?.trim() || "Simple clean 1:1 marketing image with placeholder text";

  const endpoint = `https://${GOOGLE_LOCATION}-aiplatform.googleapis.com/v1/projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}/publishers/google/models/${IMAGEN_MODEL}:predict`;
  console.log("🌍 Imagen endpoint =", endpoint);
  console.log("📝 Final prompt sent to Imagen =", safePrompt);

  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      instances: [{ prompt: safePrompt, size: "1024x1024" }],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Imagen error: ${txt}`);
  }

  const j = await res.json();
  console.log("🔍 Imagen API response =", JSON.stringify(j, null, 2));

  const b64 =
    j?.predictions?.[0]?.bytesBase64 ||
    j?.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error("Imagen returned no image bytes");

  return Buffer.from(b64, "base64");
}

// -----------------------------
// Main API
// -----------------------------
export async function POST(req: Request) {
  console.log("🚀 Hitting /api/generate endpoint");
  console.log("EXPANDER_URL =", EXPANDER_URL);

  try {
    // 1) Validate session
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Parse user intent
    const { intent } = await req.json().catch(() => ({ intent: "" }));
    if (!intent) {
      return NextResponse.json({ error: "Missing intent" }, { status: 400 });
    }

    // 3) Look up user
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ email });
    if (!user?._id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4) Brand assets
    const image_urls = await getPresignedAssetUrls(user._id, db);

    // 5) Brand profile hint
    const existingProfileDoc = await db
      .collection("brandProfiles")
      .findOne({ userId: user._id });
    const brand_profile_hint = existingProfileDoc?.profile || null;

    // 6) Expander service
    const expandRes = await fetch(EXPANDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent,
        image_urls,
        brand_profile_hint,
        brand_hex: brand_profile_hint?.primaryColorHex || null, // ✅ NEW
      }),
      cache: "no-store",
    });
    if (!expandRes.ok) {
      const txt = await expandRes.text();
      return NextResponse.json(
        { error: "expand_failed", detail: txt },
        { status: 502 }
      );
    }
    const { expanded, profile, per_image } = await expandRes.json();

    // 7) Save brand profile
    await db.collection("brandProfiles").updateOne(
      { userId: user._id },
      {
        $set: { profile, updatedAt: new Date() },
        $setOnInsert: { userId: user._id, createdAt: new Date() },
      },
      { upsert: true }
    );

    // 8) Image generation
    let outputUrl: string | undefined;
    let keyOut: string | undefined;
    if (USE_GEMINI_IMAGES) {
      try {
        const pngBytes = await generateWithImagen4(expanded);
        const jpgBytes = await sharp(pngBytes).jpeg({ quality: 90 }).toBuffer();
        const hash = crypto.createHash("sha256").update(jpgBytes).digest("hex");
        keyOut = `generated/${hash}.jpg`;

        await s3.send(
          new PutObjectCommand({
            Bucket: WASABI_BUCKET_GENERATIONS,
            Key: keyOut,
            Body: jpgBytes,
            ContentType: "image/jpeg",
            ACL: "private",
          })
        );

        // ✅ signed URL for preview
        outputUrl = await getSignedUrl(
          s3,
          new GetObjectCommand({
            Bucket: WASABI_BUCKET_GENERATIONS,
            Key: keyOut,
          }),
          { expiresIn: 3600 }
        );
      } catch (e: any) {
        console.error("❌ Imagen generation failed:", e);
      }
    }

    // 9) Save generation record
    await db.collection("brandGenerations").insertOne({
      userId: user._id,
      intent,
      expandedPrompt: expanded,
      profile,
      per_image,
      outputUrl,
      key: keyOut,
      provider: USE_GEMINI_IMAGES ? "imagen-4" : "expander",
      model: USE_GEMINI_IMAGES ? IMAGEN_MODEL : null,
      createdAt: new Date(),
    });

    // 10) Response
    return NextResponse.json({
      ok: true,
      profile,
      expanded,
      per_image,
      outputUrl,
      key: keyOut,
    });
  } catch (err: any) {
    console.error("❌ Error in /api/generate:", err);
    return NextResponse.json(
      { error: "unhandled", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}
