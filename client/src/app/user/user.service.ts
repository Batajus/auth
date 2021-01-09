import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Feature } from '../models/Feature';
import { User } from '../models/User';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) {}

    activateFeature(user: User): Observable<void> {
        return this.http.post(`${this.url}/users/${user.id}/features`, user).pipe(map(() => null));
    }

    loadFeatureOfUser(user: User): Observable<Feature[]> {
        const params = new HttpParams().set('ids', user.features.join(','));

        return this.http
            .get<Feature[]>(`${this.url}/users/${user.id}/features`, { params })
            .pipe(
                map((rawFeatures) => {
                    return rawFeatures.map((f) => Object.assign(new Feature(), f));
                })
            );
    }

    get url(): string {
        return `${environment.protocol}://${environment.host}:${environment.port}`;
    }
}
