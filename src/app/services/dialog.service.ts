import {Component, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import {DialogdataService} from './dialogdata.service';

@Injectable()
export class DialogService {
  constructor(public dialog: MatDialog,private dialogDataService:DialogdataService) {}

  openDialog(dialogTitle,dialogContent,closeButtonText){
    this.dialogDataService.dialogTitle=dialogTitle;
    this.dialogDataService.dialogContent=dialogContent;
    this.dialogDataService.closeButtonText=closeButtonText;
    setTimeout(
      () => this.dialog.open(
        DialogComponent,
        {
      height: '200px',
      width: '400px',
            }
    )
    );
  }
}
