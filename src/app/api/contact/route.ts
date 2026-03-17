import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const db = getAdminFirestore();
    await db.collection('users').doc('admin').collection('secureMessages').add({
      title: String(subject),
      content: `From: ${name} (${email})\n\n${message}`,
      createdAt: new Date().toISOString(),
      username: String(name),
      source: 'contact-form',
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }
}