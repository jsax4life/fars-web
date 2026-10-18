export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const segment = token.split('.')[1];
    if (!segment) return null;
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** True when the token is already expired (or has zero lifetime). */
export function isAccessTokenExpired(accessToken: string, skewSeconds = 5): boolean {
  const payload = decodeJwtPayload(accessToken);
  if (!payload || typeof payload.exp !== 'number') return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + skewSeconds;
}

export function extractAuthTokens(payload: unknown): { accessToken: string; refreshToken: string } | null {
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as Record<string, unknown>;
  if (typeof record.accessToken === 'string' && typeof record.refreshToken === 'string') {
    return { accessToken: record.accessToken, refreshToken: record.refreshToken };
  }
  const nested = record.data ?? record.response;
  if (nested && typeof nested === 'object') {
    return extractAuthTokens(nested);
  }
  return null;
}

export function accessTokenLifetimeSeconds(accessToken: string): number | null {
  const payload = decodeJwtPayload(accessToken);
  if (!payload || typeof payload.exp !== 'number' || typeof payload.iat !== 'number') {
    return null;
  }
  return payload.exp - payload.iat;
}
