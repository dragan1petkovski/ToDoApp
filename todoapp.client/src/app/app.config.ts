import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app-routing-module';


import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { JsonContentTypeInterceptor } from './Service/JsonContentTypeInterceptor';


export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes, withComponentInputBinding()), provideHttpClient(withFetch(), withInterceptors([JsonContentTypeInterceptor]))]
};
