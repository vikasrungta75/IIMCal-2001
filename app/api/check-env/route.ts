import { NextResponse } from 'next/server';

export async function GET() {
  const vars = [
    'KV_URL', 'KV_REST_API_URL', 'KV_REST_API_TOKEN',
    'KV_REST_API_READ_ONLY_TOKEN', 'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID', 'AZURE_AD_CLIENT_ID',
  ];
  const result: Record<string, string> = {};
  for (const v of vars) {
    const val = process.env[v];
    result[v] = val ? `✅ SET (${val.substring(0, 30)}...)` : '❌ NOT SET';
  }
  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'no-store' }
  });
}
