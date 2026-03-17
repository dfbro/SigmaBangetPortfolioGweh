import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'achievements';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const { id } = await params;
  const data = await req.json();
  const db = getAdminFirestore();
  await db.collection(COLLECTION).doc(id).update({ ...data, updatedAt: FieldValue.serverTimestamp() });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const { id } = await params;
  const db = getAdminFirestore();
  await db.collection(COLLECTION).doc(id).delete();
  return NextResponse.json({ ok: true });
}
