import { TestBed } from '@angular/core/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { SidenavComponent } from './sidenav.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;
  let routerSpy: any;
  let matSidenavSpy: jasmine.SpyObj<MatSidenav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidenavComponent, ToolbarComponent],
      providers: [
        { provide: BreakpointObserver, useValue: jasmine.createSpyObj('BreakpointObserver', ['observe']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['events']) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
  });

  beforeEach(() => {
    breakpointObserverSpy = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    routerSpy = TestBed.inject(Router);
    matSidenavSpy = jasmine.createSpyObj('MatSidenav', ['close', 'toggle']);
    
    const fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    component.sidenav = matSidenavSpy;

    breakpointObserverSpy.observe.and.returnValue(of({ 
      matches: true,
      breakpoints: { '(max-width: 780px)': true },
    } as unknown as BreakpointState));

    routerSpy.events = of();
  });

  it('should create an instance of SidenavComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor()', () => {
    it('should set isScreenSmall to false in the constructor', () => {
      // Act
      const component = new SidenavComponent(breakpointObserverSpy, routerSpy);
      
      // Assert
      expect(component.isScreenSmall).toBe(false);
    });
  });

  describe('ngOnInit()', () => {
    it('should observe the breakpoint and update the isScreenSmall property', () => {
      // Arrange
      const matches = true;
      breakpointObserverSpy.observe.calls.reset(); // Reset the call count of the observe method

      // Act
      component.ngOnInit();
      
      // Assert
      expect(breakpointObserverSpy.observe).toHaveBeenCalledTimes(1);
      expect(component.isScreenSmall).toBe(matches);
    });

    it('should subscribe to the router events and close the sidenav if the screen is small', () => {
      // Arrange
      const event = new Event('test');
      component.isScreenSmall = true;
      routerSpy.events = of(event);

      // Act
      component.ngOnInit();
      
      // Assert
      expect(matSidenavSpy.close).toHaveBeenCalledTimes(1);
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
