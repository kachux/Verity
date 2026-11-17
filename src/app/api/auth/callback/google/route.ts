import { NextResponse } from 'next/server';
import { exchangeCodeForTokens, getGoogleUserInfo } from '@/lib/google-oauth';
import { DB } from '@/lib/store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=Missing+authorization+code`);
  }

  try {
    // 1. Exchange code for access & id tokens
    const tokens = await exchangeCodeForTokens(code);

    // 2. Fetch verified Google user profile
    const googleProfile = await getGoogleUserInfo(tokens.access_token);

    if (!googleProfile.email) {
      throw new Error('Unable to retrieve email from Google profile');
    }

    // 3. Find or create user in database
    let user = DB.getUserByEmail(googleProfile.email);

    if (!user) {
      user = DB.createUser({
        id: `user-google-${googleProfile.sub || Date.now()}`,
        name: googleProfile.name || googleProfile.email.split('@')[0],
        email: googleProfile.email,
        workspaceName: `${googleProfile.given_name || 'My'} Workspace`,
        role: 'Verified Google Lead',
        avatarUrl: googleProfile.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
    } else {
      // Update details if available from Google
      if (googleProfile.name) {
        user.name = googleProfile.name;
      }
      if (googleProfile.picture) {
        user.avatarUrl = googleProfile.picture;
      }
    }

    // 4. Set session cookie and redirect to dashboard
    const response = NextResponse.redirect(`${baseUrl}/dashboard`);

    response.cookies.set({
      name: 'verity_session',
      value: JSON.stringify(user),
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Clear state cookie
    response.cookies.delete('oauth_state');

    return response;
  } catch (err: any) {
    console.error('OAuth Callback processing failed:', err);
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(err.message || 'Authentication failed')}`);
  }
}
