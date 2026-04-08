import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArticleStateService } from '../../services/article-state.service';
import { GenerationOverlay } from '../../../immerse/components/generation-overlay/generation-overlay';
import { ArticleLevel } from '../../models/article.model';

@Component({
  selector: 'app-article-hub',
  imports: [ReactiveFormsModule, RouterLink, GenerationOverlay],
  templateUrl: './article-hub.html',
  styleUrl: './article-hub.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleHub {
  protected readonly state = inject(ArticleStateService);

  protected readonly topicCtrl = new FormControl('', [
    Validators.required,
    Validators.maxLength(100),
  ]);
  protected readonly selectedLevel = signal<ArticleLevel>('B1');
  protected readonly levels: ArticleLevel[] = ['B1', 'B2', 'C1'];

  protected readonly generating = this.state.generating;
  protected readonly generationStep = this.state.generationStep;
  protected readonly generationProgress = this.state.generationProgress;
  protected readonly generationError = this.state.generationError;

  constructor() {
    this.state.reset();
  }

  protected onGenerate(): void {
    if (this.topicCtrl.invalid || this.generating()) return;
    this.state.generate({
      topic: this.topicCtrl.value!.trim(),
      level: this.selectedLevel(),
    });
  }

  protected onCancelGeneration(): void {
    this.state.cancelGeneration();
  }

  protected onRetryGeneration(): void {
    this.state.cancelGeneration();
    this.onGenerate();
  }
}
