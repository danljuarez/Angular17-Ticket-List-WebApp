/**
 * Validates a date string in the MM/DD/YYYY format.
 *
 * @param {string} value - The date string to validate.
 * @param {number} [minYear = 1900] - The minimum allowed year.
 * @param {number} [maxYear = 2100] - The maximum allowed year.
 * @param {boolean} [disallowPast = false] - Whether to disallow past dates.
 * @param {boolean} [disallowFuture = false] - Whether to disallow future dates.
 * @returns {{ [Key: string]: boolean } | null} - An error object or null if the date is valid.
 *
 * @description
 * This method checks if the provided date string is in the correct MM/DD/YYYY format and within the allowed year range.
 * It also checks if the date is in the past or future if the corresponding flags are set.
 */
export function validateDateInMMDDYYYYFormat(
    value: string,
    minYear: number = 1900,
    maxYear: number = 2100,
    disallowPast: boolean = false,
    disallowFuture: boolean = false
): { [Key: string]: boolean } | null {

    if (!value || value.length === 0) {
      return { required: true };
    }

    if (value.length > 10) {
      return { invalidDate: true };
    }

    const regex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/([0-9]{4})$/; // regex for MM-DD-YYYY format
    if (!regex.test(value)) {
      return { invalidDate: true };
    };

    const [monthStr, dayStr, yearStr] = value.split('/');
    const month = Number(monthStr);
    const day = Number(dayStr);
    const year = Number(yearStr);

    // Get current date object
    const date = new Date(year, month - 1, day);

    // Validate year range
    if (year < minYear || year > maxYear) {
      return { outOfRange: true };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight

    // Optional: Verify these toggle flags
    if (disallowPast && date < today) {
      return { pastDate: true };
    }
    if (disallowFuture && date > today) {
      return { futureDate: true };
    }

    return null;
}

const acceptedDateKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter', 'Shift', 'Home', 'End'];

/**
 * Prevents invalid keystrokes from being entered into a date input field.
 *
 * @param {KeyboardEvent} e - The keyboard event to check.
 * @description
 * This method checks if the pressed key is a valid date key that is either a digit, a forward slash,
 * or one of the accepted navigation keys and prevents other keys to be accepted.
 *
 * @example
 * document.addEventListener('keydown', preventInvalidKeystrokes);
 */
export function preventInvalidKeystrokes(e: KeyboardEvent): void {
    if (!isValidDateKey(e.key)) {
        e.preventDefault();
    }
  }

/**
 * Checks if a key is a valid date key.
 *
 * @param {string} key - The key to check.
 * @returns {boolean} - True if the key is a valid date key, false otherwise.
 * @description
 * A valid date key is either a digit, a forward slash, or one of the accepted navigation keys.
 *
 * @example
 * const isValid = isValidDateKey('1'); // true
 * const isValid = isValidDateKey('a'); // false
 */
function isValidDateKey(key: string): boolean {
    const validDateKeyRegex = /^[0-9/]+$/;
    return validDateKeyRegex.test(key) || acceptedDateKeys.includes(key);
}
