import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  effect,
  inject,
  computed,
} from '@angular/core';
import { Level, CEFR_LEVELS } from '../../../../shared/models/learning.model';
import { Conversation, TUTOR_TOPICS, TutorTopic, SuggestedGoal } from '../../models/tutor.model';
import { TutorApiService } from '../../services/tutor-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { StateService } from '../../../../shared/services/state.service';
import { ConversationList } from '../conversation-list/conversation-list';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, Lock, MessageSquarePlus, Sparkles, X } from 'lucide-angular';

@Component({
  selector: 'app-start-screen',
  imports: [ConversationList, Icon],
  templateUrl: './start-screen.html',
  styleUrl: './start-screen.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartScreen {
  private readonly tutorApi = inject(TutorApiService);
  private readonly auth = inject(AuthService);
  private readonly state = inject(StateService);

  readonly pastConversations = input.required<Conversation[]>();
  readonly defaultLevel = input<Level>('a1');
  readonly sending = input(false);
  readonly loadingHistory = input(false);
  readonly startConvo = output<{ level: Level; topic?: string; goals?: string[] }>();
  readonly selectConversation = output<string>();

  protected readonly selectedLevel = signal<Level>('a1');
  protected readonly selectedTopic = signal<TutorTopic>('free');
  protected readonly suggestedGoals = signal<SuggestedGoal[]>([]);
  protected readonly selectedGoals = signal<string[]>([]);
  protected readonly customGoal = signal('');
  protected readonly loadingGoals = signal(false);

  constructor() {
    effect(() => {
      this.selectedLevel.set(this.defaultLevel());
    });
  }

  protected readonly levels = CEFR_LEVELS;
  protected readonly topics = TUTOR_TOPICS;
  protected readonly newChatIcon: LucideIconData = MessageSquarePlus;
  protected readonly suggestIcon: LucideIconData = Sparkles;
  protected readonly removeIcon: LucideIconData = X;
  protected readonly lockIcon: LucideIconData = Lock;

  protected readonly userPronLevel = computed(() => this.state.getModuleLevel('pronunciation'));

  protected isTopicLocked(minLevel?: Level): boolean {
    if (!minLevel) return false;
    const userLevelIndex = CEFR_LEVELS.indexOf(this.userPronLevel());
    const requiredIndex = CEFR_LEVELS.indexOf(minLevel);
    return userLevelIndex < requiredIndex;
  }

  protected selectLevel(level: Level): void {
    this.selectedLevel.set(level);
  }

  protected selectTopic(topic: TutorTopic): void {
    this.selectedTopic.set(topic);
  }

  protected loadSuggestedGoals(): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this.loadingGoals.set(true);
    this.tutorApi.getSuggestedGoals(profileId).subscribe({
      next: (goals) => {
        this.suggestedGoals.set(goals);
        this.loadingGoals.set(false);
      },
      error: () => this.loadingGoals.set(false),
    });
  }

  protected toggleGoal(description: string): void {
    this.selectedGoals.update((goals) => {
      if (goals.includes(description)) {
        return goals.filter((g) => g !== description);
      }
      if (goals.length >= 3) return goals;
      return [...goals, description];
    });
  }

  protected addCustomGoal(): void {
    const goal = this.customGoal().trim();
    if (!goal || this.selectedGoals().length >= 3) return;
    this.selectedGoals.update((goals) => [...goals, goal]);
    this.customGoal.set('');
  }

  protected removeGoal(goal: string): void {
    this.selectedGoals.update((goals) => goals.filter((g) => g !== goal));
  }

  protected startConversation(): void {
    const topic = this.selectedTopic() === 'free' ? undefined : this.selectedTopic();
    const goals = this.selectedGoals().length > 0 ? this.selectedGoals() : undefined;
    this.startConvo.emit({ level: this.selectedLevel(), topic, goals });
  }
}
