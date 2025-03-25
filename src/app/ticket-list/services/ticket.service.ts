import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';

import { ITicket } from '../models/ticket.interface.model';
import { ICreateTicketRequest } from '../models/create-ticket.interface.model';
import { IPatchOperationRequest } from '../models/patch-operation.interface.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = '/api/tickets';
  private tickets$: Observable<ITicket[]> | undefined;
  
  constructor(private http: HttpClient) {}

  // Create
  createTicket(data: ICreateTicketRequest): Observable<ICreateTicketRequest> {
    return this.http
              .post<ICreateTicketRequest>(`${this.apiUrl}`, data)
              .pipe(
                catchError((error: any) => throwError(() => error))
              );
  }

  // Read
  getAllTickets(): Observable<ITicket[]> {
    if (!this.tickets$) {
      this.tickets$ = this.http
                        .get<ITicket[]>(`${this.apiUrl}/getAll`)
                        .pipe(
                          shareReplay({ bufferSize: 1, refCount: true}), // Will cache the first response
                          catchError((error: any) => throwError(() => error))
                        );
    }
    return this.tickets$;
  }

  getTicketById(id: number): Observable<ITicket> {
    return this.http
              .get<ITicket>(`${this.apiUrl}/${id}`)
              .pipe(
                catchError((error: any) => throwError(() => error))
              );
  }

  // Patch
  updateTicket(id: number, patchOperations: IPatchOperationRequest[]): Observable<any> {
    return this.http
              .patch(`${this.apiUrl}/${id}`, patchOperations)
              .pipe(
                catchError((error: any) => throwError(() => error))
              );
  }

  // Delete
  deleteTicket(id: number): Observable<any> {
    return this.http
              .delete<void>(`${this.apiUrl}/${id}`)
              .pipe(
                catchError((error: any) => throwError(() => error))
              );
  }

  // Will reset shareReplay(1)
  clearTicketsBuffer(): void {
    this.tickets$ = undefined;
  }
}
