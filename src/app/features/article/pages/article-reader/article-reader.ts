import { Component, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ArticleStateService } from '../../services/article-state.service';
import { TtsService } from '../../../../shared/services/tts.service';
import { ArticleParagraph } from '../../components/article-paragraph/article-paragraph';
import { WordTranslationPopup } from '../../components/word-translation-popup/word-translation-popup';
import { SavedWordsList } from '../../components/saved-words-list/saved-words-list';
import { PreReadingStage } from '../../components/pre-reading-stage/pre-reading-stage';
import { SavedWord, SavedWordDraft } from '../../models/article.model';

@Component({
  selector: 'app-article-reader',
  imports: [ArticleParagraph, WordTranslationPopup, SavedWordsList, PreReadingStage],
  templateUrl: './article-reader.html',
  styleUrl: './article-reader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleReader {
  protected readonly state = inject(ArticleStateService);
  private readonly tts = inject(TtsService);
  private readonly route = inject(ActivatedRoute);

  protected readonly articleId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('articleId') ?? '')),
    { initialValue: '' },
  );

  protected readonly article = this.state.article;
  protected readonly currentParagraphIndex = this.state.currentParagraphIndex;
  protected readonly loading = this.state.loading;
  protected readonly error = this.state.error;
  protected readonly activeWord = this.state.activeWord;
  protected readonly savedWords = this.state.savedWords;
  protected readonly keyWords = this.state.keyWords;
  protected readonly predictiveQuestion = this.state.predictiveQuestion;
  protected readonly preReadingLoading = this.state.preReadingLoading;
  protected readonly preReadingComplete = this.state.preReadingComplete;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.tts.stop());

    const id = this.route.snapshot.paramMap.get('articleId');
    if (id) {
      this.state.loadArticle(id);
      this.state.loadPreReading(id);
    }
  }

  protected onParagraphRead(): void {
    this.state.advanceParagraph();
    if (this.state.readingComplete()) {
      this.state.completeReading();
    }
  }

  protected onWordSelected(draft: SavedWordDraft): void {
    this.state.markWord(draft);
  }

  protected onWordSaved(word: SavedWord): void {
    this.state.saveActiveWord(word);
  }

  protected onDismissWord(): void {
    this.state.dismissActiveWord();
  }

  protected onStartReading(): void {
    this.state.dismissPreReadingStage();
  }
}
