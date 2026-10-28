import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Outing } from '../../model/outing';
import { OutingService } from '../../services/outing';

@Component({
  imports: [CommonModule, DatePipe, RouterLink],
  selector: 'app-outing-detail',
  styleUrl: './outing-detail.css',
  templateUrl: './outing-detail.html',
})
export class OutingDetail implements OnInit {
  outing: Outing | null = null;
  isLoading = true;
  isDeleting = false;
  loadError = false;
  deleteError = '';
  readonly fallbackPhoto = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85';
  private outingId = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private outingService: OutingService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.outingId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.outingId) {
      this.isLoading = false;
      this.loadError = true;
      return;
    }
    this.outingService.getOuting(this.outingId).subscribe({
      next: (response) => {
        const outingResponse = response as Outing & { data?: Outing; outing?: Outing };
        this.outing = outingResponse.data || outingResponse.outing || outingResponse;
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

  deleteOuting(): void {
    if (!this.outing || !globalThis.confirm('¿Seguro que quieres eliminar esta salida?')) return;
    this.isDeleting = true;
    this.deleteError = '';
    this.outingService.deleteOuting(this.outingId).subscribe({
      next: () => this.router.navigate(['/home/outing-list']),
      error: () => {
        this.isDeleting = false;
        this.deleteError = 'No se pudo eliminar la salida. Inténtalo de nuevo.';
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
