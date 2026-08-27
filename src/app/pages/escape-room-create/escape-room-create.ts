import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EscapeRoomService } from '../../services/escape-room';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-escape-room-create',
  styleUrl: './escape-room-create.css',
  templateUrl: './escape-room-create.html',
})
export class EscapeRoomCreate {
  isSubmitting = false;
  submitError = '';

  escapeRoomForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private escapeRoomService: EscapeRoomService,
    private router: Router,
  ) {
    this.escapeRoomForm = this.formBuilder.nonNullable.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      city: ['', Validators.required],
      photo: [''],
      description: ['', Validators.required],
      synopsis: [''],
      numPeople: [null],
      difficulty: [''],
      time: [null],
    });
  }

  submit(): void {
    if (this.escapeRoomForm.invalid) {
      this.escapeRoomForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.escapeRoomService.createEscapeRoom(this.escapeRoomForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/home/escape-room-list']),
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'The escape room could not be created. Please try again.';
      },
    });
  }
}
