import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LevelTestService } from './services/level-test.service';
import { TestIntro } from './pages/test-intro/test-intro';
import { TestVocab } from './pages/test-vocab/test-vocab';
import { TestGrammar } from './pages/test-grammar/test-grammar';
import { TestListening } from './pages/test-listening/test-listening';
import { TestPronunciation } from './pages/test-pronunciation/test-pronunciation';
import { TestResults } from './pages/test-results/test-results';
import { Level } from '../../shared/models/learning.model';

@Component({
  selector: 'app-level-test',
  imports: [TestIntro, TestVocab, TestGrammar, TestListening, TestPronunciation, TestResults],
  templateUrl: './level-test.html',
  styleUrl: './level-test.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelTest {
  protected readonly testService = inject(LevelTestService);
  private readonly router = inject(Router);

  protected readonly phase = this.testService.phase;
  protected readonly loading = this.testService.loading;

  protected onStart(): void {
    this.testService.startTest();
  }

  protected onSkip(level: Level): void {
    this.testService.skipTestWithLevel(level).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.router.navigate(['/dashboard']),
    });
  }

  protected onFinish(): void {
    this.testService.finishTest();
    this.router.navigate(['/dashboard']);
  }
}
