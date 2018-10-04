import { Component, OnInit } from '@angular/core';
import {DialogdataService} from '../services/dialogdata.service';
import * as jsPDF from 'jspdf';
import {DealScore} from '../models/DealScore';
import {LgdService} from '../services/lgd.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor(public dialogDataService:DialogdataService,public lgdService:LgdService) { }

  ngOnInit() {
  }

  checkPdfDownload(){
      if (this.dialogDataService.pdfDownload){
        this.downloadPdf();
      }
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
      doc.text('No Existing deal score found for borrower', xXis+2, yXis);
    }
    else{
      doc.text('Base LGD', xXis, yXis);
      doc.text(dealScore.baseLgd.toString()+ '%', xXis, (yXis +5));

      doc.text('EAD', (xXis + 45), yXis);
      doc.text(dealScore.ead.toString(), (xXis + 45), (yXis +5));

      doc.text('Cash And Securities', (xXis + 85), yXis);
      doc.text( dealScore.cashAndSecurities.toString(), (xXis + 85), (yXis +5));

      yXis+= 15;

      doc.text('Modified LGD', xXis, yXis);
      doc.text(dealScore.modifiedLgd.toString()+ '%', xXis, (yXis +5));

      doc.text('Adjusted LGD', (xXis + 45), yXis);
      doc.text(dealScore.adjustedLgd.toString()+ '%', (xXis + 45), (yXis +5));

      doc.setFontSize(11);
      doc.setFontType('bold');
      doc.text('Final LGD', (xXis + 85), yXis);
      doc.text( dealScore.finalLgd.toString()+ '%', (xXis + 85), (yXis +5));
      doc.setFontType('normal');

      yXis+= 8;

      doc.setFontSize(8);

      dealScore.qaArr = JSON.parse(dealScore.qa);

      doc.line(xXis, yXis, xXis+139, yXis); // vertical line

      doc.text(doc.splitTextToSize(dealScore.qaArr[0].questionText, 60), xXis, yXis+3);
      doc.text(doc.splitTextToSize(dealScore.qaArr[0].answerText, 60), (xXis + 65), yXis+3);

      yXis+= 13;
      doc.line(xXis, yXis, xXis+139, yXis); // vertical line

      doc.text(doc.splitTextToSize(dealScore.qaArr[1].questionText,60), xXis , yXis+3);
      doc.text(doc.splitTextToSize(dealScore.qaArr[1].answerText, 60),(xXis + 65), yXis+3);

      yXis+= 13;
      doc.line(xXis, yXis, xXis+139, yXis); // vertical line

      doc.text(doc.splitTextToSize(dealScore.qaArr[2].questionText, 60),xXis, yXis+3);
      doc.text(doc.splitTextToSize(dealScore.qaArr[2].answerText, 60),(xXis + 65), yXis+3 );

      yXis+= 13;
      doc.line(xXis, yXis, xXis+139, yXis); // vertical line

      doc.text(doc.splitTextToSize(dealScore.qaArr[3].questionText, 60), xXis , yXis+3);
      doc.text(doc.splitTextToSize(dealScore.qaArr[3].answerText, 60), (xXis + 65), yXis+3);

      yXis+= 13;
      doc.line(xXis, yXis, xXis+139, yXis); // vertical line

      doc.text(doc.splitTextToSize(dealScore.qaArr[4].questionText, 60), xXis, yXis+3);
      doc.text(doc.splitTextToSize(dealScore.qaArr[4].answerText, 60), (xXis + 65), yXis+3);

      yXis+= 13;
      doc.line(xXis, yXis, xXis+139, yXis); // vertical line

      doc.text(doc.splitTextToSize(dealScore.qaArr[5].questionText, 60), xXis , yXis+3);
      doc.text(doc.splitTextToSize(dealScore.qaArr[5].answerText, 60), (xXis + 65), yXis+3);

      yXis+= 13;
      doc.line(xXis, yXis, xXis+139, yXis); // vertical line

      doc.text(doc.splitTextToSize(dealScore.qaArr[6].questionText, 60), xXis, yXis+3);
      doc.text(doc.splitTextToSize(dealScore.qaArr[6].answerText, 60), (xXis + 65), yXis+3);

      yXis+= 13;
      doc.line(xXis, yXis, xXis+139, yXis); // vertical line

      doc.setFontSize(10);
      yXis+= 5;

      doc.text('Override LGD', xXis, yXis);
      doc.text('' + dealScore.overrideLgd + '%', xXis, (yXis +5));

      doc.text('Override Reason', (xXis +65), yXis);
      doc.text('' + dealScore.overrideReason, (xXis +65), (yXis +5));

      yXis+= 15;

      doc.text('Lock For Committee', xXis, yXis);
      doc.text(dealScore.formStatus === 'draft' ? 'Draft' : dealScore.committeeId.toString(), xXis, (yXis +5));
    }
  }

}
