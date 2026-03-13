import { NextRequest, NextResponse } from 'next/server';
import { NextResponse as NR } from 'next/server';

// Registration is now handled via OAuth only
// This endpoint is kept for backwards compatibility but redirects
export async function POST(req: NextRequest) {
  return NextResponse.json({ error: 'Registration is via Google/Microsoft OAuth only' }, { status: 400 });
}
