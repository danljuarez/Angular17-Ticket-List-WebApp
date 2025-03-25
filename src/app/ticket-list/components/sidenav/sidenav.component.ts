import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

import { NAV_ITEMS } from '../../utils/constants';
import { Subject, takeUntil } from 'rxjs';

const SMALL_WIDTH_BREAKPOINT = 780;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();
  public isScreenSmall: boolean;
  navItems = NAV_ITEMS;
    
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router) 
  { 
    this.isScreenSmall = false;
  }

  @ViewChild(MatSidenav) sidenav?: MatSidenav;

  ngOnInit(): void {
      this.breakpointObserver
        .observe([`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`])
        .pipe(takeUntil(this.destroyed$))
        .subscribe((state: BreakpointState) => {
          this.isScreenSmall = state.matches;
        });

      this.router.events.subscribe(() => {
        if (this.isScreenSmall) {
          this.sidenav?.close();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
