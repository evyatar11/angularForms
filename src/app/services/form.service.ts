import {EventEmitter, Injectable, Output} from '@angular/core';
import {Form} from '../models/Form';
import {Http, Response} from '@angular/http';
import {catchError, map, shareReplay} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {FormSubmission} from '../models/FormSubmission';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Injectable()
export class FormService {
  currentTab = 'Home';
  baseUrl:string;
  selectedForm: Form;
  formProgress;
  showSpinner = false;
  formSubmission:FormSubmission = new FormSubmission();

  detailedAnswersMap = new Map<number, {
    questionText: string ,
    answerText: string ,
    categoryWeight: number ,
    questionWeight:number ,
    answerScore:number ,
    effectiveScore:number
  }>();
  showTableAndGraph = false;
  tableData = [];
  pdScore = 0;
  submittedFormId: number;
  isEditable = true;
  formsCache:Observable<any>;
  // Observable navItem source
  loggedUserSource;
  // Observable navItem stream
  loggedUserObservable;

  constructor(private http:Http,private authService:AuthService,
              private router:Router){
    this.baseUrl = window.location.pathname === '' ? '/': window.location.pathname;
    this.loggedUserSource = new BehaviorSubject<string>(this.authService.getLoggedUser());
    this.loggedUserObservable = this.loggedUserSource.asObservable();
  }

  getForms() {
    if(!this.formsCache){
      this.formsCache = this.http.get(this.baseUrl + 'forms/getForms',
        {headers:this.authService.getTokenHeaders()})
        .pipe(
          map(
            (response: Response) => {
              return response.json();
            }))
        .pipe(
          shareReplay(1)
             )
        .pipe(
          catchError(
        (error:Response) => {
          if(error.status === 401){
            this.router.navigate(['/login']);
          }
          return Observable.throw('Form fetch failed');
        }
      )
        );
    }
    return this.formsCache;
  }

  submitForm(formToSubmit: FormSubmission){
    return this.http.post(this.baseUrl +'submittedForms/submitForm',formToSubmit,
      {headers:this.authService.getTokenHeaders()})
      .pipe(
        map(
          (response: Response) => {
            return response.json();
          }
        )
        ,catchError(
          (error: Response) => {
            if(error.status === 401){
              this.router.navigate(['/login']);
            }
            return Observable.throw('Submission failed');
          }
        )
      );
  }

  deleteForm(){
    return this.http.delete(this.baseUrl + 'submittedForms/deleteSubmittedFormById/'+ this.submittedFormId,
      {headers:this.authService.getTokenHeaders()}
  ).pipe(
      catchError(
        (error: Response) => {
          if(error.status === 401){
            this.router.navigate(['/login']);
          }
          return Observable.throw('Submission failed');
        }
      )
    );
  }

  getSubmittedForms() {
    return this.http.get(this.baseUrl +'submittedForms/getSubmittedForms',
      {headers:this.authService.getTokenHeaders()})
      .pipe(
        map(
          (response: Response) => {
            return response.json();
          }
        )
        ,catchError(
          (error: Response) => {
            if(error.status === 401){
              this.router.navigate(['/login']);
            }
            return Observable.throw('Form fetch failed');
          }
        )
      );
  }

  onNavigation(destinationComponentName){
    this.currentTab = destinationComponentName;
  }

  saveFormState(formState) {
    this.formProgress = formState;
  }

  getUpdatedPdAndRatingByScore(score:number){
    return this.http.get(this.baseUrl +'submittedForms/getUpdatedPdAndRating/' +score ,
      {headers:this.authService.getTokenHeaders()})
      .pipe(
        map(
          (response: Response) => {
            return response.json();
          }
        )
        ,catchError(
          (error: Response) => {
            if(error.status === 401){
              this.router.navigate(['/login']);
            }
            return Observable.throw('Form fetch failed');
          }
        )
      );
  }

}
