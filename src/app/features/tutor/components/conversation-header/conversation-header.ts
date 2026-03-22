import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, X } from 'lucide-angular';
import { Level } from '../../../../shared/models/learning.model';

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
}
