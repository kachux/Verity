import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { exchangeCodeForTokens, getGoogleUserInfo } from '@/lib/google-oauth';
import { DB } from '@/lib/store';

export default async function Home({
  searchParams,
}: {
  searchParams?: { code?: string; error?: string; state?: string };
}) {
  const cookieStore = cookies();

  // 1. Check if returning from Google OAuth callback with an authorization code at root URL
  if (searchParams?.code) {
    try {
      const tokens = await exchangeCodeForTokens(searchParams.code);
      const googleProfile = await getGoogleUserInfo(tokens.access_token);

      if (googleProfile.email) {
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
          if (googleProfile.name) {
            user.name = googleProfile.name;
          }
          if (googleProfile.picture) {
            user.avatarUrl = googleProfile.picture;
          }
        }

        // Set session cookie
        cookieStore.set({
          name: 'verity_session',
          value: JSON.stringify(user),
          httpOnly: false,
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        });

        redirect('/dashboard');
      }
    } catch (err: any) {
      console.error('Root OAuth exchange error:', err);
      redirect(`/login?error=${encodeURIComponent(err.message || 'Google authentication failed')}`);
    }
  }

  // 2. Check if Google returned an error query parameter
  if (searchParams?.error) {
    redirect(`/login?error=${encodeURIComponent(searchParams.error)}`);
  }

  // 3. Normal session routing
  const session = cookieStore.get('verity_session');
  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
