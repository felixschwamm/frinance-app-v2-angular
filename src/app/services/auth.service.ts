import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  redirectToLogin() {
    const redirectUri = window.location.href;
    window.location.href = 'https://finance-tracker-auth.auth.eu-central-1.amazoncognito.com/oauth2/authorize?client_id=40u3oh3d4dghv1fuq0usadauau&response_type=code&scope=email+openid+phone+profile&redirect_uri=' + redirectUri;
  }

}
