export class InsuranceModel {
  TransitId: number = 0;
  BranchId: number = 0;
  CompId: number = 0;
  InvoiceNo: string = '';
  ClaimId: number = 0;
  InvoiceId: string = '';
  InvNo: string = '';
  InvId: string = '';
  ClaimNo: string = '';
  ClaimDate: Date
  ClaimAmount: string = ''
  ClaimType: string = '';
  ClaimTypeId: number = 0;
  DebitNo: string = '';
  DebitDate: Date;
  DebitNote: string = '';
  DebitAmount: string = '';
  Remark: string = '';
  Addedby: string = '';
  pkId: number;
  Action: string = '';
  LRNo: string = '';
  EmailSendDate: Date;
  LREntryId: number = 0;
  SANNo: string = '';
  SANApproveBy: string = '';
  SANDate: Date;
  SANRemark: string = '';
  IsEmailSend: number = 0;
  ClaimApproveBy: string = '';
  ApproveClaimDate: Date;
  ClaimRemark: string = '';
  SANAmount: string = '';
  EmailDate:Date;
  MasterName:string='';
}

