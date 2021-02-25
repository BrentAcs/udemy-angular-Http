import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log("Request is on its way");
    console.log(req);
    const modifiedRequest = req.clone(
      {
        headers: req.headers.append('Auth', 'whodaboss'),
      }
    );

    return next.handle(modifiedRequest);
  }
}
