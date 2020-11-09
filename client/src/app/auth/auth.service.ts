import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
                    this.user.roles = this.user.roles.map(r => Object.assign(new Role(), r));

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
            .post(`${this.url}/auth/registration`, {
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
                s.unsubscribe();
            });
        }

        const jwt = localStorage.getItem('JWT');
        const id = localStorage.getItem('UserID');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${jwt}`
        });

        return this.http.get(`${this.url}/users/${id}`, { headers }).pipe(
            map((user: User) => {
                this.user = Object.assign(new User(), user);
                return this.user;
            })
        );
    }

    changePassword(password: string): Observable<boolean> {
        const jwt = localStorage.getItem('JWT');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${jwt}`
        });

        return this.http.put(`${this.url}/users/${this.user.id}/change-password`, { password }, { headers }).pipe(
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
        return new Observable((s) => {
            const jwt = localStorage.getItem('JWT');
            const id = localStorage.getItem('UserID');

            const headers = new HttpHeaders({
                Authorization: `Bearer ${jwt}`
            });

            const params = new HttpParams({ fromString: `id=${id}` });

            return this.http.get(`${this.url}/auth/re-authorization`, { headers, params }).subscribe(
                (response: { jwt: string }) => {
                    localStorage.setItem('JWT', response.jwt);
                    s.next(true);
                },
                (error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        localStorage.removeItem('JWT');
                    }

                    s.next(false);
                }
            );
        });
    }

    get url(): string {
        return `http://${environment.host}:${environment.port}`;
    }
}

export class User {
    id: string;
    jwt: string;
    constructor(
        public username: string = null,
        public email: string = null,
        public password: string = null,
        public roles: Role[] = []
    ) {}
}

export class Role {
    constructor(public name: string = null) {}
}
