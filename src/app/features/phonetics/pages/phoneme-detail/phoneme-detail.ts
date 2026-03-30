import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ArrowLeft, Volume2 } from 'lucide-angular';

import { AuthService } from '../../../../core/services/auth.service';
import { Icon } from '../../../../shared/components/icon/icon';
import { PronunciationCheck } from '../../../speak/components/pronunciation-check/pronunciation-check';
import { SpeechRecognitionService } from '../../../speak/services/speech-recognition.service';
import { TtsService } from '../../../speak/services/tts.service';
import { WordResult } from '../../../speak/models/speak.model';
import { PhonemeDetailResponse, PhraseResponse } from '../../models/phonetics.model';
import { PhoneticsApiService } from '../../services/phonetics-api.service';
import { PracticeProgressBar } from '../../components/practice-progress-bar/practice-progress-bar';
import {
  PracticeCompletion,
  PhraseResult,
} from '../../components/practice-completion/practice-completion';

type PracticeState = 'info' | 'practicing' | 'complete';

@Component({
  selector: 'app-phoneme-detail',
  imports: [RouterLink, Icon, PronunciationCheck, PracticeProgressBar, PracticeCompletion],
  templateUrl: './phoneme-detail.html',
  styleUrl: './phoneme-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhonemeDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(PhoneticsApiService);
  private readonly auth = inject(AuthService);
  private readonly tts = inject(TtsService);
  private readonly recognition = inject(SpeechRecognitionService);

  protected readonly backIcon = ArrowLeft;
  protected readonly volumeIcon = Volume2;
  protected readonly supported = this.recognition.supported;

  protected readonly phoneme = signal<PhonemeDetailResponse | null>(null);
  protected readonly phrases = signal<PhraseResponse[]>([]);
  protected readonly loading = signal(true);
  protected readonly practiceState = signal<PracticeState>('info');
  protected readonly currentPhraseIndex = signal(0);
  protected readonly phraseResults = signal<Map<number, { passed: boolean; score: number }>>(
    new Map(),
  );

  protected readonly currentPhrase = computed(
    () => this.phrases()[this.currentPhraseIndex()] ?? null,
  );

  protected readonly passedCount = computed(
    () => [...this.phraseResults().values()].filter((r) => r.passed).length,
  );

  protected readonly progressResults = computed(
    () => new Map([...this.phraseResults()].map(([k, v]) => [k, v.passed])),
  );

  protected readonly completionResults = computed<PhraseResult[]>(() =>
    this.phrases().map((p, i) => ({
      phrase: p.text,
      passed: this.phraseResults().get(i)?.passed ?? false,
      score: this.phraseResults().get(i)?.score ?? 0,
    })),
  );

  constructor() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (!id) return;

      forkJoin([this.api.getPhonemeDetail(id), this.api.getPhrases(id)]).subscribe({
        next: ([detail, phrases]) => {
          this.phoneme.set(detail);
          this.phrases.set(phrases);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    });
  }

  protected startPractice(): void {
    this.practiceState.set('practicing');
    this.currentPhraseIndex.set(0);
    this.phraseResults.set(new Map());
  }

  protected onPhraseResult(result: { expected: string; words: WordResult[] }): void {
    const totalWords = result.words.length;
    const correctWords = result.words.filter((w) => w.correct).length;
    const score = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
    const passed = score >= 70;

    const updated = new Map(this.phraseResults());
    updated.set(this.currentPhraseIndex(), { passed, score });
    this.phraseResults.set(updated);

    const profileId = this.auth.profileId();
    const phrase = this.currentPhrase();
    const phoneme = this.phoneme();
    if (profileId && phrase && phoneme) {
      this.api.submitAttempt(profileId, phoneme.id, phrase.id, { score }).subscribe();
    }

    setTimeout(() => this.nextPhrase(), 2000);
  }

  protected speakExample(word: string): void {
    this.tts.speak(word);
  }

  protected retryPractice(): void {
    this.startPractice();
  }

  protected goBack(): void {
    this.router.navigate(['/phonetics']);
  }

  private nextPhrase(): void {
    const nextIndex = this.currentPhraseIndex() + 1;
    if (nextIndex >= this.phrases().length) {
      const profileId = this.auth.profileId();
      const phoneme = this.phoneme();
      if (profileId && phoneme && this.passedCount() >= 3) {
        this.api.completePhoneme(profileId, phoneme.id).subscribe();
      }
      this.practiceState.set('complete');
    } else {
      this.currentPhraseIndex.set(nextIndex);
      this.recognition.reset();
    }
  }
}
