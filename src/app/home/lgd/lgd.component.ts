import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-lgd',
  templateUrl: './lgd.component.html',
  styleUrls: ['./lgd.component.css']
})
export class LgdComponent implements OnInit {
  lgdDetailsGroup:FormGroup;
  lgdDealScoreGroup:FormGroup;
  crossCollateralization=false;
  radioPressed=false;
  newRating=false;
  existingRating=false;
  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.lgdDetailsGroup = new FormGroup({
      'rating' : new FormGroup({
        'startNew' : new FormControl(null,Validators.required),
        'viewExisting' : new FormControl(null,Validators.required)
      }),
      'crossCollateralization': new FormControl(null),
      'crossCollaterlize' : new FormGroup({
        'loanId': new FormControl(null,Validators.required),
        'loanName':new FormControl(null,Validators.required)
      }),
      'ratedBy': new FormControl({value : this.authService.getLoggedUser(), disabled: true}, Validators.required),
      'borrowerId': new FormControl(null,Validators.required),
      'borrowerName': new FormControl(null,Validators.required),



    });
    this.lgdDealScoreGroup = new FormGroup({
      'EAD': new FormControl(null,Validators.required),
      'Base LGD': new FormControl({value : '45%',disabled:true},Validators.required),
      'cashAndSec': new FormControl(null,Validators.required),
    });

  }

}
