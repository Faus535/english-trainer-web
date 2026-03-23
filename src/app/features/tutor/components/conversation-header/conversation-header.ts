import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, X, CheckCircle, Scale, Zap } from 'lucide-angular';
import { Level } from '../../../../shared/models/learning.model';

interface FeedbackMode {
  label: string;
  icon: LucideIconData;
  cssClass: string;
}

@Component({
  selector: 'app-conversation-header',
  imports: [Icon],
  templateUrl: './conversation-header.html',
  styleUrl: './conversation-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationHeader {
  readonly level = input.required<Level>();
  readonly messageCount = input(0);
  readonly endConversation = output<void>();

  protected readonly closeIcon: LucideIconData = X;

  protected readonly feedbackMode = computed<FeedbackMode>(() => {
    const lvl = this.level();
    if (lvl === 'a1' || lvl === 'a2') {
      return { label: 'Correccion activa', icon: CheckCircle, cssClass: 'mode--detailed' };
    }
    if (lvl === 'b1' || lvl === 'b2') {
      return { label: 'Balanced', icon: Scale, cssClass: 'mode--balanced' };
    }
    return { label: 'Fluency mode', icon: Zap, cssClass: 'mode--fluency' };
  });
}
