import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { Level } from '../../../../shared/models/learning.model';

@Component({
  selector: 'app-test-intro',
  templateUrl: './test-intro.html',
  styleUrl: './test-intro.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestIntro {
  readonly start = output<void>();
  readonly skip = output<Level>();

  protected readonly levels: { level: Level; label: string }[] = [
    { level: 'a1', label: 'Principiante' },
    { level: 'a2', label: 'Basico' },
    { level: 'b1', label: 'Intermedio' },
    { level: 'b2', label: 'Intermedio alto' },
    { level: 'c1', label: 'Avanzado' },
  ];

  protected readonly steps = [
    { num: 1, title: 'Vocabulario', desc: 'Traduce 20 palabras al ingles' },
    { num: 2, title: 'Gramatica', desc: 'Elige la opcion correcta en 15 frases' },
    { num: 3, title: 'Listening', desc: 'Escucha y escribe lo que oyes (10 frases)' },
    { num: 4, title: 'Pronunciacion', desc: 'Escucha e identifica sonidos (8 preguntas)' },
  ];
}
