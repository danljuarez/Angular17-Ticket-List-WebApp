import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import { TicketService } from '../../services/ticket.service';
import { dateFormatValidator } from '../../utils/custom.form.validators';

@Component({
  selector: 'app-create-ticket-dialog',
  templateUrl: './create-ticket-dialog.component.html',
  styleUrl: './create-ticket-dialog.component.scss'
})
export class CreateTicketDialogComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  ticketAddForm!: FormGroup;

  reloadTickets = new EventEmitter<void>();

  @ViewChild('picker') picker: any;

  constructor(
    private dialogRef: MatDialogRef<CreateTicketDialogComponent>,
    private service: TicketService,
    private fb: FormBuilder
  )
  {
    this.dialogRef.keydownEvents()
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(event => {
        if (event.key === 'Escape') {
          this.dialogRef.close(event.key);
        }
        if (event.key === 'Enter') {
          this.onSubmit();
        }
      });
  }

  ngOnInit(): void {
    this.onFormInit();
  }

  onFormInit(): void {
    this.ticketAddForm = this.fb.group({
      eventName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]),
      eventDate: new FormControl('', [Validators.required, dateFormatValidator()])
    });
  }

  onSubmit(): void {
    if (this.ticketAddForm.valid) {
      this.service.createTicket(this.ticketAddForm.value).subscribe({
          next: () => {
            this.reloadTickets.emit();
          },
          error: (error) => {
            console.error('Update failed', error);
          }
        });

      this.dialogRef.close();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
