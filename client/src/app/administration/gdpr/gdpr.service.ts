import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class GDPRService {
    constructor(private auth: AuthService, private http: HttpClient) {}

    /**
     * Deletes the complete user account with all its dependencies
     */
    deleteAccount(): Observable<boolean> {
        return this.auth.ensureUserLoaded().pipe(
            mergeMap((user) => {
                return this.http.delete(`${this.url}/users/${user.id}`).pipe(
                    map((res) => {
                        return true;
                    })
                );
            })
        );
    }

    get url(): string {
        return `${environment.protocol}://${environment.host}:${environment.port}`;
    }
}
