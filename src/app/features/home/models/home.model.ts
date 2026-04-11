export type SuggestedModule = 'REVIEW' | 'ARTICLE' | 'IMMERSE' | 'TALK';

export interface RecentAchievement {
  title: string;
  icon: string;
  xpReward: number;
}

export interface HomeResponse {
  dueReviewCount: number;
  streakDays: number;
  weeklyActivity: boolean[];
  suggestedModule: SuggestedModule;
  recentXpThisWeek: number;
  recentAchievements: RecentAchievement[];
  englishLevel: string | null;
}
