import { Component, input, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/review.model';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="comments-section">
      @if (loading()) {
        <div class="spinner"></div>
      } @else {
        @for (comment of comments(); track comment.id) {
          <div class="comment fade-in-up">
            <div class="comment-header">
              <span class="comment-avatar">{{ comment.user.username.charAt(0).toUpperCase() }}</span>
              <span class="comment-user">{{ comment.user.username }}</span>
              <time class="comment-date">{{ comment.created_at | date:'shortDate' }}</time>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
          </div>
        } @empty {
          <p class="empty">No comments yet. Be the first!</p>
        }
      }

      <form class="comment-form" (ngSubmit)="submitComment()">
        <input
          type="text"
          [(ngModel)]="newComment"
          name="comment"
          placeholder="Write a comment..."
          class="comment-input"
          required
        >
        <button type="submit" class="comment-submit" [disabled]="!newComment().trim()">Send</button>
      </form>
    </div>
  `,
  styles: [`
    .comments-section {
      margin-top: 1rem;
      padding-top: 0.75rem;
    }
    .comment {
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      background: var(--bg-input);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
    }
    .comment-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.4rem;
    }
    .comment-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--accent-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 700;
      color: white;
    }
    .comment-user {
      font-weight: 600;
      font-size: 0.85rem;
      color: var(--text-primary);
    }
    .comment-date {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-left: auto;
    }
    .comment-text {
      font-size: 0.88rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .empty {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
      padding: 1rem;
    }
    .comment-form {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }
    .comment-input {
      flex: 1;
      padding: 0.6rem 1rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
      background: var(--bg-input);
      color: var(--text-primary);
      font-size: 0.9rem;
      font-family: var(--font-body);
      outline: none;
      transition: border-color var(--transition-fast);
    }
    .comment-input::placeholder { color: var(--text-muted); }
    .comment-input:focus { border-color: var(--accent-primary); }
    .comment-submit {
      padding: 0.6rem 1.2rem;
      border-radius: var(--radius-full);
      background: var(--accent-primary);
      color: white;
      border: none;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .comment-submit:hover:not(:disabled) { background: var(--accent-primary-hover); }
    .comment-submit:disabled { opacity: 0.5; cursor: default; }
  `],
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
