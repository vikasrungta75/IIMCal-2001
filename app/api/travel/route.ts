import { NextRequest, NextResponse } from 'next/server';
import { getTokenUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const user = await getTokenUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const info = await db.travel.get(user.id);
  return NextResponse.json(info || null);
}

export async function POST(req: NextRequest) {
  const user = await getTokenUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const info = await db.travel.upsert({ ...body, userId: user.id, updatedAt: new Date().toISOString() });
  return NextResponse.json(info);
}
