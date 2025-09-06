import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("mvp");

    // clear Instagram connection for this user
    await db.collection("socialAccounts").updateOne(
      { email: session.user.email, platform: "instagram" },
      {
        $unset: {
          businessId: "",
          accessToken: "",
        },
        $set: {
          connected: false,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Unlink failed:", err);
    return NextResponse.json({ error: "Failed to unlink" }, { status: 500 });
  }
}
