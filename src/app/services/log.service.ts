import { Injectable } from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {Http, Response} from '@angular/http';
import {Observable, pipe} from 'rxjs';

@Injectable()
export class LogService {
  serverSideAppName='uspb-1.0';
  constructor(private http: Http) { }

  logSuccessfullyLogin(username: string) {
    this.http.get('http://localhost:8080/'+ this.serverSideAppName +'/log/logSuccessfulLogin/' + username).subscribe();
  }

  logFailedLogin(username: string) {
    this.http.get('http://localhost:8080/'+ this.serverSideAppName +'/log/logFailedLogin/' +username).subscribe();
  }
}
