import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { BookService } from '../../services/book.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, ReviewCardComponent],
  template: `
    <div class="book-detail-page">
      <a routerLink="/books" class="back-link">← Back to Books</a>

      @if (bookResource.isLoading()) {
        <div class="detail-skeleton">
          <div class="skeleton" style="width: 200px; height: 280px; border-radius: var(--radius-md)"></div>
          <div style="flex:1">
            <div class="skeleton" style="height: 32px; width: 60%; margin-bottom: 12px"></div>
            <div class="skeleton" style="height: 18px; width: 40%; margin-bottom: 24px"></div>
            <div class="skeleton" style="height: 100px; width: 100%"></div>
          </div>
        </div>
      } @else if (bookResource.value(); as book) {
        <div class="book-hero">
          <div class="cover-section">
            @if (book.cover_image) {
              <img [src]="book.cover_image" [alt]="book.title" class="hero-cover">
            } @else {
              <div class="hero-cover-placeholder">
                <span>📖</span>
              </div>
            }
          </div>
          <div class="info-section">
            <h1 class="book-title">{{ book.title }}</h1>
            <p class="book-author">by {{ book.author.name }}</p>
            @if (book.published_year) {
              <span class="book-year">Published {{ book.published_year }}</span>
            }
            <div class="genres">
              @for (genre of book.genres; track genre.id) {
                <span class="genre-tag">{{ genre.name }}</span>
              }
            </div>
            @if (book.synopsis) {
              <p class="synopsis">{{ book.synopsis }}</p>
            }
            <p class="review-count">{{ book.reviews_count }} reviews</p>
          </div>
        </div>

        @if (auth.isAuthenticated()) {
          <div class="write-review glass-card">
            <h3>Write a Review</h3>
            <div class="rating-input">
              @for (star of [1,2,3,4,5]; track star) {
                <button
                  class="star-btn"
                  [class.filled]="star <= newRating()"
                  (click)="newRating.set(star)"
                >★</button>
              }
            </div>
            <textarea
              [(ngModel)]="newContent"
              placeholder="Share your thoughts about this book..."
              class="review-textarea"
              rows="3"
            ></textarea>
            <button
              class="submit-btn"
              (click)="submitReview(book.id)"
              [disabled]="!newContent().trim()"
            >Publish Review</button>
          </div>
        }

        <h2 class="section-title">Reviews</h2>
        @for (review of reviews(); track review.id) {
          <app-review-card [review]="review" />
        } @empty {
          <p class="empty-msg">No reviews yet. Be the first to share your thoughts!</p>
        }
      }
    </div>
  `,
  styles: [`
    .back-link {
      display: inline-block;
      margin-bottom: 1.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
      transition: color var(--transition-fast);
    }
    .back-link:hover { color: var(--accent-primary); }

    .detail-skeleton {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .book-hero {
      display: flex;
      gap: 2rem;
      margin-bottom: 2.5rem;
      padding: 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
    }
    .hero-cover {
      width: 200px;
      height: 280px;
      object-fit: cover;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
    }
    .hero-cover-placeholder {
      width: 200px;
      height: 280px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--bg-card-hover), var(--bg-secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
    }
    .info-section { flex: 1; }
    .book-title {
      font-family: var(--font-heading);
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0 0 0.3rem;
    }
    .book-author {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }
    .book-year {
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .genres {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin: 0.75rem 0;
    }
    .genre-tag {
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      background: rgba(108, 99, 255, 0.12);
      color: var(--accent-primary);
      font-size: 0.82rem;
      font-weight: 500;
    }
    .synopsis {
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 1rem 0;
    }
    .review-count {
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .write-review {
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .write-review h3 {
      font-family: var(--font-heading);
      margin-bottom: 0.75rem;
    }
    .rating-input {
      display: flex;
      gap: 0.25rem;
      margin-bottom: 0.75rem;
    }
    .star-btn {
      font-size: 1.5rem;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      transition: color var(--transition-fast);
      padding: 0;
    }
    .star-btn:hover, .star-btn.filled { color: var(--accent-star); }
    .review-textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      background: var(--bg-input);
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: 0.95rem;
      resize: vertical;
      outline: none;
      transition: border-color var(--transition-fast);
      margin-bottom: 0.75rem;
    }
    .review-textarea:focus { border-color: var(--accent-primary); }
    .review-textarea::placeholder { color: var(--text-muted); }
    .submit-btn {
      padding: 0.6rem 1.5rem;
      border-radius: var(--radius-full);
      background: var(--accent-gradient);
      color: white;
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .submit-btn:disabled { opacity: 0.5; cursor: default; }

    .section-title {
      font-family: var(--font-heading);
      font-size: 1.3rem;
      margin-bottom: 1.25rem;
      color: var(--text-primary);
    }
    .empty-msg {
      text-align: center;
      color: var(--text-muted);
      padding: 2rem;
    }

    @media (max-width: 640px) {
      .book-hero { flex-direction: column; align-items: center; text-align: center; }
      .genres { justify-content: center; }
    }
  `],
})
export class BookDetailComponent {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private reviewService = inject(ReviewService);
  auth = inject(AuthService);

  bookId = signal(0);
  reviews = signal<Review[]>([]);
  newContent = signal('');
  newRating = signal(0);

  bookResource = rxResource({
    request: () => this.bookId(),
    loader: ({ request: id }) => this.bookService.getBook(id),
  });

  constructor() {
    this.route.params.subscribe(params => {
      this.bookId.set(+params['id']);
      // Reviews would come from the feed filtered by book — for now load from feed
    });
  }

  submitReview(bookId: number) {
    const content = this.newContent().trim();
    if (!content) return;

    this.reviewService.create(bookId, content, this.newRating() || undefined).subscribe(review => {
      this.reviews.update(prev => [review, ...prev]);
      this.newContent.set('');
      this.newRating.set(0);
      this.bookResource.reload();
    });
  }
}
