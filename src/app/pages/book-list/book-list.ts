import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Book } from '../../model/book';
import { BookService } from '../../services/book';

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-book-list',
  styleUrl: './book-list.css',
  templateUrl: './book-list.html',
})
export class BookList implements OnInit {
  books: Book[] = [];
  viewMode: 'cards' | 'list' = 'cards';
  searchTerm = '';
  isLoading = true;
  loadError = false;
  readonly fallbackImage = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85';

  get filteredBooks(): Book[] {
    const search = this.searchTerm.trim().toLocaleLowerCase();
    return this.books.filter((book) =>
      !search || book.name.toLocaleLowerCase().includes(search) || book.author.toLocaleLowerCase().includes(search),
    );
  }

  constructor(
    private bookService: BookService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = Array.isArray(books) ? books : [];
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.loadError = true;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  getImageUrl(image: string | null): string {
    return image || this.fallbackImage;
  }

  getSynopsisPreview(synopsis: string): string {
    const text = synopsis || 'No synopsis available.';
    return text.length > 180 ? `${text.slice(0, 177).trimEnd()}...` : text;
  }
}
