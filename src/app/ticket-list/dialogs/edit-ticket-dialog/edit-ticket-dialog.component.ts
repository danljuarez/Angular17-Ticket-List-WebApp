import { Component, EventEmitter, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import * as _ from 'lodash';

import { ITicket } from '../../models/ticket.interface.model';
import { IPatchOperationRequest } from '../../models/patch-operation.interface.model';
import { IUpdateTicketRequest } from '../../models/update-ticket.interface.model';
import { TicketService } from '../../services/ticket.service';
import { dateFormatValidator } from '../../utils/custom.form.validators';

@Component({
  selector: 'app-edit-ticket-dialog',
  templateUrl: './edit-ticket-dialog.component.html',
  styleUrl: './edit-ticket-dialog.component.scss'
})
export class EditTicketDialogComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  ticketEditForm!: FormGroup;
  originalData: Object = {};

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
  }

  ngOnInit(): void {
    this.originalData = _.omit(_.cloneDeep(this.data), ['id', 'ticketNumber']);
    this.onFormInit();
  }

  onFormInit(): void {
    this.ticketEditForm = new FormGroup({
      eventName: new FormControl(this.data.eventName, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      description: new FormControl(this.data.description, [Validators.required, Validators.minLength(3), Validators.maxLength(300)]),
      eventDate: new FormControl(this.data.eventDate, [Validators.required, dateFormatValidator()])
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

  onDateFocus(fieldName: string = 'eventDate'): void {
    this.ticketEditForm.get(fieldName)?.markAsTouched();
    this.ticketEditForm.get(fieldName)?.updateValueAndValidity();
  }
  
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
