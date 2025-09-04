import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import clientPromise from '@/lib/mongodb';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const client = await clientPromise;
  const db = client.db();

  await db.collection('users').updateOne(
    { email: session.user.email.toLowerCase() },
    { $set: { modelStatus: 'queued' } }
  );

  return NextResponse.json({ ok: true });
}
