import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ImmerseStateService } from '../../services/immerse-state.service';
import { ReviewApiService } from '../../../../core/services/review-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AnnotatedWord } from '../../components/annotated-word/annotated-word';
import { WordPopup } from '../../components/word-popup/word-popup';
import { WordAnnotation, VocabEntry } from '../../models/immerse.model';

@Component({
  selector: 'app-immerse-reader',
  imports: [AnnotatedWord, WordPopup, UpperCasePipe],
  templateUrl: './immerse-reader.html',
  styleUrl: './immerse-reader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImmerseReader implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly immerseState = inject(ImmerseStateService);
  private readonly reviewApi = inject(ReviewApiService);
  private readonly auth = inject(AuthService);

  protected readonly content = this.immerseState.content;
  protected readonly loading = this.immerseState.loading;
  protected readonly error = this.immerseState.error;
  protected readonly activeWord = this.immerseState.activeWord;
  protected readonly capturedVocabCount = this.immerseState.capturedVocabCount;
  protected readonly readingProgress = signal(0);

  protected readonly contentId = computed(
    () => this.route.snapshot.paramMap.get('contentId') ?? '',
  );

  protected readonly activeVocabEntry = computed<VocabEntry | null>(() => {
    const word = this.activeWord();
    if (!word) return null;
    return {
      word: word.word,
      definition: word.definition,
      partOfSpeech: word.partOfSpeech,
      level: word.level,
      contextSentence: '',
    };
  });

  ngOnInit(): void {
    const id = this.contentId();
    if (id) {
      this.immerseState.loadContent(id);
    }
  }

  protected onWordSelected(annotation: WordAnnotation): void {
    this.immerseState.selectWord(annotation);
  }

  protected onPopupDismissed(): void {
    this.immerseState.dismissWord();
  }

  protected onAddToReview(entry: VocabEntry): void {
    const profileId = this.auth.profileId();
    if (profileId) {
      this.reviewApi.addWordToReview(profileId, entry.word, entry.level).subscribe();
    }
    this.immerseState.saveWord(entry);
    this.immerseState.dismissWord();
  }

  protected onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    const progress = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    this.readingProgress.set(Math.min(progress, 100));
  }

  protected goToExercises(): void {
    this.router.navigate(['/immerse', this.contentId(), 'exercises']);
  }
}
