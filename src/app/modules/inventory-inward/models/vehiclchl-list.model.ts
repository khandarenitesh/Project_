export class VehiclchlList {
    BranchId: number = 0;
    CompId: number = 0;
    FromDate: Date = new Date();
    ToDate: Date = new Date();

}

export class VehicleChecklistModel {
    PkId: number = 0;
    BranchId: number = 0;
    CompId: number = 0;
    IsApprove: string = "";
    IsConcern: number = 0;
    IsApproveBy: string = "";
    UserId: string = "";
    AddedBy: number = 0;
    ActualNoOfCasesQty: number = 0;
    NoOfCasesQty: number = 0;
    ResolveVehicleRemark: string = "";
    Img1: string;
    Img2: string;
    Img3: string;
    Img4: string;
  }
