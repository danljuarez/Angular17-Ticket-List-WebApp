import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subject, switchMap, takeUntil } from 'rxjs';

import { TicketService } from '../../services/ticket.service';
import { ITicket } from '../../models/ticket.interface.model';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styles: ''
})
export class MainContentComponent implements OnInit, OnDestroy {
  tickets!: ITicket[] | undefined;
  private destroyed$ = new Subject<void>();
  
  constructor(
    private route: ActivatedRoute,
    private service: TicketService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.route.params
      .pipe(
        takeUntil(this.destroyed$),
        switchMap(params => {
          let opt = params['link'];
          if (!opt) opt = 'list-tickets';
          if (opt == 'list-tickets') {
            return this.service.getAllTickets()
              .pipe(
                takeUntil(this.destroyed$)
              );
          } else {
            return of([]);
          }
        })
      ).subscribe({
        next: (response) => {
          this.tickets = response;
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          // Handle error appropriately (e.g., display error message)
        }
      });
  }

  onReloadData(): void {
    this.tickets = undefined;
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
