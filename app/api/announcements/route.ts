import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(db.announcements.getAll());
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const a = db.announcements.create({
    id: uuidv4(),
    title: body.title,
    content: body.content,
    category: body.category || 'general',
    author: body.author || 'Event Committee',
    createdAt: new Date().toISOString(),
    pinned: body.pinned || false,
  });
  return NextResponse.json(a);
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await req.json();
  db.announcements.delete(id);
  return NextResponse.json({ ok: true });
}
