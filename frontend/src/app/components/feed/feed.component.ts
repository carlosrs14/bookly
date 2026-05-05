import { Component, inject, signal, ElementRef, viewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { FeedService } from '../../services/feed.service';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [ReviewCardComponent],
  template: `
    <div class="feed-page">
      <header class="page-header">
        <h1 class="page-title"><span class="gradient-text">Review Feed</span></h1>
        <p class="page-subtitle">Discover what the community is reading and thinking</p>
      </header>

      @for (review of reviews(); track review.id) {
        <app-review-card [review]="review" />
      }

      @if (loading()) {
        @for (i of [1, 2, 3]; track i) {
          <div class="skeleton-card">
            <div class="skeleton" style="width: 40px; height: 40px; border-radius: 50%"></div>
            <div style="flex:1">
              <div class="skeleton" style="width: 120px; height: 14px; margin-bottom: 8px"></div>
              <div class="skeleton" style="width: 100%; height: 60px; margin-bottom: 8px"></div>
              <div class="skeleton" style="width: 200px; height: 14px"></div>
            </div>
          </div>
        }
      }

      @if (!loading() && !hasMore() && reviews().length > 0) {
        <p class="end-message">You've reached the end 🎉</p>
      }

      @if (!loading() && reviews().length === 0) {
        <div class="empty-state">
          <span class="empty-icon">📖</span>
          <h2>No reviews yet</h2>
          <p>Be the first to share your thoughts on a book!</p>
        </div>
      }

      <div #scrollAnchor class="scroll-anchor"></div>
    </div>
  `,
  styles: [`
    .page-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }
    .page-title {
      font-family: var(--font-heading);
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }
    .page-subtitle {
      color: var(--text-secondary);
      font-size: 1rem;
    }
    .skeleton-card {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      margin-bottom: 1.25rem;
    }
    .end-message {
      text-align: center;
      color: var(--text-muted);
      padding: 2rem;
      font-size: 0.95rem;
    }
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-secondary);
    }
    .empty-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
    }
    .empty-state h2 {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    .scroll-anchor {
      height: 1px;
    }
  `],
})
export class FeedComponent implements AfterViewInit, OnDestroy {
  private feedService = inject(FeedService);
  private observer?: IntersectionObserver;

  scrollAnchor = viewChild<ElementRef>('scrollAnchor');

  reviews = signal<Review[]>([]);
  loading = signal(false);
  hasMore = signal(true);
  private nextCursor: string | null = null;

  ngAfterViewInit() {
    this.loadFeed();
    this.setupInfiniteScroll();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private loadFeed() {
    if (this.loading() || !this.hasMore()) return;

    this.loading.set(true);
    const url = this.nextCursor || undefined;

    this.feedService.getFeed(url).subscribe({
      next: (response) => {
        this.reviews.update(prev => [...prev, ...response.results]);
        this.nextCursor = response.next;
        this.hasMore.set(!!response.next);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private setupInfiniteScroll() {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.loading() && this.hasMore()) {
          this.loadFeed();
        }
      },
      { threshold: 0.1 }
    );

    const el = this.scrollAnchor()?.nativeElement;
    if (el) {
      this.observer.observe(el);
    }
  }
}
