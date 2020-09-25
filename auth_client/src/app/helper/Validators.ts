import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../auth/auth.service';

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

    static checkForUniqueUsername(http: HttpClient, user: User): AsyncValidatorFn {
        return (control: AbstractControl) => {
            const body: { username: string; id?: string } = { username: control.value };
            if (user) {
                body.id = user.id;
            }
            return timer(300).pipe(
                switchMap(() => http.post(`http://${environment.host}:${environment.port}/checkUsername`, body)),
                map((response: { user: boolean }) => (response.user ? response : null))
            );
        };
    }
}
