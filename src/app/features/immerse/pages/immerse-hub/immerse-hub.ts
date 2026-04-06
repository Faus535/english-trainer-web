import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ImmerseApiService } from '../../services/immerse-api.service';
import { ImmerseStateService } from '../../services/immerse-state.service';
import { ContentType } from '../../models/immerse.model';
import { Level, CEFR_LEVELS } from '../../../../shared/models/learning.model';
import { GenerationOverlay } from '../../components/generation-overlay/generation-overlay';

@Component({
  selector: 'app-immerse-hub',
  imports: [FormsModule, UpperCasePipe, GenerationOverlay],
  templateUrl: './immerse-hub.html',
  styleUrl: './immerse-hub.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImmerseHub {
  private readonly immerseApi = inject(ImmerseApiService);
  private readonly immerseState = inject(ImmerseStateService);
  private readonly router = inject(Router);

  protected readonly urlInput = signal('');
  protected readonly textInput = signal('');
  protected readonly urlError = signal<string | null>(null);
  protected readonly loading = this.immerseState.loading;
  protected readonly error = this.immerseState.error;
  protected readonly maxTextLength = 50000;

  protected readonly selectedContentType = signal<ContentType>('TEXT');
  protected readonly selectedLevel = signal<Level>('b1');
  protected readonly topicInput = signal('');
  protected readonly contentTypes: ContentType[] = ['TEXT', 'AUDIO', 'VIDEO'];
  protected readonly levels = CEFR_LEVELS;

  protected readonly generating = this.immerseState.generating;
  protected readonly generationStep = this.immerseState.generationStep;
  protected readonly generationProgress = this.immerseState.generationProgress;
  protected readonly generationError = this.immerseState.generationError;

  protected onGenerate(): void {
    this.immerseState.generateContent({
      contentType: this.selectedContentType(),
      level: this.selectedLevel(),
      topic: this.topicInput().trim() || undefined,
    });
  }

  protected onSubmitUrl(): void {
    const url = this.urlInput().trim();
    if (!url) return;

    if (!this.isValidHttpsUrl(url)) {
      this.urlError.set('Please enter a valid HTTPS URL');
      return;
    }

    this.urlError.set(null);
    this.immerseState.submitContent({ url });
  }

  protected onSubmitText(): void {
    const text = this.textInput().trim();
    if (!text) return;
    this.immerseState.submitContent({ text });
  }

  protected onCancelGeneration(): void {
    this.immerseState.cancelGeneration();
  }

  protected onRetryGeneration(): void {
    this.immerseState.cancelGeneration();
    this.onGenerate();
  }

  private isValidHttpsUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return url.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
