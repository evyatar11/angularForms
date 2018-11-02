import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../../../services/form.service';
import {Category} from '../../../models/Category';
import {Question} from '../../../models/Question';
import {Answer} from '../../../models/Answer';
import {Http} from '@angular/http';
import {FormSubmission} from '../../../models/FormSubmission';
import {USPBpdConv} from '../../../models/USPBpdConv';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TabComponent implements OnInit {
  tabsDetails: FormGroup;
  @Output() tabsSubmitted = new EventEmitter<FormGroup>();
  formToSubmit:FormSubmission;

  constructor(public formService: FormService,private http: Http) {
  }

  ngOnInit() {
    this.tabsDetails = new FormGroup({});
    for (const category of this.formService.selectedForm.categoriesList ) {
      for (const question of category.questionList ) {
        this.tabsDetails.addControl('q' + question.questionId, new FormControl('', Validators.required));
      }
    }
    this.tabsSubmitted.emit(this.tabsDetails);
  }

  onTabsFormSubmit() {
    this.formService.showSpinner = true;
    this.formService.detailedAnswersMap.forEach(value => {
      this.formService.pdScore=0;
      // Add score to final score before rounding
      this.formService.pdScore+=value.effectiveScore;
      // Round question score
      value.effectiveScore = +value.effectiveScore.toPrecision(2).toString();
      // Add Question to array type for table presentation
      this.formService.tableData.push(value);
      // Save q&a detail for submission
      this.formService.formSubmission.submittedFormRawData.qa.push(
        {
          questionText : value.questionText,
          answerText : value.answerText
        });
    });
    // Round final PD score after calculation
    this.formService.pdScore = +this.formService.pdScore.toPrecision(3);

    this.formService.formSubmission.score = this.formService.pdScore.toString();

    this.formService.getUpdatedPdAndRatingByScore(this.formService.pdScore).subscribe(
      (response:USPBpdConv)=>{
        this.formService.formSubmission.updatedRating=response.updatedRating;
        this.formService.formSubmission.pdScore=response.pdScore;
        // Show table copmponent
        this.formService.showTableAndGraph = true;
        this.formService.showSpinner=false;
      }
      ,
      (error) => {
        console.log('error getting updated pd score and rating' + error);
      }
    );
  }

  updateTableModule(category:Category,question:Question,answer:Answer){
    if(answer){
      this.formService.detailedAnswersMap.set(question.questionId,
        {questionText : question.questionContent,
          answerText : answer.answerContent,
          categoryWeight : category.categoryWeight,
          questionWeight : question.questionWeight,
          answerScore :answer.answerScore,
          effectiveScore : answer.answerScore * (question.questionWeight/100) * (category.categoryWeight/100) });
    }
  }

}
