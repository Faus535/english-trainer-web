import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/components/icon/icon';
import { LucideIconData, BookOpen, PenLine, Repeat } from 'lucide-angular';

@Component({
  selector: 'app-practice-hub',
  imports: [RouterLink, Icon],
  templateUrl: './practice-hub.html',
  styleUrl: './practice-hub.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PracticeHub {
  protected readonly bookIcon: LucideIconData = BookOpen;
  protected readonly penIcon: LucideIconData = PenLine;
  protected readonly repeatIcon: LucideIconData = Repeat;
}
