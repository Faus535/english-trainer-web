import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { Level, CEFR_LEVELS } from '../../../../shared/models/learning.model';
import { Conversation, TUTOR_TOPICS, TutorTopic } from '../../models/tutor.model';
import { ConversationList } from '../conversation-list/conversation-list';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, MessageSquarePlus } from 'lucide-angular';

@Component({
  selector: 'app-start-screen',
  imports: [ConversationList, Icon],
  templateUrl: './start-screen.html',
  styleUrl: './start-screen.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartScreen {
  readonly pastConversations = input.required<Conversation[]>();
  readonly defaultLevel = input<Level>('a1');
  readonly sending = input(false);
  readonly loadingHistory = input(false);
  readonly startConvo = output<{ level: Level; topic?: string }>();
  readonly selectConversation = output<string>();

  protected readonly selectedLevel = signal<Level>('a1');
  protected readonly selectedTopic = signal<TutorTopic>('free');

  constructor() {
    effect(() => {
      this.selectedLevel.set(this.defaultLevel());
    });
  }

  protected readonly levels = CEFR_LEVELS;
  protected readonly topics = TUTOR_TOPICS;
  protected readonly newChatIcon: LucideIconData = MessageSquarePlus;

  protected selectLevel(level: Level): void {
    this.selectedLevel.set(level);
  }

  protected selectTopic(topic: TutorTopic): void {
    this.selectedTopic.set(topic);
  }

  protected startConversation(): void {
    const topic = this.selectedTopic() === 'free' ? undefined : this.selectedTopic();
    this.startConvo.emit({ level: this.selectedLevel(), topic });
  }
}
