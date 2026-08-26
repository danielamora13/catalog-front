import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../services/book';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-book-create',
  styleUrl: './book-create.css',
  templateUrl: './book-create.html',
})
export class BookCreate {
  isSubmitting = false;
  submitError = '';
  bookForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private bookService: BookService,
    private router: Router,
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

  submit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.bookService.createBook(this.bookForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/home/book-list']),
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'The book could not be created. Please try again.';
      },
    });
  }
}
