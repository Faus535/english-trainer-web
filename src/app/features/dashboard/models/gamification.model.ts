export interface GamificationLevel {
  name: string;
  minXP: number;
}

export interface GamificationStatus {
  name: string;
  index: number;
  xp: number;
  progress: number;
  nextLevel: GamificationLevel | null;
}

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  desc: string;
}

export interface SoundOfTheDay {
  sound: string;
  name: string;
  words: string[];
  tip: string;
}

export interface PhraseRoulette {
  en: string;
  es: string;
  hint: string;
}
