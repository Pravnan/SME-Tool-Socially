// src/app/api/history/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('mvp');

    const posts = await db
      .collection('scheduled_posts')
      .find({})
      .sort({ scheduledAt: 1 })
      .toArray();

    return NextResponse.json({ posts });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
