import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  output,
  signal,
  computed,
  OnInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { ArticleApiService } from '../../services/article-api.service';
import { SavedWordDraft, SavedWord } from '../../models/article.model';

@Component({
  selector: 'app-word-translation-popup',
  templateUrl: './word-translation-popup.html',
  styleUrl: './word-translation-popup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordTranslationPopup implements OnInit, OnDestroy {
  private readonly articleApi = inject(ArticleApiService);
  private readonly elementRef = inject(ElementRef);

  readonly draft = input.required<SavedWordDraft>();
  readonly articleId = input.required<string>();

  readonly saved = output<SavedWord>();
  readonly dismissed = output<void>();

  protected readonly loading = signal(true);
  protected readonly translation = signal<SavedWord | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly enrichmentPending = computed(() => {
    const word = this.translation();
    return word !== null && word.definition === null;
  });

  protected readonly synonymsList = computed(() => this.translation()?.synonyms ?? []);

  private boundOnKeydown = this.onKeydown.bind(this);
  private boundOnClickOutside = this.onClickOutside.bind(this);

  ngOnInit(): void {
    this.articleApi
      .saveWord(this.articleId(), {
        wordOrPhrase: this.draft().wordOrPhrase,
        contextSentence: this.draft().contextSentence,
      })
      .subscribe({
        next: (word) => {
          this.loading.set(false);
          this.translation.set(word);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Could not translate word. Please try again.');
        },
      });

    document.addEventListener('keydown', this.boundOnKeydown);
    setTimeout(() => document.addEventListener('click', this.boundOnClickOutside));
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.boundOnKeydown);
    document.removeEventListener('click', this.boundOnClickOutside);
  }

  protected onConfirmSave(): void {
    const word = this.translation();
    if (word) {
      this.saved.emit(word);
    }
  }

  protected onDismiss(): void {
    this.dismissed.emit();
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.dismissed.emit();
    }
  }

  private onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dismissed.emit();
    }
  }
}
