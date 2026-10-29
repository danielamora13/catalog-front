import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Outing } from '../../model/outing';
import { OutingService } from '../../services/outing';

@Component({
  imports: [CommonModule, DatePipe, FormsModule, RouterLink],
  selector: 'app-outing-list',
  styleUrl: './outing-list.css',
  templateUrl: './outing-list.html',
})
export class OutingList implements OnInit {
  outings: Outing[] = [];
  selectedType = '';
  isLoading = true;
  loadError = false;
  readonly fallbackPhoto = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80';

  get types(): string[] {
    return [...new Set(this.outings.map((outing) => outing.type?.trim()).filter((type): type is string => !!type))]
      .sort((typeA, typeB) => typeA.localeCompare(typeB));
  }

  get filteredOutings(): Outing[] {
    return this.outings.filter((outing) => !this.selectedType || outing.type?.trim() === this.selectedType);
  }

  constructor(
    private outingService: OutingService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.outingService.getOutings().subscribe({
      next: (outings) => {
        this.outings = Array.isArray(outings) ? outings : [];
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

  getPhotoUrl(photo: string | null): string {
    return photo || this.fallbackPhoto;
  }
}
