import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { ModuleName } from '../../../../shared/models/learning.model';
import { StateService } from '../../../../shared/services/state.service';
import { MODULES } from '../../data/modules.data';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, Headphones, BookOpen, PenLine, MessageCircle, Mic } from 'lucide-angular';

const ICON_MAP: Record<ModuleName, LucideIconData> = {
  listening: Headphones,
  vocabulary: BookOpen,
  grammar: PenLine,
  phrases: MessageCircle,
  pronunciation: Mic,
};

const COLOR_MAP: Record<ModuleName, string> = {
  listening: 'var(--color-listening)',
  vocabulary: 'var(--color-vocabulary)',
  grammar: 'var(--color-grammar)',
  phrases: 'var(--color-phrases)',
  pronunciation: 'var(--color-pronunciation)',
};

const SOFT_MAP: Record<ModuleName, string> = {
  listening: 'var(--color-listening-soft)',
  vocabulary: 'var(--color-vocabulary-soft)',
  grammar: 'var(--color-grammar-soft)',
  phrases: 'var(--color-phrases-soft)',
  pronunciation: 'var(--color-pronunciation-soft)',
};

@Component({
  selector: 'app-module-card',
  imports: [Icon],
  templateUrl: './module-card.html',
  styleUrl: './module-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModuleCard {
  private readonly state = inject(StateService);

  readonly moduleName = input.required<ModuleName>();
  readonly variant = input<'primary' | 'compact'>('primary');

  protected readonly config = computed(() => MODULES[this.moduleName()]);
  protected readonly icon = computed(() => ICON_MAP[this.moduleName()]);
  protected readonly color = computed(() => COLOR_MAP[this.moduleName()]);
  protected readonly softColor = computed(() => SOFT_MAP[this.moduleName()]);
  protected readonly level = computed(() => this.state.getModuleLevel(this.moduleName()).toUpperCase());
  protected readonly percent = computed(() => this.state.getModuleCompletionPercent(this.moduleName()));
  protected readonly nextUnit = computed(() => this.state.getNextUnit(this.moduleName()));

  protected readonly completedCount = computed(() =>
    this.state.getModuleProgress(this.moduleName()).completedUnits.length
  );

  protected readonly totalUnits = computed(() => {
    const level = this.state.getModuleLevel(this.moduleName());
    return MODULES[this.moduleName()].levels[level]?.totalUnits ?? 0;
  });

  protected readonly dots = computed(() => {
    const total = this.totalUnits();
    const completed = this.completedCount();
    return Array.from({ length: Math.min(total, 12) }, (_, i) => i < completed);
  });
}
