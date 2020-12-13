import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Pipe({ name: 'rights' })
export class RightsPipe implements PipeTransform {
    constructor(private auth: AuthService) {}

    transform(requestedRight: string): Observable<boolean> {
        return this.auth.ensureUserLoaded().pipe(
            map((user) => {
                if (!user.roles) {
                    return false;
                }
                
                // TODO implement correct handling
                return user.roles.some((r) => r.name === 'admin');
            })
        );
    }
}
