import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToolbarComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
  });
  
  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance of SidenavComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleSidenav()', () => {
    it('should emit an event when called', () => {
      // Arrange
      spyOn(component.toggleSidenav, 'emit');
      
      // Act
      component.toggleSidenav.emit();
      
      // Assert
      expect(component.toggleSidenav.emit).toHaveBeenCalledTimes(1);
    });
  });
});
