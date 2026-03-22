import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { TutorTopic } from '../../models/tutor.model';

export interface TopicSuggestion {
  topic: TutorTopic;
  label: string;
  reason: string;
}

@Component({
  selector: 'app-topic-suggestions',
  templateUrl: './topic-suggestions.html',
  styleUrl: './topic-suggestions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicSuggestions {
  readonly suggestions = input.required<TopicSuggestion[]>();
  readonly selected = output<TutorTopic>();

  protected selectTopic(topic: TutorTopic): void {
    this.selected.emit(topic);
  }
}
