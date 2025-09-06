import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

type PlatformKey = "instagram" | "facebook" | "linkedin";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("mvp");

    // find all social accounts for this user
    const accounts = await db
      .collection("socialAccounts")
      .find({ email: session.user.email })
      .toArray();

    // default false
    const status: Record<PlatformKey, boolean> = {
      instagram: false,
      facebook: false,
      linkedin: false,
    };

    for (const acc of accounts) {
      if (acc.platform && status.hasOwnProperty(acc.platform)) {
        status[acc.platform as PlatformKey] = !!acc.connected;
      }
    }

    return NextResponse.json({ ok: true, status });
  } catch (err: any) {
    console.error("Error in /api/accounts/status:", err);
    return NextResponse.json(
      { error: "Failed to fetch account status" },
      { status: 500 }
    );
  }
}
