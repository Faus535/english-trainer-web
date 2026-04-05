import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-talk-input-bar',
  imports: [FormsModule],
  templateUrl: './talk-input-bar.html',
  styleUrl: './talk-input-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TalkInputBar {
  readonly disabled = input(false);
  readonly messageSent = output<{ content: string; confidence?: number }>();

  protected readonly text = signal('');
  protected readonly maxLength = 5000;

  protected onSend(): void {
    const content = this.text().trim();
    if (!content || this.disabled()) return;
    this.messageSent.emit({ content });
    this.text.set('');
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSend();
    }
  }
}
