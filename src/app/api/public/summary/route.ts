import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';
import type { HomeSummaryResponse, LatestActivityRecord } from '@/lib/portfolio-types';
import { serializeFirestoreDocument } from '@/lib/firestore-json';

export async function GET() {
  const db = getAdminFirestore();

  const [writeupCountSnapshot, projectCountSnapshot, achievementCountSnapshot, latestWriteupSnapshot, latestProjectSnapshot, latestAchievementSnapshot] = await Promise.all([
    db.collection('ctfWriteups').count().get(),
    db.collection('projects').count().get(),
    db.collection('achievements').count().get(),
    db.collection('ctfWriteups').orderBy('createdAt', 'desc').limit(1).get(),
    db.collection('projects').orderBy('createdAt', 'desc').limit(1).get(),
    db.collection('achievements').orderBy('createdAt', 'desc').limit(1).get(),
  ]);

  const latestCandidates: LatestActivityRecord[] = [];

  const latestWriteupDoc = latestWriteupSnapshot.docs[0];
  if (latestWriteupDoc) {
    const latestWriteup = serializeFirestoreDocument<{ title?: string; createdAt?: string }>(latestWriteupDoc.id, latestWriteupDoc.data());
    if (latestWriteup.title && latestWriteup.createdAt) {
      latestCandidates.push({ type: 'WRITE-UP', title: latestWriteup.title, date: latestWriteup.createdAt });
    }
  }

  const latestProjectDoc = latestProjectSnapshot.docs[0];
  if (latestProjectDoc) {
    const latestProject = serializeFirestoreDocument<{ title?: string; createdAt?: string }>(latestProjectDoc.id, latestProjectDoc.data());
    if (latestProject.title && latestProject.createdAt) {
      latestCandidates.push({ type: 'PROJECT', title: latestProject.title, date: latestProject.createdAt });
    }
  }

  const latestAchievementDoc = latestAchievementSnapshot.docs[0];
  if (latestAchievementDoc) {
    const latestAchievement = serializeFirestoreDocument<{ title?: string; createdAt?: string }>(latestAchievementDoc.id, latestAchievementDoc.data());
    if (latestAchievement.title && latestAchievement.createdAt) {
      latestCandidates.push({ type: 'ACHIEVEMENT', title: latestAchievement.title, date: latestAchievement.createdAt });
    }
  }

  latestCandidates.sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

  const payload: HomeSummaryResponse = {
    writeupCount: Number(writeupCountSnapshot.data().count ?? 0),
    projectCount: Number(projectCountSnapshot.data().count ?? 0),
    achievementCount: Number(achievementCountSnapshot.data().count ?? 0),
    latestActivity: latestCandidates[0] ?? null,
  };

  return NextResponse.json(payload);
}