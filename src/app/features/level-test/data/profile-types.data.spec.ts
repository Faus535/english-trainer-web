import { describe, expect, it } from 'vitest';
import { getProfileType, estimateSessions } from './profile-types.data';

describe('getProfileType', () => {
  it('should return basico for all A1', () => {
    const result = getProfileType({ listening: 'a1', vocabulary: 'a1', grammar: 'a1' });
    expect(result.id).toBe('basico');
  });

  it('should return avanzado_pasivo when read B1+ but listen A1', () => {
    const result = getProfileType({ listening: 'a1', vocabulary: 'b1', grammar: 'b1' });
    expect(result.id).toBe('avanzado_pasivo');
  });

  it('should return reactivador when read A2 but listen A1', () => {
    const result = getProfileType({ listening: 'a1', vocabulary: 'a2', grammar: 'a2' });
    expect(result.id).toBe('reactivador');
  });

  it('should return intermedio for B1+ reading with good listening', () => {
    const result = getProfileType({ listening: 'b1', vocabulary: 'b1', grammar: 'a2' });
    expect(result.id).toBe('intermedio');
  });
});

describe('estimateSessions', () => {
  it('should estimate more sessions for A1 listener', () => {
    const result = estimateSessions({ listening: 'a1' });
    expect(result).toContain('56'); // 4 * 16 - 8 = 56
  });

  it('should estimate fewer sessions for B2 listener', () => {
    const result = estimateSessions({ listening: 'b2' });
    expect(result).toContain('8'); // 1 * 16 - 8 = 8
  });

  it('should estimate 0 range for C1 listener', () => {
    const result = estimateSessions({ listening: 'c1' });
    expect(result).toContain('-8'); // 0 * 16 - 8 = -8
  });
});
