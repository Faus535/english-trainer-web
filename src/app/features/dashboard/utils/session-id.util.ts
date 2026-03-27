const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isBackendSession(sessionId: string | undefined | null): boolean {
  if (!sessionId) return false;
  return UUID_REGEX.test(sessionId);
}
