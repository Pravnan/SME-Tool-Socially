import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
  }

  const client = await clientPromise;
  const db = client.db("mvp");

  // Hard-coded Instagram connection
  await db.collection("socialAccounts").updateOne(
    { email: session.user.email, platform: "instagram" },
    {
      $set: {
        businessId: process.env.INSTAGRAM_BUSINESS_ID,
        accessToken: process.env.FACEBOOK_SYSTEM_USER_TOKEN,
        connected: true,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
}
