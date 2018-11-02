import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormService} from '../../services/form.service';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {MatVerticalStepper} from '@angular/material';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {
  formDetailsSubmitted;
  tabsSubmitted;
  @Output() stepperReset = new EventEmitter<boolean>();
  constructor(public formService: FormService,private router: Router,private authService:AuthService) {}

  ngOnInit() {
    this.formDetailsSubmitted = new FormGroup({});
    this.tabsSubmitted = new FormGroup({});
  }

  onDetailsFormSubmitted(event:FormGroup){
    this.formDetailsSubmitted = event;
  }

  onTabsSubmitted(event:FormGroup,stepper){
    this.tabsSubmitted = event;
  }

  navigateToHomePage(){
    this.router.navigate(['/']);
  }

  onFormSubmit(){
    this.formService.showSpinner=true;
    this.formService.submitForm(this.formService.formSubmission).subscribe(
      (formSubmitResponse) => {
        this.formService.submittedFormId = formSubmitResponse.id;
        // Block previous steps
        this.formService.isEditable= false;
        // Release spinner
        this.formService.showSpinner = false;
        this.router.navigate(['/']);
      }
      ,
      (error) => {
        console.log('error submitting form' + error);
      }
    );
  }

  resetStepper(stepper:MatVerticalStepper){
    // Reset stepper fields
    stepper.reset();
    // Generate a new value for loggedUserSource which will than get published to all subscribers.
    // (To get currently logged user auto populated to details component)
    this.formService.loggedUserSource.next(this.authService.getLoggedUser());
  }

}
