import { NextRequest, NextResponse } from 'next/server';
import { createContactMessage } from '@/lib/server-storage';

interface ContactRequestBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactRequestBody;
    const name = typeof body.name === 'string' ? body.name : '';
    const email = typeof body.email === 'string' ? body.email : '';
    const subject = typeof body.subject === 'string' ? body.subject : '';
    const message = typeof body.message === 'string' ? body.message : '';

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    await createContactMessage({
      name: String(name),
      email: String(email),
      subject: String(subject),
      message: String(message),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }
}