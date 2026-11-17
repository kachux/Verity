import { NextResponse } from 'next/server';
import { DB } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check user in database or accept demo credentials
    let user = DB.getUserByEmail(email);

    if (!user) {
      // If user doesn't exist, allow logging in for convenience in demo mode
      user = DB.createUser({
        id: `user-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        workspaceName: 'Acme Studio Workspace',
        role: 'Content Lead'
      });
    }

    const response = NextResponse.json({
      success: true,
      user
    });

    // Set cookie for session
    response.cookies.set({
      name: 'verity_session',
      value: JSON.stringify(user),
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
