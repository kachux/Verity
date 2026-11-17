import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Runtime in-memory storage for active API key
let activeApiKey = process.env.ZEROGPT_API_KEY || process.env.AI_API_KEY || '';

export async function GET() {
  const isConfigured = Boolean(activeApiKey && activeApiKey.length > 5);
  const maskedKey = isConfigured
    ? `${activeApiKey.slice(0, 6)}••••••••${activeApiKey.slice(-4)}`
    : '';

  const isZeroGpt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activeApiKey);
  const provider = isZeroGpt
    ? 'ZeroGPT AI Detector'
    : activeApiKey.startsWith('AQ.') || activeApiKey.startsWith('AIzaSy')
    ? 'Google AI Studio (Gemini)'
    : activeApiKey.startsWith('sk-')
    ? 'OpenAI'
    : isConfigured
    ? 'Custom AI Provider'
    : 'None';

  return NextResponse.json({
    configured: isConfigured,
    maskedKey,
    provider
  });
}

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 5) {
      return NextResponse.json({ error: 'Please enter a valid API key' }, { status: 400 });
    }

    activeApiKey = apiKey.trim();
    const isZeroGpt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activeApiKey);

    if (isZeroGpt) {
      process.env.ZEROGPT_API_KEY = activeApiKey;
      process.env.AI_API_KEY = activeApiKey;
    } else if (activeApiKey.startsWith('AQ.') || activeApiKey.startsWith('AIzaSy')) {
      process.env.GEMINI_API_KEY = activeApiKey;
      process.env.AI_API_KEY = activeApiKey;
    } else {
      process.env.AI_API_KEY = activeApiKey;
    }

    try {
      const envPath = path.join(process.cwd(), '.env.local');
      let currentEnv = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
      if (isZeroGpt) {
        currentEnv = currentEnv.replace(/ZEROGPT_API_KEY=.*/g, `ZEROGPT_API_KEY=${activeApiKey}`);
        if (!currentEnv.includes('ZEROGPT_API_KEY=')) {
          currentEnv = `ZEROGPT_API_KEY=${activeApiKey}\n` + currentEnv;
        }
      }
      fs.writeFileSync(envPath, currentEnv, 'utf8');
    } catch (e) {
      console.warn('Could not write to .env.local', e);
    }

    const provider = isZeroGpt
      ? 'ZeroGPT AI Detector'
      : activeApiKey.startsWith('AQ.') || activeApiKey.startsWith('AIzaSy')
      ? 'Google AI Studio (Gemini)'
      : activeApiKey.startsWith('sk-')
      ? 'OpenAI GPT-4o'
      : 'AI Provider';

    return NextResponse.json({
      success: true,
      message: `API Key successfully connected for ${provider}!`,
      configured: true,
      provider
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save API key' }, { status: 500 });
  }
}
