import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-suggested-action-card',
  templateUrl: './suggested-action-card.html',
  styleUrl: './suggested-action-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestedActionCard {
  readonly type = input.required<'talk' | 'immerse' | 'review'>();
  readonly title = input.required<string>();
  readonly description = input('');
  readonly tapped = output<void>();

  protected onTap(): void {
    this.tapped.emit();
  }
}
