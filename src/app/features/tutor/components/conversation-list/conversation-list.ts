import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, MessageCircle, ChevronRight } from 'lucide-angular';
import { Conversation } from '../../models/tutor.model';

@Component({
  selector: 'app-conversation-list',
  imports: [DatePipe, Icon],
  templateUrl: './conversation-list.html',
  styleUrl: './conversation-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationList {
  readonly conversations = input.required<Conversation[]>();
  readonly selectConversation = output<string>();

  protected readonly chatIcon: LucideIconData = MessageCircle;
  protected readonly arrowIcon: LucideIconData = ChevronRight;
}
