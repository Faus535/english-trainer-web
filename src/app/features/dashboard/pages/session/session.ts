import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { GamificationService } from '../../services/gamification.service';
import { TtsService } from '../../../../features/speak/services/tts.service';
import { XP_PER_SESSION } from '../../data/gamification.data';

@Component({
  selector: 'app-session',
  templateUrl: './session.html',
  styleUrl: './session.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Session {
  private readonly sessionService = inject(SessionService);
  private readonly gamification = inject(GamificationService);
  private readonly tts = inject(TtsService);
  private readonly router = inject(Router);

  protected readonly session = this.sessionService.currentSession;
  protected readonly currentBlock = this.sessionService.currentBlock;
  protected readonly blockIndex = this.sessionService.currentBlockIndex;
  protected readonly progress = this.sessionService.sessionProgress;
  protected readonly isLast = this.sessionService.isLastBlock;
  protected readonly sessionCompleted = this.sessionService.sessionCompleted;
  protected readonly completedSession = this.sessionService.completedSession;

  protected readonly blocks = computed(() => this.session()?.blocks ?? []);

  protected readonly sessionDuration = computed(() => {
    const startTime = this.sessionService.sessionStartTime();
    const elapsed = Math.round((Date.now() - startTime) / 60000);
    return Math.max(1, elapsed);
  });

  protected readonly xpEarned = XP_PER_SESSION;

  protected readonly improvedAreas = computed<string[]>(() => {
    const session = this.completedSession();
    if (!session) return [];
    const areas: string[] = [];
    if (session.listening) areas.push('Listening');
    if (session.pronunciation) areas.push('Pronunciacion');
    return areas;
  });

  protected readonly practiceAreas = computed<string[]>(() => {
    const session = this.completedSession();
    if (!session) return [];
    const areas: string[] = [];
    if (session.secondary) {
      const labels: Record<string, string> = {
        vocabulary: 'Vocabulario',
        grammar: 'Gramatica',
        phrases: 'Frases',
      };
      areas.push(labels[session.secondaryModule] ?? session.secondaryModule);
    }
    return areas;
  });

  protected readonly completedBlockCount = computed(() => {
    const session = this.completedSession();
    return session?.blocks.length ?? 0;
  });

  protected advanceBlock(): void {
    this.sessionService.advanceBlock();
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
    this.sessionService.dismissCompletion();
    this.router.navigate(['/dashboard']);
  }

  protected startNextSession(): void {
    this.sessionService.dismissCompletion();
    this.sessionService.startSession('full');
  }

  protected speakContent(text: string): void {
    this.tts.speak(text);
  }

  protected readonly advanceLabel = computed(() =>
    this.isLast() ? 'Completar sesion \u2713' : 'Siguiente \u2192',
  );

  protected blockIcon(type: string): string {
    switch (type) {
      case 'warmup':
        return '\u{1F504}';
      case 'listening':
        return '\u{1F3A7}';
      case 'pronunciation':
        return '\u{1F3A4}';
      case 'secondary':
        return '\u{1F4DA}';
      case 'practice':
        return '\u{270D}';
      case 'bonus':
        return '\u2B50';
      default:
        return '\u{1F4CB}';
    }
  }
}
