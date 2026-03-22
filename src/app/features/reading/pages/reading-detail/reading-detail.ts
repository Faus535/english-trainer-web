import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ReadingApiService } from '../../services/reading-api.service';
import { ReadingTextResponse } from '../../../../shared/models/api.model';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-reading-detail',
  imports: [RouterLink, UpperCasePipe],
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/reading']);
      return;
    }
    this.readingApi.getText(id).subscribe({
      next: (t) => {
        this.text.set(t);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('No se pudo cargar el texto');
      },
    });
  }

  protected startQuiz(): void {
    const t = this.text();
    if (t) this.router.navigate(['/reading', t.id, 'quiz']);
  }
}
