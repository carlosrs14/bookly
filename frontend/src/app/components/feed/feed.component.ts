import { Component, inject, signal, ElementRef, viewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { FeedService } from '../../services/feed.service';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [ReviewCardComponent],
  templateUrl: './feed.component.html',
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

    this.feedService.getFeed(this.nextCursor || undefined).subscribe({
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
    if (el) this.observer.observe(el);
  }
}
