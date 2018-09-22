import {Component, OnInit} from '@angular/core';
import {FormService} from '../../services/form.service';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {
  formDetailsSubmitted;
  tabsSubmitted;
  constructor(public formService: FormService,private router: Router) {}

  ngOnInit() {
    this.formDetailsSubmitted = new FormGroup({});
    this.tabsSubmitted = new FormGroup({});
  }

  onDetailsFormSubmitted(event:FormGroup){
    this.formDetailsSubmitted = event;
  }

  onTabsSubmitted(event:FormGroup){
    this.tabsSubmitted = event;
  }

  navigateToHomePage(){
    this.router.navigate(['/home']);
  }

  deleteForm(stepper){
    this.formService.deleteForm().subscribe(
      (response) => {
        console.log('form deleted successfully' + response);
        stepper.reset();
      }
      ,
      (error) => {
        console.log('error deleting form' + error);
      }
    );
  }

}
