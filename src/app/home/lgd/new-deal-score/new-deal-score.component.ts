import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {LgdService} from '../../../services/lgd.service';
import {LgdQuestion} from '../../../models/LgdQuestion';
import {LgdAnswer} from '../../../models/LgdAnswer';
import {BussinessUnit} from '../../../models/BussinessUnit';
import {Router} from '@angular/router';
import * as jsPDF from 'jspdf';
import {DealScore} from '../../../models/DealScore';
import {DialogService} from '../../../services/dialog.service';

@Component({
  selector: 'app-new-deal-score',
  templateUrl: './new-deal-score.component.html',
  styleUrls: ['./new-deal-score.component.css']
})
export class NewDealScoreComponent implements OnInit {
  @ViewChild('content') content: ElementRef;
  dealScoreQuestions:LgdQuestion[];
  dealScoreGroup:FormGroup;
  @Output() dealScoreGroupSubmitted = new EventEmitter<FormGroup>();
  modifiedLgd:number;
  adjustedLgd:number;
  detailedAnswersMap = new Map<number, {
    questionContent: string ,
    modifier: number ,
    answerContent:string ,
    answerScore:number,
    weight:number;
  }>();
  lgdOverride=false;
  lockForComittee=false;
  finalLgd;
  overrideLgd;

  constructor(public authService:AuthService,public lgdService:LgdService,private router:Router,private dialogService:DialogService) { }

  ngOnInit() {
    this.modifiedLgd = this.lgdService.dealScoreSubmittionDetials.baseLgd;
    this.adjustedLgd = this.modifiedLgd;

    this.dealScoreGroup = new FormGroup({});
    this.dealScoreGroup.addControl('questionsGroup',new FormGroup({}));
    for (const question of this.lgdService.dealScoreQuestions ) {
      (<FormGroup>this.dealScoreGroup.get('questionsGroup')).addControl('q' + question.id, new FormControl('', Validators.required));
    }
    this.dealScoreGroup.addControl('baseLgd', new FormControl(
      {value: this.lgdService.dealScoreSubmittionDetials.baseLgd,disabled:true}, Validators.required));
    this.dealScoreGroup.addControl('modifiedLgd', new FormControl({value:this.modifiedLgd,disabled:true}, Validators.required));
    this.dealScoreGroup.addControl('finalLgd', new FormControl({value:this.finalLgd,disabled:true}, Validators.required));
    this.dealScoreGroup.addControl('adjustedLgd', new FormControl({value:this.adjustedLgd,disabled:true}, Validators.required));
    this.dealScoreGroup.addControl('lgdOverride',new FormControl(null));
    this.dealScoreGroup.addControl('lockForComittee',new FormControl(null));


    this.dealScoreGroup.addControl('eadGroup',new FormGroup({
      'EAD' : new FormControl(null, Validators.required),
      'CashAndSec' : new FormControl(null, Validators.required)
    }));

    this.dealScoreGroup.addControl('overrideLgdGroup',new FormGroup({
      'overrideLgd': new FormControl(null),
      'overrideReason' : new FormControl('')
    }));

  }

  onCasdOrSecChange() {
    const ead = this.dealScoreGroup.get('eadGroup.EAD').value;
    const cash = this.dealScoreGroup.get('eadGroup.CashAndSec').value;
    if (ead > 0 && cash > 0){
      const calculateModifiedLgd = (1-(cash/ead)) * this.lgdService.dealScoreSubmittionDetials.baseLgd;
      calculateModifiedLgd > this.lgdService.minLgd
        ? this.modifiedLgd = +calculateModifiedLgd.toPrecision(4)
        : this.modifiedLgd = this.lgdService.minLgd;
      if (this.dealScoreGroup.get('questionsGroup').valid){
        this.calculateAdjustedLgd();
      }
    }
    else{
      if (ead > 0){
        this.modifiedLgd = this.lgdService.dealScoreSubmittionDetials.baseLgd;
      }
      // cash > 0 and ead not
      else{
        this.modifiedLgd = this.lgdService.minLgd;
      }
    }
  }

  updateAdjustedLgd(event:LgdAnswer,question:LgdQuestion){
    if(event){
      this.detailedAnswersMap.set(question.id,
        {
          questionContent: question.questionContent,
          modifier: question.modifier ,
          answerContent:event.answerContent ,
          answerScore:event.answerScore,
          weight:event.weight
        });
      if (this.dealScoreGroup.get('questionsGroup').valid){
        this.calculateAdjustedLgd();
        this.setFinalLgd(this.adjustedLgd);

      }
    }
  }

  private calculateAdjustedLgd() {
    let tempLgd=this.modifiedLgd;
    this.detailedAnswersMap.forEach((value => {
      tempLgd+=(value.modifier * value.weight / 1000);
    }));
    tempLgd <= this.lgdService.minLgd ? this.adjustedLgd = this.lgdService.minLgd : this.adjustedLgd = +tempLgd.toPrecision(4);
    this.setFinalLgd(this.adjustedLgd);
  }

  private setFinalLgd(tempLgd: number) {
    this.finalLgd = this.adjustedLgd;
  }

  onLgdOverride(){
    this.lgdOverride = !this.lgdOverride;
    this.lgdOverride ? this.finalLgd = this.overrideLgd : this.finalLgd = this.adjustedLgd;
    // set ot unset form validations
    if(!this.lgdOverride){
      this.dealScoreGroup.get('overrideLgdGroup.overrideLgd').clearValidators();
      this.dealScoreGroup.get('overrideLgdGroup.overrideLgd').updateValueAndValidity();
      this.dealScoreGroup.get('overrideLgdGroup.overrideReason').clearValidators();
      this.dealScoreGroup.get('overrideLgdGroup.overrideReason').updateValueAndValidity();
    }
    else{
      this.dealScoreGroup.get('overrideLgdGroup.overrideLgd').setValidators([Validators.required]);
      this.dealScoreGroup.get('overrideLgdGroup.overrideLgd').updateValueAndValidity();
      this.dealScoreGroup.get('overrideLgdGroup.overrideReason').setValidators([Validators.required]);
      this.dealScoreGroup.get('overrideLgdGroup.overrideReason').updateValueAndValidity();
    }
  }

  onOverrideLgdChange(){
    this.overrideLgd = this.dealScoreGroup.get('overrideLgdGroup.overrideLgd').value;
    this.finalLgd = this.overrideLgd;

  }

  updateLockCommittee(){
    this.lockForComittee=!this.lockForComittee;
  }

  onDealFormSubmit(){
    console.log(this.dealScoreGroup);

    const qa:{questionText:string,answerText:string} [] = [];
    this.detailedAnswersMap.forEach(
      (value) =>  {
        qa.push({
          questionText : value.questionContent,
          answerText : value.answerContent
        });
      });
    this.lgdService.dealScoreSubmittionDetials.qa = JSON.stringify(qa);

    this.lgdService.dealScoreSubmittionDetials.modifiedLgd = /*this.dealScoreGroup.get('modifiedLgd').value;*/this.modifiedLgd;
    this.lgdService.dealScoreSubmittionDetials.adjustedLgd = /*this.dealScoreGroup.get('adjustedLgd').value;*/this.adjustedLgd;
    this.lgdService.dealScoreSubmittionDetials.finalLgd = /*this.dealScoreGroup.get('finalLgd').value;*/this.finalLgd;

    this.lgdService.dealScoreSubmittionDetials.ead = this.dealScoreGroup.get('eadGroup.EAD').value;
    this.lgdService.dealScoreSubmittionDetials.cashAndSecurities = this.dealScoreGroup.get('eadGroup.CashAndSec').value;

    if(this.lgdOverride){
      this.lgdService.dealScoreSubmittionDetials.overrideLgd = this.dealScoreGroup.get('overrideLgdGroup.overrideLgd').value;
      this.lgdService.dealScoreSubmittionDetials.overrideReason = this.dealScoreGroup.get('overrideLgdGroup.overrideReason').value;
    }

    this.lgdService.dealScoreSubmittionDetials.formStatus = this.dealScoreGroup.get('lockForComittee').value  === true
      ? this.lgdService.dealScoreSubmittionDetials.committeeId.toString()
      : 'draft' ;

    console.log(this.lgdService.dealScoreSubmittionDetials);
    this.lgdService.submitLgd().subscribe(
      (response) => {
        console.log('Deal score submitted');
        this.dialogService.openDialog(
          'Deal score submitted successfully',
          '',
          'Download DealScore PDF',
          true,
          true),
        // this.downloadPdf();
        this.router.navigate(['/home']);
      }
      ,
      (error) => {
        console.log('Error fetching forms, error' + error);
      }
    );
    // If suceed then emit event
    this.dealScoreGroupSubmitted.emit(this.dealScoreGroup);
  }

}
