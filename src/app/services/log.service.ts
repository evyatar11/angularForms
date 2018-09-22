import { Injectable } from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {Http, Response} from '@angular/http';
import {Observable, pipe} from 'rxjs';

@Injectable()
export class LogService {

  constructor(private http: Http) { }

  logSuccessfullyLogin(username: string) {
    this.http.get('http://localhost:8080/log/logSuccessfulLogin/' + username).subscribe();
  }

  logFailedLogin(username: string) {
    this.http.get('http://localhost:8080/log/logFailedLogin/' +username).subscribe();
  }
}
