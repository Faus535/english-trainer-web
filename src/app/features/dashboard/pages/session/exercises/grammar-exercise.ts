import { Component, ChangeDetectionStrategy, input, signal, computed, OnInit } from '@angular/core';
import { Level } from '../../../../../shared/models/learning.model';
import { GRAMMAR_CONTENT, GrammarContent } from './exercise-content.data';

@Component({
  selector: 'app-grammar-exercise',
  templateUrl: './grammar-exercise.html',
  styleUrl: './exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrammarExercise implements OnInit {
  readonly level = input.required<Level>();
  readonly unitTitle = input.required<string>();

  protected readonly content = signal<GrammarContent | null>(null);
  protected readonly phase = signal<'learn' | 'exercise' | 'done'>('learn');
  protected readonly exerciseIndex = signal(0);
  protected readonly selectedOption = signal<number | null>(null);
  protected readonly results = signal<boolean[]>([]);

  protected readonly currentExercise = computed(() => {
    const c = this.content();
    if (!c) return null;
    return c.exercises[this.exerciseIndex()] ?? null;
  });

  protected readonly score = computed(() => {
    const r = this.results();
    if (r.length === 0) return 0;
    return Math.round((r.filter((x) => x).length / r.length) * 100);
  });

  ngOnInit(): void {
    const levelContent = GRAMMAR_CONTENT[this.level()];
    if (levelContent?.length) {
      const randomIdx = Math.floor(Math.random() * levelContent.length);
      this.content.set(levelContent[randomIdx]);
    }
  }

  protected startExercises(): void {
    this.phase.set('exercise');
    this.exerciseIndex.set(0);
    this.selectedOption.set(null);
    this.results.set([]);
  }

  protected selectOption(index: number): void {
    if (this.selectedOption() !== null) return;
    this.selectedOption.set(index);
    const ex = this.currentExercise();
    if (ex) {
      this.results.update((r) => [...r, index === ex.correct]);
    }
  }

  protected nextExercise(): void {
    const c = this.content();
    if (!c) return;
    const nextIdx = this.exerciseIndex() + 1;
    if (nextIdx >= c.exercises.length) {
      this.phase.set('done');
    } else {
      this.exerciseIndex.set(nextIdx);
      this.selectedOption.set(null);
    }
  }
}
