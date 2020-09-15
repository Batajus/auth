import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot
} from '@angular/router';

@Injectable({
    'providedIn': 'root'
})
export class AuthGuardService implements CanActivate {
    constructor(private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const jwt: string = localStorage.getItem('JWT');
        if (!jwt) {
            this.router.navigate(['']);
            return false;
        }

        return true;
    }
}
