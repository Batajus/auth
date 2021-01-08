import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/User';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GDPRService {
    private user: User;

    constructor(private auth: AuthService, private http: HttpClient) {
        const subs = this.auth.ensureUserLoaded().subscribe((user) => {
            this.user = user;
            subs.unsubscribe();
        });
    }

    /**
     * Deletes the complete user account with all its dependencies
     */
    deleteAccount(): Observable<boolean> {
        return this.http.delete(`${this.url}/users/${this.user.id}`).pipe(
            map((res) => {
                return true;
            })
        );
    }

    get url(): string {
        return `${environment.protocol}://${environment.host}:${environment.port}`;
    }
}
