import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import {LgdService} from '../../../services/lgd.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Borrower} from '../../../models/Borrower';

@Component({
  selector: 'app-existing-rating',
  templateUrl: './existing-rating.component.html',
  styleUrls: ['./existing-rating.component.css']
})
export class ExistingRatingComponent implements OnInit {
  existingRatingGroup:FormGroup;
  borrowers:Borrower [];
  selectedBorrowerName:string;
  loans = [];
  constructor(public http:Http,public lgdService:LgdService) { }

  ngOnInit() {
    this.lgdService.getSubmittedBorrowers().subscribe(
      (value:Borrower[]) => {
        this.borrowers = value;
      });
    this.existingRatingGroup = new FormGroup({
      'borrowerName': new FormControl({disabled:true}),
      'borrowerId': new FormControl('',Validators.required),
      'loanId': new FormControl(null,Validators.required)
    });

  }

  onUpdateBorrowerId(event:Borrower){
    this.lgdService.getBorrowerLoans(event.borrowerId).subscribe(
      (value:number []) => {
        if(value.length > 0){
          this.loans = value;
        }
      });
    this.selectedBorrowerName = event.borrowerName;
  }

  onExistingFormSubmit(){
    const borrowerId = this.existingRatingGroup.get('borrowerId').value;
    const loanId = this.existingRatingGroup.get('loanId').value;
    this.lgdService.getExistingDealDetails(borrowerId,loanId).subscribe(
      (value:number []) => {
        if(value.length > 0){
          this.loans = value;
        }
      });
  }

}
