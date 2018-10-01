import { Component, OnInit } from '@angular/core';
import {LgdService} from '../../../services/lgd.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-existing-deal-score',
  templateUrl: './existing-deal-score.component.html',
  styleUrls: ['./existing-deal-score.component.css']
})
export class ExistingDealScoreComponent implements OnInit {

  constructor(private lgdService:LgdService,private router:Router) { }

  ngOnInit() {}

  routeToHomePage(){
    this.router.navigate(['/home']);
  }

  lockForCommitee(){
    return this.lgdService.existingDealData.formStatus === 'draft' ? false : true;
  }


}
