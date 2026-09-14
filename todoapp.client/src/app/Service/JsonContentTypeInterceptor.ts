import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";


export function JsonContentTypeInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

    let addJsonContentType = req.clone({
        headers: req.headers.set("Content-Type", `application/json`),
    })

    return next(addJsonContentType)
}
