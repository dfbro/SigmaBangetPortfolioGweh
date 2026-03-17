import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'projects';

export async function GET(req: NextRequest) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const db = getAdminFirestore();
  const snapshot = await db.collection(COLLECTION).orderBy('createdAt', 'desc').get();
  return NextResponse.json(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
}

export async function POST(req: NextRequest) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const data = await req.json();
  const db = getAdminFirestore();
  const doc = await db.collection(COLLECTION).add({
    ...data,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return NextResponse.json({ id: doc.id }, { status: 201 });
}
