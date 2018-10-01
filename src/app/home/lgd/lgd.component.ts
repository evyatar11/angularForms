import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {DealScore} from '../../models/DealScore';
import {LgdService} from '../../services/lgd.service';

@Component({
  selector: 'app-lgd',
  templateUrl: './lgd.component.html',
  styleUrls: ['./lgd.component.css']
})
export class LgdComponent implements OnInit {
  lgdNewRatingGroup:FormGroup;
  lgdDealScoreGroup:FormGroup;
  newRating=false;
  existingRating=false;
  openNewDealScore=false;
  openExistingDealScore=false;
  constructor(private authService:AuthService,private lgdService:LgdService) { }

  ngOnInit() {
    this.lgdDealScoreGroup = new FormGroup({
      'EAD': new FormControl(null,Validators.required),
      'Base LGD': new FormControl({value : '45%',disabled:true},Validators.required),
      'cashAndSec': new FormControl(null,Validators.required),
    });
  }

  onNewRatingSubmitted(event){
      this.lgdNewRatingGroup = event;
      this.openNewDealScore = true;
  }

  onExistingDealScoreSubmitted(event:DealScore){
    this.lgdService.existingDealData = event;
    this.openExistingDealScore = true;
  }

}
