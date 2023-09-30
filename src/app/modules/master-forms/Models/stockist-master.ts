import { BankModel } from "./Bankmodel";

export class StockistModel {
    StockistId: number = 0;
    BranchId: number = 0;
    CompanyId: number = 0;
    StockistNo: number = 0;
    StockistName: string = "";
    Emailid: string = "";
    MobNo: string = "";
    StockistPAN: string = "";
    GSTNo: string = "";
    CityCode: string = "";
    CityName: string = "";
    LocationId: string = "";
    Pincode: string = "";
    DLNo: string = "";
    DLExpDate: Date = new Date();
    FoodLicNo: string = "";
    FoodLicExpDate: Date = new Date();
    IsActive: string = "";
    Addedby: string = "";
    LastUpdatedOn: string = '';
    Action: string = '';
    StockistAddress: string = '';
    BankName:String='';
    BnkDtls: BankModel[]=[];
}
