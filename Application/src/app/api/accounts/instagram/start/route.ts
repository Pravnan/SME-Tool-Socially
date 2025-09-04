import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const FB_APP_ID = process.env.FACEBOOK_APP_ID!;
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI!;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
  }

  const scope = [
    "instagram_basic",
    "instagram_content_publish",
    "pages_show_list",
    "pages_manage_posts",
  ].join(",");

  const state = encodeURIComponent(session.user.email);

  const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${scope}&response_type=code&state=${state}`;

  return NextResponse.redirect(url);
}
