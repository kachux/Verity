import { NextResponse } from 'next/server';
import { DB } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { email, name, avatarUrl } = await request.json();

    const userEmail = email || 'kasimraheeskzr@gmail.com';
    const userName = name || 'Kasim Rahees';

    let user = DB.getUserByEmail(userEmail);
    if (!user) {
      user = DB.createUser({
        id: `user-google-${Date.now()}`,
        name: userName,
        email: userEmail,
        workspaceName: `${userName.split(' ')[0]} Workspace`,
        role: 'Content Lead',
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
    }

    const response = NextResponse.json({
      success: true,
      user
    });

    response.cookies.set({
      name: 'verity_session',
      value: JSON.stringify(user),
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Google authentication failed' }, { status: 500 });
  }
}
