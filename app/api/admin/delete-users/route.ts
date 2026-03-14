import { NextRequest, NextResponse } from 'next/server';
import { getTokenUser } from '@/lib/auth';
import { redis } from '@/lib/kv';

export async function POST(req: NextRequest) {
  const admin = await getTokenUser(req);
  if (!admin?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { usernames } = await req.json();
  if (!Array.isArray(usernames) || usernames.length === 0)
    return NextResponse.json({ error: 'No usernames provided' }, { status: 400 });

  let deleted = 0;
  for (const username of usernames) {
    const user = await redis.get<any>(`user:${username.toLowerCase()}`);
    if (!user || user.isAdmin) continue; // never delete admin
    await redis.del(`user:${username.toLowerCase()}`);
    await redis.srem('user_list', username.toLowerCase());
    if (user.email) await redis.del(`email:${user.email.toLowerCase()}`);
    // Also remove travel data
    if (user.id) {
      await redis.del(`travel:${user.id}`);
      await redis.srem('travel_list', user.id);
    }
    deleted++;
  }

  return NextResponse.json({ ok: true, deleted });
}
