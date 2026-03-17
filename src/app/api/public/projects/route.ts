import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { serializeFirestoreDocument } from '@/lib/firestore-json';
import type { ProjectRecord } from '@/lib/portfolio-types';

export async function GET() {
  const db = getAdminFirestore();
  const snapshot = await db.collection('projects').orderBy('createdAt', 'desc').get();
  return NextResponse.json(snapshot.docs.map((doc) => serializeFirestoreDocument<ProjectRecord>(doc.id, doc.data())));
}