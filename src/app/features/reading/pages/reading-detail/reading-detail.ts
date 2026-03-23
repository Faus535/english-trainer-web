import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ReadingApiService } from '../../services/reading-api.service';
import { ReadingTextResponse } from '../../../../shared/models/api.model';
import { NotificationService } from '../../../../shared/services/notification.service';
import { VocabPopup } from '../../../../shared/components/vocab-popup/vocab-popup';

@Component({
  selector: 'app-reading-detail',
  imports: [RouterLink, UpperCasePipe, VocabPopup],
  templateUrl: './reading-detail.html',
  styleUrl: './reading-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly readingApi = inject(ReadingApiService);
  private readonly notification = inject(NotificationService);
  protected readonly text = signal<ReadingTextResponse | null>(null);
  protected readonly loading = signal(true);

  protected readonly selectedWord = signal('');
  protected readonly showVocabPopup = signal(false);

  protected readonly contentWords = computed(() => {
    const t = this.text();
    if (!t) return [];
    return t.content.split(/(\s+)/).filter((s) => s.trim().length > 0);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/reading']);
      return;
    }
    const navState = history.state as { text?: ReadingTextResponse };
    if (navState?.text) {
      this.text.set(navState.text);
      this.loading.set(false);
    } else {
      this.router.navigate(['/reading']);
      return;
    }
  }

  protected startQuiz(): void {
    const t = this.text();
    if (t) this.router.navigate(['/reading', t.id, 'quiz']);
  }

  protected onWordClick(word: string): void {
    const clean = word.replace(/[^a-zA-Z'-]/g, '');
    if (clean.length > 0) {
      this.selectedWord.set(clean);
      this.showVocabPopup.set(true);
    }
  }

  protected closeVocabPopup(): void {
    this.showVocabPopup.set(false);
  }

  protected onAddToReview(word: string): void {
    this.notification.show('success', `"${word}" anadido a repaso`);
    this.showVocabPopup.set(false);
  }
}
