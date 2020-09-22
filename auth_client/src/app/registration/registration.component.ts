import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    Validators,
    FormBuilder,
    ValidationErrors,
    AbstractControl
} from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService, User } from '../auth/auth.service';
import { CustomValidators } from '../helper/Validators';

@Component({
    selector: 'registration-component',
    templateUrl: 'registration.component.html',
    styleUrls: ['../login/login.component.scss', 'registration.component.scss'],
    providers: [{provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}]
})
export class RegistrationComponent implements OnInit {
    formGroup: FormGroup;

    // Reference to the password form group, so it is easier to
    // access it from within the HTML
    pwFormGroup: FormGroup;

    // Boolean flag to show the password in the HTML
    hide = true;

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
        const newUser = new User(
            user.username,
            mail.email,
            user.passwords.password
        );

        return this.auth.register(newUser).subscribe((successful: boolean) => {
            if (!successful) {
                this.openSnackBar(
                    'The registration could not be completed. Please try again later',
                    3000
                );
                this.formGroup.reset();
                return;
            }

            this.openSnackBar("You've successfully created an account.");
            this.router.navigate(['administration']);
        });
    }

    private initFormGroups() {
        this.formGroup = this.fb.group({
            user: this.fb.group({
                username: ['', Validators.required],
                passwords: this.fb.group(
                    {
                        password: [
                            '',
                            Validators.compose([
                                Validators.required,
                                CustomValidators.passwordValidator
                            ])
                        ],
                        repeatedPassword: ['', Validators.required]
                    },
                    {
                        validators: CustomValidators.passwordEquality
                    }
                )
            }),
            mail: this.fb.group({
                email: ['', Validators.email]
            })
        });

        this.pwFormGroup = this.formGroup
            .get('user')
            .get('passwords') as FormGroup;
    }

    private openSnackBar(msg: string, duration = 1500) {
        this.snackBar.open(msg, null, {
            duration
        });
    }
}
