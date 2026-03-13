import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return NextResponse.json({
    registrations: db.users.count(),
    announcements: db.announcements.count(),
    travelSubmitted: db.travel.count(),
    accommodationNeeded: db.travel.countWithAccommodation(),
    recentRegistrations: db.users.getAll().slice(0, 5),
    travelDetails: db.travel.getAll().map(t => {
      const user = db.users.findById(t.userId);
      return { ...t, userName: user?.fullName || 'Unknown', programme: user?.programme };
    }),
  });
}
