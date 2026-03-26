import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { LevelTestService } from '../../services/level-test.service';
import { TtsService } from '../../../../features/speak/services/tts.service';
import { TestShell } from '../../components/test-shell/test-shell';
import { Icon } from '../../../../shared/components/icon/icon';
import { Play } from 'lucide-angular';

@Component({
  selector: 'app-test-pronunciation',
  imports: [TestShell, Icon],
  templateUrl: './test-pronunciation.html',
  styleUrl: './test-pronunciation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestPronunciation {
  protected readonly testService = inject(LevelTestService);
  private readonly tts = inject(TtsService);

  protected readonly playIcon = Play;

  protected readonly instruction = computed(() => {
    const q = this.testService.currentPronunciationQuestion();
    if (!q) return '';
    if (q.special === 'syllables') return 'Escucha la palabra. Cuantas silabas tiene?';
    if (q.special === 'words') return 'Escucha la frase. Cuantas palabras hay?';
    if (q.special === 'stress') return 'Escucha la frase. Que palabra esta enfatizada?';
    return 'Escucha la palabra y elige la correcta:';
  });

  protected playAudio(): void {
    const q = this.testService.currentPronunciationQuestion();
    if (!q) return;
    const originalRate = this.tts.rate();
    this.tts.setRate(0.9);
    this.tts.speak(q.word, () => this.tts.setRate(originalRate));
  }

  protected selectOption(index: number): void {
    this.testService.submitPronunciationAnswer(index);
  }
}
