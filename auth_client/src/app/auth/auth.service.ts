import { Injectable, ErrorHandler } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor() {}

    login(): Observable<boolean> {
        // TODO Implement server call
        return new Observable((s) => {
            //throw new Error('Test')
            setTimeout(() => {
                s.next(true);
            }, 200);
        });
    }
}
