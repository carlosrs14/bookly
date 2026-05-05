import { Component, input, inject, signal } from '@angular/core';
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
  templateUrl: './review-card.component.html',
})
export class ReviewCardComponent {
  review = input.required<Review>();

  auth = inject(AuthService);
  private reviewService = inject(ReviewService);

  liked = signal(false);
  favorited = signal(false);
  likesCount = signal(0);
  showComments = signal(false);
  stars = [1, 2, 3, 4, 5];

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
