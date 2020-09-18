import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../auth/auth.service';

@Component({
    selector: 'administration-component',
    templateUrl: 'administration.component.html',
    styleUrls: ['administration.component.scss']
})
export class AdministrationComponent {
    user: User;

    constructor(private auth: AuthService, private router: Router) {}

    ngOnInit() {
        this.auth.ensureUserLoaded().subscribe((user) => {
            this.user = user;
        });
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['']);
    }
}
