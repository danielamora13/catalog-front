import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EscapeRoomService } from '../../services/escape-room';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-escape-room-update',
  styleUrl: './escape-room-update.css',
  templateUrl: './escape-room-update.html',
})
export class EscapeRoomUpdate implements OnInit {
  escapeRoomForm: FormGroup;
  isSubmitting = false;
  isLoading = true;
  loadError = false;
  submitError = '';
  private roomId = 0;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private escapeRoomService: EscapeRoomService,
    private changeDetectorRef: ChangeDetectorRef,
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

  ngOnInit(): void {
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));
    this.escapeRoomService.getEscapeRoom(this.roomId).subscribe({
      next: (room) => {
        this.escapeRoomForm.patchValue({
          name: room.name,
          date: String(room.date).split('T')[0],
          city: room.city,
          photo: room.photo || '',
          description: room.description,
          synopsis: room.synopsis || '',
          numPeople: room.numPeople,
          difficulty: room.difficulty || '',
          time: room.time,
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
    if (this.escapeRoomForm.invalid) {
      this.escapeRoomForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.escapeRoomService.updateEscapeRoom(this.roomId, this.escapeRoomForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/home/escape-room-detail', this.roomId]),
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'The escape room could not be updated. Please try again.';
      },
    });
  }
}
