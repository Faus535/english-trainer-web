import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { AdminApiService, AdminVocabEntry } from '../../services/admin-api.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { CEFR_LEVELS } from '../../../../shared/models/learning.model';

@Component({
  selector: 'app-admin-vocab',
  imports: [ReactiveFormsModule, RouterLink, UpperCasePipe],
  templateUrl: './admin-vocab.html',
  styleUrl: './admin-vocab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminVocab implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);
  protected readonly items = signal<AdminVocabEntry[]>([]);
  protected readonly loading = signal(true);
  protected readonly editing = signal<AdminVocabEntry | null>(null);
  protected readonly showForm = signal(false);
  protected readonly levels = CEFR_LEVELS;
  readonly form = this.fb.nonNullable.group({
    en: ['', Validators.required],
    ipa: [''],
    es: ['', Validators.required],
    type: ['noun', Validators.required],
    example: [''],
    level: ['a1', Validators.required],
  });

  ngOnInit(): void {
    this.load();
  }
  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset({ en: '', ipa: '', es: '', type: 'noun', example: '', level: 'a1' });
    this.showForm.set(true);
  }
  protected openEdit(item: AdminVocabEntry): void {
    this.editing.set(item);
    this.form.patchValue(item);
    this.showForm.set(true);
  }
  protected closeForm(): void {
    this.showForm.set(false);
    this.editing.set(null);
  }
  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.form.getRawValue();
    const e = this.editing();
    if (e) {
      this.api.updateVocab(e.id, data).subscribe({
        next: () => {
          this.notification.success('Actualizado');
          this.closeForm();
          this.load();
        },
        error: () => this.notification.error('Error'),
      });
    } else {
      this.api.createVocab(data).subscribe({
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
    this.api.deleteVocab(id).subscribe({
      next: () => {
        this.notification.success('Eliminado');
        this.load();
      },
    });
  }
  private load(): void {
    this.loading.set(true);
    this.api.getVocab().subscribe({
      next: (i) => {
        this.items.set(i);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
