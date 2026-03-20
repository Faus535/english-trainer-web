import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { LevelTestService } from '../../services/level-test.service';
import { TestShell } from '../../components/test-shell/test-shell';

@Component({
  selector: 'app-test-grammar',
  imports: [TestShell],
  templateUrl: './test-grammar.html',
  styleUrl: './test-grammar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestGrammar {
  protected readonly testService = inject(LevelTestService);

  protected selectOption(index: number): void {
    this.testService.submitGrammarAnswer(index);
  }
}
