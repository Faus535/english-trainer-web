import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { VocabEntry } from '../../models/immerse.model';

@Component({
  selector: 'app-word-popup',
  templateUrl: './word-popup.html',
  styleUrl: './word-popup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordPopup implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);

  readonly entry = input.required<VocabEntry>();
  readonly dismissed = output<void>();
  readonly addToReview = output<VocabEntry>();

  private boundOnKeydown = this.onKeydown.bind(this);
  private boundOnClickOutside = this.onClickOutside.bind(this);

  ngOnInit(): void {
    document.addEventListener('keydown', this.boundOnKeydown);
    setTimeout(() => document.addEventListener('click', this.boundOnClickOutside));
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.boundOnKeydown);
    document.removeEventListener('click', this.boundOnClickOutside);
  }

  protected onAddToReview(): void {
    this.addToReview.emit(this.entry());
  }

  protected onDismiss(): void {
    this.dismissed.emit();
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.dismissed.emit();
    }
  }

  private onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dismissed.emit();
    }
  }
}
