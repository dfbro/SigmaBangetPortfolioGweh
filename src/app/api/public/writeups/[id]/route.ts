import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { serializeFirestoreDocument } from '@/lib/firestore-json';
import type { WriteupRecord } from '@/lib/portfolio-types';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getAdminFirestore();
  const snapshot = await db.collection('ctfWriteups').doc(id).get();

  if (!snapshot.exists) {
    return NextResponse.json({ error: 'Write-up not found.' }, { status: 404 });
  }

  return NextResponse.json(serializeFirestoreDocument<WriteupRecord>(snapshot.id, snapshot.data()));
}