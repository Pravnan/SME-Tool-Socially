export const env = {
  MONGODB_URI: process.env.MONGODB_URI!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  WASABI_REGION: process.env.WASABI_REGION!,
  WASABI_ENDPOINT: process.env.WASABI_ENDPOINT!,
  WASABI_ACCESS_KEY_ID: process.env.WASABI_ACCESS_KEY_ID!,
  WASABI_SECRET_ACCESS_KEY: process.env.WASABI_SECRET_ACCESS_KEY!,
  WASABI_BUCKET_GENERATIONS: process.env.WASABI_BUCKET_GENERATIONS!,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
};
Object.entries(env).forEach(([k, v]) => { if (!v) throw new Error(`Missing env: ${k}`); });
