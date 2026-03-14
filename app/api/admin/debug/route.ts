import { NextRequest, NextResponse } from 'next/server';
import { getTokenUser } from '@/lib/auth';
import { redis as kv } from '@/lib/kv';

export async function GET(req: NextRequest) {
  const user = await getTokenUser(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const usernames = (await kv.smembers('user_list') as string[]) || [];
    const users = [];
    for (const u of usernames) {
      const dbUser = await kv.get<any>(`user:${u}`);
      if (dbUser) users.push({ username: dbUser.username, email: dbUser.email, fullName: dbUser.fullName, status: dbUser.status, profileSubmitted: dbUser.profileSubmitted, isAdmin: dbUser.isAdmin });
    }
    return NextResponse.json({ userCount: users.length, users });
  } catch (err: any) { return NextResponse.json({ error: err.message }); }
}

export async function DELETE(req: NextRequest) {
  const user = await getTokenUser(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const usernames = (await kv.smembers('user_list') as string[]) || [];
    let deleted = 0;
    for (const u of usernames) {
      const dbUser = await kv.get<any>(`user:${u}`);
      if (dbUser && !dbUser.isAdmin) {
        await kv.del(`user:${u}`);
        await kv.srem('user_list', u);
        if (dbUser.email) await kv.del(`email:${dbUser.email.toLowerCase()}`);
        deleted++;
      }
    }
    const travelIds = (await kv.smembers('travel_list') as string[]) || [];
    for (const id of travelIds) await kv.del(`travel:${id}`);
    await kv.del('travel_list');
    return NextResponse.json({ ok: true, deleted });
  } catch (err: any) { return NextResponse.json({ error: err.message }); }
}
