import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { BookService } from '../../services/book.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, ReviewCardComponent],
  templateUrl: './book-detail.component.html',
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
  stars = [1, 2, 3, 4, 5];

  bookResource = rxResource({
    request: () => this.bookId(),
    loader: ({ request: id }) => this.bookService.getBook(id),
  });

  constructor() {
    this.route.params.subscribe(params => {
      this.bookId.set(+params['id']);
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
