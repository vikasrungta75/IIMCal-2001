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
      return {
        userId: (s.user as any).userId || '',
        username: (s.user as any).username || '',
        isAdmin: (s.user as any).isAdmin || false,
        name: s.user.name || '',
        email: s.user.email || '',
        image: s.user.image || '',
      };
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
