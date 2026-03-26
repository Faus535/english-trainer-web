import { Level, CEFR_LEVELS } from '../models/learning.model';

/** Returns all levels strictly below the given level, ordered ascending. */
export function getLowerLevels(level: Level): Level[] {
  const idx = CEFR_LEVELS.indexOf(level);
  return idx <= 0 ? [] : CEFR_LEVELS.slice(0, idx);
}

/**
 * Mixes main items with review items from lower levels.
 * @param mainItems - Items at the user's current level
 * @param reviewItems - Items from lower levels
 * @param totalCount - Total items to return
 * @param reviewRatio - Fraction of items that should be review (0-1), default 0.2
 * @returns Shuffled array mixing main and review items
 */
export function mixWithReview<T>(
  mainItems: T[],
  reviewItems: T[],
  totalCount: number,
  reviewRatio = 0.2,
): T[] {
  const reviewCount = Math.min(Math.round(totalCount * reviewRatio), reviewItems.length);
  const mainCount = Math.min(totalCount - reviewCount, mainItems.length);

  const picked = [
    ...pickRandomItems(mainItems, mainCount),
    ...pickRandomItems(reviewItems, reviewCount),
  ];
  return shuffle(picked);
}

function pickRandomItems<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
