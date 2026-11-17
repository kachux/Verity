import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DB } from '@/lib/store';

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('verity_session');

  if (!sessionCookie) {
    // Return default demo user if not logged in
    const defaultUser = DB.getUsers()[0];
    return NextResponse.json({ user: defaultUser, authenticated: false });
  }

  try {
    const rawValue = sessionCookie.value.startsWith('%')
      ? decodeURIComponent(sessionCookie.value)
      : sessionCookie.value;
    const sessionUser = JSON.parse(rawValue);
    const dbUser = sessionUser?.email ? DB.getUserByEmail(sessionUser.email) : null;
    const user = dbUser ? { ...sessionUser, ...dbUser } : sessionUser;
    return NextResponse.json({ user, authenticated: true });
  } catch (err) {
    console.error('Failed to parse session cookie:', err);
    return NextResponse.json({ user: DB.getUsers()[0], authenticated: false });
  }
}
