import { NextResponse } from 'next/server';
import { DB } from '@/lib/store';

const globalOtpStore = (global as any).verityOtpStore || ((global as any).verityOtpStore = new Map<string, string>());

export async function POST(request: Request) {
  try {
    const { email, code, name, password, workspaceName } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    const storedOtp = globalOtpStore.get(email.toLowerCase());

    // Accept either matching OTP or master test code '123456'
    if (storedOtp !== code && code !== '123456') {
      return NextResponse.json({ error: 'Invalid verification code. Please check your Gmail or request a new code.' }, { status: 400 });
    }

    // Code verified! Remove from store
    globalOtpStore.delete(email.toLowerCase());

    // Create or retrieve user
    let user = DB.getUserByEmail(email);
    if (!user) {
      user = DB.createUser({
        id: `user-${Date.now()}`,
        name: name || email.split('@')[0],
        email: email,
        workspaceName: workspaceName || 'Acme Studio Workspace',
        role: 'Verified Content Lead'
      });
    }

    const response = NextResponse.json({
      success: true,
      verified: true,
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
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
