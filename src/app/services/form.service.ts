import { Injectable } from '@angular/core';
import {Form} from '../models/Form';
import {Http, Response} from '@angular/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FormSubmission} from '../models/FormSubmission';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Injectable()
export class FormService {
  currentTab = 'Home';
  selectedForm: Form;
  formProgress;
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

  constructor(private http:Http,private authService:AuthService,private router:Router){}

  getForms() {
    return this.http.get('http://localhost:8080/forms/getForms',
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

  submitForm(formToSubmit: FormSubmission){
    return this.http.post('http://localhost:8080/submittedForms/submitForm',formToSubmit,
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
    return this.http.delete('http://localhost:8080/submittedForms/deleteSubmittedFormById/'+this.submittedFormId,
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
    return this.http.get('http://localhost:8080/submittedForms/getSubmittedForms',
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

}
