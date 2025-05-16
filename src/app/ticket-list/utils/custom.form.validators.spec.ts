import { validateDateInMMDDYYYYFormat } from './custom.form.validators';
import { preventInvalidKeystrokes } from './custom.form.validators';

describe('Custom Form Validators', () => {
  describe('validateDateInMMDDYYYYFormat()', () => {
    it('should return required error when empty value is provided', () => {
      // Arrange
      const value = '';

      // Act
      const result = validateDateInMMDDYYYYFormat(value);

      // Assert
      expect(result).toEqual({ required: true });
    });
    it('should return invalid date error when value length is greater than 10', () => {
      // Arrange
      const value = '12345678901';

      // Act
      const result = validateDateInMMDDYYYYFormat(value);

      // Arrange
      expect(result).toEqual({ invalidDate: true });
    });

    it('should return invalid date error when value provided is an invalid date format', () => {
      // Arrange
      const value = '1234567890';

      // Act
      const result = validateDateInMMDDYYYYFormat(value);

      // Arrange
      expect(result).toEqual({ invalidDate: true });
    });

    it('should return invalid date error when date value has an invalid month', () => {
      // Arrange
      const value = '13/01/2022';

      // Act
      const result = validateDateInMMDDYYYYFormat(value);

      // Assert
      expect(result).toEqual({ invalidDate: true });
    });

    it('should return invalid date error when date value has an invalid day', () => {
      // Arrange
      const value = '01/32/2022';

      // Act
      const result = validateDateInMMDDYYYYFormat(value);

      // Assert
      expect(result).toEqual({ invalidDate: true });
    });

    it('should return invalid date error when date value has an invalid year', () => {
      // Arrange
      const value = '01/32/20222';

      // Act
      const result = validateDateInMMDDYYYYFormat(value);

      // Assert
      expect(result).toEqual({ invalidDate: true });
    });

    it('should return out of range error when date value with year is less than minYear', () => {
      // Arrange
      const value = '01/01/1899';
      const minYear = 1900;

      // Act
      const result = validateDateInMMDDYYYYFormat(value, minYear);

      // Assert
      expect(result).toEqual({ outOfRange: true });
    });

    it('should return out of range error when date value with year is greater than maxYear', () => {
      // Arrange
      const value = '01/01/2101';
      const minYear = 1900;
      const maxYear = 2100;

      // Act
      const result = validateDateInMMDDYYYYFormat(value, minYear, maxYear);

      // Assert
      expect(result).toEqual({ outOfRange: true });
    });

    it('should return past date error when date value with disallowPast flag is set to true', () => {
      // Arrange
      const today = new Date();
      const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      const value = `${yesterday.getMonth() + 1}/${yesterday.getDate()}/${yesterday.getFullYear()}`;
      const minYear = 1900;
      const maxYear = 2100;
      const disallowPast = true;

      // Act
      const result = validateDateInMMDDYYYYFormat(value, minYear, maxYear, disallowPast);

      // Assert
      expect(result).toEqual({ pastDate: true });
    });

    it('should return future date error when date value with disallowFuture flag is set to true', () => {
      const today = new Date();
      const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      const value = `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}/${tomorrow.getFullYear()}`;
      const minYear = 1900;
      const maxYear = 2100;
      const disallowFuture = true;

      // Act
      const result = validateDateInMMDDYYYYFormat(value, minYear, maxYear, false, disallowFuture);

      // Assert
      expect(result).toEqual({ futureDate: true });
    });

    it('should return null when is a valid date', () => {
      // Arrange
      const value = '01/01/2022';

      // Act
      const result = validateDateInMMDDYYYYFormat(value);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('preventInvalidKeystrokes()', () => {
    it('should prevent invalid keystrokes when "a" key is provided', () => {
      // Arrange
      const event = new KeyboardEvent('keydown', { key: 'a' });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      // Act
      preventInvalidKeystrokes(event);

      // Assert
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    });
    it('should not prevent valid keystrokes when "1" key is provided', () => {
      // Arrange
      const event = new KeyboardEvent('keydown', { key: '1' });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      // Act
      preventInvalidKeystrokes(event);

      // Assert
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
    it('should not prevent accepted date keys when "Backspace" is provided', () => {
      // Arrange
      const event = new KeyboardEvent('keydown', { key: 'Backspace' });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      // Act
      preventInvalidKeystrokes(event);

      // Assert
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });
});