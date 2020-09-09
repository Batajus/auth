import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
    selector: 'login-component',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {

    formGroup: FormGroup;

    inLoginProcess: boolean;
    failedLogin: boolean;

    constructor(private fb: FormBuilder, private auth: AuthService, private snackBar: MatSnackBar) {
        this.inLoginProcess = false;
        this.failedLogin = false;
    }

    ngOnInit() {
        this.formGroup = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        })
    }

    login() {
        if (!this.formGroup.valid) {
            return;
        }

        this.inLoginProcess = true;

        this.auth.login().subscribe((successful) => {
            this.inLoginProcess = false;

            if (successful) {
                this.snackBar.open('You\'re successfully logged in.', null, { duration: 1500 });
                // TODO Implement hook for others
                return;
            }

            this.failedLogin = true;
        });

    }

}