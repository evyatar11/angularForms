export class DealScore{
  ratedBy:string;
  borrowerId:number;
  borrowerName:string;
  crossCollaterlized:boolean;
  loanId:number;
  loanName:string;
  lendingOfficer:string;
  committeeId:number;
  businessUnit:string;
  currency:string;
  qa:string;
  qaArr:{questionText:string,answerText:string} [];
  date:Date;
  ead:number;
  cashAndSecurities:number;
  baseLgd:number;
  modifiedLgd:number;
  adjustedLgd:number;
  finalLgd:number;
  overrideLgd:number;
  overrideReason:string;
  formStatus:string;
}
