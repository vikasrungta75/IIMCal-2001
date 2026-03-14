/**
 * Redis client using @upstash/redis
 * Works with Vercel KV (now Upstash) using KV_REST_API_URL and KV_REST_API_TOKEN
 */
import { Redis } from '@upstash/redis';

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (_redis) return _redis;
  
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  
  if (!url || !token) {
    throw new Error(`Redis not configured. Missing KV_REST_API_URL or KV_REST_API_TOKEN`);
  }
  
  _redis = new Redis({ url, token });
  return _redis;
}

// Convenience wrappers that match @vercel/kv API
export const redis = {
  get: async <T>(key: string): Promise<T | null> => getRedis().get<T>(key),
  set: async (key: string, value: any): Promise<void> => { await getRedis().set(key, value); },
  del: async (key: string): Promise<void> => { await getRedis().del(key); },
  sadd: async (key: string, ...members: string[]): Promise<void> => { await getRedis().sadd(key, members[0], ...members.slice(1)); },
  srem: async (key: string, member: string): Promise<void> => { await getRedis().srem(key, member); },
  smembers: async (key: string): Promise<string[]> => {
    const result = await getRedis().smembers(key);
    return result as string[];
  },
};
