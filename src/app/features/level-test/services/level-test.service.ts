import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Level,
  CEFR_LEVELS,
  MODULE_NAMES,
  ModuleName,
} from '../../../shared/models/learning.model';
import { StateService } from '../../../shared/services/state.service';
import { AuthService } from '../../../core/services/auth.service';
import { AssessmentApiService } from '../../../core/services/assessment-api.service';
import {
  TestPhase,
  TestAnswer,
  VocabQuestion,
  GrammarQuestion,
  ListeningQuestion,
  PronunciationQuestion,
} from '../models/level-test.model';
import {
  TEST_VOCABULARY,
  TEST_GRAMMAR,
  TEST_LISTENING,
  TEST_PRONUNCIATION,
} from '../data/test-questions.data';
import { getProfileType, estimateSessions, PROFILE_MESSAGES } from '../data/profile-types.data';

@Injectable({ providedIn: 'root' })
export class LevelTestService {
  private readonly state = inject(StateService);
  private readonly auth = inject(AuthService);
  private readonly assessmentApi = inject(AssessmentApiService);

  private readonly _phase = signal<TestPhase>('intro');
  private readonly _currentQuestion = signal(0);
  private readonly _loading = signal(false);
  private readonly _vocabAnswers = signal<TestAnswer[]>([]);
  private readonly _grammarAnswers = signal<TestAnswer[]>([]);
  private readonly _listeningAnswers = signal<TestAnswer[]>([]);
  private readonly _pronunciationAnswers = signal<TestAnswer[]>([]);

  private readonly _vocabulary = signal<VocabQuestion[]>(TEST_VOCABULARY);
  private readonly _grammar = signal<GrammarQuestion[]>(TEST_GRAMMAR);
  private readonly _listening = signal<ListeningQuestion[]>(TEST_LISTENING);
  private readonly _pronunciation = signal<PronunciationQuestion[]>(TEST_PRONUNCIATION);

  private readonly _previousLevels = signal<Partial<Record<ModuleName, Level>> | null>(null);

  readonly phase = this._phase.asReadonly();
  readonly currentQuestion = this._currentQuestion.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly previousLevels = this._previousLevels.asReadonly();

  readonly currentVocabQuestion = computed(() =>
    this._phase() === 'vocabulary' ? this._vocabulary()[this._currentQuestion()] : null,
  );

  readonly currentGrammarQuestion = computed(() =>
    this._phase() === 'grammar' ? this._grammar()[this._currentQuestion()] : null,
  );

  readonly currentListeningQuestion = computed(() =>
    this._phase() === 'listening' ? this._listening()[this._currentQuestion()] : null,
  );

  readonly currentPronunciationQuestion = computed(() =>
    this._phase() === 'pronunciation' ? this._pronunciation()[this._currentQuestion()] : null,
  );

  readonly progress = computed(() => {
    switch (this._phase()) {
      case 'vocabulary':
        return {
          current: this._currentQuestion() + 1,
          total: this._vocabulary().length,
          label: 'Vocabulario',
        };
      case 'grammar':
        return {
          current: this._currentQuestion() + 1,
          total: this._grammar().length,
          label: 'Gramatica',
        };
      case 'listening':
        return {
          current: this._currentQuestion() + 1,
          total: this._listening().length,
          label: 'Listening',
        };
      case 'pronunciation':
        return {
          current: this._currentQuestion() + 1,
          total: this._pronunciation().length,
          label: 'Pronunciacion',
        };
      default:
        return null;
    }
  });

  readonly results = computed(() => {
    if (this._phase() !== 'results') return null;
    const profile = this.state.profile();
    const levels = profile.levels;
    const profileType = getProfileType(levels);
    const message = PROFILE_MESSAGES[profileType.id];
    const sessions = estimateSessions(levels);
    const previousLevels = this._previousLevels();
    return { levels, profileType, message, sessions, previousLevels };
  });

  startTest(): void {
    const profile = this.state.profile();
    if (profile.testCompleted && Object.keys(profile.levels).length > 0) {
      this._previousLevels.set({ ...profile.levels });
    } else {
      this._previousLevels.set(null);
    }

    this._currentQuestion.set(0);
    this._vocabAnswers.set([]);
    this._grammarAnswers.set([]);
    this._listeningAnswers.set([]);
    this._pronunciationAnswers.set([]);
    this._loading.set(true);
    this._phase.set('vocabulary');

    this.assessmentApi.getTestQuestions().subscribe({
      next: (res) => {
        if (res.vocabulary?.length) this._vocabulary.set(res.vocabulary);
        if (res.grammar?.length) this._grammar.set(res.grammar);
        if (res.listening?.length) this._listening.set(res.listening);
        if (res.pronunciation?.length) this._pronunciation.set(res.pronunciation);
        this._loading.set(false);
      },
      error: () => {
        this._vocabulary.set(TEST_VOCABULARY);
        this._grammar.set(TEST_GRAMMAR);
        this._listening.set(TEST_LISTENING);
        this._pronunciation.set(TEST_PRONUNCIATION);
        this._loading.set(false);
      },
    });
  }

  submitVocabAnswer(input: string): void {
    const q = this._vocabulary()[this._currentQuestion()];
    const answer = input.trim().toLowerCase();
    const correct =
      answer === q.answer.toLowerCase() ||
      (q.alts?.some((a) => answer === a.toLowerCase()) ?? false);

    this._vocabAnswers.update((a) => [...a, { level: q.level, correct }]);
    this.advanceOrNextPhase(this._vocabulary().length, 'grammar');
  }

  skipVocab(): void {
    const q = this._vocabulary()[this._currentQuestion()];
    this._vocabAnswers.update((a) => [...a, { level: q.level, correct: false }]);
    this.advanceOrNextPhase(this._vocabulary().length, 'grammar');
  }

  submitGrammarAnswer(optionIndex: number): void {
    const q = this._grammar()[this._currentQuestion()];
    const correct = optionIndex === q.answer;
    this._grammarAnswers.update((a) => [...a, { level: q.level, correct }]);
    this.advanceOrNextPhase(this._grammar().length, 'listening');
  }

  submitListeningAnswer(input: string): void {
    const q = this._listening()[this._currentQuestion()];
    const answer = input
      .trim()
      .toLowerCase()
      .replace(/[^a-z\s']/g, '');
    const expected = q.text.toLowerCase().replace(/[^a-z\s']/g, '');
    const words = expected.split(/\s+/);
    const answerWords = answer.split(/\s+/);

    let matched = 0;
    for (const w of words) {
      if (answerWords.includes(w)) matched++;
    }
    const score = words.length > 0 ? matched / words.length : 0;

    this._listeningAnswers.update((a) => [...a, { level: q.level, correct: score >= 0.6, score }]);
    this.advanceOrNextPhase(this._listening().length, 'pronunciation');
  }

  skipListening(): void {
    const q = this._listening()[this._currentQuestion()];
    this._listeningAnswers.update((a) => [...a, { level: q.level, correct: false, score: 0 }]);
    this.advanceOrNextPhase(this._listening().length, 'pronunciation');
  }

  submitPronunciationAnswer(optionIndex: number): void {
    const q = this._pronunciation()[this._currentQuestion()];
    const correct = optionIndex === q.answer;
    this._pronunciationAnswers.update((a) => [...a, { level: q.level, correct }]);

    const next = this._currentQuestion() + 1;
    if (next >= this._pronunciation().length) {
      this.calculateResults();
      this._phase.set('results');
    } else {
      this._currentQuestion.set(next);
    }
  }

  skipTestWithLevel(level: Level): void {
    const levels: Record<ModuleName, Level> = {} as Record<ModuleName, Level>;
    for (const mod of MODULE_NAMES) {
      levels[mod] = level;
    }
    this.state.setAllLevelsAndComplete(levels);
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
    const phrasesLevel = CEFR_LEVELS[phraseIdx];

    this.state.setModuleLevel('vocabulary', vocabLevel, false);
    this.state.setModuleLevel('grammar', grammarLevel, false);
    this.state.setModuleLevel('listening', listeningLevel, false);
    this.state.setModuleLevel('pronunciation', pronunciationLevel, false);
    this.state.setModuleLevel('phrases', phrasesLevel, false);
    this.state.markTestCompleted(false);

    const levels: Record<ModuleName, Level> = {
      vocabulary: vocabLevel,
      grammar: grammarLevel,
      listening: listeningLevel,
      pronunciation: pronunciationLevel,
      phrases: phrasesLevel,
    };

    localStorage.setItem('et_pending_levels', JSON.stringify(levels));
    this.submitToBackend(levels);
  }

  private submitToBackend(_levels: Record<ModuleName, Level>): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    const scores: Record<ModuleName, number> = {
      vocabulary: this.calculateScore(this._vocabAnswers()),
      grammar: this.calculateScore(this._grammarAnswers()),
      listening: this.calculateScore(this._listeningAnswers()),
      pronunciation: this.calculateScore(this._pronunciationAnswers()),
      phrases: 0,
    };

    this.assessmentApi.submitLevelTest(profileId, { answers: {}, scores }).subscribe({
      next: (res) => {
        localStorage.removeItem('et_pending_levels');
        if (res.levels) {
          this.state.applyLevelsFromBackend(res.levels);
        }
      },
    });
  }

  private calculateScore(answers: TestAnswer[]): number {
    if (answers.length === 0) return 0;
    const correct = answers.filter((a) => a.correct).length;
    return Math.round((correct / answers.length) * 100);
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
      if (stats && stats.total > 0 && stats.correct / stats.total >= 0.5) {
        bestLevel = level;
      } else if (stats && stats.total > 0) {
        break;
      }
    }
    return bestLevel;
  }
}
