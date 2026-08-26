import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EscapeRoom } from '../../model/escape-room';
import { EscapeRoomService } from '../../services/escape-room';

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-escape-room-list',
  styleUrl: './escape-room-list.css',
  templateUrl: './escape-room-list.html',
})
export class EscapeRoomList implements OnInit {
  escapeRooms: EscapeRoom[] = [];
  viewMode: 'cards' | 'list' = 'cards';
  selectedCity = '';
  isLoading = true;
  loadError = false;
  readonly fallbackPhoto = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80';

  get cities(): string[] {
    return [...new Set(this.escapeRooms.map((room) => room.city).filter(Boolean))].sort();
  }

  get filteredEscapeRooms(): EscapeRoom[] {
    return this.escapeRooms
      .filter((room) => !this.selectedCity || room.city === this.selectedCity)
      .slice()
      .sort((roomA, roomB) => new Date(roomB.date).getTime() - new Date(roomA.date).getTime());
  }

  constructor(
    private escapeRoomService: EscapeRoomService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadEscapeRooms();
  }

  private loadEscapeRooms(): void {
    this.escapeRoomService.getEscapeRooms().subscribe({
      next: (rooms) => {
        this.escapeRooms = Array.isArray(rooms) ? rooms : [];
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
