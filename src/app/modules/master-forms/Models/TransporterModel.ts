export class TransporterModel {

  TransporterId: number = 0
  BranchId: number = 0;
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
  districtStr: string = "";
  idInfo: any;
  BranchName: string = '';
}

export class TransporterParentModel {
  Tid: number = 0
  BranchId: number = 0;
  ParentTranspNo: string = ''
  ParentTranspName: string = ''
  ParentTranspEmail: string = ''
  ParentTranspMobNo: string = ''
  TDSPer:number=0;
  // TDSPer:string=''
  IsTDS:string='';
  IsGST:string='';
  GSTNumber:string=''
  IsActive: string = ''
  Addedby: string = ''
  Action: string = ''
  TransporterId: string = ''
}