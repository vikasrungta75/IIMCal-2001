import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== 'flush-iimc-2026') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // Clear all keys
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

    // Also clear any stale email indexes
    await kv.del('email:admin@iimcal.ac.in');
    await kv.del('iimc_seeded');

    // Immediately seed the admin account
    const ADMIN_HASH = '$2a$10$FWfiB1jFD0gAhQI5t7ohW.aWMFwgEWvkLoojbJ.CKdPWW4JbEY4Sm'; // Joka@Admin2026
    const admin = {
      id: 'admin-001', username: 'iimcadmin2026', password: ADMIN_HASH,
      email: 'admin@iimcal.ac.in', fullName: 'Event Administrator',
      batch: '2001', programme: 'PGDM', company: 'IIM Calcutta',
      designation: 'Silver Jubilee Coordinator', city: 'Kolkata', country: 'India',
      isAdmin: true, status: 'approved',
      createdAt: new Date().toISOString(),
    };
    await kv.set('user:iimcadmin2026', admin);
    await kv.sadd('user_list', 'iimcadmin2026');
    await kv.set('email:admin@iimcal.ac.in', 'iimcadmin2026');
    await kv.set('iimc_seeded', '1');

    return NextResponse.json({
      ok: true,
      message: 'Database cleared and admin recreated.',
      admin: { username: 'iimcadmin2026', password: 'Joka@Admin2026' },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
