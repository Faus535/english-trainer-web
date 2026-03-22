import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { AdminApiService, AdminPhrase } from '../../services/admin-api.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { CEFR_LEVELS } from '../../../../shared/models/learning.model';

@Component({
  selector: 'app-admin-phrases',
  imports: [ReactiveFormsModule, RouterLink, UpperCasePipe],
  templateUrl: './admin-phrases.html',
  styleUrl: './admin-phrases.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhrases implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);
  protected readonly items = signal<AdminPhrase[]>([]);
  protected readonly loading = signal(true);
  protected readonly editing = signal<AdminPhrase | null>(null);
  protected readonly showForm = signal(false);
  protected readonly levels = CEFR_LEVELS;
  readonly form = this.fb.nonNullable.group({
    en: ['', Validators.required],
    es: ['', Validators.required],
    level: ['a1', Validators.required],
  });

  ngOnInit(): void {
    this.load();
  }
  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset({ en: '', es: '', level: 'a1' });
    this.showForm.set(true);
  }
  protected openEdit(item: AdminPhrase): void {
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
      this.api.updatePhrase(e.id, data).subscribe({
        next: () => {
          this.notification.success('Actualizado');
          this.closeForm();
          this.load();
        },
      });
    } else {
      this.api.createPhrase(data).subscribe({
        next: () => {
          this.notification.success('Creado');
          this.closeForm();
          this.load();
        },
      });
    }
  }
  protected deleteItem(id: string): void {
    if (!confirm('Eliminar?')) return;
    this.api.deletePhrase(id).subscribe({
      next: () => {
        this.notification.success('Eliminado');
        this.load();
      },
    });
  }
  private load(): void {
    this.loading.set(true);
    this.api.getPhrases().subscribe({
      next: (i) => {
        this.items.set(i);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
