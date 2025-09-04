// src/app/api/assets/hashtags/generate/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_MODEL = process.env.GEMINI_CAPTION_MODEL || "gemini-1.5-flash"; // free-tier works fine

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { caption } = await req.json();
    if (!caption) {
      return NextResponse.json({ error: "Missing caption" }, { status: 400 });
    }

    // --- Ask Gemini for hashtags ---
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
                  text: `Generate 3 different sets of short, popular Instagram-style hashtags for this caption: "${caption}". 
Avoid explanations or numbering, just return clean hashtags separated by spaces in each set.`,
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

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No hashtags generated";

    // Split sets by newlines
    const sets = rawText
      .split(/\n+/)
      .map((line: string) =>
        line
          .trim()
          .replace(/^[-*•\d.]+\s*/, "")
          .split(/\s+/)
          .filter((tag: string) => tag.startsWith("#"))
      )
      .filter((arr: string[]) => arr.length > 0);

    return NextResponse.json({ ok: true, hashtags: sets });
  } catch (err: any) {
    console.error("hashtags-generate error:", err);
    return NextResponse.json(
      { error: "Hashtag generation failed", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}
