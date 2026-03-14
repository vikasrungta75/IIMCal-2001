import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextauth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const s = await getServerSession(authOptions);
    const email = s?.user?.email;
    let dbUser = null;
    if (email) dbUser = await db.users.findByEmail(email);
    
    // Also get all users for debugging (admin only in prod)
    const allUsers = await db.users.getAll();
    
    return NextResponse.json({
      hasSession: !!s,
      sessionEmail: email,
      sessionUsername: (s?.user as any)?.username,
      dbUser: dbUser ? { 
        username: dbUser.username, 
        status: dbUser.status, 
        profileSubmitted: dbUser.profileSubmitted, 
        email: dbUser.email,
        fullName: dbUser.fullName,
      } : null,
      allUsersCount: allUsers.length,
      allUsers: allUsers.map(u => ({ username: u.username, email: u.email, status: u.status, profileSubmitted: u.profileSubmitted, fullName: u.fullName })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack });
  }
}
