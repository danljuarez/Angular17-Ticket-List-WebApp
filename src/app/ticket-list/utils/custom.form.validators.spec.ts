import { FormControl, ValidatorFn } from '@angular/forms';
import { dateFormatValidator } from './custom.form.validators';

describe('dateFormatValidator', () => {
  let validator: ValidatorFn;

  beforeEach(() => {
    validator = dateFormatValidator();
  });

  it('should create an instance of dateFormatValidator', () => {
    expect(dateFormatValidator()).toBeTruthy();
  });

  it('should return null for a valid date', () => {
    // Arrange
    const control = new FormControl('02/28/2022');

    // Act
    const result = validator(control);
    
    // Assert
    expect(result).toBeNull();
  });

  it('should return an error for an invalid date', () => {
    // Arrange
    const control = new FormControl('02/28/202');

    // Act
    const result = validator(control);
    
    // Assert
    expect(result).toEqual({ dateFormat: { value: '02/28/202' } });
  });

  it('should return an error for an empty input', () => {
    // Arrange
    const control = new FormControl('');
    
    // Act
    const result = validator(control);
    
    // Assert
    expect(result).toEqual({ dateFormat: { value: '' } });
  });

  it('should return an error for a null input', () => {
    // Arrange
    const control = new FormControl(null);

    // Act
    const result = validator(control);

    // Assert
    expect(result).toEqual({ dateFormat: { value: null } });
  });
});
