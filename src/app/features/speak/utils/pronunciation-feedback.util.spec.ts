import { describe, expect, it } from 'vitest';

import { compareTexts, getPronunciationFeedback, wordsMatch } from './pronunciation-feedback.util';

describe('wordsMatch', () => {
  it('should match identical words', () => {
    expect(wordsMatch('hello', 'hello')).toBe(true);
  });

  it('should match words with 1 char difference for words > 3 chars', () => {
    expect(wordsMatch('hello', 'hallo')).toBe(true);
  });

  it('should not match words with 2+ char difference', () => {
    expect(wordsMatch('hello', 'hxllo')).toBe(true); // only 1 diff
    expect(wordsMatch('hello', 'hxlly')).toBe(false); // 2 diffs
  });

  it('should not match short words with any difference', () => {
    expect(wordsMatch('ok', 'ox')).toBe(false);
    expect(wordsMatch('the', 'thi')).toBe(false);
  });

  it('should handle length difference > 1', () => {
    expect(wordsMatch('hello', 'hel')).toBe(false);
  });

  it('should match words with 1 char length difference', () => {
    expect(wordsMatch('hello', 'hell')).toBe(true);
  });
});

describe('compareTexts', () => {
  it('should return 100% for identical texts', () => {
    const result = compareTexts('Hello world', 'hello world');
    expect(result.score).toBe(100);
    expect(result.words.every(w => w.correct)).toBe(true);
  });

  it('should return 0% for completely different texts', () => {
    const result = compareTexts('Hello world', 'xyz abc');
    expect(result.score).toBe(0);
  });

  it('should handle partial matches', () => {
    const result = compareTexts('I like coffee with milk', 'I like coffee');
    expect(result.score).toBe(60); // 3/5 words
  });

  it('should ignore punctuation', () => {
    const result = compareTexts("Hello, my name is Ana.", 'hello my name is ana');
    expect(result.score).toBe(100);
  });

  it('should handle empty spoken text', () => {
    const result = compareTexts('Hello', '');
    expect(result.score).toBe(0);
  });

  it('should preserve apostrophes in matching', () => {
    const result = compareTexts("I don't understand", "i don't understand");
    expect(result.score).toBe(100);
  });
});

describe('getPronunciationFeedback', () => {
  it('should return excellent for score >= 90', () => {
    expect(getPronunciationFeedback(90).level).toBe('excellent');
    expect(getPronunciationFeedback(100).level).toBe('excellent');
  });

  it('should return good for score >= 70', () => {
    expect(getPronunciationFeedback(70).level).toBe('good');
    expect(getPronunciationFeedback(89).level).toBe('good');
  });

  it('should return ok for score >= 50', () => {
    expect(getPronunciationFeedback(50).level).toBe('ok');
    expect(getPronunciationFeedback(69).level).toBe('ok');
  });

  it('should return retry for score < 50', () => {
    expect(getPronunciationFeedback(49).level).toBe('retry');
    expect(getPronunciationFeedback(0).level).toBe('retry');
  });
});
