export class TransporterModel {
  TransporterId: number = 0
  TransporterNo: string = ''
  TransporterName: string = ''
  TransporterEmail: string = ''
  TransporterMobNo: string = ''
  TransporterAddress: string = ''
  CityCode: string = ''
  CityName: string = ''
  StateCode: string = ''
  StateName: string = ''
  DistrictCode: string = ''
  IsActive: string = ''
  RatePerBox: number = 0;
  Addedby: string = ''
  Action: string = ''
  DistrictName: string = ''
}

export class CompanyModel {
  CompanyId: number = 0;
  CompanyName: string = "";
  CompanyCode: number = 0;
}

export class CheckInvModel {
  BranchId: number = 0;
  VendorId: number = 0;
  VendorName: string = "";
  ExpInvId: number = 0;
  ExpInvNo: string = "";
  InvTypeId: number = 0;
  InvDate: Date;
  CompId: number = 0;
  CompanyName: string = "";
  ExpHeadId: number = 0;
  NoOfBox: number = 0;
  TaxableAmt: number = 0;
  ExpInvStatusText: string = "";
  TransId: string = '';
  ParentTranspName: string = '';
  InvFromDt: Date;
  InvToDt: Date;
  AddedBy: number = 0;
  BillFromName:string="";
}

export class CheckInvModelSave {
  ExpInvDtlsId: number = 0;
  ExpInvId: number = 0;
  ExpInvNo: string = "";
  TransporterId: number = 0;
  TransporterName: string = '';
  CompId: number = 0;
  CompanyName: string = "";
  GPNoOfInv: string = '';
  GPDate: string = '';
  GPNoOfBox: string = "";
  RatePerBox: string = "";
  Amount: string = "";
  TransBillBox: number = 0;   
  GatepassId:number=0;
  Remark:string='';
  DtlsStatus:number=0;
  dtctID:string='';
  ResolveRemark: string = '';
  gpctId:number=0;
}
