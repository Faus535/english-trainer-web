import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Shell } from './layout/shell/shell';

@Component({
  selector: 'app-root',
  imports: [Shell],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
