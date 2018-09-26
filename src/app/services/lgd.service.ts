import { Injectable } from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {BussinessUnit} from '../models/BussinessUnit';
import {LgdQuestion} from '../models/LgdQuestion';
import {DealScore} from '../models/DealScore';

@Injectable()
export class LgdService {
  serverSideAppName='uspb-1.0';
  minLgd:number;
  units:BussinessUnit [];
  dealScoreQuestions: LgdQuestion[];
  dealScoreSubmittionDetials:DealScore = new DealScore();
  constructor(private http:Http,private authService:AuthService,private router:Router){}

  getBussinessUnits() {
      return this.http.get('http://localhost:8080/'+ this.serverSideAppName + '/lgd/getBussinessUnits',
        {headers:this.authService.getTokenHeaders()})
        .pipe(
          map(
            (response: Response) => {
              return response.json();
            }
          )
          ,catchError(
            (error:Response) => {
              if(error.status === 401){
                this.router.navigate(['/login']);
              }
              return Observable.throw('Form fetch failed');
            }
          )
        );
    }

  getDealScoreQuestions() {
    return this.http.get('http://localhost:8080/' + this.serverSideAppName + '/lgd/getLgdQuestions',
      {headers:this.authService.getTokenHeaders()})
      .pipe(
        map(
          (response: Response) => {
            return response.json();
          }
        )
        ,catchError(
          (error:Response) => {
            if(error.status === 401){
              this.router.navigate(['/login']);
            }
            return Observable.throw('Form fetch failed');
          }
        )
      );
  }

  submitLgd(){
    return this.http.post('http://localhost:8080/' + this.serverSideAppName + '/lgd/submit',this.dealScoreSubmittionDetials,
      {headers:this.authService.getTokenHeaders()})
      .pipe(
        map(
          (response: Response) => {
            return response.json();
          }
        )
        ,catchError(
          (error:Response) => {
            if(error.status === 401){
              this.router.navigate(['/login']);
            }
            return Observable.throw('Score deal form submission failed');
          }
        )
      );
  }

  getSubmittedBorrowers() {
    return this.http.get('http://localhost:8080/'+ this.serverSideAppName + '/lgd/getSubmittedBorrowers',
      {headers:this.authService.getTokenHeaders()})
      .pipe(
        map(
          (response: Response) => {
            return response.json();
          }
        )
        ,catchError(
          (error:Response) => {
            if(error.status === 401){
              this.router.navigate(['/login']);
            }
            return Observable.throw('Form fetch failed');
          }
        )
      );
  }

  getBorrowerLoans(borrowerId){
    return this.http.get('http://localhost:8080/'+ this.serverSideAppName +'/lgd/getBorrowerLoans/' + borrowerId,
      {headers:this.authService.getTokenHeaders()})
      .pipe(
        map(
          (response: Response) => {
            return response.json();
          }
        )
        ,catchError(
          (error:Response) => {
            if(error.status === 401){
              this.router.navigate(['/login']);
            }
            return Observable.throw('Form fetch failed');
          }
        )
      );
  }

  getExistingDealDetails(borrowerId: number, loanId: number) {
    return this.http.get('http://localhost:8080/'+ this.serverSideAppName +'/lgd/getExistingDealDetails/' + borrowerId + '/' +loanId,
      {headers:this.authService.getTokenHeaders()})
      .pipe(
        map(
          (response: Response) => {
            return response.json();
          }
        )
        ,catchError(
          (error:Response) => {
            if(error.status === 401){
              this.router.navigate(['/login']);
            }
            return Observable.throw('Form fetch failed');
          }
        )
      );
  }
}
