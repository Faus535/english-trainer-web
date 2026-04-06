import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ConversationMessage } from '../../models/talk.model';
import { TalkFeedbackCard } from '../talk-feedback-card/talk-feedback-card';

@Component({
  selector: 'app-talk-chat-bubble',
  imports: [DatePipe, DecimalPipe, TalkFeedbackCard],
  templateUrl: './talk-chat-bubble.html',
  styleUrl: './talk-chat-bubble.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TalkChatBubble {
  readonly message = input.required<ConversationMessage>();
}
