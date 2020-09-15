import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'login-component',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
    formGroup: FormGroup;

    inLoginProcess: boolean;
    failedLogin: boolean;

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private snackBar: MatSnackBar,
        private router: Router
    ) {
        this.inLoginProcess = false;
        this.failedLogin = false;
    }

    ngOnInit() {
        this.formGroup = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    login() {
        if (!this.formGroup.valid) {
            return;
        }

        const values = this.formGroup.value;

        this.inLoginProcess = true;

        this.auth
            .login(values.username, values.password)
            .subscribe((successful) => {
                this.inLoginProcess = false;

                if (successful) {
                    this.snackBar.open("You're successfully logged in.", null, {
                        duration: 1500
                    });
                    // TODO Implement hook for others
                    return this.router.navigate(['administration']);
                }

                this.failedLogin = true;
            });
    }
}
