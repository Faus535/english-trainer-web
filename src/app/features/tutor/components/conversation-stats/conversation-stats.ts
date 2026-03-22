import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { ConversationMessage } from '../../models/tutor.model';

@Component({
  selector: 'app-conversation-stats',
  templateUrl: './conversation-stats.html',
  styleUrl: './conversation-stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationStats {
  readonly messages = input.required<ConversationMessage[]>();

  protected readonly stats = computed(() => {
    const msgs = this.messages();
    const userMsgs = msgs.filter((m) => m.role === 'user');
    let grammarErrors = 0;
    const vocabSet = new Set<string>();
    let totalConfidence = 0;
    let confidenceCount = 0;

    for (const msg of msgs) {
      if (msg.feedback) {
        grammarErrors += msg.feedback.grammarCorrections.length;
        for (const v of msg.feedback.vocabularySuggestions) vocabSet.add(v.word);
      }
      if (msg.confidence != null) {
        totalConfidence += msg.confidence;
        confidenceCount++;
      }
    }

    const firstTs = msgs.length > 0 ? new Date(msgs[0].timestamp).getTime() : Date.now();
    const lastTs =
      msgs.length > 0 ? new Date(msgs[msgs.length - 1].timestamp).getTime() : Date.now();

    return {
      totalMessages: msgs.length,
      userMessages: userMsgs.length,
      grammarErrors,
      vocabLearned: [...vocabSet],
      averageConfidence:
        confidenceCount > 0 ? Math.round((totalConfidence / confidenceCount) * 100) : 0,
      duration: Math.round((lastTs - firstTs) / 60000),
    };
  });
}
