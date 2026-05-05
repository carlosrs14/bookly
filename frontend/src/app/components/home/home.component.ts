import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [NgFor, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  reviews = [
    {
      book: 'El Señor de los Anillos',
      author: 'J.R.R. Tolkien',
      username: 'pedro', 
      content: 'Me parecio un libro muy interesante',
      created_at: 2025,
      likes: 10,
      my_like: true,
      owner: true,
    },
    {
      book: '1984',
      author: 'George Orwell',
      username: 'juan',
      content: 'Un clásico de la distopía que te hace reflexionar.',
      created_at: 2025,
      likes: 10,
      my_like: false,
      owner: false

    },
    {
      book: '1984',
      author: 'George Orwell',
      username: 'juan',
      content: 'esta es otra resena',
      created_at: 2025,
      likes: 20,
      my_like: false,
      owner: true

    },

  ];
}
