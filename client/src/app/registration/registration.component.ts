import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStep } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { AuthService, User } from '../auth/auth.service';
import { CustomValidators } from '../helper/Validators';

@Component({
    selector: 'registration-component',
    templateUrl: 'registration.component.html',
    styleUrls: ['../login/login.component.scss', 'registration.component.scss'],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true }
        }
    ]
})
export class RegistrationComponent implements OnInit {
    formGroup: FormGroup;

    @ViewChild('stepUsername')
    stepUsername: MatStep;

    @ViewChild('stepEmail')
    stepEmail: MatStep;

    @ViewChild('stepSubmit')
    stepSubmit: MatStep;

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
        const newUser = new User(user.username, mail.email, user.passwords.password);

        return this.auth.register(newUser).subscribe(
            () => {
                this.openSnackBar("You've successfully created an account.");
                this.router.navigate(['administration']);
            },
            (err: HttpErrorResponse) => {
                if (err.status !== 403) {
                    this.openSnackBar('The registration could not be completed. Please try again later', 3000);
                    
                    this.stepUsername.select();
                    this.stepUsername.reset();
                    this.stepEmail.reset();
                    this.stepSubmit.reset();

                    return;
                }

                if (err.error.username) {
                    this.formGroup.get('user').get('username').setErrors({ notUnique: true });
                    this.stepUsername.select();
                }

                if (err.error.email) {
                    this.formGroup.get('mail').get('email').setErrors({ notUnique: true });
                    if (!err.error.username) {
                        this.stepEmail.select();
                    }
                }

                if (err.error.username || err.error.email) {
                    this.stepSubmit.reset();
                }
            }
        );
    }

    private initFormGroups() {
        this.formGroup = this.fb.group({
            user: this.fb.group({
                username: new FormControl('', Validators.required),
                passwords: this.fb.group(
                    {
                        password: ['', Validators.compose([Validators.required, CustomValidators.passwordValidator])],
                        repeatedPassword: ['', Validators.required]
                    },
                    {
                        validators: CustomValidators.passwordEquality
                    }
                )
            }),
            mail: this.fb.group({
                email: ['', Validators.compose([Validators.required, Validators.email])]
            })
        });
    }

    private openSnackBar(msg: string, duration = 1500) {
        this.snackBar.open(msg, null, {
            duration
        });
    }
}
