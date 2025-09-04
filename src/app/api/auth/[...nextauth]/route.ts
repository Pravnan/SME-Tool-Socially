// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password || "";
        if (!email || !password) return null;

        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email });
        if (!user || !user.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          image: user.image || null,
          role: user.role || "user",
        };
      },
    }),
  ],
  pages: { signIn: "/login" },
  events: {
    async createUser({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db();
        if (!user?.email) return;
        await db.collection("users").updateOne(
          { email: user.email.toLowerCase() },
          {
            $set: {
              onboardingChoice: null,
              onboardingAt: null,
              modelStatus: "none",
              modelId: null,
              role: "user",
            },
          }
        );
      } catch (err) {
        console.error("[NextAuth events.createUser] init fields error:", err);
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as any).id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.uid) {
        (session.user as any).id = token.uid as string;
        (session.user as any).role = (token as any).role || "user";
      }
      try {
        if (session.user?.email) {
          const client = await clientPromise;
          const db = client.db();
          const doc = await db
            .collection("users")
            .findOne({ email: session.user.email.toLowerCase() });
          if (doc) {
            (session.user as any).onboardingChoice = doc.onboardingChoice ?? null;
            (session.user as any).modelStatus = doc.modelStatus ?? "none";
            (session.user as any).modelId = doc.modelId ?? null;
            (session.user as any).role = doc.role ?? "user";
          }
        }
      } catch (err) {
        console.error("[NextAuth callbacks.session] enrich error:", err);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/`) {
        try {
          const u = new URL(url);
          if (u.searchParams.get("callbackUrl")) {
            return u.searchParams.get("callbackUrl")!;
          }
        } catch (_) {}
        return `${baseUrl}/dashboard`;
      }
      return url;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
