import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { createWriteup, listWriteups } from '@/lib/server-storage';
import type { WriteupRecord } from '@/lib/portfolio-types';

export async function GET(req: NextRequest) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const rows = await listWriteups();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const data = (await req.json()) as Partial<WriteupRecord>;
  const id = await createWriteup(data);
  return NextResponse.json({ id }, { status: 201 });
}
