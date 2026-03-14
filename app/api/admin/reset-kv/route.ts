import { NextRequest, NextResponse } from 'next/server';
import { redis as kv } from '@/lib/kv';
import { getTokenUser } from '@/lib/auth';

// Force reset the admin user record (to update password hash etc)
export async function POST(req: NextRequest) {
  const user = await getTokenUser(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const ADMIN_HASH = '$2a$10$FWfiB1jFD0gAhQI5t7ohW.aWMFwgEWvkLoojbJ.CKdPWW4JbEY4Sm'; // Joka@Admin2026
  const SEED_ADMIN = {
    id: 'admin-001', username: 'iimcadmin2026', password: ADMIN_HASH,
    email: 'admin@iimcal.ac.in', fullName: 'Event Administrator',
    batch: '2001', programme: 'PGDM', company: 'IIM Calcutta',
    designation: 'Silver Jubilee Coordinator', city: 'Kolkata', country: 'India',
    isAdmin: true, status: 'approved',
    createdAt: new Date('2026-01-01').toISOString(),
  };

  await kv.set('user:iimcadmin2026', SEED_ADMIN);
  await kv.sadd('user_list', 'iimcadmin2026');
  await kv.set('email:admin@iimcal.ac.in', 'iimcadmin2026');
  // Remove old admin if it exists
  await kv.del('user:iimcadmin2025');
  await kv.srem('user_list', 'iimcadmin2025');

  return NextResponse.json({ ok: true, message: 'Admin updated to iimcadmin2026 / Joka@Admin2026' });
}
