import { NextResponse } from 'next/server';

// In-memory OTP storage
const globalOtpStore = (global as any).verityOtpStore || ((global as any).verityOtpStore = new Map<string, string>());

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid Gmail address' }, { status: 400 });
    }

    // Generate 6 digit numeric code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    globalOtpStore.set(email.toLowerCase(), otp);

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${email}`,
      code: otp // Returned so user can view/paste directly during testing
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send verification code' }, { status: 500 });
  }
}
