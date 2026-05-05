import { Component, input, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/review.model';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './comment-section.component.html',
})
export class CommentSectionComponent {
  reviewId = input.required<number>();

  private commentService = inject(CommentService);

  comments = signal<Comment[]>([]);
  loading = signal(true);
  newComment = signal('');

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.loading.set(true);
    this.commentService.getComments(this.reviewId()).subscribe({
      next: (comments) => {
        this.comments.set(comments);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  submitComment() {
    const content = this.newComment().trim();
    if (!content) return;

    this.commentService.create(this.reviewId(), content).subscribe(comment => {
      this.comments.update(prev => [...prev, comment]);
      this.newComment.set('');
    });
  }
}
