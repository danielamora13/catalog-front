import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Outing } from '../model/outing';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OutingService {
  private readonly outingsUrl = `${environment.API_URL}/outing`;
  private readonly typesUrl = `${environment.API_URL}/types`;

  constructor(private http: HttpClient) {}

  getOutings(): Observable<Outing[]> {
    return this.http.get<Outing[]>(this.outingsUrl);
  }

  getOuting(id: number): Observable<Outing> {
    return this.http.get<Outing>(`${this.outingsUrl}/${id}`);
  }

  createOuting(outing: Omit<Outing, 'id'>): Observable<Outing> {
    return this.http.post<Outing>(this.outingsUrl, outing);
  }

  updateOuting(id: number, outing: Omit<Outing, 'id'>): Observable<Outing> {
    return this.http.put<Outing>(`${this.outingsUrl}/${id}`, outing);
  }

  deleteOuting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.outingsUrl}/${id}`);
  }

  getTypes(): Observable<unknown[]> {
    return this.http.get<unknown[]>(this.typesUrl);
  }

}
