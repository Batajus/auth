import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { User } from "../models/User";
import { LogoutComponent } from '../logout/logout.component';
import { NavigationObject } from './administration.api';

@Component({
    selector: 'administration-component',
    templateUrl: 'administration.component.html',
    styleUrls: ['administration.component.scss']
})
export class AdministrationComponent {
    user: User;

    navObjs: NavigationObject[];
    selectedNav: NavigationObject;

    constructor(private auth: AuthService, private router: Router, private dialog: MatDialog) {}

    ngOnInit() {
        this.initNavigation();

        this.auth.ensureUserLoaded().subscribe((user) => {
            this.user = user;
        });
    }

    logout() {
        this.dialog.open(LogoutComponent);
    }

    selected(navObj: NavigationObject) {
        this.selectedNav = navObj;
    }

    private initNavigation() {
        this.selectedNav = new NavigationObject('Features', 'features', 'view_module');
        this.navObjs = [
            this.selectedNav,
            new NavigationObject('Security', 'security', 'security'),
            // new NavigationObject('GDPR', 'gdpr')
        ];
    }
}


