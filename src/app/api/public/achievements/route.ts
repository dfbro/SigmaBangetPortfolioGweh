import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { serializeFirestoreDocument } from '@/lib/firestore-json';
import type { AchievementRecord } from '@/lib/portfolio-types';

export async function GET() {
  const db = getAdminFirestore();
  const snapshot = await db.collection('achievements').orderBy('createdAt', 'desc').get();
  return NextResponse.json(snapshot.docs.map((doc) => serializeFirestoreDocument<AchievementRecord>(doc.id, doc.data())));
}