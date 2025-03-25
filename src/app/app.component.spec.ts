import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance of AppComponent', () => {
    expect(component).toBeTruthy();
  });

  it(`should have a title 'Angular17-Ticket-List-WebApp'`, () => {
    expect(component.title).toEqual('Angular17-Ticket-List-WebApp');
  });
});
