import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EscapeRoom } from '../../model/escape-room';
import { EscapeRoomService } from '../../services/escape-room';

@Component({
  imports: [CommonModule, DatePipe, RouterLink],
  selector: 'app-escape-room-detail',
  styleUrl: './escape-room-detail.css',
  templateUrl: './escape-room-detail.html',
})
export class EscapeRoomDetail implements OnInit {
  escapeRoom: EscapeRoom | null = null;
  isLoading = true;
  loadError = false;
  readonly fallbackPhoto = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=85';

  constructor(
    private route: ActivatedRoute,
    private escapeRoomService: EscapeRoomService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.isLoading = false;
      this.loadError = true;
      return;
    }

    this.escapeRoomService.getEscapeRoom(id).subscribe({
      next: (response) => {
        const roomResponse = response as EscapeRoom & {
          data?: EscapeRoom;
          escapeRoom?: EscapeRoom;
        };
        this.escapeRoom = roomResponse.data || roomResponse.escapeRoom || roomResponse;
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
    return photo && !photo.startsWith('https://photos.google.com/') ? photo : this.fallbackPhoto;
  }
}
