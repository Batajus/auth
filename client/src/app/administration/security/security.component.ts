import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService, User } from 'src/app/auth/auth.service';
import { CustomValidators } from 'src/app/helper/Validators';

@Component({
    selector: 'security-component',
    templateUrl: 'security.component.html',
    styleUrls: ['security.component.scss']
})
export class SecurityComponent implements OnInit {
    formGroup: FormGroup;

    passwordChangeInProgress = false;

    private user: User;

    constructor(
        private auth: AuthService,
        private fb: FormBuilder,
        private router: Router,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.auth.ensureUserLoaded().subscribe((user) => {
            if (!user) {
                this.router.navigate(['']);
            }

            this.user = user;
        });
        this.formGroup = this.fb.group(
            {
                password: new FormControl('', Validators.compose([Validators.required, CustomValidators.passwordValidator])),
                repeatedPassword: ['', Validators.required]
            },
            { validators: CustomValidators.passwordEquality }
        );
    }

    clear() {
        this.formGroup.reset();
    }

    submit() {
        // Workaround, so the fields inside of the passwords.component.ts are highlighted
        // https://github.com/udos86/ng-dynamic-forms/issues/987#issuecomment-515252454
        // TODO further investigation is required to find a better solution for this problem
        this.formGroup.markAllAsTouched();

        if (!this.formGroup.valid) {
            return;
        }

        this.passwordChangeInProgress = true;

        const formValue = this.formGroup.value;
        this.auth.changePassword(formValue.passwords.password).subscribe((successful) => {
            this.passwordChangeInProgress = false;

            if (!successful) {
                this.snackBar.open('The password change was unsusccessful. Please try again later.');
                return;
            }

            this.snackBar.open('Your password was changed successfully.');
            this.clear();
        });
    }
}
