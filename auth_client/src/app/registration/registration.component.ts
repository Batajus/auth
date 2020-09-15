import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    Validators,
    FormBuilder,
    ValidationErrors,
    AbstractControl
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService, User } from '../auth/auth.service';

@Component({
    selector: 'registration-component',
    templateUrl: 'registration.component.html',
    styleUrls: ['../login/login.component.scss', 'registration.component.scss']
})
export class RegistrationComponent implements OnInit {
    formGroup: FormGroup;

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private snackBar: MatSnackBar,
        private router: Router
    ) {}

    ngOnInit() {
        this.initFormGroups();
    }

    submit() {
        if (!this.formGroup.valid) {
            return;
        }

        const { user, mail } = this.formGroup.value;
        const newUser = new User(user.username, mail.email, user.password);

        return this.auth.register(newUser).subscribe((successful: boolean) => {
            if (!successful) {
                // TODO Do something useful
                return;
            }

            this.snackBar.open(
                "You've successfully created an account.",
                null,
                {
                    duration: 1500
                }
            );

            this.router.navigate(['administration']);
        });
    }

    private initFormGroups() {
        this.formGroup = this.fb.group({
            user: this.fb.group({
                username: ['', Validators.required],
                password: [
                    '',
                    Validators.compose([
                        Validators.required,
                        this.passwordValidator
                    ])
                ],
                repeatedPassword: [
                    '',
                    Validators.compose([Validators.required])
                ]
            }),
            mail: this.fb.group({
                email: ['', Validators.email]
            })
        });
    }

    private passwordValidator(
        control: AbstractControl
    ): ValidationErrors | null {
        // ^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|\]).{8,32}$

        return null;
    }

    private passwordEqualityValidator(
        controls: AbstractControl
    ): ValidationErrors | null {
        return null;
    }
}
