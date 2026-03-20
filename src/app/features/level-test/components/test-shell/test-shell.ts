import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-test-shell',
  templateUrl: './test-shell.html',
  styleUrl: './test-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestShell {
  readonly label = input.required<string>();
  readonly current = input.required<number>();
  readonly total = input.required<number>();

  protected get percent(): number {
    return Math.round((this.current() / this.total()) * 100);
  }
}
