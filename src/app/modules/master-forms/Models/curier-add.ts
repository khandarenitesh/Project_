export class CurierModel {
    CourierId:number=0;
    BranchId:number=0;
    BranchName:string="";
    CourierName:string="";
    CourierEmail:string="";
    CourierMobNo:string="";
    CourierAddress:string="";
    CityCode:string="";
    StateCode:string="";
    DistrictCode:string="";
    DistrictName : string="";
    IsActive:string="";
    Addedby:string="";
    Action:string="";
    CityName : string="";
    StateName:string="";
    RatePerBox:number=0;
    
}

export class CourierParentModel {

    Cpid: number = 0
    BranchId: number = 0;
    ParentCourNo: string = ''
    ParentCourierName: string = ''
    ParentCourierEmail: string = ''
    ParentCourierMobNo: string = ''
    TDSPer:number=0;
    IsTDS:string='';
    IsGST:string='';
    GSTNumber:string=''
    IsActive: string = ''
    Addedby: string = ''
    Action: string = ''
    CourierId:string=''
  }
