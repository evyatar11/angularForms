import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import {catchError, map} from 'rxjs/operators';

import { Observable } from 'rxjs/Observable';
import {Auth} from '../models/Auth';
import {TokenResponse} from '../models/TokenResponse';
import {CookieService} from 'ngx-cookie';

@Injectable()
export class AuthService {
  serverSideAppName='uspb-1.0';
  constructor(private http: Http,private cookieService: CookieService ) {}

  authenticateUser(auth: Auth) {
    // const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('http://localhost:8080/'+ this.serverSideAppName + '/auth/authenticateUser', auth)
      .pipe(
        map(
          (response: Response) => {
            return response.json();
          }
        )
        ,catchError(
          (error: Response) => {
            return Observable.throw('Authentication failed');
          }
        )
      );
  }

  generateTokenForUser(username){
    // const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.get('http://localhost:8080/'+ this.serverSideAppName + '/auth/generateTokenForUser/' +username)
      .pipe(
        map(
          (response: Response) => {
            return response.json();
          }
        )
        ,catchError(
          (error: Response) => {
            return Observable.throw('Authentication failed');
          }
        )
      );
  }

  saveTokenInCookie(tokenResponse: TokenResponse) {
    this.cookieService.putObject('token',{ username : tokenResponse.username , token : tokenResponse.token});
  }

  checkTokenValidity(cookie: TokenResponse) {
    return this.http.post('http://localhost:8080/'+ this.serverSideAppName + '/auth/validateTokenForUser', cookie)
      .pipe(
        map(
          (response: Response) => {
            return response.json();
          }
        )
        ,catchError(
          (error: Response) => {
            return Observable.throw('Token validation failed');
          }
        )
      );
  }

  getTokenObject():TokenResponse{
    return (<TokenResponse>this.cookieService.getObject('token'));
  }

  getTokenHeaders():Headers{
    const tokenObj:TokenResponse = this.getTokenObject();
    return new Headers(
      { 'token': tokenObj.token,
        'username' : tokenObj.username
      });
  }

  getLoggedUser():string{
    const tokenObj:TokenResponse = this.getTokenObject();
    return tokenObj.username;
  }
}
