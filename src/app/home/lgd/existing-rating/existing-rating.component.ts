import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Http} from '@angular/http';
import {LgdService} from '../../../services/lgd.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Borrower} from '../../../models/Borrower';
import {DealScore} from '../../../models/DealScore';

@Component({
  selector: 'app-existing-rating',
  templateUrl: './existing-rating.component.html',
  styleUrls: ['./existing-rating.component.css']
})
export class ExistingRatingComponent implements OnInit {
  existingRatingGroup:FormGroup;
  @Output() existingDealScoreGroupSubmitted = new EventEmitter<DealScore>();
  borrowers:Borrower [];
  selectedBorrowerName:string;
  loans = [];
  showLoans = false;
  dealScore: DealScore;
  selectedLoanId;
  isDefaultBorrowerDeal = false;
  constructor(public http:Http,public lgdService:LgdService) { }

  ngOnInit() {
    this.dealScore = new DealScore();
    this.dealScore.qaArr = [];
    this.lgdService.getSubmittedBorrowers().subscribe(
      (value:Borrower[]) => {
        this.borrowers = value;
      });
    this.existingRatingGroup = new FormGroup({
      'borrowerName': new FormControl({value:'',disabled:true}),
      'borrowerId': new FormControl(null,Validators.required),
      'loans' : new FormGroup({
        'loanId': new FormControl(null)
      })
    });

  }

  onUpdateBorrowerId(event:Borrower){
    if (event){
      this.selectedBorrowerName = event.borrowerName;
      // Get loans for selected borrower
      this.lgdService.getBorrowerLoans(event).subscribe(
        (value:string[])=>{
          this.loans=value;
          // set ot unset form validations
          if(this.loans.length > 0 ){
            this.showLoans = true;
            this.existingRatingGroup.get('loans.loanId').setValidators([Validators.required]);
            this.existingRatingGroup.get('loans.loanId').updateValueAndValidity();
          }
          else{
            this.showLoans = false;
            this.existingRatingGroup.get('loans.loanId').clearValidators();
            this.existingRatingGroup.get('loans.loanId').updateValueAndValidity();
          }
        }
      );
    }
  }

  onExistingFormSubmit(){
    const borrower = this.existingRatingGroup.get('borrowerId').value;
    // Show done button
    this.lgdService.showExistingDoneButton = false;
    if (this.showLoans){
      if (this.isDefaultBorrowerDeal){
        this.getExistingDealScore(borrower);
      }
      else{
        this.getExistingDealScoreWithLoan(borrower);
      }
    }
    else{
      this.getExistingDealScore(borrower);
    }
  }

  private getExistingDealScore(borrower:Borrower){
    this.lgdService.getExistingDealDetails(borrower).subscribe(
      (value:DealScore) => {
        this.dealScore = value;
        // @ts-ignore
        this.dealScore.qaArr = JSON.parse(value.qa);
        // If suceed then emit event
        this.existingDealScoreGroupSubmitted.emit(this.dealScore);
      }
      ,(error) => {
        if (error.name === 'TypeError'){
          this.existingDealScoreGroupSubmitted.emit(new DealScore());
        }
      }
      );
  }

  private getExistingDealScoreWithLoan(borrower:Borrower){
    this.lgdService.getExistingDealDetailsWithLoan(borrower,this.selectedLoanId).subscribe(
      (value:DealScore) => {
        this.dealScore = value;
        // @ts-ignore
        this.dealScore.qaArr = JSON.parse(value.qa);
        // If suceed then emit event
        this.existingDealScoreGroupSubmitted.emit(this.dealScore);
      }
      ,(error) => {
        if (error.name === 'TypeError'){
          this.existingDealScoreGroupSubmitted.emit(new DealScore());
        }
      }
      );
  }


  onUpdateLoan(event){
    if (event){
      this.selectedLoanId = event;
    }
    else{
      // In case we deal with a borrower with loan submitted and no loans submitted
      this.selectedLoanId = 0;
    }

  }

  showLatestDealScore(){
    this.isDefaultBorrowerDeal = !this.isDefaultBorrowerDeal;
    if (this.isDefaultBorrowerDeal){
      this.existingRatingGroup.get('loans.loanId').clearValidators();
      this.existingRatingGroup.get('loans.loanId').disable();
      this.existingRatingGroup.get('loans.loanId').updateValueAndValidity();
    }
    else{
      this.existingRatingGroup.get('loans.loanId').setValidators([Validators.required]);
      this.existingRatingGroup.get('loans.loanId').enable();
      this.existingRatingGroup.get('loans.loanId').updateValueAndValidity();
    }
  }

}
