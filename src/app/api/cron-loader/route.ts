// src/app/api/_cron-loader/route.ts
import "@/lib/cron";
export const runtime = "nodejs";

export async function GET() {
  return new Response("Cron is running in the background 🚀");
}
