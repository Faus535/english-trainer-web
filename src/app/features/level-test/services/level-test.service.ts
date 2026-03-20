import { Injectable, inject, signal, computed } from '@angular/core';
import { Level, CEFR_LEVELS, MODULE_NAMES } from '../../../shared/models/learning.model';
import { StateService } from '../../../shared/services/state.service';
import { TestPhase, TestAnswer, ProfileType } from '../models/level-test.model';
import { TEST_VOCABULARY, TEST_GRAMMAR, TEST_LISTENING, TEST_PRONUNCIATION } from '../data/test-questions.data';
import { getProfileType, estimateSessions, PROFILE_MESSAGES } from '../data/profile-types.data';

@Injectable({ providedIn: 'root' })
export class LevelTestService {
  private readonly state = inject(StateService);

  private readonly _phase = signal<TestPhase>('intro');
  private readonly _currentQuestion = signal(0);
  private readonly _vocabAnswers = signal<TestAnswer[]>([]);
  private readonly _grammarAnswers = signal<TestAnswer[]>([]);
  private readonly _listeningAnswers = signal<TestAnswer[]>([]);
  private readonly _pronunciationAnswers = signal<TestAnswer[]>([]);

  readonly phase = this._phase.asReadonly();
  readonly currentQuestion = this._currentQuestion.asReadonly();

  readonly currentVocabQuestion = computed(() =>
    this._phase() === 'vocabulary' ? TEST_VOCABULARY[this._currentQuestion()] : null
  );

  readonly currentGrammarQuestion = computed(() =>
    this._phase() === 'grammar' ? TEST_GRAMMAR[this._currentQuestion()] : null
  );

  readonly currentListeningQuestion = computed(() =>
    this._phase() === 'listening' ? TEST_LISTENING[this._currentQuestion()] : null
  );

  readonly currentPronunciationQuestion = computed(() =>
    this._phase() === 'pronunciation' ? TEST_PRONUNCIATION[this._currentQuestion()] : null
  );

  readonly progress = computed(() => {
    switch (this._phase()) {
      case 'vocabulary': return { current: this._currentQuestion() + 1, total: TEST_VOCABULARY.length, label: 'Vocabulario' };
      case 'grammar': return { current: this._currentQuestion() + 1, total: TEST_GRAMMAR.length, label: 'Gramatica' };
      case 'listening': return { current: this._currentQuestion() + 1, total: TEST_LISTENING.length, label: 'Listening' };
      case 'pronunciation': return { current: this._currentQuestion() + 1, total: TEST_PRONUNCIATION.length, label: 'Pronunciacion' };
      default: return null;
    }
  });

  readonly results = computed(() => {
    if (this._phase() !== 'results') return null;
    const profile = this.state.profile();
    const levels = profile.levels;
    const profileType = getProfileType(levels);
    const message = PROFILE_MESSAGES[profileType.id];
    const sessions = estimateSessions(levels);
    return { levels, profileType, message, sessions };
  });

  startTest(): void {
    this._phase.set('vocabulary');
    this._currentQuestion.set(0);
    this._vocabAnswers.set([]);
    this._grammarAnswers.set([]);
    this._listeningAnswers.set([]);
    this._pronunciationAnswers.set([]);
  }

  submitVocabAnswer(input: string): void {
    const q = TEST_VOCABULARY[this._currentQuestion()];
    const answer = input.trim().toLowerCase();
    const correct = answer === q.answer.toLowerCase() ||
      (q.alts?.some(a => answer === a.toLowerCase()) ?? false);

    this._vocabAnswers.update(a => [...a, { level: q.level, correct }]);
    this.advanceOrNextPhase(TEST_VOCABULARY.length, 'grammar');
  }

  skipVocab(): void {
    const q = TEST_VOCABULARY[this._currentQuestion()];
    this._vocabAnswers.update(a => [...a, { level: q.level, correct: false }]);
    this.advanceOrNextPhase(TEST_VOCABULARY.length, 'grammar');
  }

  submitGrammarAnswer(optionIndex: number): void {
    const q = TEST_GRAMMAR[this._currentQuestion()];
    const correct = optionIndex === q.answer;
    this._grammarAnswers.update(a => [...a, { level: q.level, correct }]);
    this.advanceOrNextPhase(TEST_GRAMMAR.length, 'listening');
  }

  submitListeningAnswer(input: string): void {
    const q = TEST_LISTENING[this._currentQuestion()];
    const answer = input.trim().toLowerCase().replace(/[^a-z\s']/g, '');
    const expected = q.text.toLowerCase().replace(/[^a-z\s']/g, '');
    const words = expected.split(/\s+/);
    const answerWords = answer.split(/\s+/);

    let matched = 0;
    for (const w of words) {
      if (answerWords.includes(w)) matched++;
    }
    const score = words.length > 0 ? matched / words.length : 0;

    this._listeningAnswers.update(a => [...a, { level: q.level, correct: score >= 0.6, score }]);
    this.advanceOrNextPhase(TEST_LISTENING.length, 'pronunciation');
  }

  skipListening(): void {
    const q = TEST_LISTENING[this._currentQuestion()];
    this._listeningAnswers.update(a => [...a, { level: q.level, correct: false, score: 0 }]);
    this.advanceOrNextPhase(TEST_LISTENING.length, 'pronunciation');
  }

  submitPronunciationAnswer(optionIndex: number): void {
    const q = TEST_PRONUNCIATION[this._currentQuestion()];
    const correct = optionIndex === q.answer;
    this._pronunciationAnswers.update(a => [...a, { level: q.level, correct }]);

    const next = this._currentQuestion() + 1;
    if (next >= TEST_PRONUNCIATION.length) {
      this.calculateResults();
      this._phase.set('results');
    } else {
      this._currentQuestion.set(next);
    }
  }

  skipTestWithLevel(level: Level): void {
    for (const mod of MODULE_NAMES) {
      this.state.setModuleLevel(mod, level);
    }
    this.state.markTestCompleted();
  }

  finishTest(): void {
    // Results already saved in calculateResults
  }

  private advanceOrNextPhase(total: number, nextPhase: TestPhase): void {
    const next = this._currentQuestion() + 1;
    if (next >= total) {
      this._phase.set(nextPhase);
      this._currentQuestion.set(0);
    } else {
      this._currentQuestion.set(next);
    }
  }

  private calculateResults(): void {
    const vocabLevel = this.calculateLevel(this._vocabAnswers());
    const grammarLevel = this.calculateLevel(this._grammarAnswers());
    const listeningLevel = this.calculateLevel(this._listeningAnswers());
    const pronunciationLevel = this.calculateLevel(this._pronunciationAnswers());

    const vocIdx = CEFR_LEVELS.indexOf(vocabLevel);
    const gramIdx = CEFR_LEVELS.indexOf(grammarLevel);
    const phraseIdx = Math.min(vocIdx, gramIdx);

    this.state.setModuleLevel('vocabulary', vocabLevel);
    this.state.setModuleLevel('grammar', grammarLevel);
    this.state.setModuleLevel('listening', listeningLevel);
    this.state.setModuleLevel('pronunciation', pronunciationLevel);
    this.state.setModuleLevel('phrases', CEFR_LEVELS[phraseIdx]);
    this.state.markTestCompleted();
  }

  private calculateLevel(answers: TestAnswer[]): Level {
    const byLevel: Record<string, { correct: number; total: number }> = {};
    for (const a of answers) {
      if (!byLevel[a.level]) byLevel[a.level] = { correct: 0, total: 0 };
      byLevel[a.level].total++;
      if (a.correct) byLevel[a.level].correct++;
    }

    let bestLevel: Level = 'a1';
    for (const level of CEFR_LEVELS) {
      const stats = byLevel[level];
      if (stats && stats.total > 0 && (stats.correct / stats.total) >= 0.5) {
        bestLevel = level;
      } else if (stats && stats.total > 0) {
        break;
      }
    }
    return bestLevel;
  }
}
