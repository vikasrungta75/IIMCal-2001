import { NextRequest, NextResponse } from 'next/server';
import { getTokenUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  const user = await getTokenUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await db.announcements.getAll());
}

export async function POST(req: NextRequest) {
  const user = await getTokenUser(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const ann = await db.announcements.create({
    id: uuidv4(), title: body.title, content: body.content,
    category: body.category || 'general', author: body.author || 'Event Committee',
    createdAt: new Date().toISOString(), pinned: body.pinned || false,
  });
  return NextResponse.json(ann);
}

export async function DELETE(req: NextRequest) {
  const user = await getTokenUser(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await req.json();
  await db.announcements.delete(id);
  return NextResponse.json({ ok: true });
}
