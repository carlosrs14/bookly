import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-books',
  imports: [NgFor, FormsModule, NgIf],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  ngOnInit(): void {
    this.getBooksFromBackend();
  }
  toFilter:String = '';
  lastFilter: String = '';
  filteredBooks: Book[] = [];
  originalbooks: Book[] = [];

  selectedBook: Book | null = null;
  showModal: boolean = false;
  reviewContent: string = '';

  filter() {
    const current = this.toFilter.trim().toLowerCase();
    const previous = this.lastFilter.trim().toLowerCase();
    if (current === previous) return;

    if (current.startsWith(previous)) {
      this.filteredBooks = this.filteredBooks.filter(book =>
        book.getTitle().toLowerCase().includes(current)
      );
    } else {
      this.getBooksFromBackend(current);
    }
    this.lastFilter = this.toFilter;
  }
  getBooksFromBackend(filterValue:String = '') {
    this.originalbooks = [
      new Book(1, "titulo1", "author1", "descripcion1", 1900),
      new Book(2, "titulo2", "author2", "descripcion2", 1900),
      new Book(3, "titulo3", "author3", "descripcion3", 1900),
      new Book(4, "titulo4", "author4", "descripcion4", 1900)
    ]
    this.filteredBooks = this.originalbooks.filter(book =>
      book.getTitle().toLowerCase().includes(filterValue.toLowerCase())
    );
  }
  // create review user, book, content

  openReviewModal(book:Book) {
    this.selectedBook = book;
    this.showModal = true;
  }

  closeModal() {
    this.selectedBook = null;
    this.reviewContent = '';
    this.showModal = false;
  }
  
  submitReview() {
    const accessToken = localStorage.getItem('tokenAccess');
    if (!accessToken) {
      alert('No puedes enviar el review sin estar autenticado.');
      return;
    }
    if (!this.selectedBook) {
      alert('Debes seleccionar un libro.');
      return;
    }
    if (!this.reviewContent.trim()) {
      alert('No puedes enviar el review sin escribir algo.');
      return;
    }
  
    const reviewPayload = {
      token: accessToken,
      content: this.reviewContent,
      book_title: this.selectedBook.getId(),
    };
  
    console.log("Review enviado:", reviewPayload);
    
    //hacer logica para enviar el review
  
    this.closeModal();
  }
}

class Book {
  private id:Number;
  private title:String;
  private author:String;
  private description:String;
  private relased_date:Number;
  constructor(id:Number, title:String, author:String, description:String, relased_date:Number) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.description = description;
    this.relased_date = relased_date;
  }
  public getId() : Number {
    return this.id;
  }
  public getTitle() : String {
    return this.title;
  }
  public getAuthor() : String {
    return this.author;
  }
  public getDescription() : String {
    return this.description;
  }
  public getRelasedDate() : Number {
    return this.relased_date;
  }
  
}
