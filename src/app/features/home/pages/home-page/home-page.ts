import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeApiService } from '../../services/home-api.service';
import { HomeResponse } from '../../models/home.model';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  private readonly homeApi = inject(HomeApiService);
  private readonly router = inject(Router);

  protected readonly data = signal<HomeResponse | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.homeApi.getHome().subscribe({
      next: (response) => {
        this.data.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  protected goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
