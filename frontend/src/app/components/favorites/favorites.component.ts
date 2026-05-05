import { Component, inject, signal } from '@angular/core';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { FavoriteService } from '../../services/favorite.service';
import { Favorite } from '../../models/review.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [ReviewCardComponent],
  templateUrl: './favorites.component.html',
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
