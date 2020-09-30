import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'logout-component',
    template: ` <h1 mat-dialog-title>Logout</h1>
        <div mat-dialog-content>Are you sure you want to logout?</div>
        <div mat-dialog-actions>
            <button mat-button mat-dialog-close (click)="logout()">
                Logout
            </button>
            <button mat-button mat-dialog-close>Cancel</button>
        </div>`
})
export class LogoutComponent {
    constructor(private auth: AuthService, private router: Router) {}

    logout() {
        // setTimeout is required in this case, because due to the navigation
        // the modal wouldn't be closed correctly
        setTimeout(() => {
            this.auth.logout();
            this.router.navigate(['']);
        });
    }
}
