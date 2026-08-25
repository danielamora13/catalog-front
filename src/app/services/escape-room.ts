import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EscapeRoom } from '../model/escape-room';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EscapeRoomService {
  constructor(private http: HttpClient) {}

  getEscapeRooms(): Observable<EscapeRoom[]> {
    return this.http.get<EscapeRoom[]>(`${environment.API_URL}/escape-room`);
  }

  getEscapeRoom(id: number): Observable<EscapeRoom> {
    return this.http.get<EscapeRoom>(`${environment.API_URL}/escape-room/${id}`);
  }

  createEscapeRoom(escapeRoom: Omit<EscapeRoom, 'id'>): Observable<EscapeRoom> {
    return this.http.post<EscapeRoom>(`${environment.API_URL}/escape-room`, escapeRoom);
  }

  updateEscapeRoom(id: number, escapeRoom: Omit<EscapeRoom, 'id'>): Observable<EscapeRoom> {
    return this.http.put<EscapeRoom>(`${environment.API_URL}/escape-room/${id}`, escapeRoom);
  }
}
