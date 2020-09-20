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

    navObjs: NavigationObject[];
    selectedNav: NavigationObject;

    constructor(private auth: AuthService, private router: Router) {}

    ngOnInit() {
        this.initNavigation();

        this.auth.ensureUserLoaded().subscribe((user) => {
            this.user = user;
        });
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['']);
    }

    selected(navObj: NavigationObject) {
        this.selectedNav = navObj;
    }

    private initNavigation() {
        this.selectedNav = new NavigationObject('Features', 'features', true);
        this.navObjs = [
            this.selectedNav,
            new NavigationObject('Security', 'security'),
        ];
    }
}

class NavigationObject {
    constructor(public label: string, public link: string, public selected = false) {}
}

enum NavigationEnum {
    features,
    security,
    logout
}