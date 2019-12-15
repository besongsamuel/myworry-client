import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

        if(this.authService)
        {
            const authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${this.authService.token}`)
            });

            return next.handle(authReq);
        }
        else
        {
            return next.handle(req);
        }
    
  }
}