/**
 * Redis client - works with standard Redis URL (ioredis)
 * Falls back to in-memory when Redis not configured
 */

// ── In-memory fallback ────────────────────────────────────────────────────────
const g = globalThis as any;
if (!g.__kv_store) g.__kv_store = new Map<string, any>();
if (!g.__kv_sets)  g.__kv_sets  = new Map<string, Set<string>>();
const memStore: Map<string, any>         = g.__kv_store;
const memSets:  Map<string, Set<string>> = g.__kv_sets;

// ── Redis client (lazy, ioredis) ──────────────────────────────────────────────
let _client: any = null;

async function getClient(): Promise<any | null> {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  if (_client) return _client;
  try {
    const { default: Redis } = await import('ioredis');
    _client = new Redis(url, {
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
      lazyConnect: true,
      tls: url.includes('rediss://') ? {} : undefined,
    });
    await _client.connect().catch(() => {});
    return _client;
  } catch { return null; }
}

// ── Unified API ───────────────────────────────────────────────────────────────
export const redis = {
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const r = await getClient();
      if (r) {
        const val = await r.get(key);
        if (val !== null) {
          const parsed = JSON.parse(val) as T;
          memStore.set(key, parsed);
          return parsed;
        }
      }
    } catch {}
    return (memStore.get(key) as T) ?? null;
  },

  set: async (key: string, value: any): Promise<void> => {
    memStore.set(key, value);
    try {
      const r = await getClient();
      if (r) await r.set(key, JSON.stringify(value));
    } catch {}
  },

  del: async (key: string): Promise<void> => {
    memStore.delete(key);
    try {
      const r = await getClient();
      if (r) await r.del(key);
    } catch {}
  },

  sadd: async (key: string, ...members: string[]): Promise<void> => {
    if (!memSets.has(key)) memSets.set(key, new Set());
    members.forEach(m => memSets.get(key)!.add(m));
    try {
      const r = await getClient();
      if (r) await r.sadd(key, ...members);
    } catch {}
  },

  srem: async (key: string, member: string): Promise<void> => {
    memSets.get(key)?.delete(member);
    try {
      const r = await getClient();
      if (r) await r.srem(key, member);
    } catch {}
  },

  smembers: async (key: string): Promise<string[]> => {
    try {
      const r = await getClient();
      if (r) {
        const result: string[] = await r.smembers(key);
        if (result?.length) {
          if (!memSets.has(key)) memSets.set(key, new Set());
          result.forEach(m => memSets.get(key)!.add(m));
          return result;
        }
      }
    } catch {}
    return Array.from(memSets.get(key) ?? new Set<string>());
  },
};
