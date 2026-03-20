import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { LevelTestService } from '../../services/level-test.service';
import { TtsService } from '../../../../features/speak/services/tts.service';
import { TestShell } from '../../components/test-shell/test-shell';
import { Icon } from '../../../../shared/components/icon/icon';
import { Play, RotateCcw } from 'lucide-angular';

@Component({
  selector: 'app-test-listening',
  imports: [TestShell, Icon],
  templateUrl: './test-listening.html',
  styleUrl: './test-listening.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestListening {
  protected readonly testService = inject(LevelTestService);
  private readonly tts = inject(TtsService);
  protected readonly inputValue = signal('');

  protected readonly playIcon = Play;
  protected readonly repeatIcon = RotateCcw;

  protected playAudio(): void {
    const q = this.testService.currentListeningQuestion();
    if (!q) return;
    const originalRate = this.tts.rate();
    this.tts.setRate(q.speed);
    this.tts.speak(q.text, () => this.tts.setRate(originalRate));
  }

  protected submit(): void {
    if (this.inputValue().trim()) {
      this.testService.submitListeningAnswer(this.inputValue());
      this.inputValue.set('');
    }
  }

  protected skip(): void {
    this.testService.skipListening();
    this.inputValue.set('');
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.submit();
  }

  protected onInput(event: Event): void {
    this.inputValue.set((event.target as HTMLInputElement).value);
  }
}
