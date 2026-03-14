import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'iimc-jubilee-secret';

const SECRET = new TextEncoder().encode(SECRET_KEY);

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

// Used by SERVER COMPONENTS (dashboard, etc.) - reads JWT from cookies
export async function getSession(req?: NextRequest) {
  try {
    const { cookies } = await import('next/headers');
    const { getServerSession } = await import('next-auth/next');
    const { authOptions } = await import('@/lib/nextauth');

    const s = await getServerSession(authOptions);
    if (!s?.user) return null;

    const { db } = await import('@/lib/db');

    if ((s.user as any).isAdmin && (s.user as any).username) {
      const admin = await db.users.findByUsername((s.user as any).username);
      if (admin?.isAdmin) return {
        userId: admin.id, username: admin.username, isAdmin: true,
        status: 'approved' as const, profileSubmitted: true,
        name: admin.fullName, email: admin.email, image: '',
      };
    }

    if (!s.user.email) return null;
    const dbUser = await db.users.findByEmail(s.user.email);
    if (!dbUser) return null;

    return {
      userId: dbUser.id, username: dbUser.username,
      isAdmin: !!dbUser.isAdmin,
      status: dbUser.status || 'pending',
      profileSubmitted: dbUser.profileSubmitted || false,
      name: s.user.name || dbUser.fullName || '',
      email: s.user.email,
      image: s.user.image || '',
    };
  } catch (err) {
    console.error('[getSession]', err);
    return null;
  }
}

// Used by API ROUTES - reads JWT token directly (no NEXTAUTH_URL needed)
export async function getTokenUser(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET_KEY });
    if (!token) return null;

    const { db } = await import('@/lib/db');

    if (token.isAdmin && token.username) {
      const admin = await db.users.findByUsername(token.username as string);
      if (admin?.isAdmin) return { ...admin, isAdmin: true as const };
    }

    const email = token.email as string;
    if (!email) return null;
    return await db.users.findByEmail(email);
  } catch { return null; }
}
