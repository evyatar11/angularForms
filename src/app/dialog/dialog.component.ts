import { Component, OnInit } from '@angular/core';
import {DialogdataService} from '../services/dialogdata.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor(public dialogDataService:DialogdataService) { }

  ngOnInit() {
  }

}
