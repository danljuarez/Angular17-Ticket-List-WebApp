import { Component, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import { TicketService } from '../../services/ticket.service';
import { ITicket } from '../../models/ticket.interface.model';

@Component({
  selector: 'app-delete-ticket-dialog',
  templateUrl: './delete-ticket-dialog.component.html',
  styleUrl: './delete-ticket-dialog.component.scss'
})
export class DeleteTicketDialogComponent implements OnDestroy {
  private destroyed$ = new Subject<void>();

  reloadTickets = new EventEmitter<void>();
  
  constructor(
    private dialogRef: MatDialogRef<DeleteTicketDialogComponent>,
    private service: TicketService,
    @Inject(MAT_DIALOG_DATA) public data: ITicket
  ) 
  {
    this.dialogRef.keydownEvents()
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(event => {
          if (event.key === 'Escape' || event.key === 'Enter') {
            this.dialogRef.close(event.key);
          }
      });
  }

  onSubmit(): void {
    this.service.deleteTicket(this.data.id)
      .subscribe({
        next: () => {
          this.reloadTickets.emit();
        },
        error: (error) => {
          console.error('Update failed', error)
        }
      });

    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
