import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../services/book';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-book-update',
  styleUrl: './book-update.css',
  templateUrl: './book-update.html',
})
export class BookUpdate implements OnInit {
  bookForm: FormGroup;
  isSubmitting = false;
  isLoading = true;
  loadError = false;
  submitError = '';
  bookId = 0;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.bookForm = this.formBuilder.nonNullable.group({
      name: ['', Validators.required],
      author: ['', Validators.required],
      year: [null, Validators.required],
      image: [''],
      synopsis: ['', Validators.required],
      comment: [''],
    });
  }

  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.bookId) {
      this.isLoading = false;
      this.loadError = true;
      return;
    }

    this.bookService.getBook(this.bookId).subscribe({
      next: (response) => {
        const bookResponse = response as { data?: typeof response; book?: typeof response };
        const book = bookResponse.data || bookResponse.book || response;
        this.bookForm.patchValue({
          name: book.name,
          author: book.author,
          year: book.year,
          image: book.image || '',
          synopsis: book.synopsis,
          comment: book.comment || '',
        });
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

  submit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.bookService.updateBook(this.bookId, this.bookForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/home/book-detail', this.bookId]),
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'The book could not be updated. Please try again.';
      },
    });
  }
}
