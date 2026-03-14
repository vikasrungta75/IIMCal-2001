import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';

async function resolveUser(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || 'iimc-jubilee-secret',
    });
    if (!token) return null;

    // Admin
    if (token.isAdmin && token.username) {
      const admin = await db.users.findByUsername(token.username as string);
      if (admin?.isAdmin) return { user: admin, isAdmin: true };
    }

    // OAuth user
    const email = token.email as string;
    if (!email) return null;
    const user = await db.users.findByEmail(email);
    return user ? { user, isAdmin: false } : null;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  const result = await resolveUser(req);
  if (!result) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { password, ...safe } = result.user;
  return NextResponse.json(safe);
}

export async function PUT(req: NextRequest) {
  const result = await resolveUser(req);
  if (!result) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  delete body.password; delete body.username; delete body.isAdmin;
  delete body.approvedAt; delete body.approvedBy;
  if (body.status && body.status !== 'pending') delete body.status;

  const updated = await db.users.update(result.user.username, body);
  if (!updated) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  const { password, ...safe } = updated;
  return NextResponse.json(safe);
}
