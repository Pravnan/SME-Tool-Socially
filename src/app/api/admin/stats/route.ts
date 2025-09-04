import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // --- Users
    const totalUsers = await db.collection("users").countDocuments();

    // --- Posts (assume posts collection)
    const scheduledPosts = await db
      .collection("posts")
      .countDocuments({ status: "scheduled" });
    const publishedPosts = await db
      .collection("posts")
      .countDocuments({ status: "published" });

    // --- Images (assume generations collection)
    const imagesCreated = await db.collection("generations").countDocuments();

    // --- Posts over time (group by week)
    const postsOverTimeAgg = await db
      .collection("posts")
      .aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              week: { $isoWeek: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.week": 1 } },
      ])
      .toArray();

    const postsOverTime = postsOverTimeAgg.map((r) => ({
      date: `W${r._id.week} ${r._id.year}`,
      count: r.count,
    }));

    // --- Posts by platform
    const postsByPlatformAgg = await db
      .collection("posts")
      .aggregate([
        { $group: { _id: "$platform", value: { $sum: 1 } } },
      ])
      .toArray();

    const postsByPlatform = postsByPlatformAgg.map((r) => ({
      platform: r._id || "Unknown",
      value: r.value,
    }));

    return NextResponse.json({
      totalUsers,
      scheduledPosts,
      publishedPosts,
      imagesCreated,
      postsOverTime,
      postsByPlatform,
    });
  } catch (err) {
    console.error("ADMIN_STATS_ERROR", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
