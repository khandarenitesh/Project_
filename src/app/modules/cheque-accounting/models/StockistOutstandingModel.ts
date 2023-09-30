export class StockistOutStanding {
  BranchId: number = 0;
  CompId: number = 0;
  Document:string='';
  Date:Date = new Date();
  OSDate: Date = new Date();
  OpenAmt:number = 0;
  DocTypeDesc:string = '';
  DocType:string = '';
  OverDueAmt:string='';
  Addedby: string = '';
  Action: string = '';
  StatusText: string = '';
  RejectReason: string = '';
}
