import { NextResponse } from 'next/server';
import { getProfileSettings } from '@/lib/server-storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  const payload = await getProfileSettings();
  return NextResponse.json(payload);
}
