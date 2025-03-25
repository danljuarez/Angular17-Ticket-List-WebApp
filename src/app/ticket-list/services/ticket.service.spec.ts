import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from "rxjs";

import { TicketService } from "./ticket.service";
import { ITicket } from "../models/ticket.interface.model";
import { IPatchOperationRequest } from "../models/patch-operation.interface.model";
import { ICreateTicketRequest } from "../models/create-ticket.interface.model";

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TicketService]
    });

    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an instance of TicketService', () => {
    expect(service).toBeTruthy();
  });

  describe('updateTicket()', () => {
    // Arrange
    const ticketFields: IPatchOperationRequest[] = [{ op: 'replace', path: '/eventName', value: 'Value Test 1' }];
    const ticketId = 1;

    it('should update a ticket', () => {
      // Arrange
      const expectedResponse: ITicket = { 
        id: 1,
        eventName: 'Value Test 1',
        description: 'Ticket Description 1',
        eventDate: '2024-08-10T21:57:10.789Z',
        ticketNumber: '2024081000001'
      };
      
      // Act
      service.updateTicket(ticketId, ticketFields).subscribe((ticket) => {
        expect(ticket).toEqual(expectedResponse);
      });

      // Assert
      const req = httpMock.expectOne('/api/tickets/1');
      
      expect(req.request.body).toEqual(ticketFields);
      expect(req.request.method).toEqual('PATCH');

      req.flush(expectedResponse);
    });

    it('should handle error when updating a ticket', () => {
      // Arrange
      const errorMessage = 'Failed to update';
      spyOn(service['http'], 'patch').and.returnValue(throwError(() => ({ status: 400, message: errorMessage})));

      // Act
      service.updateTicket(ticketId, ticketFields).subscribe({
        next: () => { 
          fail('Expected error to be thrown');
        },
        error: (error) => {
          // Assert
          expect(error.message).toContain(errorMessage);
        }
      });
    });
    
  });

  describe('getAllTickets()', () => {
    it('should get all tickets successfully', () => {
      // Arrange
      const expectedResponse: ITicket[] = [
        { id: 1, eventName: 'Ticket 1', description: 'Ticket Description 1', eventDate: '2024-08-10T21:57:10.789Z', ticketNumber: '2024081000001' },
        { id: 2, eventName: 'Ticket 2', description: 'Ticket Description 2', eventDate: '2024-10-15T21:57:10.789Z', ticketNumber: '2024101500002' },
        { id: 3, eventName: 'Ticket 3', description: 'Ticket Description 3', eventDate: '2024-11-05T21:57:10.789Z', ticketNumber: '2024110500003' }
      ];
  
      // Act
      service.getAllTickets().subscribe((tickets) => {
        expect(tickets).toEqual(expectedResponse);
      });
  
      // Assert
      const req = httpMock.expectOne('/api/tickets/getAll');

      expect(req.request.method).toEqual('GET');
  
      req.flush(expectedResponse);
    });

    it('should handle error when calling to get all tickets', () => {
      // Arrange
      const errorMessage = 'Error getting all tickets';
      spyOn(service['http'], 'get').and.returnValue(throwError(() => ({ status: 400, message: errorMessage})));

      /// Act
      service.getAllTickets().subscribe({
        next: () => {
          fail('Expected error to be thrown');
        },
        error: (error) => {
          // Assert
          expect(error.message).toEqual(errorMessage); 
        }
      });
    });        
  });

  describe('createTicket()', () => {
    // Arrange
    const newTicket: ICreateTicketRequest = { 
      eventName: 'Ticket 5',
      description: 'Ticket Description 5',
      eventDate: '2025-01-12T21:57:10.789Z'
    };

    it('should create a new ticket successfully', () => {
      // Arrange
      const expectedResponse: ITicket = { 
        id: 5,
        eventName: 'Ticket 5',
        description: 'Ticket Description 5',
        eventDate: '2025-01-12T21:57:10.789Z',
        ticketNumber: '2025011200005'
      };
      
      // Act
      service.createTicket(newTicket).subscribe((ticket) => {
        expect(ticket).toEqual(expectedResponse);
      });

      // Assert
      const req = httpMock.expectOne('/api/tickets');

      expect(req.request.method).toEqual('POST');

      req.flush(expectedResponse);
    });

    it('should handle error when creating a ticket', () => {
      // Arrange
      const errorMessage = 'Error creating ticket';
      spyOn(service['http'], 'post').and.returnValue(throwError(() => ({ status: 400, message: errorMessage})));

      // Act
      service.createTicket(newTicket).subscribe({
        next: () => {
          fail('Expected error to be thrown')
        },
        error: (error) => {
          // Assert
          expect(error.message).toEqual(errorMessage);
        }
      });
    });
  });

  describe('getTicketById()', () => {
    // Arrange
    const ticketId = 1;

    it('should get ticket by id successfully', () => {
      const expectedTicket: ITicket = { 
        id: 1,
        eventName: 'Ticket 1',
        description: 'Ticket Description 1',
        eventDate: '2024-08-10T21:57:10.789Z',
        ticketNumber: '2024081000001'
      };

      // Act
      service.getTicketById(ticketId).subscribe((ticket) => {
        expect(ticket).toEqual(expectedTicket);
      });

      // Assert
      const req = httpMock.expectOne('/api/tickets/1');

      expect(req.request.method).toEqual('GET');      

      req.flush(expectedTicket);
    });

    it('should handle error when calling get ticket by id', () => {
      // Arrange
      const errorMessage = `Error getting ticket id:${ticketId}`;
      spyOn(service['http'], 'get').and.returnValue(throwError(() => ({ status: 400, message: errorMessage})));

      // Act
      service.getTicketById(ticketId).subscribe({
        next: () => {
          fail('Expected error to be thrown');
        },
        error: (error) => {
          // Assert
          expect(error.message).toEqual(errorMessage);
        }
      });
    });
  });

  describe('deleteTicket()', () => {
    // Arrange
    const ticketId = 1;

    it('should delete a ticket', () => {
      // Act
      service.deleteTicket(ticketId).subscribe(() => {
        expect(true).toBeTruthy();
      });

      // Assert
      const req = httpMock.expectOne('/api/tickets/1');

      expect(req.request.method).toEqual('DELETE');

      req.flush(null);
    });

    it('should handle error when deleting ticket', () => {
      // Arrange
      const errorMessage = `Error deleting ticket id:${ticketId}`;
      spyOn(service['http'], 'delete').and.returnValue(throwError(() => ({ status: 400, message: errorMessage})));

      // Act
      service.deleteTicket(ticketId).subscribe({
        next: () => { 
          fail('Expected error to be thrown') ;
        },
        error: (error) => {
          // Assert
          expect(error.message).toEqual(errorMessage);
        }
      });
    });
  });

  describe('clearTicketsBuffer()', () => {
    it('should clear ticket list buffer', () => {
      // Arrange
      (service as any).tickets$ = of({});

      expect((service as any).tickets$).not.toBeUndefined();

      // Act
      service.clearTicketsBuffer();

      // Assert
      expect((service as any).tickets$).toBeUndefined();
    });
  })
});
