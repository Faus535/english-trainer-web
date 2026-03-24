import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  ElementRef,
  viewChild,
  effect,
} from '@angular/core';
import { Router } from '@angular/router';
import { Level } from '../../../../shared/models/learning.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ReviewApiService } from '../../../../core/services/review-api.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { SpeechRecognitionService } from '../../../speak/services/speech-recognition.service';
import { TtsService } from '../../../speak/services/tts.service';
import { ConversationStateService } from '../../services/conversation-state.service';
import { TutorApiService } from '../../services/tutor-api.service';
import { Conversation } from '../../models/tutor.model';
import { ChatBubble } from '../../components/chat-bubble/chat-bubble';
import { VoiceInput } from '../../components/voice-input/voice-input';
import { ConversationHeader } from '../../components/conversation-header/conversation-header';
import { StartScreen } from '../../components/start-screen/start-screen';
import { ConversationStats } from '../../components/conversation-stats/conversation-stats';
import { EvaluationCard } from '../../components/evaluation-card/evaluation-card';
import { GoalsTracker } from '../../components/goals-tracker/goals-tracker';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, MessageSquarePlus, Trophy, Download, BookOpen } from 'lucide-angular';

@Component({
  selector: 'app-tutor-page',
  imports: [
    ChatBubble,
    VoiceInput,
    ConversationHeader,
    StartScreen,
    ConversationStats,
    EvaluationCard,
    GoalsTracker,
    Icon,
  ],
  templateUrl: './tutor-page.html',
  styleUrl: './tutor-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorPage {
  protected readonly conversationState = inject(ConversationStateService);
  private readonly speech = inject(SpeechRecognitionService);
  private readonly tts = inject(TtsService);
  private readonly auth = inject(AuthService);
  private readonly tutorApi = inject(TutorApiService);
  private readonly reviewApi = inject(ReviewApiService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  private readonly chatContainer = viewChild<ElementRef<HTMLElement>>('chatContainer');

  protected readonly messages = this.conversationState.messages;
  protected readonly status = this.conversationState.status;
  protected readonly isActive = this.conversationState.isActive;
  protected readonly currentLevel = this.conversationState.currentLevel;
  protected readonly messageCount = this.conversationState.messageCount;
  protected readonly error = this.conversationState.error;
  protected readonly endResult = this.conversationState.endResult;
  protected readonly speechSupported = this.speech.supported;
  protected readonly defaultLevel = computed(() => this.conversationState.defaultLevel());

  protected readonly pastConversations = signal<Conversation[]>([]);
  protected readonly loadingHistory = signal(false);
  protected readonly sending = computed(() => this.status() === 'sending');
  protected readonly showSummary = computed(() => !!this.endResult());

  protected readonly newChatIcon: LucideIconData = MessageSquarePlus;
  protected readonly trophyIcon: LucideIconData = Trophy;
  protected readonly downloadIcon: LucideIconData = Download;
  protected readonly exercisesIcon: LucideIconData = BookOpen;
  protected readonly streaming = this.conversationState.streaming;
  protected readonly goals = this.conversationState.goals;

  constructor() {
    this.loadHistory();

    effect(() => {
      this.messages();
      this.scrollToBottom();
    });

    effect(() => {
      const status = this.conversationState.status();
      const msgs = this.conversationState.messages();
      if (status === 'speaking' && msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg.role === 'assistant') {
          this.tts.speak(lastMsg.content, () => {
            this.conversationState.setStatus('idle');
          });
        }
      }
    });
  }

  protected onStart(event: { level: Level; topic?: string; goals?: string[] }): void {
    this.conversationState.startConversation(event.level, event.topic, event.goals);
  }

  protected async toggleRecord(): Promise<void> {
    if (this.speech.state() === 'recording') {
      this.speech.stopRecording();
      return;
    }

    this.conversationState.setStatus('recording');
    const result = await this.speech.startFreeRecording();

    if (result.error) {
      if (result.error === 'no-speech') {
        this.notification.warning('No se detecto voz. Intenta de nuevo.');
      } else if (result.error === 'not-supported') {
        this.notification.error('Tu navegador no soporta reconocimiento de voz.');
      } else {
        this.notification.error(`Error de microfono: ${result.error}`);
      }
      this.conversationState.setStatus('idle');
      return;
    }

    if (result.transcript) {
      this.conversationState.sendMessage(result.transcript, result.confidence);
    } else {
      this.conversationState.setStatus('idle');
    }
  }

  protected endConversation(): void {
    this.tts.stop();
    this.conversationState.endConversation();
  }

  protected startNew(): void {
    this.conversationState.resetConversation();
    this.loadHistory();
  }

  protected onSelectConversation(conversationId: string): void {
    this.tutorApi.getConversation(conversationId).subscribe({
      next: () => {
        this.notification.info('Conversacion cargada en modo lectura');
      },
      error: () => {
        this.notification.error('No se pudo cargar la conversacion');
      },
    });
  }

  protected speakWord(word: string): void {
    this.tts.speak(word);
  }

  protected addToReview(word: string): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this.reviewApi.addWordToReview(profileId, word, this.currentLevel() ?? 'a1').subscribe({
      next: () => this.notification.success(`"${word}" anadido a repaso`),
      error: () => this.notification.error('No se pudo anadir al repaso'),
    });
  }

  protected goToExercises(): void {
    const id = this.conversationState.conversationId();
    if (id) {
      this.router.navigate(['/tutor', 'exercises', id]);
    }
  }

  protected clearError(): void {
    this.conversationState.clearError();
  }

  protected exportConversation(): void {
    const msgs = this.messages();
    const text = msgs
      .map((m) => `[${m.role === 'user' ? 'Tu' : 'Tutor'}] ${m.content}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private loadHistory(): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this.loadingHistory.set(true);
    this.tutorApi.listConversations(profileId).subscribe({
      next: (list) => {
        this.pastConversations.set(list);
        this.loadingHistory.set(false);
      },
      error: () => {
        this.loadingHistory.set(false);
        this.notification.warning('No se pudo cargar el historial');
      },
    });
  }

  private scrollToBottom(): void {
    const el = this.chatContainer()?.nativeElement;
    if (el) {
      setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }), 50);
    }
  }
}
