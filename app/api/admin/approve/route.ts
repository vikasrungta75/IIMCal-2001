import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { username, action, reason } = await req.json();
  if (!username || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  if (action === 'approve') {
    const updated = db.users.approve(username);
    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const { password, ...safe } = updated;
    return NextResponse.json({ ok: true, user: safe });
  }
  if (action === 'reject') {
    const updated = db.users.reject(username, reason || 'Not from Batch 1999-2001');
    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const { password, ...safe } = updated;
    return NextResponse.json({ ok: true, user: safe });
  }
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
