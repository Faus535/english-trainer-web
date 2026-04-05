import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ImmerseApiService } from '../../services/immerse-api.service';
import { ImmerseStateService } from '../../services/immerse-state.service';
import { ImmerseContentSuggestion } from '../../models/immerse.model';

@Component({
  selector: 'app-immerse-hub',
  imports: [FormsModule, UpperCasePipe],
  templateUrl: './immerse-hub.html',
  styleUrl: './immerse-hub.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImmerseHub implements OnInit {
  private readonly immerseApi = inject(ImmerseApiService);
  private readonly immerseState = inject(ImmerseStateService);
  private readonly router = inject(Router);

  protected readonly urlInput = signal('');
  protected readonly textInput = signal('');
  protected readonly suggestions = signal<ImmerseContentSuggestion[]>([]);
  protected readonly urlError = signal<string | null>(null);
  protected readonly loading = this.immerseState.loading;
  protected readonly error = this.immerseState.error;
  protected readonly maxTextLength = 50000;

  ngOnInit(): void {
    this.immerseApi.getSuggested().subscribe({
      next: (data) => this.suggestions.set(data),
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

  protected onSuggestionClick(suggestion: ImmerseContentSuggestion): void {
    this.router.navigate(['/immerse', suggestion.id]);
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
