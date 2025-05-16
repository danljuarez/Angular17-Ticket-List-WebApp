import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import { TicketService } from '../../services/ticket.service';
import { validateDateInMMDDYYYYFormat, preventInvalidKeystrokes } from '../../utils/custom.form.validators';

@Component({
  selector: 'app-create-ticket-dialog',
  templateUrl: './create-ticket-dialog.component.html',
  styleUrl: './create-ticket-dialog.component.scss'
})
export class CreateTicketDialogComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  ticketAddForm!: FormGroup;

  minDate: Date;
  maxDate: Date;

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

    this.minDate = new Date(1900, 1 - 1, 1);
    this.maxDate = new Date(2100, 12 - 1, 31);
  }

  ngOnInit(): void {
    this.onFormInit();
  }

  onFormInit(): void {
    this.ticketAddForm = this.fb.group({
      eventName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]),
      eventDate: new FormControl('')
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

  onDateFocus(value: string): void {
    this.ticketAddForm.get('eventDate')?.markAsTouched();
    this.customDateValidator(value);
  }

  onDateModelChange(value: string): void {
    this.customDateValidator(value);
  }

  onDateChange(value: string): void {
    this.customDateValidator(value);
  }

  onDateBlur(value: string): void {
    this.ticketAddForm.get('eventDate')?.markAsTouched();
    this.customDateValidator(value);
  }

  customDateValidator(value: string): void {
    this.ticketAddForm.get('eventDate')?.setErrors(validateDateInMMDDYYYYFormat(value));
  }

  getEventDateErrorMessage(): string {
    if (this.ticketAddForm.get('eventDate')?.hasError('required')) return 'Date is required';
    if (this.ticketAddForm.get('eventDate')?.hasError('invalidDate')) return 'Invalid date format or value';
    if (this.ticketAddForm.get('eventDate')?.hasError('outOfRange')) return 'Year must be between 1900 and 2100';
    if (this.ticketAddForm.get('eventDate')?.hasError('pastDate')) return 'Past dates are not allowed';
    if (this.ticketAddForm.get('eventDate')?.hasError('futureDate')) return 'Future dates are not allowed';
    return '';
  }

  onDateKeyDown(e: KeyboardEvent): void {
    preventInvalidKeystrokes(e);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
