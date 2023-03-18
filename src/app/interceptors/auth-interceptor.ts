import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NbAuthService, NbAuthToken } from '@nebular/auth';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  authPrefix: string = 'Bearer';
  constructor(private authService: NbAuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth-token to http-header if available
    return this.authService.getToken().pipe(
      switchMap((token: NbAuthToken) => {
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `${this.authPrefix} ${token.getValue()}`,
            },
          });
        }
        return next.handle(request);
      }),
    );
  }

  errorHandle(error: HttpErrorResponse) {
    if (error.status === 401) {
      location.assign('/login');
    }
    return throwError(error.message);
  }
}
