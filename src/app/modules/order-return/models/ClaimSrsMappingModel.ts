export class ClaimSrsMappingModel{
  BranchId:number=0;
  CompId:number = 0;
  UserId:string='';
  StockistName:string='';
  LRNumber:string=''
  ReturnCategory:string='';
  ReturnCatId:number=0;
  ClaimNo:string='';
  SRSId:string = '';
  LRNo:string ='';
  SRSDate:Date;
  SRSNumber:number=0;
  Action:string='';
  lastUpdatedBy:Date;
  isActive:string='';
  ClaimType:string='';
  PhyChkId:number=0;
  LRDate:Date;
  LRIdGPId:number=0;
  AddedBy:number=0;
}
export class UploadDesCertiModel {
  CNIdStr: string = '';
  BranchId: number = 0;
  CompId: number = 0;
  StockistId: number = 0;
  DestrCertFile: string = '';
  AddedBy: string = '';
}
