// src/app/api/run-cron/route.ts
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("mvp");

    const now = new Date();

    // 1️⃣ Find posts due for publishing
    const duePosts = await db.collection("scheduled_posts").find({
      status: "pending",
      scheduledAt: { $lte: now },
    }).toArray();

    const igBusinessId = process.env.INSTAGRAM_BUSINESS_ID!;
    const token = process.env.FACEBOOK_SYSTEM_USER_TOKEN!;

    const published: any[] = [];

    for (const post of duePosts) {
      try {
        console.log("🚀 Trying to publish post:", post._id, post.imageUrl);

        // 2️⃣ Step 1: Create media container
        const createRes = await fetch(
          `https://graph.facebook.com/v21.0/${igBusinessId}/media`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_url: post.imageUrl,
              caption: post.caption || "",
              access_token: token,
            }),
          }
        );
        const createData = await createRes.json();
        console.log("📸 Media create response:", createData);

        if (!createData.id) throw new Error(JSON.stringify(createData));

        // 3️⃣ Step 2: Publish container
        const publishRes = await fetch(
          `https://graph.facebook.com/v21.0/${igBusinessId}/media_publish`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              creation_id: createData.id,
              access_token: token,
            }),
          }
        );
        const publishData = await publishRes.json();
        console.log("✅ Publish response:", publishData);

        if (!publishData.id) throw new Error(JSON.stringify(publishData));

        // ✅ Success → update DB
        await db.collection("scheduled_posts").updateOne(
          { _id: post._id },
          { $set: { status: "published", publishedAt: new Date() } }
        );

        published.push(post._id);

      } catch (err: any) {
        console.error("❌ Instagram publish error:", err);

        await db.collection("scheduled_posts").updateOne(
          { _id: post._id },
          { $set: { status: "failed", error: err?.message || String(err) } }
        );
      }
    }

    return NextResponse.json({
      success: true,
      published,
      count: published.length,
    });
  } catch (error) {
    console.error("🔥 Error in run-cron:", error);
    return NextResponse.json({ success: false, error: String(error) });
  }
}
