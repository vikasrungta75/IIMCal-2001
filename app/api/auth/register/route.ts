import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, email, fullName, batch, programme, phone, company, designation, city, country } = body;

    if (!username || !password || !email || !fullName || !batch || !programme) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    if (db.users.findByUsername(username)) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }
    if (db.users.findByEmail(email)) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = db.users.create({
      id: uuidv4(),
      username: username.toLowerCase(),
      password: hashed,
      email,
      fullName,
      batch,
      programme,
      phone,
      company,
      designation,
      city,
      country,
      createdAt: new Date().toISOString(),
    });

    const token = await createToken({ userId: user.id, username: user.username });
    const res = NextResponse.json({ ok: true });
    res.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
