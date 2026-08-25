import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EscapeRoom } from '../../model/escape-room';
import { EscapeRoomService } from '../../services/escape-room';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-escape-room-list',
  styleUrl: './escape-room-list.css',
  templateUrl: './escape-room-list.html',
})
export class EscapeRoomList implements OnInit {
  escapeRooms: EscapeRoom[] = [];
  readonly fallbackPhoto = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80';

  constructor(private escapeRoomService: EscapeRoomService) {}

  ngOnInit(): void {
    this.loadEscapeRooms();
  }

  private loadEscapeRooms(): void {
    this.escapeRoomService.getEscapeRooms().subscribe({
      next: (rooms) => {
        this.escapeRooms = Array.isArray(rooms) ? rooms : [];
      },
      error: () => undefined,
    });
  }

  getPhotoUrl(photo: string | null): string {
    return photo && !photo.startsWith('https://photos.google.com/') ? photo : this.fallbackPhoto;
  }
}
