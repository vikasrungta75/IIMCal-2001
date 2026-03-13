import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.json({
    totalAlumni: db.users.count(),
    pendingCount: db.users.countPending(),
    travelCount: db.travel.count(),
    accommodationCount: db.travel.countWithAccommodation(),
    announcementCount: db.announcements.count(),
    alumni: db.users.getAllApproved(),
    pendingRegistrations: db.users.getPending(),
    travel: db.travel.getAll(),
  });
}
