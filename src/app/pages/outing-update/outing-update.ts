import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Outing } from '../../model/outing';
import { OutingService } from '../../services/outing';

@Component({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  selector: 'app-outing-update',
  styleUrl: './outing-update.css',
  templateUrl: './outing-update.html',
})
export class OutingUpdate implements OnInit {
  outingForm: FormGroup;
  types: string[] = [];
  newType = '';
  isLoading = true;
  isLoadingTypes = true;
  isSubmitting = false;
  loadError = false;
  submitError = '';
  typeError = '';
  outingId = 0;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private outingService: OutingService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.outingForm = this.formBuilder.nonNullable.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      place: ['', Validators.required],
      photo: [''],
      difficulty: [''],
      description: [''],
      type: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.outingId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTypes();
    this.outingService.getOuting(this.outingId).subscribe({
      next: (response) => {
        const outingResponse = response as Outing & { data?: Outing; outing?: Outing };
        const outing = outingResponse.data || outingResponse.outing || outingResponse;
        this.outingForm.patchValue({
          name: outing.name,
          date: String(outing.date).split('T')[0],
          place: outing.place,
          photo: outing.photo || '',
          difficulty: outing.difficulty || '',
          description: outing.description,
          type: outing.type,
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

  private loadTypes(): void {
    this.outingService.getTypes().subscribe({
      next: (response) => {
        this.types = this.normalizeTypes(response);
        this.isLoadingTypes = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.isLoadingTypes = false;
        this.typeError = 'No se pudieron cargar los tipos desde /types.';
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  private normalizeTypes(response: unknown): string[] {
    const body = response && typeof response === 'object' && !Array.isArray(response)
      ? response as Record<string, unknown>
      : null;
    const values = Array.isArray(response)
      ? response
      : Array.isArray(body?.['types'])
        ? body['types'] as unknown[]
        : Array.isArray(body?.['data'])
          ? body['data'] as unknown[]
          : [];
    return [...new Set(values.map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        const value = item as Record<string, unknown>;
        return String(value['type'] ?? value['name'] ?? '');
      }
      return '';
    }).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  addType(): void {
    const type = this.newType.trim();
    if (!type) return;
    this.typeError = '';
    this.types = [...new Set([...this.types, type])].sort((a, b) => a.localeCompare(b));
    this.outingForm.patchValue({ type });
    this.newType = '';
  }

  submit(): void {
    if (this.outingForm.invalid) {
      this.outingForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.submitError = '';
    this.outingService.updateOuting(this.outingId, this.outingForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/home/outing-detail', this.outingId]),
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'No se pudo actualizar la salida. Inténtalo de nuevo.';
      },
    });
  }
}
