import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextauth';
import { SignJWT, jwtVerify } from 'jose';

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
    if (!s?.user) return null;

    const { db } = await import('@/lib/db');

    // For admin (credentials login) - they have username in token but email may differ
    const tokenUsername = (s.user as any).username;
    const tokenIsAdmin = (s.user as any).isAdmin;
    
    if (tokenIsAdmin && tokenUsername) {
      const adminUser = await db.users.findByUsername(tokenUsername);
      if (adminUser?.isAdmin) {
        return {
          userId: adminUser.id,
          username: adminUser.username,
          isAdmin: true,
          status: 'approved' as const,
          profileSubmitted: true,
          name: adminUser.fullName,
          email: adminUser.email,
          image: '',
        };
      }
    }

    // For OAuth users - use email as the primary key (most reliable)
    if (!s.user.email) return null;
    
    const dbUser = await db.users.findByEmail(s.user.email);
    if (!dbUser) return null;

    return {
      userId: dbUser.id,
      username: dbUser.username,
      isAdmin: !!dbUser.isAdmin,
      status: dbUser.status || 'pending',
      profileSubmitted: dbUser.profileSubmitted || false,
      name: s.user.name || dbUser.fullName || '',
      email: s.user.email,
      image: s.user.image || '',
    };
  } catch (err) {
    console.error('[getSession] error:', err);
    return null;
  }
}
