import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService, UserModel } from '../modules/auth';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  authLocalStorageToken: any;
  UserInfo: UserModel;

  constructor(private _authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const user: any = sessionStorage.getItem('SessionLoginData');
    if(user){
    this.UserInfo = JSON.parse(user);
    const headerToken = this.UserInfo.Token;
      const req = request.clone({
        setHeaders: {
          Authorization: `Bearer ${headerToken}`
        }
      })      
      return next.handle(req).pipe(
        tap(data => {
          // this._JWTAccountService.ReadStatusCode(data.status);
        },
          error => {
            console.log(error);
            if (error.status === 401) {
              this._authService.RefreshToken();
            }
          }
        )
      )
    }
    return next.handle(request);
  }
}
