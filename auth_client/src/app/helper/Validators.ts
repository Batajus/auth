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
        // ^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|\]).{8,32}$
        return null;
    }
}
