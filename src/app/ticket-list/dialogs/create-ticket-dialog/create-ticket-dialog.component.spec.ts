import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, Subject, throwError } from 'rxjs';

import { CreateTicketDialogComponent } from './create-ticket-dialog.component';
import { TicketService } from '../../services/ticket.service';
import { ICreateTicketRequest } from '../../models/create-ticket.interface.model';

describe('CreateTicketDialogComponent', () => {
  let component: CreateTicketDialogComponent;
  let fixture: any;
  let dialogRef: any;
  let service: TicketService;
  let fb: FormBuilder;
  let keydownSubject: Subject<KeyboardEvent>;

  beforeEach(async () => {
    keydownSubject = new Subject<KeyboardEvent>();

    await TestBed.configureTestingModule({
      declarations: [CreateTicketDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { keydownEvents: () => keydownSubject.asObservable(), close: () => true }},
        { provide: TicketService, useValue: { createTicket: () => of({}) }},
        { provide: FormBuilder, useValue: { group: () => new FormGroup({}) }} ,
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
  });
  
  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTicketDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    service = TestBed.inject(TicketService);
    fb = TestBed.inject(FormBuilder);
  });

  it('should create an instance of CreateTicketDialogComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor()', () => {
    it('should call dialogRef.keydownEvents on constructor', () => {
      // Arrange
      spyOn(dialogRef, 'keydownEvents').and.returnValue(of({}));

      // Act
      component = new CreateTicketDialogComponent(dialogRef, service, fb);
      
      // Assert
      expect(dialogRef.keydownEvents).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to dialogRef.keydownEvents on constructor', () => {
      // Arrange
      const observable = of({});
      spyOn(dialogRef, 'keydownEvents').and.returnValue(observable);
      const subscribeSpy = spyOn(observable, 'subscribe');
      
      // Act
      component = new CreateTicketDialogComponent(dialogRef, service, fb);

      // Assert
      expect(subscribeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call dialogRef.close on Escape key pressed', () => {
      // Arrange
      spyOn(dialogRef, 'close');

      // Act
      keydownSubject.next(new KeyboardEvent('keydown', { key: 'Escape' }));

      // Assert
      expect((component as any).dialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should call onSubmit when Enter key is pressed', () => {
      // Arrange
      spyOn(component, 'onSubmit');
      
      // Act
      keydownSubject.next(new KeyboardEvent('keydown', { key: 'Enter' }));
      
      // Assert
      expect(component.onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnInit()', () => {
    it('should call onFormInit', () => {
      // Arrange
      spyOn(component, 'onFormInit');
      
      // Act
      component.ngOnInit();
      
      // Assert
      expect(component.onFormInit).toHaveBeenCalledTimes(1);
    });
  });

  describe('onFormInit()', () => {
    it('should initialize the form', () => {
      // Arrange
      const formGroup = new FormGroup({});
      formGroup.addControl('eventName', new FormControl(''));
      formGroup.addControl('description', new FormControl(''));
      formGroup.addControl('eventDate', new FormControl(''));

      const groupSpy = spyOn(fb, 'group').and.returnValue(formGroup);

      // Act
      component.onFormInit();
      
      // Assert
      expect(component.ticketAddForm).toBeInstanceOf(FormGroup);
      expect(component.ticketAddForm.controls['eventName']).toBeInstanceOf(FormControl);
      expect(component.ticketAddForm.controls['description']).toBeInstanceOf(FormControl);
      expect(component.ticketAddForm.controls['eventDate']).toBeInstanceOf(FormControl);
      expect(groupSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSubmit()', () => {
    it('should call service.createTicket and dialogRef.close when form is valid', () => {
      // Arrange
      const ticket: ICreateTicketRequest = { 
        eventName: 'Ticket 1',
        description: 'Ticket Description 1',
        eventDate: '10/08/2024'
      };
      spyOn(service, 'createTicket').and.returnValue(of(ticket));
      spyOn(dialogRef, 'close').and.returnValue(true);

      component.ticketAddForm = fb.group({
        eventName: ['eventName'],
        description: ['description'],
        eventDate: ['eventDate']
      });
      
      // Act
      component.onSubmit();

      // Assert
      expect(service.createTicket).toHaveBeenCalledTimes(1);
      expect(service.createTicket).toHaveBeenCalledWith(component.ticketAddForm.value);
      expect(dialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should not call service.createTicket and dialogRef.close when form is invalid', () => {
      spyOn(service, 'createTicket').and.returnValue(of());
      spyOn(dialogRef, 'close').and.returnValue(true);
      
      component.ticketAddForm = fb.group({});
      component.ticketAddForm.setErrors({ invalid: true });

      // Act
      component.onSubmit();
      
      // Assert
      expect(service.createTicket).not.toHaveBeenCalled();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should emit reloadTickets event when service.createTicket successfully executes', () => {
      // Arrange
      const ticket: ICreateTicketRequest = { 
        eventName: 'Ticket 1',
        description: 'Ticket Description 1',
        eventDate: '10/08/2024'
      };
      spyOn(service, 'createTicket').and.returnValue(of(ticket));
      spyOn(component.reloadTickets, 'emit');
      
      component.ticketAddForm = fb.group({
        eventName: ['eventName'],
        description: ['description'],
        eventDate: ['eventDate']
      });

      // Act
      component.onSubmit();
      
      // Assert
      expect(component.reloadTickets.emit).toHaveBeenCalledTimes(1);
    });

    it('should handle error when service.createTicket fails', () => {
      // Arrange
      spyOn(service, 'createTicket').and.returnValue(throwError(() => new Error('Test error')));
      spyOn(console, 'error');

      component.ticketAddForm = fb.group({
        eventName: ['eventName'],
        description: ['description'],
        eventDate: ['eventDate']
      });

      // Act
      component.onSubmit();
      
      // Assert
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('onDateFocus()', () => {
    it('should mark the form control as touched and update its validity', () => {
      // Arrange
      component.ticketAddForm = new FormGroup({
        eventDate: new FormControl('10/08/2024')
      });
      const eventDateControl = component.ticketAddForm.get('eventDate');
      expect(eventDateControl?.touched).toBe(false);

      // Act
      component.onDateFocus(eventDateControl?.value);

      // Assert
      expect(eventDateControl?.touched).toBe(true);
      expect(eventDateControl?.valid).toBe(true);
    });

    it('should not throw an error if the form control is null or undefined', () => {
      // Arrange
      component.ticketAddForm = new FormGroup({});

      // Act & Assert
      expect(() => component.onDateFocus('')).not.toThrow();
    });

    it('should mark the form control as touched and as invalid', () => {
      // Arrange
      component.ticketAddForm = new FormGroup({
        eventDate: new FormControl('10-08-2024')
      });
      const eventDateControl = component.ticketAddForm.get('eventDate');
      expect(eventDateControl?.touched).toBe(false);

      // Act
      component.onDateFocus(eventDateControl?.value);

      // Assert
      expect(eventDateControl?.touched).toBe(true);
      expect(eventDateControl?.valid).toBe(false);
    });
  });

  describe('onDateModelChange()', () => {
    it('should ensure customDateValidator has been called', () => {
      // Arrange
      const value = '10/08/2024';
      const customDateValidatorSpy = spyOn(component, 'customDateValidator');

      // Act
      component.onDateModelChange(value);

      // Assert
      expect(customDateValidatorSpy).toHaveBeenCalledTimes(1);
      expect(customDateValidatorSpy).toHaveBeenCalledWith(value);
    });
  });

  describe('onDateChange()', () => {
    it('should ensure customDateValidator has been called', () => {
      // Arrange
      const value = '10/08/2024';
      const customDateValidatorSpy = spyOn(component, 'customDateValidator');

      // Act
      component.onDateChange(value);

      // Assert
      expect(customDateValidatorSpy).toHaveBeenCalledTimes(1);
      expect(customDateValidatorSpy).toHaveBeenCalledWith(value);
    });
  });

  describe('onDateBlur()', () => {
    it('should mark eventDate as touched', () => {
      // Arrange
      component.ticketAddForm = new FormGroup({
        eventDate: new FormControl('')
      });
      const value = '10/08/2024';
      const eventDateControl = component.ticketAddForm.get('eventDate');
      expect(eventDateControl?.touched).toBe(false);

      // Act
      component.onDateBlur(value);

      // Assert
      expect(eventDateControl?.touched).toBe(true);
    });

    it('should call customDateValidator', () => {
      // Arrange
      component.ticketAddForm = new FormGroup({
        eventDate: new FormControl('')
      });
      const value = '10/08/2024';
      const customDateValidatorSpy = spyOn(component, 'customDateValidator');

      // Act
      component.onDateBlur(value);

      // Assert
      expect(customDateValidatorSpy).toHaveBeenCalledTimes(1);
      expect(customDateValidatorSpy).toHaveBeenCalledWith(value);
    });
  });

  describe('customDateValidator()', () => {
    it('should set errors to null on eventDate when date format is valid', () => {
      // Arrange
      component.ticketAddForm = new FormGroup({
        eventDate: new FormControl('')
      });
      const value = '10/08/2024';
      const expectedErrorValue = null;

      // Act
      component.customDateValidator(value);

      // Assert
      expect(component.ticketAddForm.get('eventDate')?.errors).toEqual(expectedErrorValue);
    });

    it('should set errors to invalidDate on eventDate when date format is invalid', () => {
      // Arrange
      component.ticketAddForm = new FormGroup({
        eventDate: new FormControl('')
      });
      const value = '45/08/2024';
      const expectedErrorValue = { invalidDate: true };

      // Act
      component.customDateValidator(value);

      // Assert
      expect(component.ticketAddForm.get('eventDate')?.errors).toEqual(expectedErrorValue);
    });
  });

  describe('getEventDateErrorMessage()', () => {
    beforeEach(() => {
      component.ticketAddForm = new FormGroup({
        eventDate: new FormControl('')
      });
    });

    it('should return error message for required error', () => {
      // Arrange
      component.ticketAddForm.get('eventDate')?.setErrors({ required: true });

      // Act
      const errorMessage = component.getEventDateErrorMessage();

      // Assert
      expect(errorMessage).toBe('Date is required');
    });

    it('should return error message for invalidDate error', () => {
      // Arrange
      component.ticketAddForm.get('eventDate')?.setErrors({ invalidDate: true });

      // Act
      const errorMessage = component.getEventDateErrorMessage();

      // Assert
      expect(errorMessage).toBe('Invalid date format or value');
    });

    it('should return error message for outOfRange error', () => {
      // Arrange
      component.ticketAddForm.get('eventDate')?.setErrors({ outOfRange: true });

      // Act
      const errorMessage = component.getEventDateErrorMessage();

      // Assert
      expect(errorMessage).toBe('Year must be between 1900 and 2100');
    });

    it('should return error message for pastDate error', () => {
      // Arrange
      component.ticketAddForm.get('eventDate')?.setErrors({ pastDate: true });

      // Act
      const errorMessage = component.getEventDateErrorMessage();

      // Assert
      expect(errorMessage).toBe('Past dates are not allowed');
    });

    it('should return error message for futureDate error', () => {
      // Arrange
      component.ticketAddForm.get('eventDate')?.setErrors({ futureDate: true });

      // Act
      const errorMessage = component.getEventDateErrorMessage();

      // Assert
      expect(errorMessage).toBe('Future dates are not allowed');
    });

    it('should return empty string for no errors', () => {
      // Arrange
      component.ticketAddForm.get('eventDate')?.setErrors(null);

      // Act
      const errorMessage = component.getEventDateErrorMessage();

      // Assert
      expect(errorMessage).toBe('');
    });
  });

  describe('ngOnDestroy()', () => {
    it('should call destroyed$.next and destroyed$.complete', () => {
      // Arrange
      spyOn((component as any).destroyed$, 'next');
      spyOn((component as any).destroyed$, 'complete');
      
      // Act
      component.ngOnDestroy();
      
      // Assert
      expect((component as any).destroyed$.next).toHaveBeenCalledTimes(1);
      expect((component as any).destroyed$.complete).toHaveBeenCalledTimes(1);
    });
  });
});
