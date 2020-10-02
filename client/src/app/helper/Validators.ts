import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export class CustomValidators {
    static passwordEquality(fg: FormGroup): ValidationErrors {
        const password = fg.get('password').value;
        const repeatedPW = fg.get('repeatedPassword').value;

        if (password && password !== repeatedPW) {
            return { equality: true };
        }

        return null;
    }

    static passwordValidator(control: AbstractControl): ValidationErrors {
        const value: string = control.value;

        const errors: ValidationErrors = {};

        if (!value || value.length < 8) {
            errors.length = true;
        }

        if (!/(?=.*[A-Z])/g.test(value)) {
            errors.upperCase = true;
        }

        if (!/(?=.*[a-z])/g.test(value)) {
            errors.lowerCase = true;
        }

        if (!/(?=.*[0-9])/g.test(value)) {
            errors.number = true;
        }
        
        if (!/(?=.*[*.!@$%^&:;,.?~\+\-=])/g.test(value)) {
            errors.special = true;
        }

        if (!Object.keys(errors).length) {
            return null;
        }

        return errors;
    }
}
