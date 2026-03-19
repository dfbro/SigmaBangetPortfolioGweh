import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { getProfileSettings, updateProfileSettings } from '@/lib/server-storage';
import type { ProfileSettingsRecord } from '@/lib/portfolio-types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const payload = await getProfileSettings();
  return NextResponse.json(payload);
}

export async function PUT(req: NextRequest) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const data = (await req.json()) as Partial<ProfileSettingsRecord>;
  const payload = await updateProfileSettings(data);
  return NextResponse.json(payload);
}
