import { Component, input, output, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Review } from '../../models/review.model';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { CommentSectionComponent } from '../comment-section/comment-section.component';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [RouterLink, DatePipe, CommentSectionComponent],
  template: `
    <article class="review-card fade-in-up">
      <div class="card-header">
        <div class="user-info">
          @if (review().user.avatar) {
            <img [src]="review().user.avatar" alt="" class="avatar">
          } @else {
            <span class="avatar-placeholder">{{ review().user.username.charAt(0).toUpperCase() }}</span>
          }
          <div>
            <span class="username">{{ review().user.username }}</span>
            <time class="date">{{ review().created_at | date:'mediumDate' }}</time>
          </div>
        </div>
        @if (review().rating) {
          <div class="rating">
            @for (star of stars(); track $index) {
              <span class="star" [class.filled]="$index < review().rating!">★</span>
            }
          </div>
        }
      </div>

      <div class="book-info">
        <a [routerLink]="['/books', review().book_id]" class="book-link">
          @if (review().book_cover) {
            <img [src]="review().book_cover" alt="" class="book-cover">
          }
          <div>
            <h3 class="book-title">{{ review().book_title }}</h3>
            <span class="book-author">by {{ review().book_author }}</span>
          </div>
        </a>
      </div>

      <p class="content">{{ review().content }}</p>

      <div class="actions">
        <button class="action-btn" [class.active]="liked()" (click)="onToggleLike()" [disabled]="!auth.isAuthenticated()">
          <span class="icon">{{ liked() ? '❤️' : '🤍' }}</span>
          <span>{{ likesCount() }}</span>
        </button>

        <button class="action-btn" (click)="showComments.set(!showComments())" [disabled]="!auth.isAuthenticated()">
          <span class="icon">💬</span>
          <span>{{ review().comments_count }}</span>
        </button>

        <button class="action-btn" [class.active]="favorited()" (click)="onToggleFavorite()" [disabled]="!auth.isAuthenticated()">
          <span class="icon">{{ favorited() ? '🔖' : '📑' }}</span>
          <span>{{ favorited() ? 'Saved' : 'Save' }}</span>
        </button>
      </div>

      @if (showComments()) {
        <app-comment-section [reviewId]="review().id" />
      }
    </article>
  `,
  styles: [`
    .review-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 1.25rem;
      transition: all var(--transition-normal);
    }
    .review-card:hover {
      border-color: var(--border-default);
      box-shadow: var(--shadow-glow);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .avatar, .avatar-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .avatar { object-fit: cover; border: 2px solid var(--border-default); }
    .avatar-placeholder {
      background: var(--accent-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: white;
      font-size: 1rem;
    }
    .username {
      display: block;
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--text-primary);
    }
    .date {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .rating {
      display: flex;
      gap: 2px;
    }
    .star {
      font-size: 1rem;
      color: var(--text-muted);
    }
    .star.filled { color: var(--accent-star); }

    .book-info {
      margin-bottom: 1rem;
    }
    .book-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--bg-input);
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: background var(--transition-fast);
    }
    .book-link:hover { background: var(--bg-card-hover); }
    .book-cover {
      width: 40px;
      height: 56px;
      border-radius: 4px;
      object-fit: cover;
    }
    .book-title {
      font-family: var(--font-heading);
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }
    .book-author {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .content {
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-subtle);
    }
    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0.8rem;
      border-radius: var(--radius-full);
      background: transparent;
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .action-btn:hover:not(:disabled) {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
      background: rgba(108, 99, 255, 0.08);
    }
    .action-btn.active {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }
    .action-btn:disabled { opacity: 0.5; cursor: default; }
    .icon { font-size: 1rem; }
  `],
})
export class ReviewCardComponent {
  review = input.required<Review>();

  auth = inject(AuthService);
  private reviewService = inject(ReviewService);

  liked = signal(false);
  favorited = signal(false);
  likesCount = signal(0);
  showComments = signal(false);
  stars = signal([1, 2, 3, 4, 5]);

  ngOnInit() {
    this.liked.set(this.review().is_liked);
    this.favorited.set(this.review().is_favorited);
    this.likesCount.set(this.review().likes_count);
  }

  onToggleLike() {
    this.reviewService.toggleLike(this.review().id).subscribe(res => {
      this.liked.set(res.liked);
      this.likesCount.set(res.likes_count);
    });
  }

  onToggleFavorite() {
    this.reviewService.toggleFavorite(this.review().id).subscribe(res => {
      this.favorited.set(res.favorited);
    });
  }
}
