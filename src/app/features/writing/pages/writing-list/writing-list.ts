import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { WritingApiService } from '../../services/writing-api.service';
import { WritingExerciseResponse } from '../../../../shared/models/api.model';
import { Level, CEFR_LEVELS } from '../../../../shared/models/learning.model';
import { ProfileStateService } from '../../../../shared/services/profile-state.service';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, PenLine, History } from 'lucide-angular';

@Component({
  selector: 'app-writing-list',
  imports: [RouterLink, UpperCasePipe, Icon],
  templateUrl: './writing-list.html',
  styleUrl: './writing-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WritingList implements OnInit {
  private readonly writingApi = inject(WritingApiService);
  private readonly profileState = inject(ProfileStateService);
  protected readonly exercises = signal<WritingExerciseResponse[]>([]);
  protected readonly loading = signal(true);
  protected readonly selectedLevel = signal<Level | null>(null);
  protected readonly levels = CEFR_LEVELS;
  protected readonly penIcon: LucideIconData = PenLine;
  protected readonly historyIcon: LucideIconData = History;

  ngOnInit(): void {
    this.selectedLevel.set(this.profileState.overallLevel());
    this.loadExercises();
  }

  protected filterByLevel(level: Level | null): void {
    this.selectedLevel.set(level);
    this.loadExercises();
  }

  private loadExercises(): void {
    this.loading.set(true);
    this.writingApi.getExercises(this.selectedLevel() ?? undefined).subscribe({
      next: (ex) => {
        this.exercises.set(ex);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
