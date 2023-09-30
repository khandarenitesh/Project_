export class AddEmployeeModel {
    BranchId: number = 0;
    EmpNo: string = "";
    EmpId: number = 0;
    EmpName: string = "";
    EmpPAN: string = "";
    EmpEmail: string = "";
    EmpMobNo: string = "";
    BloodGroup:string="";
    EmpAddress: string = "";
    CityCode: string = "";
    DesignationId: number = 0;
    DesignationName : string='';
    pkId: number = 0;
    AadharNo: string = "";
    IsUser: string = "";
    Addedby: string = "";
    companyStr: string = "";
    RoleIdStr:string="";
    RoleId: number = 0;
    UserName: string = "";
    Password: string = "";
    EncryptPassword: string = "";
    CityName : string="";
    CompanyName : string="";
    CompanyId:number=0
    CompanyCode: string = '';
    MasterName : string ='';
    BloodGroupName : string='';
    BranchName : string='';
}

export class EmployeeMasterModel {
    EmpId: number = 0;
    BranchId: number = 0;
    EmpNo: string = "";
    BranchCode: string = "";
    BranchName: string = "";
    EmpName: string = "";
    EmpPAN: string = "";
    EmpEmail: string = "";
    EmpMobNo: string = "";
    EmpAddress: string = "";
    CityCode: string = "";
    CityName: string = "";
    DesignationId: number = 0;
    pkId: number = 0;
    BloodGroupName: string = "";
    AadharNo: string = "";
    IsUser: string = "";
    IsActive: string = "";
    Addedby: string = "";
    AddedOn: string = "";
    LastUpdatedOn: string = "";
    RoleId: number = 0;
    UserName: string = "";
    Password: string = "";
    UserStatus: string = "";
}

export class EmployeeActiveModel {
    EmpId: number = 0;
    IsActive: string = "";
    Addedby: string = "";
}
