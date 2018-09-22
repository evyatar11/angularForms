import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormService} from '../../../services/form.service';

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

  constructor(public formService:FormService) { }

  ngOnInit() {
  }

}
