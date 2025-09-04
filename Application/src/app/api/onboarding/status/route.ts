// src/app/api/onboarding/status/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { needsOnboarding: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne(
      { email: session.user.email.toLowerCase() },
      { projection: { _id: 1, onboardingChoice: 1 } }
    );

    if (!user?._id) {
      return NextResponse.json(
        { needsOnboarding: null, error: "User not found" },
        { status: 404 }
      );
    }

    const assetCount = await db
      .collection("brandAssets")
      .countDocuments({ userId: user._id });

    if (assetCount > 0) {
      return NextResponse.json({ needsOnboarding: false });
    }

    return NextResponse.json({
      needsOnboarding: true,
      onboardingChoice: user.onboardingChoice || null,
    });
  } catch (err: any) {
    console.error("Onboarding status error:", err);
    return NextResponse.json(
      { needsOnboarding: null, error: "Server error" },
      { status: 500 }
    );
  }
}
