import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../../../services/form.service';
import {Form} from '../../../models/Form';
import {SubmittedFormRawData} from '../../../models/SubmittedFormRawData';
import {Router} from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  formDetailsGroup: FormGroup;
  @Output() detailsFormSubmitted = new EventEmitter<FormGroup>();
  forms: Form [] = [];
  ratings = [
    {value: 1}, {value: 2}, {value: 3},
    {value: 4}, {value: 5}, {value: 6},
    {value: 7}, {value: 8}, {value: 9}, {value: 10}
  ];
  loggedUser;
  // loggedUserSubscription;
  constructor(public formService: FormService,public router:Router) {}

  ngOnInit() {
    /// Get currently logged user and auto populate in the form
    this.formService.loggedUserObservable.subscribe(
      (value) => {
        this.loggedUser = value;
        if (this.formDetailsGroup){
          this.formDetailsGroup.get('officerName').setValue(this.loggedUser);
        }
      }
    );
    // Get forms complete details from DB
    this.formService.getForms().subscribe(
      (response) => {
        this.forms = response;
      }
    );
    // Create FormGroup ( Validation, track form state, etc.)
    this.formDetailsGroup = new FormGroup({
      'officerName': new FormControl({value : this.loggedUser, disabled: true}),
      'borrowerId': new FormControl(null, Validators.required),
      'borrowerRating': new FormControl(null,Validators.required),
      'formId': new FormControl(null,Validators.required)
    });
    this.detailsFormSubmitted.emit(this.formDetailsGroup);
  }

  onDeailsFormSubmit(){
    this.formService.selectedForm = this.forms.find(i => i.formId === this.formDetailsGroup.get('formId').value);
    this.detailsFormSubmitted.emit(this.formDetailsGroup);
    // Save form submission data
    this.formService.formSubmission.submittedFormRawData = new SubmittedFormRawData();
    this.formService.formSubmission.submittedFormRawData.qa = [];

    this.formService.formSubmission.accountOfficeName = this.formDetailsGroup.get('officerName').value;
    this.formService.formSubmission.customerName = this.formDetailsGroup.get('borrowerId').value;
    this.formService.formSubmission.borrowerRating = this.formDetailsGroup.get('borrowerRating').value;

    this.formService.formSubmission.submittedFormRawData.accountOfficeName = this.formService.formSubmission.accountOfficeName;
    this.formService.formSubmission.submittedFormRawData.customerName = this.formService.formSubmission.customerName;
    this.formService.formSubmission.submittedFormRawData.borrowerRating = this.formService.formSubmission.borrowerRating;
  }

}

