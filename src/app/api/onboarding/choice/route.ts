import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';

// Save onboarding choice
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { choice } = await req.json();
  if (choice !== 'assets' && choice !== 'new') {
    return NextResponse.json({ error: 'Invalid choice' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  await db.collection('users').updateOne(
    { email: session.user.email.toLowerCase() },
    {
      $set: {
        onboardingChoice: choice,
        onboardingAt: new Date(),
        modelStatus: 'none', // or "queued"
      },
    },
    { upsert: false } // user already exists from NextAuth
  );

  return NextResponse.json({ ok: true, choice });
}

// Debug helper: fetch current choice
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection('users').findOne(
    { email: session.user.email.toLowerCase() },
    { projection: { onboardingChoice: 1, onboardingAt: 1 } }
  );

  return NextResponse.json({
    onboardingChoice: user?.onboardingChoice || null,
    onboardingAt: user?.onboardingAt || null,
  });
}
