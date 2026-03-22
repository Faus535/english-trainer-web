import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WritingApiService } from '../../services/writing-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { WritingHistoryResponse } from '../../../../shared/models/api.model';

@Component({
  selector: 'app-writing-history',
  imports: [RouterLink],
  templateUrl: './writing-history.html',
  styleUrl: './writing-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WritingHistory implements OnInit {
  private readonly writingApi = inject(WritingApiService);
  private readonly auth = inject(AuthService);
  protected readonly history = signal<WritingHistoryResponse[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;
    this.writingApi.getHistory(profileId).subscribe({
      next: (h) => {
        this.history.set(h);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
