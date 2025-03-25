import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { of } from 'rxjs';

import { TableComponent } from './table.component';
import { TicketService } from '../../../services/ticket.service';
import { MainContentComponent } from '../main-content.component';
import { ITicket } from '../../../models/ticket.interface.model';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableComponent],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MainContentComponent, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
        { provide: TicketService, useValue: {} },
        { provide: MatPaginator, useValue: {} },
        { provide: MatSort, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      imports: [
        MatIconModule,
        MatFormFieldModule,
        MatPaginatorModule
      ]
    })
  });
    
  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance of TableComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should initialize dataSource', () => {
      // Arrange
      const tickets: ITicket[] = [{
        id: 1,
        eventName: 'Ticket 1',
        description: 'Ticket Description 1',
        eventDate: '2024-08-10',
        ticketNumber: '2024081000001'
      }];
      component.tickets = tickets;
  
      // Act
      component.ngOnInit();
  
      // Assert
      expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
      expect(component.dataSource.data).toEqual(tickets);
    });
  });

  describe('ngAfterViewInit()', () => {
    it('should set paginator and sort', () => {
      // Arrange
      const tickets: ITicket[] = [{
        id: 1,
        eventName: 'Ticket 1',
        description: 'Ticket Description 1',
        eventDate: '2024-08-10',
        ticketNumber: '2024081000001'
      }];
      component.dataSource = new MatTableDataSource<ITicket>(tickets);
  
      // Act
      component.ngAfterViewInit();
  
      // Assert
      expect(component.dataSource.paginator).toEqual(component.paginator);
      expect(component.dataSource.sort).toEqual(component.sort);
    });
  });

  describe('applyFilter()', () => {
    const tickets: ITicket[] = [{
      id: 1,
      eventName: 'Ticket 1',
      description: 'Ticket Description 1',
      eventDate: '2024-08-10',
      ticketNumber: '2024081000001'
    }];

    it('should apply filter with lowercase and trimmed', () => {
      // Arrange
      component.dataSource = new MatTableDataSource<ITicket>(tickets);
      const filterValue = 'Filter ';
      const event = { target: { value: filterValue } } as any;

      // Act
      component.applyFilter(event);

      // Assert
      expect(component.dataSource.filter).toBe(filterValue.trim().toLowerCase());
    });

    it('should apply filter with empty string', () => {
      // Arrange
      component.dataSource = new MatTableDataSource<ITicket>(tickets);
      const filterValue = '';
      const event = { target: { value: filterValue } } as any;

      // Act
      component.applyFilter(event);
      
      // Assert
      expect(component.dataSource.filter).toBe('');
    });

    it('should apply filter with null value', () => {
      // Arrange
      component.dataSource = new MatTableDataSource<ITicket>(tickets);

      const filterValue = null;
      const event = { target: { value: filterValue } } as any;

      // Act
      component.applyFilter(event);

      // Assert
      expect(component.dataSource.filter).toBe('');
    });

    it('should apply filter with undefined value', () => {
      // Arrange
      component.dataSource = new MatTableDataSource<ITicket>(tickets);

      const filterValue = undefined;
      const event = { target: { value: filterValue } } as any;

      // Act
      component.applyFilter(event);

      // Assert
      expect(component.dataSource.filter).toBe('');
    });
  });

  describe('openEditDialog()', () => {
    it('should open edit dialog, confirm times called and proper snackbar message', () => {
      // Arrange
      const ticket: ITicket = {
        id: 1,
        eventName: 'Test 1',
        description: 'Ticket Test 1',
        eventDate: '2024-08-10',
        ticketNumber: '2024081000001'
      };
      const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'componentInstance']);
      dialogRef.afterClosed.and.returnValue(of(undefined));
      dialogRef.componentInstance = jasmine.createSpyObj('EditTicketDialogComponent', ['reloadTickets']);
      dialogRef.componentInstance.reloadTickets = jasmine.createSpyObj(['subscribe']);
  
      (component as any).dialog = jasmine.createSpyObj('MatDialog', ['open']);
      (component as any).dialog.open.and.returnValue(dialogRef);
      
      (component as any).snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
      (component as any).snackBar.open.and.returnValue({});
      
      (component as any).emitDataRefresh = jasmine.createSpy();
      (component as any).emitDataRefresh.and.returnValue(Promise.resolve(true));
  
      // Act
      component.openEditDialog(ticket);
  
      // Assert
      dialogRef.componentInstance.reloadTickets.subscribe.calls.allArgs()[0][0](); // Trigger the subscribe method
  
      expect((component as any).dialog.open).toHaveBeenCalledTimes(1);
      expect(dialogRef.afterClosed).toHaveBeenCalledTimes(1);
      expect(dialogRef.componentInstance.reloadTickets.subscribe).toHaveBeenCalledTimes(1);
      expect((component as any).snackBar.open).toHaveBeenCalledTimes(1);
      expect((component as any).snackBar.open).toHaveBeenCalledWith('Ticket was successfully updated!', undefined, { duration: 2000 });
      expect((component as any).emitDataRefresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('openAddDialog()', () => {
    it('should open add dialog, confirm times called and proper snackbar message', () => {
      // Arrange
      const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'componentInstance']);
      dialogRef.afterClosed.and.returnValue(of(undefined));
      dialogRef.componentInstance = jasmine.createSpyObj('CreateTicketDialogComponent', ['reloadTickets']);
      dialogRef.componentInstance.reloadTickets = jasmine.createSpyObj(['subscribe']);

      (component as any).dialog = jasmine.createSpyObj('MatDialog', ['open']);
      (component as any).dialog.open.and.returnValue(dialogRef);
      
      (component as any).snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
      (component as any).snackBar.open.and.returnValue({});
      
      (component as any).emitDataRefresh = jasmine.createSpy();
      (component as any).emitDataRefresh.and.returnValue(Promise.resolve(true));

      // Act
      component.openAddDialog();

      // Assert
      dialogRef.componentInstance.reloadTickets.subscribe.calls.allArgs()[0][0]();

      expect((component as any).dialog.open).toHaveBeenCalledTimes(1);
      expect(dialogRef.afterClosed).toHaveBeenCalledTimes(1);
      expect(dialogRef.componentInstance.reloadTickets.subscribe).toHaveBeenCalledTimes(1);
      expect((component as any).snackBar.open).toHaveBeenCalledTimes(1);
      expect((component as any).snackBar.open).toHaveBeenCalledWith('Ticket was successfully created!', undefined, { duration: 2000 });
      expect((component as any).emitDataRefresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('openDeleteDialog()', () => {
    it('should open delete dialog, confirm times called and proper snackbar message', () => {
      // Arrange
      const ticket: ITicket = {
        id: 1,
        eventName: 'Test 1',
        description: 'Ticket Test 1',
        eventDate: '2024-08-10',
        ticketNumber: '2024081000001'
      };
      const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'componentInstance']);
      dialogRef.afterClosed.and.returnValue(of(undefined));
      dialogRef.componentInstance = jasmine.createSpyObj('DeleteTicketDialogComponent', ['reloadTickets']);
      dialogRef.componentInstance.reloadTickets = jasmine.createSpyObj(['subscribe']);

      (component as any).dialog = jasmine.createSpyObj('MatDialog', ['open']);
      (component as any).dialog.open.and.returnValue(dialogRef);

      (component as any).snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
      (component as any).snackBar.open.and.returnValue({});

      (component as any).emitDataRefresh = jasmine.createSpy();
      (component as any).emitDataRefresh.and.returnValue(Promise.resolve(true));

      // Act
      component.openDeleteDialog(ticket);

      // Assert
      dialogRef.componentInstance.reloadTickets.subscribe.calls.allArgs()[0][0]();

      expect((component as any).dialog.open).toHaveBeenCalledTimes(1);
      expect(dialogRef.afterClosed).toHaveBeenCalledTimes(1);
      expect(dialogRef.componentInstance.reloadTickets.subscribe).toHaveBeenCalledTimes(1);
      expect((component as any).snackBar.open).toHaveBeenCalledTimes(1);
      expect((component as any).snackBar.open).toHaveBeenCalledWith('Ticket was successfully deleted!', undefined, { duration: 2000 });
      expect((component as any).emitDataRefresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('emitDataRefresh()', () => {
    it('should emit data refresh and confirm times being called', () => {
      // Arrange
      (component as any).service = jasmine.createSpyObj('Service', ['clearTicketsBuffer']);
      (component as any).service.clearTicketsBuffer.and.returnValue(Promise.resolve(true));
      
      (component as any).mainComponent = jasmine.createSpyObj('MainComponent', ['onReloadData']);
      (component as any).mainComponent.onReloadData.and.returnValue(Promise.resolve(true));

      // Act
      component.emitDataRefresh();

      // Assert
      expect((component as any).service.clearTicketsBuffer).toHaveBeenCalledTimes(1);
      expect((component as any).mainComponent.onReloadData).toHaveBeenCalledTimes(1);
    });
  });

  describe('openSnackBar()', () => {
    it('should open snack bar, confirm times called and proper message sent', () => {
      // Arrange
      const message = 'Message';
      const action = 'Action';

      (component as any).snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
      (component as any).snackBar.open.and.returnValue({});
      
      // Act
      component.openSnackBar(message, action);
      
      // Assert
      expect((component as any).snackBar.open).toHaveBeenCalledTimes(1);
      expect((component as any).snackBar.open).toHaveBeenCalledWith(message, action, { duration: 2000 });
    });
  });
});
