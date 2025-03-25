import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, Subject, throwError } from 'rxjs';

import { DeleteTicketDialogComponent } from './delete-ticket-dialog.component';
import { TicketService } from '../../services/ticket.service';


describe('DeleteTicketDialogComponent', () => {
  let component: DeleteTicketDialogComponent;
  let fixture: ComponentFixture<DeleteTicketDialogComponent>;
  let dialogRef: any;
  let ticketService: TicketService;
  let keydownSubject: Subject<KeyboardEvent>;

  beforeEach(async () => {
    keydownSubject = new Subject<KeyboardEvent>();

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, BrowserAnimationsModule],
      declarations: [DeleteTicketDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { keydownEvents: () => keydownSubject.asObservable(), close: () => true } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: TicketService, useValue: { deleteTicket: () => of({}) } }
      ]
    })
  });
    
  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTicketDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    ticketService = TestBed.inject(TicketService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor()', () => {
    it('should call dialogRef.keydownEvents on constructor', () => {
      // Arrange
      const data = {
        id: 1,
        eventName: 'Test Event',
        description: 'Test Description',
        eventDate: '2022-01-01',
        ticketNumber: '2022010100001'
      };
      spyOn(dialogRef, 'keydownEvents').and.returnValue(of({}));

      // Act
      component = new DeleteTicketDialogComponent(dialogRef, ticketService, data);
      
      // Assert
      expect(dialogRef.keydownEvents).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to dialogRef.keydownEvents on constructor', () => {
      // Arrange
      const data = {
        id: 1,
        eventName: 'Test Event',
        description: 'Test Description',
        eventDate: '2022-01-01',
        ticketNumber: '2022010100001'
      };
      const observable = of({});
      spyOn(dialogRef, 'keydownEvents').and.returnValue(observable);
      const subscribeSpy = spyOn(observable, 'subscribe');      
      
      // Act
      component = new DeleteTicketDialogComponent(dialogRef, ticketService, data);
      
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

    it('should call dialogRef.close when Enter key is pressed', () => {
      // Arrange
      spyOn(dialogRef, 'close');

      // Act
      keydownSubject.next(new KeyboardEvent('keydown', { key: 'Enter' }));
      
      // Assert
      expect((component as any).dialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should not call dialogRef.close when Escape or Enter key is pressed', () => {
      // Arrange
      spyOn(dialogRef, 'close');

      // Act
      keydownSubject.next(new KeyboardEvent('keydown', { key: 'Space' }));
      
      // Assert
      expect((component as any).dialogRef.close).toHaveBeenCalledTimes(0);
    });
  });

  describe('onSubmit()', () => {
    it('should call the deleteTicket method of the ticket service', () => {
      // Arrange
      spyOn(ticketService, 'deleteTicket').and.returnValue(of({}));
      
      // Act
      component.onSubmit();

      // Assert
      expect(ticketService.deleteTicket).toHaveBeenCalledTimes(1);
    });

    it('should emit the reloadTickets event when the delete operation is successful', () => {
      // Arrange
      spyOn(component.reloadTickets, 'emit');
      spyOn(ticketService, 'deleteTicket').and.returnValue(of({}));
      
      // Act
      component.onSubmit();
      
      // Assert
      expect(component.reloadTickets.emit).toHaveBeenCalledTimes(1);
    });

    it('should log an error message when the delete operation fails', () => {
      // Arrange
      spyOn(ticketService, 'deleteTicket').and.returnValue(throwError(() => new Error('Test error')));
      spyOn(console, 'error');
      
      // Act
      component.onSubmit();

      // Assert
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('should do something', () => {
      // Arrange
      spyOn(dialogRef, 'close');

      // Act
      component.onSubmit();
      
      // Assert
      expect(dialogRef.close).toHaveBeenCalledTimes(1);
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
