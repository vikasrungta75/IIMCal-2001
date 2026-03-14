/**
 * IIMC Silver Jubilee — Data Layer
 * Uses Vercel KV when available, falls back to in-memory store
 */

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── KV helper — gracefully falls back to in-memory ───────────────────────────

async function kvGet<T>(key: string): Promise<T | null> {
  try {
    const { kv } = await import('@vercel/kv');
    return await kv.get<T>(key);
  } catch { return null; }
}

async function kvSet(key: string, value: any): Promise<void> {
  try {
    const { kv } = await import('@vercel/kv');
    await kv.set(key, value);
  } catch (err) {
    console.error('[KV] set failed for', key, err);
  }
}

async function kvDel(key: string): Promise<void> {
  try {
    const { kv } = await import('@vercel/kv');
    await kv.del(key);
  } catch {}
}

async function kvSAdd(key: string, ...members: string[]): Promise<void> {
  try {
    const { kv } = await import('@vercel/kv');
    await kv.sadd(key, members[0], ...members.slice(1));
  } catch {}
}

async function kvSRem(key: string, member: string): Promise<void> {
  try {
    const { kv } = await import('@vercel/kv');
    await kv.srem(key, member);
  } catch {}
}

async function kvSMembers(key: string): Promise<string[]> {
  try {
    const { kv } = await import('@vercel/kv');
    const members = await kv.smembers(key);
    return (members as string[]) || [];
  } catch { return []; }
}

// ── In-memory fallback (also used as cache layer) ────────────────────────────

const g = globalThis as any;
if (!g.__iimc_users) g.__iimc_users = new Map<string, User>();
if (!g.__iimc_travel) g.__iimc_travel = new Map<string, TravelInfo>();
if (!g.__iimc_anns) g.__iimc_anns = new Map<string, Announcement>();
if (!g.__iimc_seeded) g.__iimc_seeded = false;

const mem = {
  users: g.__iimc_users as Map<string, User>,
  travel: g.__iimc_travel as Map<string, TravelInfo>,
  anns: g.__iimc_anns as Map<string, Announcement>,
};

// ── Seed data ─────────────────────────────────────────────────────────────────

const ADMIN_HASH = '$2a$10$2O5OMgJao691f2wynEamKu4uy38gTrjH6zgTMIkgVv9Zq2D4QShq.'; // Joka@Admin2025

const SEED_USERS: User[] = [
  { id:'admin-001', username:'iimcadmin2025', password:ADMIN_HASH, email:'admin@iimcal.ac.in', fullName:'Event Administrator', batch:'2001', programme:'PGDM', company:'IIM Calcutta', designation:'Silver Jubilee Coordinator', city:'Kolkata', country:'India', isAdmin:true, status:'approved', createdAt: new Date(Date.now()-30*86400000).toISOString() },
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  { id:'ann-001', title:'🎉 Welcome to the Silver Jubilee Portal!', content:`Dear Batch 2001 Alumni,\n\nWelcome to the official portal for IIM Calcutta's Silver Jubilee Alumni Meet!\n\nEvent: December 12–14, 2027 | IIM Calcutta Campus, Joka, Kolkata\n\nPlease complete your profile and travel details at the earliest.\n\nWarm regards,\nSilver Jubilee Organising Committee`, category:'important', author:'Organising Committee', createdAt:new Date(Date.now()-14*86400000).toISOString(), pinned:true },
  { id:'ann-002', title:'📅 Event Schedule — Dec 12–14, 2027', content:`DAY 1 — FRIDAY, DEC 12 (Arrival)\n• 2:00 PM — Registration & check-in at MDC\n• 6:30 PM — Welcome cocktails\n• 8:00 PM — Dinner\n\nDAY 2 — SATURDAY, DEC 13 (Main Event)\n• 9:00 AM — Inaugural ceremony\n• 10:30 AM — Panel discussions\n• 7:00 PM — Gala Dinner & Awards Night\n• 9:00 PM — DJ Night\n\nDAY 3 — SUNDAY, DEC 14 (Farewell)\n• 9:00 AM — Breakfast\n• 12:00 PM — Farewell lunch\n• 2:00 PM — Departures`, category:'event', author:'Event Committee', createdAt:new Date(Date.now()-10*86400000).toISOString(), pinned:true },
  { id:'ann-003', title:'🏨 Accommodation Options', content:`ON-CAMPUS (Limited — 40 rooms)\n• IIM Calcutta Guest House, Joka\n• ₹3,500/night | Twin sharing ₹2,200/person\n• Includes breakfast\n\nPARTNER HOTELS (shuttle provided)\n• The LaLiT Great Eastern Kolkata ⭐⭐⭐⭐⭐\n• Swissotel Kolkata ⭐⭐⭐⭐⭐\n• Novotel Kolkata ⭐⭐⭐⭐`, category:'logistics', author:'Logistics Team', createdAt:new Date(Date.now()-7*86400000).toISOString(), pinned:false },
  { id:'ann-004', title:'✈️ Travel & Airport Transfer', content:`GETTING TO JOKA CAMPUS\nAddress: Diamond Harbour Road, Joka, Kolkata 700104\n\nFrom Airport (NSCBI): ~35 km | ~1.5 hours\nFrom Howrah Station: ~20 km | ~1 hour\n\nFree campus pickup on Dec 12 at 3 PM & 6 PM.\nUpdate your flight details in Travel section.`, category:'logistics', author:'Logistics Team', createdAt:new Date(Date.now()-5*86400000).toISOString(), pinned:false },
];

async function ensureSeeded() {
  if (g.__iimc_seeded) return;

  // Check KV first
  try {
    const { kv } = await import('@vercel/kv');
    const seeded = await kv.get<string>('iimc_seeded');
    if (seeded === '1') {
      g.__iimc_seeded = true;
      return;
    }
    // Seed KV
    for (const user of SEED_USERS) {
      await kv.set(`user:${user.username}`, user);
      await kv.sadd('user_list', user.username);
      if (user.email) await kv.set(`email:${user.email.toLowerCase()}`, user.username);
    }
    for (const ann of SEED_ANNOUNCEMENTS) {
      await kv.set(`ann:${ann.id}`, ann);
      await kv.sadd('ann_list', ann.id);
    }
    await kv.set('iimc_seeded', '1');
    g.__iimc_seeded = true;
    console.log('[DB] Seeded KV');
    return;
  } catch (err) {
    console.log('[DB] KV not available, using in-memory fallback');
  }

  // Seed in-memory fallback
  if (mem.users.size === 0) {
    for (const user of SEED_USERS) {
      mem.users.set(user.username, user);
    }
    for (const ann of SEED_ANNOUNCEMENTS) {
      mem.anns.set(ann.id, ann);
    }
  }
  g.__iimc_seeded = true;
}

// ── User helpers ──────────────────────────────────────────────────────────────

async function getUser(username: string): Promise<User | null> {
  const key = username.toLowerCase();
  // Try KV first
  const fromKV = await kvGet<User>(`user:${key}`);
  if (fromKV) { mem.users.set(key, fromKV); return fromKV; }
  // Fallback to memory
  return mem.users.get(key) || null;
}

async function setUser(user: User): Promise<void> {
  const key = user.username.toLowerCase();
  mem.users.set(key, user);
  await kvSet(`user:${key}`, user);
  await kvSAdd('user_list', key);
  if (user.email) await kvSet(`email:${user.email.toLowerCase()}`, key);
}

async function getAllUsernames(): Promise<string[]> {
  const fromKV = await kvSMembers('user_list');
  if (fromKV.length > 0) return fromKV;
  return Array.from(mem.users.keys());
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
      
      // 1. Try KV email index (fastest)
      const username = await kvGet<string>(`email:${emailKey}`);
      if (username) {
        const user = await getUser(username);
        if (user) return user;
      }
      
      // 2. Scan memory cache
      for (const user of mem.users.values()) {
        if (user.email?.toLowerCase() === emailKey) {
          // Repair the email index in KV
          await kvSet(`email:${emailKey}`, user.username.toLowerCase());
          return user;
        }
      }
      
      // 3. Full KV scan (slowest but most reliable)
      const usernames = await getAllUsernames();
      for (const u of usernames) {
        const user = await getUser(u);
        if (user?.email?.toLowerCase() === emailKey) {
          // Repair the email index in KV
          await kvSet(`email:${emailKey}`, u);
          return user;
        }
      }
      return null;
    },

    findById: async (id: string): Promise<User | null> => {
      await ensureSeeded();
      const usernames = await getAllUsernames();
      for (const u of usernames) {
        const user = await getUser(u);
        if (user?.id === id) return user;
      }
      return null;
    },

    create: async (user: User): Promise<User> => {
      await ensureSeeded();
      await setUser(user);
      return user;
    },

    update: async (username: string, data: Partial<User>): Promise<User | null> => {
      await ensureSeeded();
      const existing = await getUser(username);
      if (!existing) return null;
      const updated = { ...existing, ...data };
      await setUser(updated);
      return updated;
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
      let count = 0;
      for (const u of usernames) {
        const user = await getUser(u);
        if (user && !user.isAdmin && user.status === 'approved') count++;
      }
      return count;
    },

    countPending: async (): Promise<number> => {
      await ensureSeeded();
      const usernames = await getAllUsernames();
      let count = 0;
      for (const u of usernames) {
        const user = await getUser(u);
        if (user && !user.isAdmin && user.status === 'pending' && user.profileSubmitted) count++;
      }
      return count;
    },

    approve: async (username: string): Promise<User | null> => {
      return db.users.update(username, { status: 'approved', approvedAt: new Date().toISOString() });
    },

    reject: async (username: string, reason: string): Promise<User | null> => {
      return db.users.update(username, { status: 'rejected', rejectionReason: reason });
    },
  },

  travel: {
    get: async (userId: string): Promise<TravelInfo | null> => {
      const fromKV = await kvGet<TravelInfo>(`travel:${userId}`);
      if (fromKV) return fromKV;
      return mem.travel.get(userId) || null;
    },

    upsert: async (info: TravelInfo): Promise<TravelInfo> => {
      mem.travel.set(info.userId, info);
      await kvSet(`travel:${info.userId}`, info);
      await kvSAdd('travel_list', info.userId);
      return info;
    },

    getAll: async (): Promise<TravelInfo[]> => {
      const ids = await kvSMembers('travel_list');
      const result: TravelInfo[] = [];
      const sources = ids.length > 0 ? ids : Array.from(mem.travel.keys());
      for (const id of sources) {
        const t = await kvGet<TravelInfo>(`travel:${id}`) || mem.travel.get(id);
        if (t) result.push(t);
      }
      return result;
    },

    count: async (): Promise<number> => {
      const ids = await kvSMembers('travel_list');
      return ids.length || mem.travel.size;
    },

    countWithAccommodation: async (): Promise<number> => {
      const all = await db.travel.getAll();
      return all.filter(t => t.accommodationRequired).length;
    },
  },

  announcements: {
    getAll: async (): Promise<Announcement[]> => {
      await ensureSeeded();
      const ids = await kvSMembers('ann_list');
      const result: Announcement[] = [];
      const sources = ids.length > 0 ? ids : Array.from(mem.anns.keys());
      for (const id of sources) {
        const a = await kvGet<Announcement>(`ann:${id}`) || mem.anns.get(id);
        if (a) result.push(a);
      }
      return result.sort((a,b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    },

    create: async (ann: Announcement): Promise<Announcement> => {
      await ensureSeeded();
      mem.anns.set(ann.id, ann);
      await kvSet(`ann:${ann.id}`, ann);
      await kvSAdd('ann_list', ann.id);
      return ann;
    },

    delete: async (id: string): Promise<void> => {
      mem.anns.delete(id);
      await kvDel(`ann:${id}`);
      await kvSRem('ann_list', id);
    },

    count: async (): Promise<number> => {
      await ensureSeeded();
      const ids = await kvSMembers('ann_list');
      return ids.length || mem.anns.size;
    },
  },
};
