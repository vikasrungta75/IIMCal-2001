/**
 * IIMC Silver Jubilee — Persistent Data Layer
 * Primary: Vercel KV | Fallback: In-memory (same serverless instance only)
 */

import { kv } from '@vercel/kv';

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  fullName: string;
  batch: string;
  programme: string;
  phone?: string;
  company?: string;
  designation?: string;
  city?: string;
  country?: string;
  bio?: string;
  linkedIn?: string;
  createdAt: string;
  isAdmin?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  profileSubmitted?: boolean;
  approvedAt?: string;
  rejectionReason?: string;
  oauthProvider?: 'google' | 'azure-ad';
}

export interface TravelInfo {
  userId: string;
  arrivalDate: string; arrivalTime: string; arrivalMode: string;
  departureDate: string; departureTime: string; departureMode: string;
  flightTrainNumber?: string;
  accommodationRequired: boolean; accommodationPreference: string;
  roomSharing: boolean; dietaryPreference: string;
  specialRequirements?: string; updatedAt: string;
}

export interface Announcement {
  id: string; title: string; content: string;
  category: string; author: string; createdAt: string; pinned: boolean;
}

// ── Seed constants ────────────────────────────────────────────────────────────
const ADMIN_HASH = '$2a$10$FWfiB1jFD0gAhQI5t7ohW.aWMFwgEWvkLoojbJ.CKdPWW4JbEY4Sm'; // Joka@Admin2026

const SEED_ADMIN: User = {
  id: 'admin-001', username: 'iimcadmin2026', password: ADMIN_HASH,
  email: 'admin@iimcal.ac.in', fullName: 'Event Administrator',
  batch: '2001', programme: 'PGDM', company: 'IIM Calcutta',
  designation: 'Silver Jubilee Coordinator', city: 'Kolkata', country: 'India',
  isAdmin: true, status: 'approved',
  createdAt: new Date('2026-01-01').toISOString(),
};

const SEED_ANNOUNCEMENTS: Announcement[] = [
  { id:'ann-001', title:'🎉 Welcome to the Silver Jubilee Portal!', content:`Dear Batch 2001 Alumni,\n\nWelcome to the official portal for IIM Calcutta's Silver Jubilee Alumni Meet!\n\nEvent: December 12–14, 2026 | IIM Calcutta Campus, Joka, Kolkata\n\nPlease complete your profile and travel details at the earliest.\n\nWarm regards,\nSilver Jubilee Organising Committee`, category:'important', author:'Organising Committee', createdAt:new Date('2026-10-01').toISOString(), pinned:true },
  { id:'ann-002', title:'📅 Event Schedule — Dec 12–14, 2026', content:`DAY 1 — FRIDAY, DEC 12 (Arrival)\n• 2:00 PM — Registration & check-in at MDC\n• 6:30 PM — Welcome cocktails\n• 8:00 PM — Dinner\n\nDAY 2 — SATURDAY, DEC 13 (Main Event)\n• 9:00 AM — Inaugural ceremony\n• 10:30 AM — Panel discussions\n• 7:00 PM — Gala Dinner & Awards Night\n• 9:00 PM — DJ Night\n\nDAY 3 — SUNDAY, DEC 14 (Farewell)\n• 9:00 AM — Breakfast\n• 12:00 PM — Farewell lunch\n• 2:00 PM — Departures`, category:'event', author:'Event Committee', createdAt:new Date('2026-10-05').toISOString(), pinned:true },
  { id:'ann-003', title:'🏨 Accommodation Options', content:`ON-CAMPUS (Limited — 40 rooms)\n• IIM Calcutta Guest House, Joka\n• ₹3,500/night | Twin sharing ₹2,200/person\n• Includes breakfast\n\nPARTNER HOTELS (shuttle provided)\n• The LaLiT Great Eastern Kolkata ⭐⭐⭐⭐⭐\n• Swissotel Kolkata ⭐⭐⭐⭐⭐\n• Novotel Kolkata ⭐⭐⭐⭐`, category:'logistics', author:'Logistics Team', createdAt:new Date('2026-10-10').toISOString(), pinned:false },
  { id:'ann-004', title:'✈️ Travel & Airport Transfer', content:`GETTING TO JOKA CAMPUS\nAddress: Diamond Harbour Road, Joka, Kolkata 700104\n\nFrom Airport (NSCBI): ~35 km | ~1.5 hours\nFrom Howrah Station: ~20 km | ~1 hour\n\nFree campus pickup on Dec 12 at 3 PM & 6 PM.\nUpdate your flight details in Travel section.`, category:'logistics', author:'Logistics Team', createdAt:new Date('2026-10-15').toISOString(), pinned:false },
];

// ── Seed: ensures admin and announcements exist, runs on every cold start ─────
let seedPromise: Promise<void> | null = null;

async function ensureSeeded(): Promise<void> {
  if (seedPromise) return seedPromise;
  seedPromise = _seed();
  return seedPromise;
}

async function _seed(): Promise<void> {
  try {
    // Check if admin exists — if yes, DB is seeded
    const admin = await kv.get<User>(`user:iimcadmin2026`);
    if (admin?.isAdmin) return; // already seeded

    // Seed admin
    await kv.set(`user:iimcadmin2026`, SEED_ADMIN);
    await kv.sadd('user_list', 'iimcadmin2026');
    await kv.set(`email:admin@iimcal.ac.in`, 'iimcadmin2026');

    // Seed announcements
    for (const ann of SEED_ANNOUNCEMENTS) {
      const exists = await kv.get(`ann:${ann.id}`);
      if (!exists) {
        await kv.set(`ann:${ann.id}`, ann);
        await kv.sadd('ann_list', ann.id);
      }
    }
    console.log('[DB] KV seeded successfully');
  } catch (err) {
    console.error('[DB] Seed error:', err);
    seedPromise = null; // allow retry
  }
}

// ── Core KV operations ────────────────────────────────────────────────────────

async function getUser(username: string): Promise<User | null> {
  try {
    return await kv.get<User>(`user:${username.toLowerCase()}`);
  } catch { return null; }
}

async function saveUser(user: User): Promise<void> {
  const key = user.username.toLowerCase();
  try {
    await kv.set(`user:${key}`, user);
    await kv.sadd('user_list', key);
    if (user.email) {
      await kv.set(`email:${user.email.toLowerCase()}`, key);
    }
  } catch (err) {
    console.error('[DB] saveUser failed:', err);
  }
}

async function getAllUsernames(): Promise<string[]> {
  try {
    return (await kv.smembers('user_list') as string[]) || [];
  } catch { return []; }
}

// ── db API ────────────────────────────────────────────────────────────────────

export const db = {
  users: {
    findByUsername: async (username: string): Promise<User | null> => {
      await ensureSeeded();
      return getUser(username);
    },

    findByEmail: async (email: string): Promise<User | null> => {
      await ensureSeeded();
      const emailKey = email.toLowerCase();
      try {
        // Try email index first
        const username = await kv.get<string>(`email:${emailKey}`);
        if (username) {
          const user = await getUser(username);
          if (user) return user;
        }
        // Full scan fallback
        const usernames = await getAllUsernames();
        for (const u of usernames) {
          const user = await getUser(u);
          if (user?.email?.toLowerCase() === emailKey) {
            // Fix the index
            await kv.set(`email:${emailKey}`, u);
            return user;
          }
        }
      } catch (err) {
        console.error('[DB] findByEmail error:', err);
      }
      return null;
    },

    create: async (user: User): Promise<User> => {
      await ensureSeeded();
      await saveUser(user);
      return user;
    },

    update: async (username: string, data: Partial<User>): Promise<User | null> => {
      await ensureSeeded();
      const existing = await getUser(username);
      if (!existing) return null;
      const updated = { ...existing, ...data };
      await saveUser(updated);
      return updated;
    },

    approve: async (username: string): Promise<User | null> => {
      return db.users.update(username, { status: 'approved', approvedAt: new Date().toISOString() });
    },

    reject: async (username: string, reason: string): Promise<User | null> => {
      return db.users.update(username, { status: 'rejected', rejectionReason: reason });
    },

    getAllApproved: async (): Promise<Omit<User,'password'>[]> => {
      await ensureSeeded();
      const usernames = await getAllUsernames();
      const result: User[] = [];
      for (const u of usernames) {
        const user = await getUser(u);
        if (user && !user.isAdmin && user.status === 'approved') result.push(user);
      }
      return result.map(({ password, ...r }) => r).sort((a,b) => a.fullName.localeCompare(b.fullName));
    },

    getAll: async (): Promise<Omit<User,'password'>[]> => {
      await ensureSeeded();
      const usernames = await getAllUsernames();
      const result: User[] = [];
      for (const u of usernames) {
        const user = await getUser(u);
        if (user && !user.isAdmin) result.push(user);
      }
      return result.map(({ password, ...r }) => r).sort((a,b) => a.fullName.localeCompare(b.fullName));
    },

    getPending: async (): Promise<Omit<User,'password'>[]> => {
      await ensureSeeded();
      const usernames = await getAllUsernames();
      const result: User[] = [];
      for (const u of usernames) {
        const user = await getUser(u);
        if (user && !user.isAdmin && user.status === 'pending' && user.profileSubmitted) result.push(user);
      }
      return result.map(({ password, ...r }) => r).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    count: async (): Promise<number> => {
      await ensureSeeded();
      const usernames = await getAllUsernames();
      let n = 0;
      for (const u of usernames) {
        const user = await getUser(u);
        if (user && !user.isAdmin && user.status === 'approved') n++;
      }
      return n;
    },

    countPending: async (): Promise<number> => {
      await ensureSeeded();
      const usernames = await getAllUsernames();
      let n = 0;
      for (const u of usernames) {
        const user = await getUser(u);
        if (user && !user.isAdmin && user.status === 'pending' && user.profileSubmitted) n++;
      }
      return n;
    },
  },

  travel: {
    get: async (userId: string): Promise<TravelInfo | null> => {
      try { return await kv.get<TravelInfo>(`travel:${userId}`); } catch { return null; }
    },
    upsert: async (info: TravelInfo): Promise<TravelInfo> => {
      try {
        await kv.set(`travel:${info.userId}`, info);
        await kv.sadd('travel_list', info.userId);
      } catch (err) { console.error('[DB] travel upsert error:', err); }
      return info;
    },
    getAll: async (): Promise<TravelInfo[]> => {
      try {
        const ids = (await kv.smembers('travel_list') as string[]) || [];
        const result: TravelInfo[] = [];
        for (const id of ids) {
          const t = await kv.get<TravelInfo>(`travel:${id}`);
          if (t) result.push(t);
        }
        return result;
      } catch { return []; }
    },
    count: async (): Promise<number> => {
      try { return ((await kv.smembers('travel_list') as string[]) || []).length; } catch { return 0; }
    },
    countWithAccommodation: async (): Promise<number> => {
      const all = await db.travel.getAll();
      return all.filter(t => t.accommodationRequired).length;
    },
  },

  announcements: {
    getAll: async (): Promise<Announcement[]> => {
      await ensureSeeded();
      try {
        const ids = (await kv.smembers('ann_list') as string[]) || [];
        const result: Announcement[] = [];
        for (const id of ids) {
          const a = await kv.get<Announcement>(`ann:${id}`);
          if (a) result.push(a);
        }
        return result.sort((a,b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      } catch { return []; }
    },
    create: async (ann: Announcement): Promise<Announcement> => {
      try {
        await kv.set(`ann:${ann.id}`, ann);
        await kv.sadd('ann_list', ann.id);
      } catch (err) { console.error('[DB] ann create error:', err); }
      return ann;
    },
    delete: async (id: string): Promise<void> => {
      try { await kv.del(`ann:${id}`); await kv.srem('ann_list', id); } catch {}
    },
    count: async (): Promise<number> => {
      await ensureSeeded();
      try { return ((await kv.smembers('ann_list') as string[]) || []).length; } catch { return 0; }
    },
  },
};
