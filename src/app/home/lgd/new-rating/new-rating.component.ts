import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-new-rating',
  templateUrl: './new-rating.component.html',
  styleUrls: ['./new-rating.component.css']
})
export class NewRatingComponent implements OnInit {
  newRatingGroup:FormGroup;
  crossCollateralization=false;
  constructor(public authService:AuthService) { }

  ngOnInit() {
    this.newRatingGroup = new FormGroup({
      'crossCollateralization': new FormControl(null),
      'crossCollaterlize' : new FormGroup({
        'loanId': new FormControl(null,Validators.required),
        'loanName':new FormControl(null,Validators.required)
      }),
      'ratedBy': new FormControl({value : this.authService.getLoggedUser(), disabled: true}, Validators.required),
      'borrowerId': new FormControl(null,Validators.required),
      'borrowerName': new FormControl(null,Validators.required),



    });
  }

}
