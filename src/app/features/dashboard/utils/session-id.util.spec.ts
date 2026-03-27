import { describe, expect, it } from 'vitest';
import { isBackendSession } from './session-id.util';

describe('isBackendSession', () => {
  it('returns true for valid UUIDs', () => {
    expect(isBackendSession('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('returns true for uppercase UUIDs', () => {
    expect(isBackendSession('550E8400-E29B-41D4-A716-446655440000')).toBe(true);
  });

  it('returns false for local fallback IDs', () => {
    expect(isBackendSession('session-1710000000000')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isBackendSession('')).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(isBackendSession(null)).toBe(false);
    expect(isBackendSession(undefined)).toBe(false);
  });

  it('returns false for UUID without dashes', () => {
    expect(isBackendSession('550e8400e29b41d4a716446655440000')).toBe(false);
  });
});
