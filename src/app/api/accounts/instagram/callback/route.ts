import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: false, message: "Not used. Instagram is hard-wired." });
}
