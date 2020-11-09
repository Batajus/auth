import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const jwt = localStorage.getItem('JWT');

        if (!jwt) {
            next.handle(req);
        }

        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${jwt}`)
        });
        return next.handle(authReq);
    }
}
