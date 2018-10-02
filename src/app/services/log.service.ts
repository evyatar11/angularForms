import { Injectable } from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {Http, Response} from '@angular/http';
import {Observable, pipe} from 'rxjs';

@Injectable()
export class LogService {
  path = window.location.pathname === '' ? '/': window.location.pathname;
  url = window.location.origin + this.path;
  // url = 'http://localhost:8080/uspb/';
  constructor(private http: Http) { }

  logSuccessfullyLogin(username: string) {
    this.http.get(this.url+'log/logSuccessfulLogin/' + username).subscribe();
  }

  logFailedLogin(username: string) {
    this.http.get(this.url+'log/logFailedLogin/' +username).subscribe();
  }
}
