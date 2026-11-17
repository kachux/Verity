import { NextResponse } from 'next/server';
import { DB } from '@/lib/store';

export async function GET() {
  const stats = DB.getStats();
  return NextResponse.json({ stats });
}
