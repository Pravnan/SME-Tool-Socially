// src/app/api/accounts/facebook/start/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const FB_APP_ID = process.env.FACEBOOK_APP_ID!;
const FB_REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/accounts/facebook/callback`;

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
  }

  // Permissions: manage pages + instagram_basic + publish
  const scope = [
    "pages_show_list",
    "pages_manage_posts",
    "pages_read_engagement",
    "instagram_basic",
    "instagram_content_publish",
  ].join(",");

  const state = encodeURIComponent(session.user.email); // You can encrypt this instead

  const fbAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(
    FB_REDIRECT_URI
  )}&scope=${scope}&response_type=code&state=${state}`;

  return NextResponse.redirect(fbAuthUrl);
}
