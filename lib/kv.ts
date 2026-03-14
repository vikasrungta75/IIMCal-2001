/**
 * Redis client - uses @upstash/redis when env vars are set
 * Falls back to in-memory store when not configured
 */

// ── In-memory fallback ────────────────────────────────────────────────────────
const g = globalThis as any;
if (!g.__kv_store) g.__kv_store = new Map<string, any>();
if (!g.__kv_sets) g.__kv_sets = new Map<string, Set<string>>();

const mem = {
  store: g.__kv_store as Map<string, any>,
  sets: g.__kv_sets as Map<string, Set<string>>,
};

function isConfigured() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function getRedis() {
  const { Redis } = require('@upstash/redis');
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

export const redis = {
  get: async <T>(key: string): Promise<T | null> => {
    if (isConfigured()) {
      try { return await getRedis().get<T>(key); } catch {}
    }
    return mem.store.get(key) ?? null;
  },

  set: async (key: string, value: any): Promise<void> => {
    mem.store.set(key, value);
    if (isConfigured()) {
      try { await getRedis().set(key, value); } catch {}
    }
  },

  del: async (key: string): Promise<void> => {
    mem.store.delete(key);
    if (isConfigured()) {
      try { await getRedis().del(key); } catch {}
    }
  },

  sadd: async (key: string, ...members: string[]): Promise<void> => {
    if (!mem.sets.has(key)) mem.sets.set(key, new Set());
    members.forEach(m => mem.sets.get(key)!.add(m));
    if (isConfigured()) {
      try { await getRedis().sadd(key, members[0], ...members.slice(1)); } catch {}
    }
  },

  srem: async (key: string, member: string): Promise<void> => {
    mem.sets.get(key)?.delete(member);
    if (isConfigured()) {
      try { await getRedis().srem(key, member); } catch {}
    }
  },

  smembers: async (key: string): Promise<string[]> => {
    if (isConfigured()) {
      try {
        const result = await getRedis().smembers(key);
        if (result && result.length > 0) {
          // Sync to memory
          if (!mem.sets.has(key)) mem.sets.set(key, new Set());
          (result as string[]).forEach((m: string) => mem.sets.get(key)!.add(m));
          return result as string[];
        }
      } catch {}
    }
    return Array.from(mem.sets.get(key) ?? new Set<string>());
  },
};
