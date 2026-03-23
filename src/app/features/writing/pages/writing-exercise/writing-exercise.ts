import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { WritingApiService } from '../../services/writing-api.service';
import {
  WritingExerciseResponse,
  WritingFeedbackResponse,
} from '../../../../shared/models/api.model';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-writing-exercise',
  imports: [ReactiveFormsModule, RouterLink, UpperCasePipe],
  templateUrl: './writing-exercise.html',
  styleUrl: './writing-exercise.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WritingExercise implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly writingApi = inject(WritingApiService);
  private readonly notification = inject(NotificationService);

  protected readonly exercise = signal<WritingExerciseResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly submitting = signal(false);
  protected readonly feedback = signal<WritingFeedbackResponse | null>(null);
  readonly form = this.fb.nonNullable.group({ content: ['', [Validators.required]] });
  protected readonly wordCount = signal(0);
  private exerciseId = '';

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.exerciseId) {
      this.router.navigate(['/writing']);
      return;
    }

    const navState = history.state as { exercise?: WritingExerciseResponse };
    if (navState?.exercise) {
      this.exercise.set(navState.exercise);
      this.loading.set(false);
    } else {
      this.router.navigate(['/writing']);
      return;
    }
    this.form.controls.content.valueChanges.subscribe((val) => {
      this.wordCount.set(val.trim() ? val.trim().split(/\s+/).length : 0);
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.writingApi
      .submitWriting({ exerciseId: this.exerciseId, content: this.form.getRawValue().content })
      .subscribe({
        next: (fb) => {
          this.feedback.set(fb);
          this.submitting.set(false);
        },
        error: () => {
          this.submitting.set(false);
          this.notification.error('Error al enviar el ejercicio');
        },
      });
  }
}
