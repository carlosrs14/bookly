import { Component, inject, signal } from '@angular/core';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { FavoriteService } from '../../services/favorite.service';
import { Favorite } from '../../models/review.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [ReviewCardComponent],
  template: `
    <div class="favorites-page">
      <header class="page-header">
        <h1 class="page-title"><span class="gradient-text">Your Favorites</span></h1>
        <p class="page-subtitle">Reviews you've saved for later</p>
      </header>

      @if (loading()) {
        @for (i of [1, 2, 3]; track i) {
          <div class="skeleton-card">
            <div class="skeleton" style="width: 40px; height: 40px; border-radius: 50%"></div>
            <div style="flex:1">
              <div class="skeleton" style="width: 120px; height: 14px; margin-bottom: 8px"></div>
              <div class="skeleton" style="width: 100%; height: 60px"></div>
            </div>
          </div>
        }
      } @else {
        @for (fav of favorites(); track fav.id) {
          <app-review-card [review]="fav.review" />
        } @empty {
          <div class="empty-state">
            <span class="empty-icon">🔖</span>
            <h2>No favorites yet</h2>
            <p>Start saving reviews you love from the feed!</p>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page-header { text-align: center; margin-bottom: 2.5rem; }
    .page-title {
      font-family: var(--font-heading);
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }
    .page-subtitle { color: var(--text-secondary); }
    .skeleton-card {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      margin-bottom: 1.25rem;
    }
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-secondary);
    }
    .empty-icon { font-size: 4rem; display: block; margin-bottom: 1rem; }
    .empty-state h2 { font-family: var(--font-heading); color: var(--text-primary); margin-bottom: 0.5rem; }
  `],
})
export class FavoritesComponent {
  private favoriteService = inject(FavoriteService);

  favorites = signal<Favorite[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.favoriteService.getFavorites().subscribe({
      next: (res) => {
        this.favorites.set(res.results);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
