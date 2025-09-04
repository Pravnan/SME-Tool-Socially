// src/app/api/assets/captions/generate/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_MODEL = process.env.GEMINI_CAPTION_MODEL || "gemini-1.5-flash"; // ✅ free multimodal

// Wasabi S3 client
const s3 = new S3Client({
  region: process.env.WASABI_REGION!,
  endpoint: process.env.WASABI_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY_ID!,
    secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY!,
  },
});

// Helper: stream → buffer
async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: any[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { key } = await req.json();
    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    // 1. Download image from Wasabi
    const getCmd = new GetObjectCommand({
      Bucket: process.env.WASABI_BUCKET_GENERATIONS!,
      Key: key,
    });
    const s3Res = await s3.send(getCmd);
    const buffer = await streamToBuffer(s3Res.Body);
    const base64 = buffer.toString("base64");

    // 2. Call Gemini Vision
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        GEMINI_MODEL
      )}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a social media assistant. Look at the image and write 4 engaging, natural captions with emojis. 
                  - Do NOT add numbers, bullets, hashtags, or explanations. 
                  - Just output the raw captions, one per line.`,
                },
                {
                  inline_data: {
                    mime_type: "image/png", // safer default
                    data: base64,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Gemini error: ${txt}`);
    }

    const data = await res.json();

    // 3. Extract captions from all parts
    const parts =
      data?.candidates?.flatMap((c: any) => c?.content?.parts || []) || [];

    const rawText = parts.map((p: any) => p.text || "").join("\n");

    const captions = rawText
      .split(/\n+/)
      .map((c: string) =>
        c
          .replace(/^[-*•\d.]+/, "") // remove bullets/numbers
          .replace(/^["“”]+|["“”]+$/g, "") // strip quotes
          .replace(/\*\*/g, "") // remove markdown
          .trim()
      )
      .filter((c: string) => c.length > 0);

    return NextResponse.json({ ok: true, captions });
  } catch (err: any) {
    console.error("caption-generate error:", err);
    return NextResponse.json(
      { error: "Caption generation failed", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}
