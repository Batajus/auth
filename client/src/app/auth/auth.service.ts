import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User, Role } from '../models/User';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public user: User;

    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<boolean> {
        return this.http
            .post(`${this.url}/auth/login`, {
                username,
                password
            })
            .pipe(
                map((response: User) => {
                    this.user = new User();
                    Object.assign(this.user, response);
                    this.user.roles = this.user.roles.map((r) => Object.assign(new Role(), r));

                    localStorage.setItem('UserID', this.user.id);
                    localStorage.setItem('JWT', this.user.jwt);
                    return true;
                }),
                catchError((err) => {
                    console.error(err);
                    return of(false);
                })
            );
    }

    logout() {
        localStorage.removeItem('UserID');
        localStorage.removeItem('JWT');
    }

    register(user: User): Observable<void> {
        return this.http
            .put(`${this.url}/auth/registration`, {
                username: user.username,
                email: user.email,
                password: user.password
            })
            .pipe(
                map((response: { id: string; jwt: string }) => {
                    this.user = user;
                    user.id = response.id;
                    user.jwt = response.jwt;

                    localStorage.setItem('UserID', this.user.id);
                    localStorage.setItem('JWT', this.user.jwt);
                })
            );
    }

    ensureUserLoaded(): Observable<User> {
        if (this.user) {
            return new Observable((s) => {
                s.next(this.user);
                s.complete();
            });
        }

        const id = localStorage.getItem('UserID');
        return this.http.get(`${this.url}/users/${id}`).pipe(
            map((user: User) => {
                this.user = Object.assign(new User(), user);
                return this.user;
            })
        );
    }

    changePassword(password: string): Observable<boolean> {
        return this.http.post(`${this.url}/users/${this.user.id}/change-password`, { password }).pipe(
            map(({ jwt }: { jwt: string }) => {
                this.user.jwt = jwt;
                localStorage.setItem('JWT', jwt);
                return true;
            })
        );
    }

    /**
     * This function is called by the auth-guard.service.ts
     * It verifies the current JWT for its validity
     */
    isAuthorized(): Observable<boolean> {
        const id = localStorage.getItem('UserID');

        const params = new HttpParams({ fromString: `id=${id}` });
        return this.http.get(`${this.url}/auth/re-authorization`, { params }).pipe(
            map((response: { jwt: string }) => {
                localStorage.setItem('JWT', response.jwt);
                return true;
            }),
            catchError((error: HttpErrorResponse) => {
                return of(false);
            })
        );
    }

    get url(): string {
        return `${environment.protocol}://${environment.host}:${environment.port}`;
    }
}
