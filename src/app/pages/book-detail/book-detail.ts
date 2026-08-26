import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Book } from '../../model/book';
import { BookService } from '../../services/book';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-book-detail',
  styleUrl: './book-detail.css',
  templateUrl: './book-detail.html',
})
export class BookDetail implements OnInit {
  book: Book | null = null;
  isLoading = true;
  loadError = false;
  readonly fallbackImage = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1400&q=85';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.isLoading = false;
      this.loadError = true;
      return;
    }

    this.bookService.getBook(id).subscribe({
      next: (response) => {
        const bookResponse = response as Book & { data?: Book; book?: Book };
        this.book = bookResponse.data || bookResponse.book || bookResponse;
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
}
