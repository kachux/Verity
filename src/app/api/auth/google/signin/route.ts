import { NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/lib/google-oauth';

export async function GET() {
  const state = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const authUrl = getGoogleAuthUrl(state);

  const response = NextResponse.redirect(authUrl);

  // Set CSRF state cookie
  response.cookies.set({
    name: 'oauth_state',
    value: state,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 10 // 10 minutes
  });

  return response;
}
