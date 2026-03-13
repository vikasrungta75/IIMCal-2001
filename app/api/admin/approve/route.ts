import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { username, action, reason } = await req.json();
  if (!username || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  if (action === 'approve') {
    const updated = db.users.approve(username);
    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // Send approval email (non-blocking)
    if (updated.email) {
      sendApprovalEmail(updated.email, updated.fullName).catch(console.error);
    }
    const { password, ...safe } = updated;
    return NextResponse.json({ ok: true, user: safe });
  }

  if (action === 'reject') {
    const r = reason || 'Not verified as Batch 1999–2001 alumni';
    const updated = db.users.reject(username, r);
    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // Send rejection email (non-blocking)
    if (updated.email) {
      sendRejectionEmail(updated.email, updated.fullName, r).catch(console.error);
    }
    const { password, ...safe } = updated;
    return NextResponse.json({ ok: true, user: safe });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
