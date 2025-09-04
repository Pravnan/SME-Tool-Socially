import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const FB_APP_ID = process.env.FACEBOOK_APP_ID!;
const FB_APP_SECRET = process.env.FACEBOOK_APP_SECRET!;
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // this is user email from earlier

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  // 1. Exchange code for access token
  const tokenRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&client_secret=${FB_APP_SECRET}&code=${code}`
  );

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return NextResponse.json({ error: "Token exchange failed", detail: tokenData }, { status: 400 });
  }

  // 2. Store token in MongoDB for this user
  const client = await clientPromise;
  const db = client.db();

  await db.collection("socialAccounts").updateOne(
    { email: state, platform: "instagram" },
    {
      $set: {
        accessToken: tokenData.access_token,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
}
