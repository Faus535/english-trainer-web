import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { TtsService } from '../../../../features/speak/services/tts.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.html',
  styleUrl: './session.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Session {
  private readonly sessionService = inject(SessionService);
  private readonly tts = inject(TtsService);
  private readonly router = inject(Router);

  protected readonly session = this.sessionService.currentSession;
  protected readonly currentBlock = this.sessionService.currentBlock;
  protected readonly blockIndex = this.sessionService.currentBlockIndex;
  protected readonly progress = this.sessionService.sessionProgress;
  protected readonly isLast = this.sessionService.isLastBlock;

  protected readonly blocks = computed(() => this.session()?.blocks ?? []);

  protected advanceBlock(): void {
    if (this.isLast()) {
      this.sessionService.advanceBlock();
      this.router.navigate(['/dashboard']);
    } else {
      this.sessionService.advanceBlock();
    }
  }

  protected goBack(): void {
    this.sessionService.goBackBlock();
  }

  protected goToBlock(index: number): void {
    this.sessionService.goToBlock(index);
  }

  protected isCompleted(index: number): boolean {
    return this.sessionService.isBlockCompleted(index);
  }

  protected exitSession(): void {
    this.router.navigate(['/dashboard']);
  }

  protected speakContent(text: string): void {
    this.tts.speak(text);
  }

  protected readonly advanceLabel = computed(() =>
    this.isLast() ? 'Completar sesion \u2713' : 'Siguiente \u2192'
  );

  protected blockIcon(type: string): string {
    switch (type) {
      case 'warmup': return '\u{1F504}';
      case 'listening': return '\u{1F3A7}';
      case 'pronunciation': return '\u{1F3A4}';
      case 'secondary': return '\u{1F4DA}';
      case 'practice': return '\u{270D}';
      case 'bonus': return '\u2B50';
      default: return '\u{1F4CB}';
    }
  }
}
