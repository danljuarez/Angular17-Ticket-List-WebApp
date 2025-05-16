import { Component, EventEmitter, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import * as _ from 'lodash';

import { ITicket } from '../../models/ticket.interface.model';
import { IPatchOperationRequest } from '../../models/patch-operation.interface.model';
import { IUpdateTicketRequest } from '../../models/update-ticket.interface.model';
import { TicketService } from '../../services/ticket.service';
import { validateDateInMMDDYYYYFormat, preventInvalidKeystrokes } from '../../utils/custom.form.validators';

@Component({
  selector: 'app-edit-ticket-dialog',
  templateUrl: './edit-ticket-dialog.component.html',
  styleUrl: './edit-ticket-dialog.component.scss'
})
export class EditTicketDialogComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  ticketEditForm!: FormGroup;
  originalData: Object = {};

  minDate: Date;
  maxDate: Date;

  reloadTickets = new EventEmitter<void>();

  @ViewChild('picker') picker: any;

  constructor(
    private dialogRef: MatDialogRef<EditTicketDialogComponent>,
    private service: TicketService,
    @Inject(MAT_DIALOG_DATA) public data: ITicket
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
    this.originalData = _.omit(_.cloneDeep(this.data), ['id', 'ticketNumber']);
    this.onFormInit();
  }

  onFormInit(): void {
    this.ticketEditForm = new FormGroup({
      eventName: new FormControl(this.data.eventName, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      description: new FormControl(this.data.description, [Validators.required, Validators.minLength(3), Validators.maxLength(300)]),
      eventDate: new FormControl(this.data.eventDate)
    });
  }

  onSubmit(): void {
    if (this.ticketEditForm.valid && this.hasChanges()) {
      const ticketToUpdate = this.prepareDataToPatch(this.ticketEditForm.value as any as IUpdateTicketRequest);
      this.service.updateTicket(this.data.id, ticketToUpdate)
        .subscribe({
          next: () => { 
            this.reloadTickets.emit();
          },
          error: (error) => { 
            console.error('Update failed', error);
          }
        });
    }
    this.dialogRef.close();
  }

  prepareDataToPatch( data: IUpdateTicketRequest ): IPatchOperationRequest[] {
    return [
      { op: 'replace', path: '/eventName', value: data.eventName },
      { op: 'replace', path: '/description', value: data.description },
      { op: 'replace', path: '/eventDate', value: data.eventDate }
    ]
  }

  hasChanges(): boolean {
    return JSON.stringify(this.ticketEditForm.value) !== JSON.stringify(this.originalData);
  }

  onFocus(fieldName: string = 'eventName'): void {
    this.ticketEditForm.get(fieldName)?.markAsTouched();
    this.ticketEditForm.get(fieldName)?.updateValueAndValidity();
  }

  onDateFocus(value: string): void {
    this.ticketEditForm.get('eventDate')?.markAsTouched();
    this.customDateValidator(value);
  }

  onDateModelChange(value: string): void {
    this.customDateValidator(value);
  }

  onDateChange(value: string): void {
    this.customDateValidator(value);
  }

  onDateBlur(value: string): void {
    this.ticketEditForm.get('eventDate')?.markAsTouched();
    this.customDateValidator(value);
  }
  
  customDateValidator(value: string): void {
    this.ticketEditForm.get('eventDate')?.setErrors(validateDateInMMDDYYYYFormat(value));
  }

  getEventDateErrorMessage(): string {
    if (this.ticketEditForm.get('eventDate')?.hasError('required')) return 'Date is required';
    if (this.ticketEditForm.get('eventDate')?.hasError('invalidDate')) return 'Invalid date format or value';
    if (this.ticketEditForm.get('eventDate')?.hasError('outOfRange')) return 'Year must be between 1900 and 2100';
    if (this.ticketEditForm.get('eventDate')?.hasError('pastDate')) return 'Past dates are not allowed';
    if (this.ticketEditForm.get('eventDate')?.hasError('futureDate')) return 'Future dates are not allowed';
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
