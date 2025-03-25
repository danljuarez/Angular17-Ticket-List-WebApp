import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppTicketListComponent } from './app-ticket-list.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MaterialModule } from '../shared/material.module';
import { TicketService } from './services/ticket.service';
import { TableComponent } from './components/main-content/table/table.component';
import { EditTicketDialogComponent } from './dialogs/edit-ticket-dialog/edit-ticket-dialog.component';
import { DeleteTicketDialogComponent } from './dialogs/delete-ticket-dialog/delete-ticket-dialog.component';
import { CreateTicketDialogComponent } from './dialogs/create-ticket-dialog/create-ticket-dialog.component';

const routes: Routes = [
  {
    path: '', component: AppTicketListComponent,
    children: [
      { path: ':link', component: MainContentComponent },
      { path: '', component: MainContentComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppTicketListComponent,
    MainContentComponent,
    SidenavComponent,
    ToolbarComponent,
    TableComponent,
    EditTicketDialogComponent,
    DeleteTicketDialogComponent,
    CreateTicketDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    TicketService
  ]
})
export class TicketListModule { }
