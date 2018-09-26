import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {LgdService} from '../../../services/lgd.service';
import {BussinessUnit} from '../../../models/BussinessUnit';
import {LgdQuestion} from '../../../models/LgdQuestion';

@Component({
  selector: 'app-new-rating',
  templateUrl: './new-rating.component.html',
  styleUrls: ['./new-rating.component.css']
})
export class NewRatingComponent implements OnInit {
  newRatingGroup:FormGroup;
  crossCollateralization=false;
  currencies:string[]= ['USD','EURO','ILS'];
  dateString;
  @Output() newRatingGroupSubmitted = new EventEmitter<FormGroup>();

  constructor(public authService:AuthService,public lgdService:LgdService) { }

  ngOnInit() {
    if(!this.lgdService.units){
      this.lgdService.getBussinessUnits().subscribe(
        (response:BussinessUnit[]) => {
          this.lgdService.units = response;
        }
        ,
        (error) => {
          console.log('Error fetching forms, error' + error);
        }
      );
    }
    if(!this.lgdService.dealScoreQuestions){
      this.lgdService.getDealScoreQuestions().subscribe(
        (response:LgdQuestion[]) => {
          this.lgdService.dealScoreQuestions = response;
        }
        ,
        (error) => {
          console.log('Error fetching forms, error' + error);
        }
      );
    }
    const date = new Date();
    this.dateString = date.toLocaleDateString() + ', ' + date.toLocaleTimeString();
    this.newRatingGroup = new FormGroup({
      'crossCollateralization': new FormControl(null),
      'crossCollaterlize' : new FormGroup({
        'loanId': new FormControl(null,Validators.required),
        'loanName':new FormControl(null,Validators.required)
      }),
      'ratedBy': new FormControl({value : this.authService.getLoggedUser(), disabled: true}, Validators.required),
      'borrowerId': new FormControl(null,Validators.required),
      'borrowerName': new FormControl(null,Validators.required),
      'lendingOfficer': new FormControl(null,Validators.required),
      'creditCommittee': new FormControl(null,Validators.required),
      'bussinessUnit': new FormControl(null,Validators.required),
      'date' : new FormControl({ value : this.dateString, disabled : true },Validators.required),
      'currency' : new FormControl(null,Validators.required)
    });
  }

  onCrossCollateral(){
    this.crossCollateralization=!this.crossCollateralization;
    // set ot unset form validations
    if(this.crossCollateralization){
      this.newRatingGroup.get('crossCollaterlize.loanId').clearValidators();
      this.newRatingGroup.get('crossCollaterlize.loanId').updateValueAndValidity();
      this.newRatingGroup.get('crossCollaterlize.loanName').clearValidators();
      this.newRatingGroup.get('crossCollaterlize.loanName').updateValueAndValidity();
    }
    else{
      this.newRatingGroup.get('crossCollaterlize.loanId').setValidators([Validators.required]);
      this.newRatingGroup.get('crossCollaterlize.loanId').updateValueAndValidity();
      this.newRatingGroup.get('crossCollaterlize.loanName').setValidators([Validators.required]);
      this.newRatingGroup.get('crossCollaterlize.loanName').updateValueAndValidity();
    }
}

  onDeailsFormSubmit(){
    console.log(this.newRatingGroup);
    this.setNewRatingFieldsForSubmission();
    // Emit submition event
    this.newRatingGroupSubmitted.emit(this.newRatingGroup);
  }

  updateBaseAndMinLgd(event:BussinessUnit){
    if(event){
      this.lgdService.dealScoreSubmittionDetials.baseLgd=event.baseLGD;
      this.lgdService.minLgd=event.minLGD;
    }
  }

  private setNewRatingFieldsForSubmission() {
    this.lgdService.dealScoreSubmittionDetials.borrowerId = this.newRatingGroup.get('borrowerId').value;
    this.lgdService.dealScoreSubmittionDetials.borrowerName = this.newRatingGroup.get('borrowerName').value;
    this.lgdService.dealScoreSubmittionDetials.ratedBy = this.newRatingGroup.get('ratedBy').value;
    this.lgdService.dealScoreSubmittionDetials.crossCollaterlized = this.crossCollateralization;
    this.lgdService.dealScoreSubmittionDetials.lendingOfficer = this.newRatingGroup.get('lendingOfficer').value;
    this.lgdService.dealScoreSubmittionDetials.committeeId = this.newRatingGroup.get('creditCommittee').value;
    this.lgdService.dealScoreSubmittionDetials.businessUnit = this.newRatingGroup.get('bussinessUnit').value.businessLine;
    this.lgdService.dealScoreSubmittionDetials.baseLgd = this.newRatingGroup.get('bussinessUnit').value.baseLGD;
    this.lgdService.dealScoreSubmittionDetials.date = new Date();
    this.lgdService.dealScoreSubmittionDetials.currency = this.newRatingGroup.get('currency').value;

    if (this.crossCollateralization){
      this.lgdService.dealScoreSubmittionDetials.loanId = this.newRatingGroup.get('crossCollaterlize.loanId').value;
      this.lgdService.dealScoreSubmittionDetials.loanName = this.newRatingGroup.get('crossCollaterlize.loanName').value;
    }
  }
}
