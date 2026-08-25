import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    provideClientHydration(),
    provideHttpClient(),
    provideSweetAlert2({
      // Optional configuration
      fireOnInit: false,
      dismissOnDestroy: true,
    })
  ]
};
