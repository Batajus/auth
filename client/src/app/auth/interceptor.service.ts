import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class InterceptorService implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const jwt = localStorage.getItem('JWT');

        if (!jwt) {
            next.handle(req);
        }

        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${jwt}`)
        });

        return next.handle(authReq).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    localStorage.removeItem('JWT');
                    this.router.navigate(['']);
                }

                return throwError(err);
            })
        );
    }
}
