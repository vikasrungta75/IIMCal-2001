import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Secret key to prevent unauthorized access
const SECRET = process.env.RESET_SECRET || 'iimc-reset-2027';

export async function POST(req: NextRequest) {
  const { secret } = await req.json();
  if (secret !== SECRET) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    // Get all keys and delete everything
    const usernames = await kv.smembers('user_list') as string[];
    const annIds = await kv.smembers('ann_list') as string[];
    const travelIds = await kv.smembers('travel_list') as string[];

    const pipeline = kv.pipeline();
    
    // Delete all users and email indexes
    for (const u of usernames) {
      const user = await kv.get<any>(`user:${u}`);
      if (user?.email) pipeline.del(`email:${user.email.toLowerCase()}`);
      pipeline.del(`user:${u}`);
    }
    
    // Delete announcements
    for (const id of annIds) pipeline.del(`ann:${id}`);
    
    // Delete travel
    for (const id of travelIds) pipeline.del(`travel:${id}`);
    
    // Delete list keys and seed flag
    pipeline.del('user_list');
    pipeline.del('ann_list');
    pipeline.del('travel_list');
    pipeline.del('iimc_seeded');
    
    await pipeline.exec();
    
    return NextResponse.json({ 
      ok: true, 
      deleted: { users: usernames.length, announcements: annIds.length, travel: travelIds.length }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
