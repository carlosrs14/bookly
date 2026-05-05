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
  templateUrl: './books.component.html',
})
export class BooksComponent {
  private bookService = inject(BookService);

  searchQuery = signal('');
  selectedGenre = signal<number | null>(null);
  currentPage = signal(1);
  genres = signal<Genre[]>([]);

  private searchTimeout: any;

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
