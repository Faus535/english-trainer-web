import { Component, ChangeDetectionStrategy, inject, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TalkStateService } from '../../services/talk-state.service';
import { TalkChatBubble } from '../../components/talk-chat-bubble/talk-chat-bubble';
import { ConversationHeader } from '../../../tutor/components/conversation-header/conversation-header';
import { TalkInputBar } from '../../components/talk-input-bar/talk-input-bar';

@Component({
  selector: 'app-talk-conversation',
  imports: [TalkChatBubble, ConversationHeader, TalkInputBar],
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
  protected readonly error = this.talkState.error;
  protected readonly messageCount = this.talkState.messageCount;
  protected readonly level = this.talkState.level;

  protected readonly inputDisabled = computed(() => this.talkState.isSending());

  ngOnInit(): void {
    const scenarioId = this.route.snapshot.queryParamMap.get('scenarioId');
    const level = this.route.snapshot.queryParamMap.get('level') ?? 'a2';
    if (scenarioId) {
      this.talkState.startConversation(scenarioId, level);
    }
  }

  protected onMessageSent(event: { content: string; confidence?: number }): void {
    this.talkState.sendMessage(event.content, event.confidence);
  }

  protected onEndConversation(): void {
    this.talkState.endConversation();
    const sub = this.talkState.status;
    const check = setInterval(() => {
      if (sub() === 'idle' && this.talkState.endResult()) {
        clearInterval(check);
        this.router.navigate(['/talk', 'summary']);
      } else if (sub() === 'error') {
        clearInterval(check);
      }
    }, 100);
  }
}
