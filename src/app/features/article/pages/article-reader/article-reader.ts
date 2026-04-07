import { Component, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ArticleStateService } from '../../services/article-state.service';
import { TtsService } from '../../../../shared/services/tts.service';
import { ArticleParagraph } from '../../components/article-paragraph/article-paragraph';
import { SavedWordDraft } from '../../models/article.model';

@Component({
  selector: 'app-article-reader',
  imports: [ArticleParagraph],
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

  constructor() {
    inject(DestroyRef).onDestroy(() => this.tts.stop());

    const id = this.route.snapshot.paramMap.get('articleId');
    if (id) {
      this.state.loadArticle(id);
    }
  }

  protected onParagraphRead(): void {
    this.state.advanceParagraph();
    if (this.state.readingComplete()) {
      this.state.completeReading();
    }
  }

  protected onWordSelected(_draft: SavedWordDraft): void {
    this.state.markWord(_draft);
  }
}
