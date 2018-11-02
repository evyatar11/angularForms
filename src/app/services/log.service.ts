import { Injectable } from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class LogService {
  baseUrl:string;
  constructor(private http: Http) {
    this.baseUrl = window.location.pathname === '' ? '/': window.location.pathname;
  }

  logSuccessfullyLogin(username: string) {
    this.http.get(this.baseUrl+'log/logSuccessfulLogin/' + username).subscribe();
  }

  logFailedLogin(username: string) {
    this.http.get(this.baseUrl+'log/logFailedLogin/' +username).subscribe();
  }
}
