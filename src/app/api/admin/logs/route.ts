import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { getAdminFirestore } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const db = getAdminFirestore();
  const snapshot = await db
    .collection('securePageAccessLogs')
    .orderBy('accessedAt', 'desc')
    .limit(200)
    .get();

  const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  return NextResponse.json(data);
}
