import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ConversationMessage } from '../../models/talk.model';
import { FeedbackCard } from '../feedback-card/feedback-card';

@Component({
  selector: 'app-chat-bubble',
  imports: [DatePipe, DecimalPipe, FeedbackCard],
  templateUrl: './chat-bubble.html',
  styleUrl: './chat-bubble.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatBubble {
  readonly message = input.required<ConversationMessage>();
}
