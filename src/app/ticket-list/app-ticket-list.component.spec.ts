import { TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppTicketListComponent } from './app-ticket-list.component';
import { TICKET_LIST_ICONS } from './utils/constants';

describe('AppTicketListComponent', () => {
  let component: AppTicketListComponent;
  let iconRegistrySpy: jasmine.SpyObj<MatIconRegistry>;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppTicketListComponent],
      providers: [
        { provide: MatIconRegistry, useValue: jasmine.createSpyObj('MatIconRegistry', ['addSvgIcon']) },
        { provide: DomSanitizer, useValue: jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
  });

  beforeEach(() => {
    iconRegistrySpy = TestBed.inject(MatIconRegistry) as jasmine.SpyObj<MatIconRegistry>;
    sanitizerSpy = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
    const fixture = TestBed.createComponent(AppTicketListComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance of AppTicketListComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor()', () => {
    it('should call registerIcons on constructor', () => {
      // Arrange
      iconRegistrySpy.addSvgIcon.calls.reset(); // Reset the call count of addSvgIcon method
           
      // Act
      const fixture = TestBed.createComponent(AppTicketListComponent);
      component = fixture.componentInstance;
      
      // Assert
      expect(iconRegistrySpy.addSvgIcon).toHaveBeenCalledTimes(TICKET_LIST_ICONS.length);
    });
  });

  describe('registerIcons()', () => {
    it('should register each icon in the TICKET_LIST_ICONS array', () => {
      // Arrange
      iconRegistrySpy.addSvgIcon.calls.reset();

      // Act
      (component as any).registerIcons();
      
      // Assert
      expect(iconRegistrySpy.addSvgIcon).toHaveBeenCalledTimes(TICKET_LIST_ICONS.length);
    });

    it('should bypass security trust for each icon URL', () => {
      // Arrange
      sanitizerSpy.bypassSecurityTrustResourceUrl.calls.reset();
     
      // Act
      (component as any).registerIcons();
      
      // Assert
      expect(sanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledTimes(TICKET_LIST_ICONS.length);
    });
  });
});
