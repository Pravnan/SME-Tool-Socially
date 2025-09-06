// src/app/api/schedule-post/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, imageKey, caption, scheduledAt, platform = "instagram", hashtags = [] } =
      await req.json();

    // ✅ Validate input
    if (!imageUrl || !caption || !scheduledAt) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!imageUrl.startsWith("http")) {
      return NextResponse.json(
        { error: "Invalid imageUrl: must be a public HTTPS link" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("mvp");

    // ✅ Insert into scheduled_posts
    const result = await db.collection("scheduled_posts").insertOne({
      imageUrl,       // full public URL (for IG API)
      imageKey,       // optional reference in Wasabi
      caption,
      hashtags,
      platform,
      scheduledAt: new Date(scheduledAt),
      status: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("Error in schedule-post:", err);
    return NextResponse.json(
      { error: "Failed to save scheduled post", detail: String(err) },
      { status: 500 }
    );
  }
}
