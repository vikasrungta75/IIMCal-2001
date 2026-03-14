import { NextRequest, NextResponse } from 'next/server';
import { getTokenUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const user = await getTokenUser(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const [totalAlumni, pendingCount, travelCount, accommodationCount, announcementCount, alumni, pendingRegistrations, travel] = await Promise.all([
    db.users.count(), db.users.countPending(), db.travel.count(),
    db.travel.countWithAccommodation(), db.announcements.count(),
    db.users.getAllApproved(), db.users.getPending(), db.travel.getAll(),
  ]);
  return NextResponse.json({ totalAlumni, pendingCount, travelCount, accommodationCount, announcementCount, alumni, pendingRegistrations, travel });
}
