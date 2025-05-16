import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, Subject, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { EditTicketDialogComponent } from './edit-ticket-dialog.component';
import { TicketService } from '../../services/ticket.service';
import { IUpdateTicketRequest } from '../../models/update-ticket.interface.model';

describe('EditTicketDialogComponent', () => {
  let component: EditTicketDialogComponent;
  let fixture: ComponentFixture<EditTicketDialogComponent>;
  let dialogRef: any;
  let ticketService: TicketService;
  let keydownSubject: Subject<KeyboardEvent>;

  beforeEach(async () => {
    keydownSubject = new Subject<KeyboardEvent>();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatDialogModule, BrowserAnimationsModule],
      declarations: [EditTicketDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { keydownEvents: () => keydownSubject.asObservable(), close: () => true } },
        { provide: MAT_DIALOG_DATA, useValue: {}},
        { provide: TicketService, useValue: { updateTicket: () => of({}) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
  });
  
  beforeEach(() => {
    fixture = TestBed.createComponent(EditTicketDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    ticketService = TestBed.inject(TicketService);
  });

  it('should create an instance of EditTicketDialogComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor()', () => {
    it('should call dialogRef.keydownEvents on constructor', () => {
      // Arrange
      const data = {
        id: 1,
        eventName: 'Test Event',
        description: 'Test Description',
        eventDate: '01/01/2022',
        ticketNumber: '2022010100001'
      };
      spyOn(dialogRef, 'keydownEvents').and.returnValue(of({}));
      
      // Act
      component = new EditTicketDialogComponent(dialogRef, ticketService, data);
      
      // Assert
      expect(dialogRef.keydownEvents).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to dialogRef.keydownEvents on constructor', () => {
      // Arrange
      const data = {
        id: 1,
        eventName: 'Test Event',
        description: 'Test Description',
        eventDate: '01/01/2022',
        ticketNumber: '2022010100001'
      };
      const observable = of({});
      spyOn(dialogRef, 'keydownEvents').and.returnValue(observable);
      const subscribeSpy = spyOn(observable, 'subscribe');
      
      // Act
      component = new EditTicketDialogComponent(dialogRef, ticketService, data);

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

    it('should not call onSubmit or dialogRef.close when another key is pressed', () => {
      // Arrange
      spyOn(dialogRef, 'close');
      spyOn(component, 'onSubmit');
      
      // Act
      keydownSubject.next(new KeyboardEvent('keydown', { key: 'a' }));
      
      // Assert
      expect(dialogRef.close).not.toHaveBeenCalled();
      expect(component.onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit()', () => {
    it('should initialize the form', () => {
      // Arrange
      (component as any).data = {};

      // Act
      component.ngOnInit();
      
      // Assert
      expect(component.ticketEditForm).toBeDefined();
    });

    it('should set the original data from the returned ticket data', () => {
      // Arrange
      const data = {
        id: 1,
        eventName: 'Test Event',
        description: 'Test Description',
        eventDate: '01/01/2022',
        ticketNumber: '2022010100001'
      };
      (component as any).data = data;

      // Act
      component.ngOnInit();
      
      // Assert
      expect(component.originalData).toEqual({ eventName: 'Test Event', description: 'Test Description', eventDate: '01/01/2022' });
    });

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
    it('should initialize the form with the correct values', () => {
      // Arrange
      const data = { eventName: 'Test Event', description: 'Test Description', eventDate: '01/01/2022' };
      (component as any).data = data;
      
      // Act
      component.onFormInit();
      
      // Assert
      expect((component as any).ticketEditForm.get('eventName').value).toBe('Test Event');
      expect((component as any).ticketEditForm.get('description').value).toBe('Test Description');
      expect((component as any).ticketEditForm.get('eventDate').value).toBe('01/01/2022');
    });
  });

  describe('onSubmit()', () => {
    it('should update the ticket if the form is valid and there are changes', () => {
      // Arrange
      component.ticketEditForm = new FormGroup({
        eventName: new FormControl('New Event Name'),
        description: new FormControl('New Description'),
        eventDate: new FormControl('01/01/2022')
      });
      spyOn(component, 'hasChanges').and.returnValue(true);
      spyOn(ticketService, 'updateTicket').and.returnValue(of({}));

      // Act
      component.onSubmit();
      
      // Assert
      expect(ticketService.updateTicket).toHaveBeenCalledTimes(1);
    });

    it('should not update the ticket if the form is invalid', () => {
      // Arrange
      component.ticketEditForm = new FormGroup({});
      component.ticketEditForm.setErrors({ invalid: true });
      spyOn(component, 'hasChanges').and.returnValue(false);

      spyOn(ticketService, 'updateTicket').and.returnValue(of({}));

      // Act
      component.onSubmit();

      // Assert
      expect(ticketService.updateTicket).not.toHaveBeenCalled();
    });

    it('should not update the ticket if there are no changes', () => {
      // Arrange
      component.ticketEditForm = new FormGroup({
        eventName: new FormControl('Test Event'),
        description: new FormControl('Test Description'),
        eventDate: new FormControl('01/01/2022')
      });
      spyOn(ticketService, 'updateTicket').and.returnValue(of({}));
      spyOn(component, 'hasChanges').and.returnValue(false);
      
      // Act
      component.onSubmit();
      
      // Assert
      expect(ticketService.updateTicket).not.toHaveBeenCalled();
    });

    it('should handle error when service.updateTicket fails', () => {
      // Arrange
      component.ticketEditForm = new FormGroup({
        eventName: new FormControl('New Event Name'),
        description: new FormControl('New Description'),
        eventDate: new FormControl('01/01/2022')
      });
      spyOn(component, 'hasChanges').and.returnValue(true);

      spyOn(ticketService, 'updateTicket').and.returnValue(throwError(() => new Error('Test error')));
      spyOn(console, 'error');
      
      // Act
      component.onSubmit();

      // Assert
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('prepareDataToPatch()', () => {
    it('should return the correct patch data', () => {
      // Arrange
      const data: IUpdateTicketRequest = { eventName: 'New Event Name', description: 'New Description', eventDate: '01/01/2022' };

      // Act
      const result = component.prepareDataToPatch(data);

      // Assert
      expect(result).toEqual([
        { op: 'replace', path: '/eventName', value: 'New Event Name' },
        { op: 'replace', path: '/description', value: 'New Description' },
        { op: 'replace', path: '/eventDate', value: '01/01/2022' }
      ]);
    });
  });

  describe('hasChanges()', () => {
    it('should return true if the form value is different from the original data', () => {
      // Arrange
      component.ticketEditForm = new FormGroup({
        eventName: new FormControl('New Event Name'),
        description: new FormControl('New Description'),
        eventDate: new FormControl('01/01/2022')
      });
      component.originalData = { eventName: 'Old Event Name', description: 'Old Description', eventDate: '01/01/2022' };
      
      // Act & Assert
      expect(component.hasChanges()).toBe(true);
    });

    it('should return false if the form value is the same as the original data', () => {
      // Arrange
      component.ticketEditForm = new FormGroup({
        eventName: new FormControl('Old Event Name'),
        description: new FormControl('Old Description'),
        eventDate: new FormControl('01/01/2022')
      });
      component.originalData = { eventName: 'Old Event Name', description: 'Old Description', eventDate: '01/01/2022' };

      // Act & Assert
      expect(component.hasChanges()).toBe(false);
    });
  });

  describe('onFocus()', () => {
    it('should mark the form control as touched and update its validity', () => {
      // Arrange
      component.ticketEditForm = new FormGroup({
        eventName: new FormControl('New Event Name'),
        description: new FormControl('New Description'),
        eventDate: new FormControl('01/01/2022')
      });
      const eventDateControl = component.ticketEditForm.get('eventName');
      expect(eventDateControl?.touched).toBe(false);

      // Act
      component.onFocus('eventName');
      
      // Assert
      expect(eventDateControl?.touched).toBe(true);
      expect(eventDateControl?.valid).toBe(true);
    });

    it('should not throw an error if the form control is null or undefined', () => {
      // Arrange
      component.ticketEditForm = new FormGroup({
        description: new FormControl('New Description'),
        eventDate: new FormControl('01/01/2022')
      });

      // Act & Assert
      expect(() => component.onFocus('eventName')).not.toThrow();
    });

    it('should default to fieldname eventDate and not fail when no argument is provided', () => {
      // Arrange
      component.ticketEditForm = new FormGroup({
        eventName: new FormControl('New Event Name'),
        description: new FormControl('New Description'),
        eventDate: new FormControl('01/01/2022')
      });
      const eventDateControl = component.ticketEditForm.get('eventName');
      expect(eventDateControl?.touched).toBe(false);

      // Act
      component.onFocus();

      // Assert
      expect(eventDateControl?.touched).toBe(true);
      expect(eventDateControl?.valid).toBe(true);
    });
  });

  describe('onDateFocus()', () => {
    it('should mark the form control as touched and update its validity', () => {
      // Arrange
      component.ticketEditForm = new FormGroup({
        eventDate: new FormControl('01/01/2022')
      });
      const eventDateControl = component.ticketEditForm.get('eventDate');
      expect(eventDateControl?.touched).toBe(false);

      // Act
      component.onDateFocus(eventDateControl?.value);
      
      // Assert
      expect(eventDateControl?.touched).toBe(true);
      expect(eventDateControl?.valid).toBe(true);
    });

    it('should not throw an error if the form control is null or undefined', () => {
      // Arrange
      component.ticketEditForm = new FormGroup({});

      // Act & Assert
      expect(() => component.onDateFocus('')).not.toThrow();
    });

    it('should mark the form control as touched and as invalid', () => {
      // Arrange
      component.ticketEditForm = new FormGroup({
        eventDate: new FormControl('01-01-2022')
      });
      const eventDateControl = component.ticketEditForm.get('eventDate');
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
      const value = '01/01/2022';
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
      const value = '01/01/2022';
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
      component.ticketEditForm = new FormGroup({
        eventDate: new FormControl('01/01/2022')
      });
      const value = '01/01/2022';
      const eventDateControl = component.ticketEditForm.get('eventDate');
      expect(eventDateControl?.touched).toBe(false);

      // Act
      component.onDateBlur(value);

      // Assert
      expect(eventDateControl?.touched).toBe(true);
    });

    it('should call customDateValidator', () => {
      // Arrange
      component.ticketEditForm = new FormGroup({
        eventDate: new FormControl('01/01/2022')
      });
      const value = '01/01/2022';
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
      component.ticketEditForm = new FormGroup({
        eventDate: new FormControl('')
      });
      const value = '01/01/2022';
      const expectedErrorValue = null;

      // Act
      component.customDateValidator(value);

      // Assert
      expect(component.ticketEditForm.get('eventDate')?.errors).toEqual(expectedErrorValue);
    });

    it('should set errors to invalidDate on eventDate when date format is invalid', () => {
      // Arrange
      component.ticketEditForm = new FormGroup({
        eventDate: new FormControl('')
      });
      const value = '45/01/2022';
      const expectedErrorValue = { invalidDate: true };

      // Act
      component.customDateValidator(value);

      // Assert
      expect(component.ticketEditForm.get('eventDate')?.errors).toEqual(expectedErrorValue);
    });
  });

  describe('getEventDateErrorMessage()', () => {
    beforeEach(() => {
      component.ticketEditForm = new FormGroup({
        eventDate: new FormControl('')
      });
    });

    it('should return error message for required error', () => {
      // Arrange
      component.ticketEditForm.get('eventDate')?.setErrors({ required: true });

      // Act
      const errorMessage = component.getEventDateErrorMessage();

      // Assert
      expect(errorMessage).toBe('Date is required');
    });

    it('should return error message for invalidDate error', () => {
      // Arrange
      component.ticketEditForm.get('eventDate')?.setErrors({ invalidDate: true });

      // Act
      const errorMessage = component.getEventDateErrorMessage();

      // Assert
      expect(errorMessage).toBe('Invalid date format or value');
    });

    it('should return error message for outOfRange error', () => {
      // Arrange
      component.ticketEditForm.get('eventDate')?.setErrors({ outOfRange: true });

      // Act
      const errorMessage = component.getEventDateErrorMessage();

      // Assert
      expect(errorMessage).toBe('Year must be between 1900 and 2100');
    });

    it('should return error message for pastDate error', () => {
      // Arrange
      component.ticketEditForm.get('eventDate')?.setErrors({ pastDate: true });

      // Act
      const errorMessage = component.getEventDateErrorMessage();

      // Assert
      expect(errorMessage).toBe('Past dates are not allowed');
    });

    it('should return error message for futureDate error', () => {
      // Arrange
      component.ticketEditForm.get('eventDate')?.setErrors({ futureDate: true });

      // Act
      const errorMessage = component.getEventDateErrorMessage();

      // Assert
      expect(errorMessage).toBe('Future dates are not allowed');
    });

    it('should return empty string for no errors', () => {
      // Arrange
      component.ticketEditForm.get('eventDate')?.setErrors(null);

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
