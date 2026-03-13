/**
 * IIMC Silver Jubilee — Persistent Data Layer using Vercel KV
 *
 * Key schema:
 *   user:{username}        → User object
 *   user_email:{email}     → username (index)
 *   user_list              → Set of all usernames
 *   travel:{userId}        → TravelInfo object
 *   travel_list            → Set of all userIds with travel
 *   ann:{id}               → Announcement object
 *   ann_list               → Set of all announcement ids
 *   seeded                 → '1' once seed data written
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
  approvedBy?: string;
  rejectionReason?: string;
  oauthProvider?: 'google' | 'azure-ad';
}

export interface TravelInfo {
  userId: string;
  arrivalDate: string;
  arrivalTime: string;
  arrivalMode: string;
  departureDate: string;
  departureTime: string;
  departureMode: string;
  flightTrainNumber?: string;
  accommodationRequired: boolean;
  accommodationPreference: string;
  roomSharing: boolean;
  dietaryPreference: string;
  specialRequirements?: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  pinned: boolean;
}

// ── Seed data (only written to KV once ever) ──────────────────────────────────

const ADMIN_HASH = '$2a$10$2O5OMgJao691f2wynEamKu4uy38gTrjH6zgTMIkgVv9Zq2D4QShq.'; // Joka@Admin2025
const DEMO_HASH  = '$2a$10$5pn2Y.47D9qXKPZ6OdIaAupYnPDj5cF9ydagaWMuBT7UEmkAO69d6'; // admin123

const SEED_USERS: User[] = [
  {
    id: 'admin-001', username: 'iimcadmin2025', password: ADMIN_HASH,
    email: 'admin@iimcal.ac.in', fullName: 'Event Administrator',
    batch: '2001', programme: 'PGDM', company: 'IIM Calcutta',
    designation: 'Silver Jubilee Coordinator', city: 'Kolkata', country: 'India',
    isAdmin: true, status: 'approved', createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'u-001', username: 'rahul.sharma.test', password: DEMO_HASH,
    email: 'rahul.test@gmail.com', fullName: 'Rahul Kumar Sharma',
    batch: '2001', programme: 'PGDM', company: 'McKinsey & Company',
    designation: 'Senior Partner', city: 'Mumbai', country: 'India',
    bio: 'Strategy consulting and cricket!', linkedIn: 'https://linkedin.com',
    status: 'approved', profileSubmitted: true, oauthProvider: 'google',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'u-002', username: 'priya.mehra.test', password: DEMO_HASH,
    email: 'priya.test@outlook.com', fullName: 'Priya Mehra',
    batch: '2001', programme: 'PGDCM', company: 'Goldman Sachs',
    designation: 'Managing Director', city: 'New York', country: 'USA',
    bio: '25 years of finance across three continents.',
    status: 'approved', profileSubmitted: true, oauthProvider: 'azure-ad',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    title: '🎉 Welcome to the Silver Jubilee Portal!',
    content: `Dear Batch 1999-2001 Alumni,\n\nWelcome to the official portal for IIM Calcutta's Silver Jubilee Alumni Meet!\n\nThis is a momentous occasion — reconnect with batchmates, relive the legendary Joka experience, and celebrate 25 years of extraordinary journeys.\n\nEvent: December 12–14, 2027 | IIM Calcutta Campus, Joka, Kolkata\n\nPlease complete your profile and travel details at the earliest.\n\nWarm regards,\nSilver Jubilee Organising Committee`,
    category: 'important', author: 'Organising Committee',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), pinned: true,
  },
  {
    id: 'ann-002',
    title: '📅 Full Event Schedule — Dec 12–14, 2027',
    content: `DAY 1 — FRIDAY, DEC 12 (Arrival)\n• 2:00 PM — Registration & check-in at MDC\n• 4:00 PM — Campus nostalgia walk\n• 6:30 PM — Welcome cocktails at AC Auditorium Lawn\n• 8:00 PM — Dinner & informal catch-up\n\nDAY 2 — SATURDAY, DEC 13 (Main Event)\n• 9:00 AM — Inaugural ceremony\n• 10:30 AM — "25 Years of Leadership" panel discussion\n• 1:00 PM — Lunch\n• 3:00 PM — Sports: cricket, badminton, football\n• 5:00 PM — Batch photo session\n• 7:00 PM — Gala Dinner & Silver Jubilee Awards Night\n• 9:00 PM — DJ Night\n\nDAY 3 — SUNDAY, DEC 14 (Farewell)\n• 9:00 AM — Breakfast\n• 10:30 AM — Alumni chapter meetings\n• 12:00 PM — Farewell lunch\n• 2:00 PM — Departures`,
    category: 'event', author: 'Event Committee',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), pinned: true,
  },
  {
    id: 'ann-003',
    title: '🏨 Accommodation Options & Booking Deadline',
    content: `ON-CAMPUS (Limited — 40 rooms)\n• IIM Calcutta Guest House, Joka\n• ₹3,500/night | Twin sharing ₹2,200/person\n• Includes breakfast\n\nPARTNER HOTELS (shuttle provided)\n• The LaLiT Great Eastern Kolkata ⭐⭐⭐⭐⭐\n• Swissotel Kolkata ⭐⭐⭐⭐⭐\n• Novotel Kolkata ⭐⭐⭐⭐\n\nMention "IIMC Silver Jubilee" for special rates.`,
    category: 'logistics', author: 'Logistics Team',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), pinned: false,
  },
  {
    id: 'ann-004',
    title: '✈️ Travel & Airport Transfer Details',
    content: `GETTING TO JOKA CAMPUS\nAddress: Diamond Harbour Road, Joka, Kolkata 700104\n\nFrom Airport (NSCBI): ~35 km | ~1.5 hours | Ola/Uber available\nFrom Howrah Station: ~20 km | ~1 hour\nFrom Sealdah Station: ~22 km | ~1.15 hours\n\nCAMPUS PICKUP (Dec 12 only)\nFree pickup from airport at 3 PM & 6 PM.\nUpdate your flight details in the Travel section to be included.`,
    category: 'logistics', author: 'Logistics Team',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), pinned: false,
  },
];

// ── Seed KV (runs once, checks 'seeded' flag in KV) ──────────────────────────

async function ensureSeeded() {
  try {
    const already = await kv.get<string>('seeded');
    if (already === '1') return;

    // Write all seed users
    for (const user of SEED_USERS) {
      await kv.set(`user:${user.username.toLowerCase()}`, user);
      await kv.sadd('user_list', user.username.toLowerCase());
      if (user.email) {
        await kv.set(`user_email:${user.email.toLowerCase()}`, user.username.toLowerCase());
      }
    }

    // Write seed announcements
    for (const ann of SEED_ANNOUNCEMENTS) {
      await kv.set(`ann:${ann.id}`, ann);
      await kv.sadd('ann_list', ann.id);
    }

    await kv.set('seeded', '1');
    console.log('[DB] Seeded KV with initial data');
  } catch (err) {
    console.error('[DB] Seed error:', err);
  }
}

// ── db API ────────────────────────────────────────────────────────────────────

export const db = {
  users: {
    findByUsername: async (username: string): Promise<User | null> => {
      await ensureSeeded();
      return kv.get<User>(`user:${username.toLowerCase()}`);
    },

    findByEmail: async (email: string): Promise<User | null> => {
      await ensureSeeded();
      const username = await kv.get<string>(`user_email:${email.toLowerCase()}`);
      if (!username) return null;
      return kv.get<User>(`user:${username}`);
    },

    findById: async (id: string): Promise<User | null> => {
      await ensureSeeded();
      const usernames = await kv.smembers<string[]>('user_list');
      for (const u of usernames) {
        const user = await kv.get<User>(`user:${u}`);
        if (user?.id === id) return user;
      }
      return null;
    },

    create: async (user: User): Promise<User> => {
      await ensureSeeded();
      const key = user.username.toLowerCase();
      await kv.set(`user:${key}`, user);
      await kv.sadd('user_list', key);
      if (user.email) {
        await kv.set(`user_email:${user.email.toLowerCase()}`, key);
      }
      return user;
    },

    update: async (username: string, data: Partial<User>): Promise<User | null> => {
      await ensureSeeded();
      const key = username.toLowerCase();
      const existing = await kv.get<User>(`user:${key}`);
      if (!existing) return null;
      const updated = { ...existing, ...data };
      await kv.set(`user:${key}`, updated);
      // Update email index if email changed
      if (data.email && data.email !== existing.email) {
        if (existing.email) await kv.del(`user_email:${existing.email.toLowerCase()}`);
        await kv.set(`user_email:${data.email.toLowerCase()}`, key);
      }
      return updated;
    },

    getAll: async (): Promise<Omit<User, 'password'>[]> => {
      await ensureSeeded();
      const usernames = await kv.smembers<string[]>('user_list');
      const users: User[] = [];
      for (const u of usernames) {
        const user = await kv.get<User>(`user:${u}`);
        if (user && !user.isAdmin) users.push(user);
      }
      return users
        .map(({ password, ...r }) => r)
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
    },

    getAllApproved: async (): Promise<Omit<User, 'password'>[]> => {
      await ensureSeeded();
      const usernames = await kv.smembers<string[]>('user_list');
      const users: User[] = [];
      for (const u of usernames) {
        const user = await kv.get<User>(`user:${u}`);
        if (user && !user.isAdmin && user.status === 'approved') users.push(user);
      }
      return users
        .map(({ password, ...r }) => r)
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
    },

    getPending: async (): Promise<Omit<User, 'password'>[]> => {
      await ensureSeeded();
      const usernames = await kv.smembers<string[]>('user_list');
      const users: User[] = [];
      for (const u of usernames) {
        const user = await kv.get<User>(`user:${u}`);
        if (user && !user.isAdmin && user.status === 'pending' && user.profileSubmitted) users.push(user);
      }
      return users
        .map(({ password, ...r }) => r)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    count: async (): Promise<number> => {
      await ensureSeeded();
      const usernames = await kv.smembers<string[]>('user_list');
      let count = 0;
      for (const u of usernames) {
        const user = await kv.get<User>(`user:${u}`);
        if (user && !user.isAdmin && user.status === 'approved') count++;
      }
      return count;
    },

    countPending: async (): Promise<number> => {
      await ensureSeeded();
      const usernames = await kv.smembers<string[]>('user_list');
      let count = 0;
      for (const u of usernames) {
        const user = await kv.get<User>(`user:${u}`);
        if (user && !user.isAdmin && user.status === 'pending' && user.profileSubmitted) count++;
      }
      return count;
    },

    approve: async (username: string): Promise<User | null> => {
      return db.users.update(username, {
        status: 'approved',
        approvedAt: new Date().toISOString(),
      });
    },

    reject: async (username: string, reason: string): Promise<User | null> => {
      return db.users.update(username, {
        status: 'rejected',
        rejectionReason: reason,
      });
    },
  },

  travel: {
    get: async (userId: string): Promise<TravelInfo | null> => {
      return kv.get<TravelInfo>(`travel:${userId}`);
    },

    upsert: async (info: TravelInfo): Promise<TravelInfo> => {
      await kv.set(`travel:${info.userId}`, info);
      await kv.sadd('travel_list', info.userId);
      return info;
    },

    getAll: async (): Promise<TravelInfo[]> => {
      const ids = await kv.smembers<string[]>('travel_list');
      const results: TravelInfo[] = [];
      for (const id of ids) {
        const t = await kv.get<TravelInfo>(`travel:${id}`);
        if (t) results.push(t);
      }
      return results;
    },

    count: async (): Promise<number> => {
      const ids = await kv.smembers<string[]>('travel_list');
      return ids.length;
    },

    countWithAccommodation: async (): Promise<number> => {
      const ids = await kv.smembers<string[]>('travel_list');
      let count = 0;
      for (const id of ids) {
        const t = await kv.get<TravelInfo>(`travel:${id}`);
        if (t?.accommodationRequired) count++;
      }
      return count;
    },
  },

  announcements: {
    getAll: async (): Promise<Announcement[]> => {
      await ensureSeeded();
      const ids = await kv.smembers<string[]>('ann_list');
      const anns: Announcement[] = [];
      for (const id of ids) {
        const a = await kv.get<Announcement>(`ann:${id}`);
        if (a) anns.push(a);
      }
      return anns.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    },

    create: async (ann: Announcement): Promise<Announcement> => {
      await kv.set(`ann:${ann.id}`, ann);
      await kv.sadd('ann_list', ann.id);
      return ann;
    },

    delete: async (id: string): Promise<void> => {
      await kv.del(`ann:${id}`);
      await kv.srem('ann_list', id);
    },

    count: async (): Promise<number> => {
      await ensureSeeded();
      const ids = await kv.smembers<string[]>('ann_list');
      return ids.length;
    },
  },
};
