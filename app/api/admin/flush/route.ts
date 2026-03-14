import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// One-time flush endpoint - secured with a secret key
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  
  // Simple secret check - you pass this in the URL
  if (secret !== 'flush-iimc-2026') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // Get all keys and delete them
    const usernames = (await kv.smembers('user_list') as string[]) || [];
    for (const u of usernames) {
      const user = await kv.get<any>(`user:${u}`);
      await kv.del(`user:${u}`);
      if (user?.email) await kv.del(`email:${user.email.toLowerCase()}`);
    }
    await kv.del('user_list');

    const annIds = (await kv.smembers('ann_list') as string[]) || [];
    for (const id of annIds) await kv.del(`ann:${id}`);
    await kv.del('ann_list');

    const travelIds = (await kv.smembers('travel_list') as string[]) || [];
    for (const id of travelIds) await kv.del(`travel:${id}`);
    await kv.del('travel_list');

    await kv.del('iimc_seeded');

    return NextResponse.json({ 
      ok: true, 
      message: 'Database cleared. Admin account will be recreated on next login.',
      deletedUsers: usernames.length,
      deletedAnnouncements: annIds.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
