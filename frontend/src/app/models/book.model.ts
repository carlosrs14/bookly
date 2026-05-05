export interface Author {
  id: number;
  name: string;
  birth_date: string | null;
  nationality: string;
}

export interface Genre {
  id: number;
  name: string;
  description: string;
}

export interface Book {
  id: number;
  title: string;
  author: Author;
  genres: Genre[];
  published_year: number | null;
  synopsis: string;
  cover_image: string | null;
  reviews_count: number;
  created_at: string;
}
