import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: "user" | "admin";
  }

  interface Session {
    user: {
      id: string;
      role?: "user" | "admin";
    } & DefaultSession["user"];
  }

  interface JWT {
    uid?: string;
    role?: "user" | "admin";
  }
}
