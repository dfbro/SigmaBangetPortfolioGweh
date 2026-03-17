import { Timestamp } from 'firebase-admin/firestore';

export function serializeFirestoreValue(value: unknown): unknown {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeFirestoreValue(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => [key, serializeFirestoreValue(entryValue)])
    );
  }

  return value;
}

export function serializeFirestoreDocument<T>(id: string, data: Record<string, unknown> | undefined): T {
  return {
    id,
    ...(serializeFirestoreValue(data ?? {}) as Record<string, unknown>),
  } as T;
}