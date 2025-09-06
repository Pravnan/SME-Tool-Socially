// src/app/api/suggest-time/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform") || "instagram";

  const client = await clientPromise;
  const db = client.db("mvp");

  // Look at last 30 posts for this platform
  const posts = await db.collection("scheduled_posts")
    .find({ platform, status: "published" })
    .sort({ publishedAt: -1 })
    .limit(30)
    .toArray();

  let bestHour = platform === "facebook" ? 12 : 19; // fallback

  if (posts.length > 0) {
    // Group by posting hour
    const byHour: Record<number, { count: number; score: number }> = {};

    for (const post of posts) {
      const hour = new Date(post.publishedAt).getHours();
      const score = post.metrics?.impressions || 1; // fallback
      if (!byHour[hour]) byHour[hour] = { count: 0, score: 0 };
      byHour[hour].count++;
      byHour[hour].score += score;
    }

    // Pick the hour with max average score
    const best = Object.entries(byHour).reduce(
      (acc, [hour, data]) => {
        const avg = data.score / data.count;
        return avg > acc.avg ? { hour: Number(hour), avg } : acc;
      },
      { hour: bestHour, avg: -Infinity }
    );

    bestHour = best.hour;
  }

  const now = new Date();
  let suggested = new Date(now.getFullYear(), now.getMonth(), now.getDate(), bestHour);

  if (suggested < now) suggested.setDate(suggested.getDate() + 1);

  return NextResponse.json({
    date: suggested.toISOString().slice(0, 10),
    time: suggested.toTimeString().slice(0, 5),
  });
}
