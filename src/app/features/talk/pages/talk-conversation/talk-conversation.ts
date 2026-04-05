import { Component, ChangeDetectionStrategy, inject, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TalkStateService } from '../../services/talk-state.service';
import { ChatBubble } from '../../../tutor/components/chat-bubble/chat-bubble';
import { ConversationHeader } from '../../../tutor/components/conversation-header/conversation-header';
import { InlineCorrection } from '../../components/inline-correction/inline-correction';
import { TalkInputBar } from '../../components/talk-input-bar/talk-input-bar';

@Component({
  selector: 'app-talk-conversation',
  imports: [ChatBubble, ConversationHeader, InlineCorrection, TalkInputBar],
  templateUrl: './talk-conversation.html',
  styleUrl: './talk-conversation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TalkConversation implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly talkState = inject(TalkStateService);

  protected readonly messages = this.talkState.messages;
  protected readonly status = this.talkState.status;
  protected readonly streaming = this.talkState.streaming;
  protected readonly error = this.talkState.error;
  protected readonly messageCount = this.talkState.messageCount;

  protected readonly inputDisabled = computed(
    () => this.status() === 'sending' || this.streaming(),
  );

  ngOnInit(): void {
    const scenarioId = this.route.snapshot.queryParamMap.get('scenarioId');
    if (scenarioId) {
      this.talkState.startConversation(scenarioId, 'a2');
    }
  }

  protected onMessageSent(event: { content: string; confidence?: number }): void {
    this.talkState.sendMessageStreaming(event.content, event.confidence);
  }

  protected onEndConversation(): void {
    this.talkState.endConversation();
    this.router.navigate(['/talk', 'summary']);
  }
}
