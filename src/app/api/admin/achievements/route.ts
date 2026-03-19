import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { createAchievement, listAchievements } from '@/lib/server-storage';
import type { AchievementRecord } from '@/lib/portfolio-types';

export async function GET(req: NextRequest) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const rows = await listAchievements();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const data = (await req.json()) as Partial<AchievementRecord>;
  const id = await createAchievement(data);
  return NextResponse.json({ id }, { status: 201 });
}
