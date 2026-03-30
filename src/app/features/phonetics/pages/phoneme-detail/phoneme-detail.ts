import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-phoneme-detail',
  imports: [RouterLink],
  template: `
    <div class="page">
      <a routerLink="/phonetics">Volver</a>
      <p>Cargando detalle del fonema...</p>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .page {
      max-width: 40rem;
      margin: 0 auto;
      padding: var(--sp-4);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhonemeDetail {}
