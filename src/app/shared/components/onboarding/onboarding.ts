import { Component, ChangeDetectionStrategy, signal, output } from '@angular/core';

const STEPS = [
  {
    title: 'Bienvenido a English Trainer',
    description: 'Tu plataforma personalizada para aprender ingles.',
    icon: '👋',
  },
  {
    title: 'Test de nivel',
    description: 'Evaluaremos tu nivel en gramatica, vocabulario, escucha, pronunciacion y frases.',
    icon: '📝',
  },
  {
    title: 'Sesiones de aprendizaje',
    description: 'Genera sesiones personalizadas basadas en tu nivel y areas de mejora.',
    icon: '📚',
  },
  {
    title: 'Practica de habla',
    description: 'Mejora tu pronunciacion con ejercicios de voz y feedback en tiempo real.',
    icon: '🎤',
  },
  {
    title: 'Tutor IA',
    description: 'Conversa con un tutor de IA que se adapta a tu nivel.',
    icon: '🤖',
  },
  {
    title: 'Logros y racha',
    description: 'Mantiene tu motivacion con logros, XP y rachas diarias.',
    icon: '🏆',
  },
];
const STORAGE_KEY = 'et_onboarding_completed';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Onboarding {
  readonly completed = output<void>();
  protected readonly currentStep = signal(0);
  protected readonly steps = STEPS;
  protected readonly visible = signal(false);
  protected readonly step = () => this.steps[this.currentStep()];
  protected readonly isLast = () => this.currentStep() >= this.steps.length - 1;

  constructor() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, 'true');
      this.visible.set(true);
    }
  }

  protected next(): void {
    if (this.isLast()) this.finish();
    else this.currentStep.update((i) => i + 1);
  }
  protected previous(): void {
    this.currentStep.update((i) => Math.max(0, i - 1));
  }
  protected skip(): void {
    this.finish();
  }
  private finish(): void {
    this.visible.set(false);
    this.completed.emit();
  }
}
