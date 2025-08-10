import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password too short" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    await users.createIndex({ email: 1 }, { unique: true });

    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();

    const { insertedId } = await users.insertOne({
      name,
      email: email.toLowerCase(),
      passwordHash,
      image: null,
      provider: "credentials",
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ ok: true, userId: insertedId.toString() }, { status: 201 });
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    console.error("REGISTER_ERROR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
