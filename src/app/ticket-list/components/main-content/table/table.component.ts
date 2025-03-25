import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

import { ITicket } from '../../../models/ticket.interface.model';
import { EditTicketDialogComponent } from '../../../dialogs/edit-ticket-dialog/edit-ticket-dialog.component';
import { DeleteTicketDialogComponent } from '../../../dialogs/delete-ticket-dialog/delete-ticket-dialog.component';
import { TicketService } from '../../../services/ticket.service';
import { MainContentComponent } from '../main-content.component';
import { CreateTicketDialogComponent } from '../../../dialogs/create-ticket-dialog/create-ticket-dialog.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input() tickets?: ITicket[];

  isMobile = false;
  displayedColumns: string[] = ['id', 'eventName', 'description', 'eventDate', 'ticketNumber', 'actions'];
  dataSource!: MatTableDataSource<ITicket>;

  constructor(
    private dialog: MatDialog,
    private mainComponent: MainContentComponent,
    private snackBar: MatSnackBar,
    private service: TicketService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<ITicket>(this.tickets);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue?.trim().toLowerCase() ?? '';
  }

  openEditDialog(ticket: ITicket): void {
    const dialogRef = this.dialog.open(EditTicketDialogComponent, {
      width: '300px',
      disableClose: true,
      data: ticket
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        this.openSnackBar("Ticket was successfully updated!");
      }
    });

    dialogRef.componentInstance.reloadTickets.subscribe(() => {
      this.emitDataRefresh();
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(CreateTicketDialogComponent, {
        width: '300px',
        disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        this.openSnackBar("Ticket was successfully created!");
      }
    });

    dialogRef.componentInstance.reloadTickets.subscribe(() => {
      this.emitDataRefresh();
    });
  }

  openDeleteDialog(ticket: ITicket): void {
    const dialogRef = this.dialog.open(DeleteTicketDialogComponent, {
      width: '400px',
      disableClose: true,
      data: ticket
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        this.openSnackBar("Ticket was successfully deleted!");
      }
    });

    dialogRef.componentInstance.reloadTickets.subscribe(() => {
      this.emitDataRefresh();
    });
  }

  emitDataRefresh(): void {
    this.service.clearTicketsBuffer();
    this.mainComponent.onReloadData();
  }

  openSnackBar(message: string, action?: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, action, { duration: 2000 });
  }
}
