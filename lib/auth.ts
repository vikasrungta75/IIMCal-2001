import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextauth';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'iimc-jubilee-secret'
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
  // 1. Try NextAuth session
  try {
    const s = await getServerSession(authOptions);
    if (s?.user) {
      let username = (s.user as any).username || '';
      let userId = (s.user as any).userId || '';
      // For OAuth users, username may not be in token — look up by email
      if (!username && s.user.email) {
        const { db } = await import('@/lib/db');
        const dbUser = db.users.findByEmail(s.user.email);
        if (dbUser) {
          username = dbUser.username;
          userId = dbUser.id;
        }
      }
      if (username) {
        return {
          userId,
          username,
          isAdmin: (s.user as any).isAdmin || false,
          name: s.user.name || '',
          email: s.user.email || '',
          image: s.user.image || '',
        };
      }
    }
  } catch {}
  // 2. Fallback: legacy cookie
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (token) {
      const p = await verifyToken(token);
      if (p) return { ...p, name: '', email: '', image: '' };
    }
  } catch {}
  return null;
}
