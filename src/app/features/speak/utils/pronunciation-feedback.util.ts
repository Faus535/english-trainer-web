import { PronunciationFeedback, WordResult } from '../models/speak.model';

export function getPronunciationFeedback(score: number): PronunciationFeedback {
  if (score >= 90) return { level: 'excellent', message: 'Excelente! Pronunciacion casi perfecta.' };
  if (score >= 70) return { level: 'good', message: 'Muy bien! Unas pocas palabras para mejorar.' };
  if (score >= 50) return { level: 'ok', message: 'Casi! Revisa las palabras en rojo.' };
  return { level: 'retry', message: 'Intentalo de nuevo. Escucha primero y repite.' };
}

export function normalizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, '')
    .trim()
    .split(/\s+/);
}

export function wordsMatch(expected: string, spoken: string): boolean {
  if (expected === spoken) return true;
  if (expected.length > 3 && spoken.length > 3) {
    const maxLen = Math.max(expected.length, spoken.length);
    const minLen = Math.min(expected.length, spoken.length);
    if (maxLen - minLen > 1) return false;
    let diff = 0;
    for (let i = 0; i < minLen; i++) {
      if (expected[i] !== spoken[i]) diff++;
    }
    diff += maxLen - minLen;
    return diff <= 1;
  }
  return false;
}

export function compareTexts(expected: string, spoken: string): { score: number; words: WordResult[] } {
  const expectedWords = normalizeText(expected);
  const spokenWords = normalizeText(spoken);

  const words: WordResult[] = [];
  let matched = 0;

  for (const ew of expectedWords) {
    const found = spokenWords.some(sw => wordsMatch(ew, sw));
    words.push({ word: ew, correct: found });
    if (found) matched++;
  }

  const score = expectedWords.length > 0 ? Math.round((matched / expectedWords.length) * 100) : 0;
  return { score, words };
}
