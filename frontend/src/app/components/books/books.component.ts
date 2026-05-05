import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { BookService } from '../../services/book.service';
import { Book, Genre } from '../../models/book.model';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="books-page">
      <header class="page-header">
        <h1 class="page-title"><span class="gradient-text">Explore Books</span></h1>
        <p class="page-subtitle">Find your next favorite read</p>
      </header>

      <div class="filters">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search by title, author, or genre..."
            class="search-input"
          >
        </div>

        <div class="genre-filters">
          <button
            class="genre-chip"
            [class.active]="!selectedGenre()"
            (click)="selectedGenre.set(null)"
          >All</button>
          @for (genre of genres(); track genre.id) {
            <button
              class="genre-chip"
              [class.active]="selectedGenre() === genre.id"
              (click)="selectedGenre.set(genre.id)"
            >{{ genre.name }}</button>
          }
        </div>
      </div>

      @if (booksResource.isLoading()) {
        <div class="books-grid">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="book-skeleton">
              <div class="skeleton" style="height: 200px; border-radius: var(--radius-md)"></div>
              <div class="skeleton" style="height: 18px; width: 70%; margin-top: 12px"></div>
              <div class="skeleton" style="height: 14px; width: 50%; margin-top: 8px"></div>
            </div>
          }
        </div>
      } @else if (booksResource.error()) {
        <div class="empty-state">
          <span class="empty-icon">⚠️</span>
          <h2>Failed to load books</h2>
          <p>Please try again later.</p>
        </div>
      } @else {
        <div class="books-grid">
          @for (book of books(); track book.id) {
            <a [routerLink]="['/books', book.id]" class="book-card fade-in-up">
              <div class="book-cover-wrapper">
                @if (book.cover_image) {
                  <img [src]="book.cover_image" [alt]="book.title" class="book-cover">
                } @else {
                  <div class="book-cover-placeholder">
                    <span class="cover-icon">📖</span>
                  </div>
                }
                @if (book.reviews_count > 0) {
                  <span class="review-badge">{{ book.reviews_count }} reviews</span>
                }
              </div>
              <div class="book-info">
                <h3 class="book-title">{{ book.title }}</h3>
                <p class="book-author">{{ book.author.name }}</p>
                @if (book.published_year) {
                  <span class="book-year">{{ book.published_year }}</span>
                }
                <div class="book-genres">
                  @for (genre of book.genres; track genre.id) {
                    <span class="genre-tag">{{ genre.name }}</span>
                  }
                </div>
              </div>
            </a>
          } @empty {
            <div class="empty-state full-width">
              <span class="empty-icon">📚</span>
              <h2>No books found</h2>
              <p>Try adjusting your search or filters.</p>
            </div>
          }
        </div>

        @if (totalPages() > 1) {
          <div class="pagination">
            <button
              class="page-btn"
              [disabled]="currentPage() <= 1"
              (click)="currentPage.set(currentPage() - 1)"
            >← Previous</button>
            <span class="page-info">Page {{ currentPage() }} of {{ totalPages() }}</span>
            <button
              class="page-btn"
              [disabled]="currentPage() >= totalPages()"
              (click)="currentPage.set(currentPage() + 1)"
            >Next →</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page-header {
      text-align: center;
      margin-bottom: 2rem;
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

    .filters { margin-bottom: 2rem; }
    .search-box {
      position: relative;
      margin-bottom: 1rem;
    }
    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.1rem;
    }
    .search-input {
      width: 100%;
      padding: 0.85rem 1rem 0.85rem 2.8rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
      background: var(--bg-card);
      color: var(--text-primary);
      font-size: 1rem;
      font-family: var(--font-body);
      outline: none;
      transition: all var(--transition-fast);
    }
    .search-input:focus { border-color: var(--accent-primary); box-shadow: var(--shadow-glow); }
    .search-input::placeholder { color: var(--text-muted); }

    .genre-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .genre-chip {
      padding: 0.4rem 1rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
      background: transparent;
      color: var(--text-secondary);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .genre-chip:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
    .genre-chip.active {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
      color: white;
    }

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .book-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      overflow: hidden;
      text-decoration: none;
      transition: all var(--transition-normal);
    }
    .book-card:hover {
      transform: translateY(-4px);
      border-color: var(--border-default);
      box-shadow: var(--shadow-lg);
    }
    .book-cover-wrapper {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    .book-cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .book-cover-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--bg-card-hover), var(--bg-secondary));
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cover-icon { font-size: 3rem; }
    .review-badge {
      position: absolute;
      bottom: 8px;
      right: 8px;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      background: var(--accent-primary);
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .book-info { padding: 1rem 1.25rem 1.25rem; }
    .book-title {
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 1.05rem;
      color: var(--text-primary);
      margin: 0 0 0.3rem;
      line-height: 1.3;
    }
    .book-author {
      font-size: 0.88rem;
      color: var(--text-secondary);
      margin: 0 0 0.25rem;
    }
    .book-year {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .book-genres {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
      margin-top: 0.5rem;
    }
    .genre-tag {
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-full);
      background: rgba(108, 99, 255, 0.1);
      color: var(--accent-primary);
      font-size: 0.75rem;
      font-weight: 500;
    }

    .book-skeleton {
      padding: 0;
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .book-skeleton .skeleton:not(:first-child) {
      margin-left: 1rem;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 2rem;
      padding: 1rem;
    }
    .page-btn {
      padding: 0.5rem 1.2rem;
      border-radius: var(--radius-full);
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      cursor: pointer;
      font-size: 0.9rem;
      transition: all var(--transition-fast);
    }
    .page-btn:hover:not(:disabled) { border-color: var(--accent-primary); color: var(--accent-primary); }
    .page-btn:disabled { opacity: 0.4; cursor: default; }
    .page-info { color: var(--text-secondary); font-size: 0.9rem; }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
    }
    .full-width { grid-column: 1 / -1; }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: 0.75rem; }
    .empty-state h2 { font-family: var(--font-heading); color: var(--text-primary); margin-bottom: 0.25rem; }

    @media (max-width: 640px) {
      .books-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class BooksComponent {
  private bookService = inject(BookService);

  searchQuery = signal('');
  selectedGenre = signal<number | null>(null);
  currentPage = signal(1);
  genres = signal<Genre[]>([]);

  private searchTimeout: any;

  /** rxResource reactively fetches books when search/genre/page signals change */
  booksResource = rxResource({
    request: () => ({
      search: this.searchQuery(),
      genre: this.selectedGenre(),
      page: this.currentPage(),
    }),
    loader: ({ request }) => {
      return this.bookService.getBooks({
        search: request.search || undefined,
        genre: request.genre ?? undefined,
        page: request.page,
      });
    },
  });

  books = computed(() => this.booksResource.value()?.results ?? []);
  totalPages = computed(() => {
    const count = this.booksResource.value()?.count ?? 0;
    return Math.ceil(count / 12);
  });

  constructor() {
    this.bookService.getGenres().subscribe(genres => this.genres.set(genres));
  }

  onSearchChange(value: string) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.searchQuery.set(value);
      this.currentPage.set(1);
    }, 400);
  }
}
