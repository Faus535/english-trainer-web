import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { AdminApiService, AdminWritingExercise } from '../../services/admin-api.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { CEFR_LEVELS } from '../../../../shared/models/learning.model';

@Component({
  selector: 'app-admin-writing',
  imports: [ReactiveFormsModule, RouterLink, UpperCasePipe],
  templateUrl: './admin-writing.html',
  styleUrl: './admin-writing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminWriting implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);
  protected readonly items = signal<AdminWritingExercise[]>([]);
  protected readonly loading = signal(true);
  protected readonly editing = signal<AdminWritingExercise | null>(null);
  protected readonly showForm = signal(false);
  protected readonly levels = CEFR_LEVELS;
  readonly form = this.fb.nonNullable.group({
    prompt: ['', Validators.required],
    level: ['a1', Validators.required],
    category: ['', Validators.required],
    minWords: [50],
    maxWords: [200],
  });

  ngOnInit(): void {
    this.load();
  }
  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset({ prompt: '', level: 'a1', category: '', minWords: 50, maxWords: 200 });
    this.showForm.set(true);
  }
  protected openEdit(item: AdminWritingExercise): void {
    this.editing.set(item);
    this.form.patchValue(item);
    this.showForm.set(true);
  }
  protected closeForm(): void {
    this.showForm.set(false);
  }
  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.form.getRawValue();
    const e = this.editing();
    if (e) {
      this.api.updateWritingExercise(e.id, data).subscribe({
        next: () => {
          this.notification.success('Actualizado');
          this.closeForm();
          this.load();
        },
        error: () => this.notification.error('Error'),
      });
    } else {
      this.api.createWritingExercise(data).subscribe({
        next: () => {
          this.notification.success('Creado');
          this.closeForm();
          this.load();
        },
        error: () => this.notification.error('Error'),
      });
    }
  }
  protected deleteItem(id: string): void {
    if (!confirm('Eliminar?')) return;
    this.api.deleteWritingExercise(id).subscribe({
      next: () => {
        this.notification.success('Eliminado');
        this.load();
      },
    });
  }
  private load(): void {
    this.loading.set(true);
    this.api.getWritingExercises().subscribe({
      next: (i) => {
        this.items.set(i);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
