import { Component, OnInit } from '@angular/core';
import {LgdService} from '../../../services/lgd.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-existing-deal-score',
  templateUrl: './existing-deal-score.component.html',
  styleUrls: ['./existing-deal-score.component.css']
})
export class ExistingDealScoreComponent implements OnInit {

  constructor(public lgdService:LgdService,private router:Router) { }

  ngOnInit() {}

  routeToHomePage(){
    this.router.navigate(['/home']);
  }

  lockForCommitee(){
    if (this.lgdService.existingDealData.formStatus){
      return this.lgdService.existingDealData.formStatus === 'draft' ? false : true;
    }
    else{
      return false;
    }
  }


}

