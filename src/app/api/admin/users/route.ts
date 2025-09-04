// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";

// ✅ Middleware-like protection inside API
async function requireAdmin(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return null;
  }
  return session;
}

// GET: List all users
export async function GET(req: Request) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db();
  const users = await db
    .collection("users")
    .find({}, { projection: { passwordHash: 0 } }) // hide passwordHash
    .toArray();

  return NextResponse.json(users);
}

// POST: Create new user
export async function POST(req: Request) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, role = "user" } = await req.json();
  if (!name || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const now = new Date();

  const existing = await db.collection("users").findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const { insertedId } = await db.collection("users").insertOne({
    name,
    email: email.toLowerCase(),
    role,
    createdAt: now,
    updatedAt: now,
    provider: "admin-manual",
  });

  return NextResponse.json({ ok: true, userId: insertedId.toString() });
}

// PUT: Update user (role, status, etc.)
export async function PUT(req: Request) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...updates } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db();
  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } });

  return NextResponse.json({ ok: true });
}

// DELETE: Remove user
export async function DELETE(req: Request) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db();
  await db.collection("users").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ ok: true });
}
