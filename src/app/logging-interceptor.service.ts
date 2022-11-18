import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

export class LoggingInterceptorService implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Outgoing request');
        console.log(req.url);
        console.log(req.headers);
        return next.handle(req) // this return lets the request continue
        .pipe( // can also transform response data in the interceptor using pipes
            tap(event => {
                if(event.type === HttpEventType.Response){
                    console.log('Incoming response');
                    console.log(event.body);
                }
            })
        );
    }
}