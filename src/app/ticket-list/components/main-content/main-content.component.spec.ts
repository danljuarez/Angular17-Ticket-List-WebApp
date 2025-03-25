import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { MainContentComponent } from './main-content.component';
import { TicketService } from '../../services/ticket.service';
import { ITicket } from '../../models/ticket.interface.model';

describe('MainContentComponent', () => {
  let component: MainContentComponent;
  let fixture: ComponentFixture<MainContentComponent>;
  let route: ActivatedRoute;
  let service: TicketService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainContentComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ link: 'list-tickets'}) } },
        { provide: TicketService, useValue: { getAllTickets: () => of([]) } }
      ]
    })
  });    
  beforeEach(() => {
    fixture = TestBed.createComponent(MainContentComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    service = TestBed.inject(TicketService);
  });

  it('should create an instance of MainContentComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should call fetchData on init', () => {
      // Arrange
      spyOn(component, 'fetchData');

      // Act
      component.ngOnInit();

      // Assert
      expect(component.fetchData).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchData()', () => {
    it('should call getAllTickets and set tickets when route parameter is list-tickets', () => {
      // Arrange
      const tickets: ITicket[] = [{ 
        id: 1,
        eventName: 'Ticket 1',
        description: 'Ticket Description 1',
        eventDate: '2024-08-10',
        ticketNumber: '2024081000001' 
      }];
      spyOn(service, 'getAllTickets').and.returnValue(of(tickets));

      // Act
      component.fetchData();

      // Assert
      expect(service.getAllTickets).toHaveBeenCalledTimes(1);
      expect(component.tickets).toEqual(tickets);
    });

    it('should set tickets to empty array when route parameter is empty', () => {
      // Arrange
      route.params = of({ link: '' });
      
      // Act
      component.fetchData();
      
      // Assert
      expect(component.tickets).toEqual([]);
    });

    it('should set tickets to empty array when route parameter is non-list-tickets', () => {
      // Arrange
      route.params = of({ link: 'other' });
      
      // Act
      component.fetchData();
      
      // Assert
      expect(component.tickets).toEqual([]);
    });

    it('should log error when getAllTickets throws error', () => {
      // Arrange
      spyOn(service, 'getAllTickets').and.returnValue(throwError(() => new Error('Test error')));
      spyOn(console, 'error');

      // Act
      component.fetchData();
      
      // Assert
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('onReloadData()', () => {
    it('should reset tickets and call fetchData on reload', () => {
      // Arrange
      component.tickets = [{
        id: 1,
        eventName: 'Ticket 1',
        description: 'Ticket Description 1',
        eventDate: '2024-08-10',
        ticketNumber: '2024081000001'
      }];
      spyOn(component, 'fetchData');

      // Act
      component.onReloadData();
      
      // Assert
      expect(component.tickets).toBeUndefined();
      expect(component.fetchData).toHaveBeenCalledTimes(1);
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
