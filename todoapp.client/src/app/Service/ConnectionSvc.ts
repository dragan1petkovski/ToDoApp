import { Injectable,inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"

@Injectable({
    providedIn: 'root'
})

export class ConnectionSvc {
    constructor(private http: HttpClient) { }
    GET<T>(url: string) {
        return this.http.get<T>(url)
    }

    POST<T>(url: string, data: string) {
        return this.http.post<T>(url, data)
    }

    PUT<T>(url: string, data: string) {
        return this.http.put<T>(url, data)
    }

    DELETE(url: string) {
        return this.http.delete(url)
    }

    PATCH(url: string, data: string) {
        return this.http.patch(url, data)
    }
}
