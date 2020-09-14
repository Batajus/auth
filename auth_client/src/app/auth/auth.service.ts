import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private user: User;

    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<boolean> {
        return new Observable((s) => {
            return this.http
                .post(`${this.url}/login`, { username, password })
                .subscribe(
                    (response: { jwt: string }) => {
                        this.user = new User(username, response.jwt);
                        s.next(true);
                    },
                    (err) => {
                        console.error(err);
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
    constructor(public username: string, public jwt: string) {}
}
