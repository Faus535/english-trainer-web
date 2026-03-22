import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ReadingApiService } from '../../services/reading-api.service';
import { ReadingTextResponse } from '../../../../shared/models/api.model';
import { Level, CEFR_LEVELS } from '../../../../shared/models/learning.model';
import { ProfileStateService } from '../../../../shared/services/profile-state.service';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, BookOpen, Clock } from 'lucide-angular';

@Component({
  selector: 'app-reading-list',
  imports: [RouterLink, UpperCasePipe, Icon],
  templateUrl: './reading-list.html',
  styleUrl: './reading-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingList implements OnInit {
  private readonly readingApi = inject(ReadingApiService);
  private readonly profileState = inject(ProfileStateService);
  protected readonly texts = signal<ReadingTextResponse[]>([]);
  protected readonly loading = signal(true);
  protected readonly selectedLevel = signal<Level | null>(null);
  protected readonly levels = CEFR_LEVELS;
  protected readonly bookIcon: LucideIconData = BookOpen;
  protected readonly clockIcon: LucideIconData = Clock;

  ngOnInit(): void {
    this.selectedLevel.set(this.profileState.overallLevel());
    this.loadTexts();
  }

  protected filterByLevel(level: Level | null): void {
    this.selectedLevel.set(level);
    this.loadTexts();
  }

  private loadTexts(): void {
    this.loading.set(true);
    this.readingApi.getTexts(this.selectedLevel() ?? undefined).subscribe({
      next: (texts) => {
        this.texts.set(texts);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
