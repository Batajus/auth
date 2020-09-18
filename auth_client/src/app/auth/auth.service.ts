import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private user: User;

    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<boolean> {
        return new Observable((s) => {
            return this.http
                .post(`${this.url}/login`, {
                    username,
                    password
                })
                .subscribe(
                    (response: User) => {
                        this.user = new User();
                        Object.assign(this.user, response);

                        localStorage.setItem('UserID', this.user.id);
                        localStorage.setItem('JWT', this.user.jwt);

                        s.next(true);
                    },
                    (err) => {
                        console.error(err);
                        s.next(false);
                    }
                );
        });
    }

    logout() {
        localStorage.removeItem('UserID');
        localStorage.removeItem('JWT');
    }

    register(user: User): Observable<boolean> {
        return new Observable((s) => {
            return this.http
                .post(`${this.url}/registration`, {
                    username: user.username,
                    email: user.email,
                    password: user.password
                })
                .subscribe(
                    (response: { id: string; jwt: string }) => {
                        this.user = user;
                        user.id = response.id;
                        user.jwt = response.jwt;

                        localStorage.setItem('UserID', this.user.id);
                        localStorage.setItem('JWT', this.user.jwt);
                    },
                    (err) => {
                        console.error(err);
                        s.next(false);
                    }
                );
        });
    }

    ensureUserLoaded(): Observable<User> {
        return new Observable((s) => {
            if (this.user) {
                return s.next(this.user);
            }

            const jwt = localStorage.getItem('JWT');
            const id = localStorage.getItem('UserID');

            const headers = new HttpHeaders({
                Authorization: `Bearer ${jwt}`
            });

            const params = new HttpParams({ fromString: `id=${id}` });

            return this.http
                .get(`${this.url}/user`, { headers, params })
                .subscribe(
                    (user: User) => {
                        this.user = Object.assign(new User(), user);
                        s.next(this.user);
                    },
                    (error) => {
                        if (error.status === 401) {
                            localStorage.removeItem('JWT');
                        }

                        s.next(null);
                    }
                );
        });
    }

    /**
     * This function is called by the auth-guard.service.ts
     * It verifies if the current JWT is still valid
     */
    isAuthorized(): Observable<boolean> {
        return new Observable((s) => {
            const jwt = localStorage.getItem('JWT');
            const id = localStorage.getItem('UserID');

            const headers = new HttpHeaders({
                Authorization: `Bearer ${jwt}`
            });

            const params = new HttpParams({ fromString: `id=${id}` });

            return this.http
                .get(`${this.url}/reauthorization`, { headers, params })
                .subscribe(
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
        public password: string = null
    ) {}
}
