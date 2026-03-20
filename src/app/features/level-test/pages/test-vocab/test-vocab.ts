import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { LevelTestService } from '../../services/level-test.service';
import { TestShell } from '../../components/test-shell/test-shell';

@Component({
  selector: 'app-test-vocab',
  imports: [TestShell],
  templateUrl: './test-vocab.html',
  styleUrl: './test-vocab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestVocab {
  protected readonly testService = inject(LevelTestService);
  protected readonly inputValue = signal('');

  protected submit(): void {
    if (this.inputValue().trim()) {
      this.testService.submitVocabAnswer(this.inputValue());
      this.inputValue.set('');
    }
  }

  protected skip(): void {
    this.testService.skipVocab();
    this.inputValue.set('');
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.submit();
  }

  protected onInput(event: Event): void {
    this.inputValue.set((event.target as HTMLInputElement).value);
  }
}
