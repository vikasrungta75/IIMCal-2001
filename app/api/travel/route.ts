import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let user = session.username ? await db.users.findByUsername(session.username) : null;
  if (!user && session.email) user = await db.users.findByEmail(session.email);
  const info = user ? await db.travel.get(user.id) : null;
  return NextResponse.json(info || null);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let user = session.username ? await db.users.findByUsername(session.username) : null;
  if (!user && session.email) user = await db.users.findByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const body = await req.json();
  const info = await db.travel.upsert({ ...body, userId: user.id, updatedAt: new Date().toISOString() });
  return NextResponse.json(info);
}
