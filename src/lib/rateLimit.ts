type Entry = { count: number; expiresAt: number };

const store = new Map<string, Entry>();

export function limitByKey(key: string, maxHits: number, windowMs: number): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.expiresAt <= now) {
    store.set(key, { count: 1, expiresAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (current.count >= maxHits) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.expiresAt - now) / 1000)),
    };
  }

  current.count += 1;
  store.set(key, current);
  return { ok: true, retryAfterSeconds: 0 };
}
