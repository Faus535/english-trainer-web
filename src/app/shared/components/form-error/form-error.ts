import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-form-error',
  template: ` <span class="form-error" role="alert">{{ message() }}</span> `,
  styles: `
    :host {
      display: block;
    }
    .form-error {
      display: block;
      font-size: var(--fs-xs);
      color: var(--error);
      margin-top: var(--sp-1);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormError {
  readonly message = input.required<string>();
}
