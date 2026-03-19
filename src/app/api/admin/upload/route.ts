import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';

export async function POST(req: NextRequest) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  return NextResponse.json(
    {
      error:
        'Upload storage backend is not configured yet for Cloudflare Workers. Upload migration will be added in the next phase.',
    },
    { status: 501 }
  );
}
