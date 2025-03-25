import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TICKET_LIST_ICONS } from './utils/constants';

@Component({
  selector: 'app-ticket-list',
  template: `
    <app-sidenav></app-sidenav>
  `,
  styles: []
})
export class AppTicketListComponent {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) { 
    this.registerIcons();
  }
  
  private registerIcons() {
    TICKET_LIST_ICONS.forEach(icon => {
      this.iconRegistry.addSvgIcon(
        icon.name,
        this.sanitizer.bypassSecurityTrustResourceUrl(icon.url)
      );
    });
  }
}
