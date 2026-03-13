import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let user = session.username ? db.users.findByUsername(session.username) : null;
  if (!user && session.email) user = db.users.findByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const { password, ...safe } = user;
  return NextResponse.json({ ...safe, sessionName: session.name, sessionImage: session.image });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  delete body.password;
  delete body.username;
  delete body.isAdmin;

  let user = session.username ? db.users.findByUsername(session.username) : null;
  if (!user && session.email) user = db.users.findByEmail(session.email);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const updated = db.users.update(user.username, body);
  if (!updated) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  const { password, ...safe } = updated;
  return NextResponse.json(safe);
}
