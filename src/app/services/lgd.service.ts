import { Injectable } from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {BussinessUnit} from '../models/BussinessUnit';
import {LgdQuestion} from '../models/LgdQuestion';
import {DealScore} from '../models/DealScore';
import {Borrower} from '../models/Borrower';

@Injectable()
export class LgdService {
  minLgd:number;
  units:BussinessUnit [];
  dealScoreQuestions: LgdQuestion[];
  dealScoreSubmittionDetials:DealScore = new DealScore();
  path = window.location.pathname === '' ? '/': window.location.pathname;
  // url = window.location.origin + this.path;
  url = 'http://localhost:8080/uspb/';

  constructor(private http:Http,private authService:AuthService,private router:Router){}

  getBussinessUnits() {
      return this.http.get(this.url+ 'lgd/getBussinessUnits',
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
    return this.http.get(this.url+ 'lgd/getLgdQuestions',
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
    return this.http.post(this.url + 'lgd/submit',this.dealScoreSubmittionDetials,
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
    return this.http.get(this.url + 'lgd/getSubmittedBorrowers',
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

  getExistingDealDetails(borrower:Borrower) {
    return this.http.get(this.url  +'lgd/getLastSubmittedFromByBorrower/' + borrower.borrowerId + '/' +borrower.borrowerName,
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

  getExistingDealDetailsWithLoan(borrower:Borrower,loanId:number) {
    return this.http.get(this.url  +'lgd/getLastSubmittedFromByBorrowerAndLoan/' +
      borrower.borrowerId + '/' + borrower.borrowerName + '/' + loanId,
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
