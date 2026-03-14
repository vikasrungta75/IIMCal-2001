import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';

// Uses JWT directly - works regardless of NEXTAUTH_URL
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || 'iimc-jubilee-secret',
    });

    if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 });

    // Admin via credentials
    if (token.isAdmin && token.username) {
      const admin = await db.users.findByUsername(token.username as string);
      if (admin?.isAdmin) {
        const { password, ...safe } = admin;
        return NextResponse.json({ ...safe, isAdmin: true });
      }
    }

    const email = token.email as string;
    if (!email) return NextResponse.json({ error: 'No email' }, { status: 401 });

    let user = await db.users.findByEmail(email);

    // First-time OAuth user - create record if signIn callback missed it
    if (!user) {
      const { v4: uuidv4 } = await import('uuid');
      const base = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase();
      const username = base + Math.floor(Math.random() * 900 + 100);
      user = await db.users.create({
        id: uuidv4(), username, password: '', email,
        fullName: (token.name as string) || username,
        batch: '', programme: '',
        createdAt: new Date().toISOString(),
        status: 'pending', profileSubmitted: false,
        oauthProvider: 'google',
      });
    }

    const { password, ...safe } = user;
    return NextResponse.json({ ...safe, sessionName: token.name, sessionImage: token.picture });
  } catch (err: any) {
    console.error('[/api/me]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
