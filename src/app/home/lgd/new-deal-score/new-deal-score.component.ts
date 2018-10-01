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

  constructor(public authService:AuthService,public lgdService:LgdService,private router:Router) { }

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
        this.downloadPdf();
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

  downloadPdf(){
    const doc = new jsPDF('landscape');

    doc.setFont('courier', 'italic').setFontSize(10);

    doc.text('Rated By', 5, 10);
    doc.text(this.lgdService.dealScoreSubmittionDetials.ratedBy, 5, 15);

    doc.text('Date', 80, 10);

    const dd = this.lgdService.dealScoreSubmittionDetials.date.getDate();
    const mm = this.lgdService.dealScoreSubmittionDetials.date.getMonth()+1; // January is 0!
    const yyyy = this.lgdService.dealScoreSubmittionDetials.date.getFullYear();
    const today = dd+'/'+mm+'/'+yyyy;

    doc.text( today, 80, 15);

    doc.text('Borrower Id', 155, 10);
    doc.text(this.lgdService.dealScoreSubmittionDetials.borrowerId.toString(), 155, 15);

    doc.text('Borrower Name', 230, 10);
    doc.text( this.lgdService.dealScoreSubmittionDetials.borrowerName, 230, 15);

    doc.text('Lending Officer', 5, 25);
    doc.text(this.lgdService.dealScoreSubmittionDetials.lendingOfficer, 5, 30);

    doc.text('Committee Id', 80, 25);
    doc.text( this.lgdService.dealScoreSubmittionDetials.committeeId.toString(), 80, 30);

    doc.text('Bussiness Unit', 155, 25);
    doc.text(doc.splitTextToSize(this.lgdService.dealScoreSubmittionDetials.businessUnit, 60),155, 30);

    doc.text('Cross Collateralization', 230, 25);
    doc.text( this.lgdService.dealScoreSubmittionDetials.crossCollaterlized.toString(), 230, 30);

    let yXis = 40;
    let xXis = 5;
    const crossColl = this.lgdService.dealScoreSubmittionDetials.crossCollaterlized;

    if (!crossColl){
      doc.text('Loan Id', 5, yXis);
      doc.text(this.lgdService.dealScoreSubmittionDetials.loanId.toString(), 5, (yXis +5));

      doc.text('Loan Name', 80, yXis);
      doc.text( this.lgdService.dealScoreSubmittionDetials.loanName, 80, (yXis +5));

      xXis = 155;
    }

    doc.text('Currency', xXis, yXis);
    doc.text(this.lgdService.dealScoreSubmittionDetials.currency, xXis, (yXis +5));

    yXis += 15;

    doc.setFontSize(15);

    doc.line(5, (yXis-5), 290, (yXis-5)); // horizontal line
    doc.text('New Deal Score', 5, yXis);

    doc.text('Existing Deal Score', 145, yXis);
    doc.setLineWidth(0.1);
    doc.line(144, (yXis-5), 144, (yXis+150)); // vertical line

    doc.setFontSize(10);

    yXis+= 10;
    xXis = 5;

    this.createDealScore(doc,xXis,yXis,this.lgdService.dealScoreSubmittionDetials);

    xXis=145;

    this.createDealScore(doc,xXis,yXis,this.lgdService.existingDealData);

    doc.save( this.lgdService.dealScoreSubmittionDetials.ratedBy +
      '_' + this.lgdService.dealScoreSubmittionDetials.borrowerName + '_' +
      this.lgdService.dealScoreSubmittionDetials.borrowerId + '.pdf');
  }

  private createDealScore(doc:jsPDF,xXis:number,yXis:number,dealScore:DealScore){
    // Check if dealscore if empty (for existing scores)
    if (Object.keys(dealScore).length === 0){
      doc.text('No Existing deal score found for borrower', xXis, yXis);
    }
    else{
      doc.text('Base LGD', xXis, yXis);
      doc.text(dealScore.baseLgd.toString(), xXis, (yXis +5));

      doc.text('EAD', (xXis + 45), yXis);
      doc.text(dealScore.ead.toString(), (xXis + 45), (yXis +5));

      doc.text('Cash And Securities', (xXis + 85), yXis);
      doc.text( dealScore.cashAndSecurities.toString(), (xXis + 85), (yXis +5));

      yXis+= 15;

      doc.text('Modified LGD', xXis, yXis);
      doc.text(dealScore.modifiedLgd.toString(), xXis, (yXis +5));

      doc.text('Adjusted LGD', (xXis + 45), yXis);
      doc.text(dealScore.adjustedLgd.toString(), (xXis + 45), (yXis +5));

      doc.text('Final LGD', (xXis + 85), yXis);
      doc.text( dealScore.finalLgd.toString(), (xXis + 85), (yXis +5));

      yXis+= 20;

      doc.setFontSize(8);

      dealScore.qaArr = JSON.parse(dealScore.qa);

      doc.line(5, (yXis-5), 144, (yXis-5)); // vertical line

      doc.text(doc.splitTextToSize(dealScore.qaArr[0].questionText, 60), xXis, yXis);
      doc.text(doc.splitTextToSize(dealScore.qaArr[0].answerText, 60), xXis, (yXis +11));

      doc.text(doc.splitTextToSize(dealScore.qaArr[1].questionText,60), (xXis + 65), yXis);
      doc.text(doc.splitTextToSize(dealScore.qaArr[1].answerText, 60),(xXis + 65), (yXis +11));

      yXis+= 20;

      doc.line(5, (yXis-5), 144, (yXis-5)); // vertical line

      doc.text(doc.splitTextToSize(dealScore.qaArr[2].questionText, 60),xXis, yXis);
      doc.text(doc.splitTextToSize(dealScore.qaArr[2].answerText, 60),xXis, (yXis +11));

      doc.text(doc.splitTextToSize(dealScore.qaArr[3].questionText, 60), (xXis + 65), yXis);
      doc.text(doc.splitTextToSize(dealScore.qaArr[3].answerText, 60), (xXis + 65), (yXis +11));

      yXis+= 20;

      doc.line(5, (yXis-5), 144, (yXis-5)); // vertical line

      doc.text(doc.splitTextToSize(dealScore.qaArr[4].questionText, 60), xXis, yXis);
      doc.text(doc.splitTextToSize(dealScore.qaArr[4].answerText, 60), xXis, (yXis +11));

      doc.text(doc.splitTextToSize(dealScore.qaArr[5].questionText, 60), (xXis + 65), yXis);
      doc.text(doc.splitTextToSize(dealScore.qaArr[5].answerText, 60), (xXis + 65), (yXis +11));

      yXis+= 20;

      doc.line(5, (yXis-5), 144, (yXis-5)); // vertical line

      doc.text(doc.splitTextToSize(dealScore.qaArr[6].questionText, 60), xXis, yXis);
      doc.text(doc.splitTextToSize(dealScore.qaArr[6].answerText, 60), xXis, (yXis +11));

      yXis+= 20;
      doc.line(5, (yXis-5), 144, (yXis-5)); // vertical line

      doc.setFontSize(10);

      doc.text('Override LGD', xXis, yXis);
      doc.text('' + dealScore.overrideLgd, xXis, (yXis +5));

      doc.text('Override Reason', (xXis +65), yXis);
      doc.text('' + dealScore.overrideReason, (xXis +65), (yXis +5));

      yXis+= 15;

      doc.text('Lock For Committee', xXis, yXis);
      doc.text(dealScore.formStatus === 'draft' ? 'Draft' : dealScore.committeeId.toString(), xXis, (yXis +5));
    }
  }

}
