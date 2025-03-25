import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function dateFormatValidator(): ValidatorFn {
    return (control: AbstractControl<any, any>): ValidationErrors | null => {
        const patternRegex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/([0-9]{4})$/; // Pattern: MM/DD/YYYY
        if (control.value !== null) {
            const dateControl = new Date(control.value);
            const isValidDate = !isNaN(dateControl.getTime());

            if (isValidDate) {
                const dateValue = (dateControl.getMonth() + 1) + '/' + dateControl.getDate() + '/' + dateControl.getFullYear();
                const valid = patternRegex.test(dateValue);
    
                return valid ? null : { dateFormat: { value: control.value } };
            }
        }

        return { dateFormat: { value: control.value } };
    };
}
