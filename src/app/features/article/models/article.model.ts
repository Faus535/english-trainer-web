export type ArticleLevel = 'B1' | 'B2' | 'C1';
export type ArticleStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'READY'
  | 'FAILED'
  | 'IN_PROGRESS'
  | 'COMPLETED';
export type ParagraphSpeaker = 'AI' | 'USER';

export interface GenerateArticleRequest {
  topic: string;
  level: ArticleLevel;
}

export interface GenerateArticleResponse {
  id: string;
  status: ArticleStatus;
}

export interface ArticleParagraphDto {
  id: string;
  content: string;
  orderIndex: number;
  speaker: ParagraphSpeaker;
}

export interface ArticleResponse {
  id: string;
  title: string;
  topic: string;
  level: ArticleLevel;
  status: ArticleStatus;
  paragraphs: ArticleParagraphDto[];
  currentParagraphIndex: number;
  currentQuestionIndex: number;
}

export interface SaveWordRequest {
  wordOrPhrase: string;
  contextSentence: string;
}

export interface SavedWord {
  id: string;
  wordOrPhrase: string;
  translation: string;
  englishDefinition: string;
  contextSentence: string;
  // Enrichment (async — null until enriched)
  definition: string | null;
  phonetics: string | null;
  synonyms: string[] | null;
  exampleSentence: string | null;
  partOfSpeech: string | null;
}

export interface PreReadingKeyWord {
  word: string;
  translation: string;
  definition: string;
}

export interface PreReadingData {
  keyWords: PreReadingKeyWord[];
  predictiveQuestion: string | null;
}

export interface SavedWordDraft {
  wordOrPhrase: string;
  contextSentence: string;
}

export interface ArticleQuestion {
  id: string;
  questionText: string;
  orderIndex: number;
  minWords: number;
  answered: boolean;
  answer?: AnswerResult;
}

export interface SubmitAnswerRequest {
  answer: string;
}

export interface AnswerResult {
  isContentCorrect: boolean;
  grammarFeedback: string;
  styleFeedback: string;
  correctionSummary: string;
}

export interface QuestionAnswer {
  questionId: string;
  result: AnswerResult;
}

export interface SummaryStats {
  totalQuestions: number;
  answeredCorrectly: number;
  totalWords: number;
  xpBreakdown: {
    baseXp: number;
    correctAnswerXp: number;
    markedWordsXp: number;
    totalXp: number;
  };
}

export interface ArticleHistoryItem {
  id: string;
  topic: string;
  level: ArticleLevel;
  status: ArticleStatus;
  createdAt: string;
  questionCount: number;
  answeredCount: number;
  savedWordCount: number;
}
