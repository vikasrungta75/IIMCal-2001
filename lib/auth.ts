import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextauth';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'iimc-jubilee-secret'
);

export async function createToken(payload: { userId: string; username: string; isAdmin?: boolean }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: string; username: string; isAdmin?: boolean };
  } catch { return null; }
}

export async function getSession() {
  try {
    const s = await getServerSession(authOptions);
    if (s?.user) {
      let username = (s.user as any).username || '';
      let userId = (s.user as any).userId || '';
      let status = (s.user as any).status;
      let profileSubmitted = (s.user as any).profileSubmitted;

      // Always look up from DB for OAuth users to get fresh status
      if (s.user.email) {
        const { db } = await import('@/lib/db');
        const dbUser = await db.users.findByEmail(s.user.email);
        if (dbUser) {
          username = dbUser.username;
          userId = dbUser.id;
          status = dbUser.status;
          profileSubmitted = dbUser.profileSubmitted;
        }
      }

      if (username) {
        return {
          userId,
          username,
          isAdmin: (s.user as any).isAdmin || false,
          status: status || 'pending',
          profileSubmitted: profileSubmitted || false,
          name: s.user.name || '',
          email: s.user.email || '',
          image: s.user.image || '',
        };
      }
    }
  } catch {}
  return null;
}
