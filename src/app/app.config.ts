import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideOAuthClient } from 'angular-oauth2-oidc';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authInterceptor } from './auth.interceptor';

function initializeOAuth(oauthService: OAuthService): Function {
  oauthService.configure({
    issuer: 'https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_6dDGdyCic',
    redirectUri: window.location.origin + '/index.html',
    clientId: '40u3oh3d4dghv1fuq0usadauau',
    responseType: 'code',
    scope: 'openid profile email',
    strictDiscoveryDocumentValidation: false,
    showDebugInformation: true, // Turn off in production,
    requireHttps: false, // Turn off in production
    logoutUrl: 'https://finance-tracker-auth.auth.eu-central-1.amazoncognito.com/logout?client_id=40u3oh3d4dghv1fuq0usadauau&logout_uri=' + window.location.origin + '/index.html',
  });
  return () => oauthService.loadDiscoveryDocumentAndLogin();
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptors([authInterceptor])), provideOAuthClient(), { provide: APP_INITIALIZER, useFactory: initializeOAuth, deps: [OAuthService], multi: true }],
};
