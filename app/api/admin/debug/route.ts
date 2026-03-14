import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const usernames = (await kv.smembers('user_list') as string[]) || [];
    const users = [];
    for (const u of usernames) {
      const user = await kv.get<any>(`user:${u}`);
      if (user) users.push({ username: user.username, email: user.email, fullName: user.fullName, status: user.status, profileSubmitted: user.profileSubmitted, isAdmin: user.isAdmin });
    }
    return NextResponse.json({ userCount: users.length, users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}

export async function DELETE() {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const usernames = (await kv.smembers('user_list') as string[]) || [];
    let deleted = 0;
    for (const u of usernames) {
      const user = await kv.get<any>(`user:${u}`);
      if (user && !user.isAdmin) {
        await kv.del(`user:${u}`);
        await kv.srem('user_list', u);
        if (user.email) await kv.del(`email:${user.email.toLowerCase()}`);
        deleted++;
      }
    }
    const travelIds = (await kv.smembers('travel_list') as string[]) || [];
    for (const id of travelIds) await kv.del(`travel:${id}`);
    await kv.del('travel_list');
    return NextResponse.json({ ok: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
