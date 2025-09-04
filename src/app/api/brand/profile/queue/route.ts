import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { imageKeys = [], captionsKey = null } = body;

  const client = await clientPromise;
  const db = client.db();

  // Mark user model status so dashboard can show “Building profile…”
  await db.collection("users").updateOne(
    { email },
    { $set: { modelStatus: "queued", updatedAt: new Date() } },
    { upsert: true }
  );

  // Create a job document (your worker/cron can poll this collection)
  const job = await db.collection("brand_profile_jobs").insertOne({
    email,
    imageKeys,
    captionsKey,
    status: "queued",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return NextResponse.json({ ok: true, queued: true, jobId: String(job.insertedId) });
}
