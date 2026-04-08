export type ArticleLevel = 'B1' | 'B2' | 'C1';
export type ArticleStatus = 'IN_PROGRESS' | 'READY' | 'FAILED';
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
}

export interface SaveWordRequest {
  wordOrPhrase: string;
  contextSentence: string;
}

export interface SavedWord {
  id: string;
  wordOrPhrase: string;
  translation: string;
  contextSentence: string;
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
