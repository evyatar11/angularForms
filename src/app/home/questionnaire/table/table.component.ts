import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormService} from '../../../services/form.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class TableComponent implements OnInit {
  displayedColumns: string[] = [
    'Question',
    'Selected Answer',
    'Category Weight',
    'Question Weight',
    'Selected Answer Score',
    'Effective Score'];
  constructor(public formService:FormService,public router: Router) { }

  ngOnInit() {
  }

}
