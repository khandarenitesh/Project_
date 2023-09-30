export class courierList{
    CourierId : number = 0;
    BranchId : number = 0;
    CourierName : string = '';
    CourierEmail : string = '';
    CourierMobNo : string = '';
    CourierAddress : string = '';
    CityCode : string = '';
    CityName : string = '';
    StateCode : string = '';
    StateName : string = '';
    DistrictCode : string = '';
    RatePerBox : number = 0;
    DistrictName :string="";
    Addedby : string = '';
    Action : string = '';
    IsActive : string = '';
    BranchName:string = '';
}

export class CourierParentModel {
  Cpid: number = 0
  BranchId: number = 0;
  ParentCourierName: string = ''
  ParentCourierEmail: string = ''
  ParentCourierMobNo: string = ''
  IsGST: string = '';
  GSTNumber: string = ''
  TDSPer: number = 0;
  IsActive: string = ''
  Addedby: string = ''
  Action: string = ''
}
