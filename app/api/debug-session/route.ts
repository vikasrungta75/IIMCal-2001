import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextauth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const s = await getServerSession(authOptions);
    if (!s) return NextResponse.json({ error: 'No session' });
    const email = s.user?.email;
    let dbUser = null;
    if (email) dbUser = await db.users.findByEmail(email);
    return NextResponse.json({
      sessionUser: s.user,
      dbUser: dbUser ? { username: dbUser.username, status: dbUser.status, profileSubmitted: dbUser.profileSubmitted, email: dbUser.email } : null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
