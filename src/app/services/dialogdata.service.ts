import { Injectable } from '@angular/core';

@Injectable()
export class DialogdataService {
  dialogTitle;
  dialogContent;
  closeButtonText;
  pdfDownload:boolean;
  constructor() { }
}
