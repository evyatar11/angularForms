import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../../../services/form.service';
import {Category} from '../../../models/Category';
import {Question} from '../../../models/Question';
import {Answer} from '../../../models/Answer';
import {Http} from '@angular/http';
import {FormSubmission} from '../../../models/FormSubmission';

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

  constructor(private formService: FormService,private http: Http) {
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
    this.formService.detailedAnswersMap.forEach(value => {
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

    this.formService.formSubmission.pdScore = this.formService.pdScore.toString();

    this.formService.submitForm(this.formService.formSubmission).subscribe(
      (response) => {
        this.formService.submittedFormId = response.id;
        console.log('form submitted successfully' + response);
        // Save form state
        this.formService.saveFormState(this.tabsDetails);
        // Trigger an event for submitting all questions
        this.tabsSubmitted.emit(this.tabsDetails);
        // Show table copmponent
        this.formService.showTableAndGraph = true;
        // Block previous steps
        this.formService.isEditable= false;
      }
      ,
      (error) => {
        console.log('error submitting form' + error);
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
