/**
 * Redis client with in-memory fallback
 * Uses @upstash/redis when KV_REST_API_URL + KV_REST_API_TOKEN are set
 * Falls back to in-memory (globalThis) when not configured
 */
import { Redis } from '@upstash/redis';

// ── In-memory fallback (persists within same serverless instance) ─────────────
const g = globalThis as any;
if (!g.__kv_store) g.__kv_store = new Map<string, any>();
if (!g.__kv_sets)  g.__kv_sets  = new Map<string, Set<string>>();
const memStore: Map<string, any>         = g.__kv_store;
const memSets:  Map<string, Set<string>> = g.__kv_sets;

// ── Redis client (lazy) ───────────────────────────────────────────────────────
let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  if (!_redis) {
    _redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }
  return _redis;
}

// ── Unified API ───────────────────────────────────────────────────────────────
export const redis = {
  get: async <T>(key: string): Promise<T | null> => {
    const r = getRedis();
    if (r) {
      try {
        const val = await r.get<T>(key);
        if (val !== null) { memStore.set(key, val); return val; }
      } catch {}
    }
    return (memStore.get(key) as T) ?? null;
  },

  set: async (key: string, value: any): Promise<void> => {
    memStore.set(key, value);
    const r = getRedis();
    if (r) { try { await r.set(key, value); } catch {} }
  },

  del: async (key: string): Promise<void> => {
    memStore.delete(key);
    const r = getRedis();
    if (r) { try { await r.del(key); } catch {} }
  },

  sadd: async (key: string, ...members: string[]): Promise<void> => {
    if (!memSets.has(key)) memSets.set(key, new Set());
    members.forEach(m => memSets.get(key)!.add(m));
    const r = getRedis();
    if (r) { try { await r.sadd(key, members[0], ...members.slice(1)); } catch {} }
  },

  srem: async (key: string, member: string): Promise<void> => {
    memSets.get(key)?.delete(member);
    const r = getRedis();
    if (r) { try { await r.srem(key, member); } catch {} }
  },

  smembers: async (key: string): Promise<string[]> => {
    const r = getRedis();
    if (r) {
      try {
        const result = await r.smembers(key) as string[];
        if (result?.length) {
          if (!memSets.has(key)) memSets.set(key, new Set());
          result.forEach(m => memSets.get(key)!.add(m));
          return result;
        }
      } catch {}
    }
    return Array.from(memSets.get(key) ?? new Set<string>());
  },
};
