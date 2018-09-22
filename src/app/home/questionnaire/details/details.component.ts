import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../../../services/form.service';
import {Form} from '../../../models/Form';
import {TokenResponse} from '../../../models/TokenResponse';
import {SubmittedFormRawData} from '../../../models/SubmittedFormRawData';

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

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.formService.getForms().subscribe(
      (response) => {
        this.forms = response;
      }
      ,
      (error) => {
        console.log('Error fetching forms, error' + error);
      }
    );
    this.formDetailsGroup = new FormGroup({
      'officerName': new FormControl(null, Validators.required),// remove default value
      'borrowerId': new FormControl(null, Validators.required), // remove default value
      'borrowerRating': new FormControl(null,Validators.required), // remove default value
      'formId': new FormControl(null,Validators.required)
    });
    this.detailsFormSubmitted.emit(this.formDetailsGroup);
  }

  onDeailsFormSubmit(){
    console.log(this.formDetailsGroup);
    this.formService.selectedForm = this.forms.find(i => i.formId === this.formDetailsGroup.get('formId').value);
    this.detailsFormSubmitted.emit(this.formDetailsGroup);
    // Save form submission data
    this.formService.formSubmission.submittedFormRawData = new SubmittedFormRawData();
    this.formService.formSubmission.submittedFormRawData.qa = [];

    this.formService.formSubmission.accountOfficeName = this.formDetailsGroup.get('officerName').value;
    this.formService.formSubmission.customerName = this.formDetailsGroup.get('borrowerId').value;
    this.formService.formSubmission.borrowerRating = this.formDetailsGroup.get('borrowerRating').value;

    this.formService.formSubmission.submittedFormRawData.accountOfficeName = this.formService.formSubmission.accountOfficeName;
    this.formService.formSubmission.submittedFormRawData.customerName = this.formService.formSubmission.customerName
    this.formService.formSubmission.submittedFormRawData.borrowerRating = this.formService.formSubmission.borrowerRating

  }

}

