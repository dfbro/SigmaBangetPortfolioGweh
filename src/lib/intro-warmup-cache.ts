const INTRO_WARMUP_PREFIX = "intro_warmup:"
const INTRO_WARMUP_TTL_MS = 90_000

type WarmupEnvelope<T> = {
  payload: T
  timestamp: number
}

function getStorageKey(key: string): string {
  return `${INTRO_WARMUP_PREFIX}${key}`
}

export function setIntroWarmupData<T>(key: string, payload: T): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    const envelope: WarmupEnvelope<T> = {
      payload,
      timestamp: Date.now(),
    }
    window.sessionStorage.setItem(getStorageKey(key), JSON.stringify(envelope))
  } catch {
    // Ignore storage write failures (private mode/quota exceeded).
  }
}

export function getIntroWarmupData<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const raw = window.sessionStorage.getItem(getStorageKey(key))
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as WarmupEnvelope<T>
    if (!parsed || typeof parsed !== "object") {
      return null
    }

    if (typeof parsed.timestamp !== "number") {
      return null
    }

    if (Date.now() - parsed.timestamp > INTRO_WARMUP_TTL_MS) {
      window.sessionStorage.removeItem(getStorageKey(key))
      return null
    }

    return parsed.payload ?? null
  } catch {
    return null
  }
}