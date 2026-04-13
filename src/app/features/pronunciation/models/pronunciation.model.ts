export interface PronunciationAnalyzeRequest {
  text: string;
  level: string;
}

export interface PronunciationAnalyzeResponse {
  text: string;
  ipa: string;
  syllables: string;
  stressPattern: string;
  tips: string[];
  commonMistakes: string[];
  minimalPairs: string[];
  exampleSentences: string[];
}

export interface WordConfidence {
  word: string;
  confidence: number;
}

export interface WordFeedback {
  word: string;
  recognized: string;
  tip: string;
  score: number;
}

export interface PronunciationFeedbackRequest {
  targetText: string;
  recognizedText: string;
  wordConfidences: WordConfidence[];
}

export interface PronunciationFeedbackResponse {
  score: number;
  wordFeedback: WordFeedback[];
  overallTip: string;
}

export interface DrillItem {
  id: string;
  phrase: string;
  focus: string;
  difficulty: string;
  cefrLevel: string;
}

export interface DrillSubmitRequest {
  recognizedText: string;
  confidence: number;
}

export interface DrillSubmitResponse {
  score: number;
  feedback: string;
  perfectStreak: number;
}

export interface MiniConversationStartRequest {
  focus: string;
  level: string;
}

export interface MiniConversationStartResponse {
  id: string;
  prompt: string;
  targetPhrase: string;
}

export interface MiniConversationEvaluateRequest {
  recognizedText: string;
  wordConfidences: WordConfidence[];
}

export interface MiniConversationEvaluateResponse {
  score: number;
  wordFeedback: WordFeedback[];
  nextPrompt: string;
  nextTargetPhrase: string;
  isComplete: boolean;
}

export interface MiniConversationTurn {
  id: string;
  prompt: string;
  targetPhrase: string;
  recognizedText: string | null;
  score: number | null;
  wordFeedback: WordFeedback[];
  overallTip: string | null;
}
