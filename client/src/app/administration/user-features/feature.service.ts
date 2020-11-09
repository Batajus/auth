import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Feature } from 'src/app/models/Feature';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FeatureService {
    constructor(private http: HttpClient) {}

    loadFeatures(): Observable<Feature[]> {
        return this.http.get(`${this.url}/features`).pipe(
            map((features: Feature[]) => {
                return features.map((f) => Object.assign(new Feature(), f));
            })
        );
    }

    get url(): string {
        return `${environment.protocol}://${environment.host}:${environment.port}`;
    }
}
