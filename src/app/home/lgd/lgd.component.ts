import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DealScore} from '../../models/DealScore';
import {LgdService} from '../../services/lgd.service';

@Component({
  selector: 'app-lgd',
  templateUrl: './lgd.component.html',
  styleUrls: ['./lgd.component.css']
})
export class LgdComponent implements OnInit {
  newRating=false;
  existingRating=false;
  openNewDealScore=false;
  openExistingDealScore=false;
  constructor(private authService:AuthService,public lgdService:LgdService) { }

  ngOnInit() {}

  onNewRatingSubmitted(event){
      this.lgdService.lgdNewRatingGroup = event;
      this.openNewDealScore = true;
  }

  onExistingDealScoreSubmitted(event:DealScore){
    this.lgdService.existingDealData = event;
    this.openExistingDealScore = true;
  }

  onNewDealScoreSubmit(event){
    this.lgdService.lgdDealScoreGroup = event;
  }

  onRadioButtonChange(event){

  }

}
