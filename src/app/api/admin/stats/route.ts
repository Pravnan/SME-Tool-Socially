import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mvp");

    // --- Users
    const totalUsers = await db.collection("users").countDocuments();

    // --- Posts (use scheduled_posts collection)
    const scheduledPosts = await db
      .collection("scheduled_posts")
      .countDocuments({ status: "pending" }); // pending == scheduled
    const publishedPosts = await db
      .collection("scheduled_posts")
      .countDocuments({ status: "published" });

    // --- Images (use brandGenerations collection)
    const imagesCreated = await db.collection("brandGenerations").countDocuments();

    // --- Posts over time (group by day)
    const postsOverTimeAgg = await db
      .collection("scheduled_posts")
      .aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const postsOverTime = postsOverTimeAgg.map((r) => ({
      date: r._id,
      count: r.count,
    }));

    // --- Posts by platform
    const postsByPlatformAgg = await db
      .collection("scheduled_posts")
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
      { error: "Failed to fetch stats", detail: String(err) },
      { status: 500 }
    );
  }
}
