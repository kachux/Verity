import { NextResponse } from 'next/server';
import { DB } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { name, email, password, workspaceName } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existingUser = DB.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const newUser = DB.createUser({
      id: `user-${Date.now()}`,
      name,
      email,
      workspaceName: workspaceName || 'Acme Studio Workspace',
      role: 'Content Editor'
    });

    const response = NextResponse.json({
      success: true,
      user: newUser
    });

    response.cookies.set({
      name: 'verity_session',
      value: JSON.stringify(newUser),
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Signup failed' }, { status: 500 });
  }
}
