export class ApproveVehicleModel {
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

export class InvInwardAllCountModel {
  TodayLR: number = 0;
  TotalClaimSAN: number = 0;
  PendingClaimSANApproved: number = 0;
  TotalTodaysMapCnrnRaise: number = 0;
  TodayVehicleMapped: number = 0;
  TodayChklistDone: number = 0;
  TodayConcernRaised: number = 0;
  TotalClaimRaised: number = 0;
  TotalSANRaised: number = 0;
  TodayMapConcernRaised: number = 0;
  TodayMapConcernResolved: number = 0;
  TotalClaimApproved: number = 0;
  TotalSANApproved: number = 0;
  PendingClaim: number = 0;
  PendingSAN: number = 0;
}

export class ResolveRaisedConcernModel {
  BranchId: number = 0;
  CompId: number = 0;
  RaieseReqId: number = 0;
  LrNo: string = '';
  InvoiceNo: string = '';
  Remark: string = '';
  AddedBy: number = 0;
  AddedOn: Date;
}
