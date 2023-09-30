
export class DashbordorderDispatchcountmodel {
  TotalInvoices: number = 0;
  CummPL: number = 0;
  InvPerMonth: number = 0;
  TodaysBoxes: number = 0;
  CummBoxes: number = 0;
  SalesAmtToday: number = 0;
  SalesAmtCumm: number = 0;
  NotDispPckdInv: number = 0;
  NotDispPckdBox: number = 0;
  LocalMode: number = 0;
  OtherCity: number = 0;
  ByHand: number = 0;
  TodayInv: number = 0;
  PendingInv: number = 0;
  PriorityInvToday: number = 0;
  PriorityPending: number = 0;
  InvConcernPending: number = 0;
  StkPrintedToday: number = 0
  StkPending: number = 0;
  GPTodayCreated: number = 0;
  GPPending: number = 0;
  PendingLR: number = 0;
  TPBox: number = 0;
  TPStockiest: number = 0;
  StkBox: number = 0;
  StkInv: number = 0;
  PLToday: number = 0;
  PLPending: number = 0;
  PLConcern: number = 0;
  PLVerifiedToday: number = 0;
  PLVerifiedPending: number = 0;
  PLAllotedToday: number = 0;
  PLAllotedPending: number = 0;
  DispatchN: number = 0;
  DispatchN1: number = 0;
  DispatchN2: number = 0;
  DispatchNPer:number=0;
  DispatchN1Per:number=0;
  DispatchN2Per:number=0;
  DispatchPending: number = 0;
  StkrPendingAmt: number = 0;
  GPPendingAmt: number = 0;
  CummInvCnt: number = 0;
  CummBoxesCnt: number = 0;
  CummPLCnt: number = 0;
  TodaySalesAmt: number = 0;
  CummSalesAmt: number = 0;
  LocalTotalDisp: number = 0;
  OtherTotalDisp: number = 0;
  ByHandTotalDisp: number = 0;
}
export class InventoryCountModel {
  BranchId: number = 0;
  CompId: number = 0;
  TotalVeh: number = 0;
  TodayVeh: number = 0;
  TotalCaseQty: number = 0;
  TodayCaseQty: number = 0;
  TodayClaimCnt: number = 0;
  PendClaimCnt: number = 0;
  TodaySANCnt: number = 0;
  PendSANCnt: number = 0;
  CummVehicle: number = 0;
  CummBoxes: number = 0;
}
export class OrderReturnModel {
  ConsignToday: number = 0;
  ConsignPending: number = 0;
  atWarehouse: number = 0;
  atOperator: number = 0;
  atAuditorChk: number = 0;
  SalebleClaim: number = 0;
  DestrPending: number = 0;
  SalebleCN1: number = 0;
  SalebleCN2: number = 0;
  SalebleMore2: number = 0;
  SalebleCN7Plus: number = 0;
  PendingCN: number = 0;
  SalebleCN1Per: number = 0;
  SalebleCN2Per: number = 0;
  Salemore2DaysPer: number = 0;
  ExpCN15D: number = 0;
  ExpCN30D: number = 0;
  ExpCN45D: number = 0;
  ExpCNMore45D: number = 0;
  ExpCN15DPer: number = 0;
  ExpCN30DPer: number = 0;
  ExpCN45DPer: number = 0;
  ExpCNMore45DPer: number=0;
}

export class ChequeAcctModel {
  TodayBounce: number = 0;
  TotalChqBounced: number = 0;
  DueforFirstNotice: number = 0;
  DueforLegalNotice: number = 0;
  TodayDeposited: number = 0;
  Overduestk: number = 0;
  NTotalFirstNotice: number = 0;
  NTotalLegalNotice: number = 0;
  CummDiposited: number = 0;
  OverDueAmt: number = 0;
}

export class StockTransferModel {
  InvPending: number = 0;
  InvToday: number = 0;
  ConcernPending: number = 0;
  StkrToday: number = 0;
  StkrPending: number = 0;
  StkGPToday: number = 0;
  StkGPPending: number = 0;
  StkCummInvCnt: number = 0;
  StkCummBoxCnt: number = 0;
  StkCummPLCnt: number = 0;
  NoOfBoxes: number = 0;
  LRPendingStockTrnsfer: number = 0;
  StkSticerPendingAmt: number = 0;
  StkGPPendingAmt: number = 0;
}

export class OwnerLoginDashCnt {
  branchId: number=0;
  compId: number=0;
  OPrioPending: number=0;
  OStkrPending: number=0;
  OStkrPendingAmt: number=0;
  OGPPending: number=0;
  OGPPendingAmt: number=0;
  OTPBox: number=0;
  OTotalChqBounced: number=0;
  ODueforFirstNotice: number=0;
  ODueforLegalNotice: number=0;
  OOverDueStk: number=0;
  OOverDueAmt: number=0;
  OPendSANCnt: number=0;
  OPendClaimCnt: number=0;
  OConsignPending: number=0;
  OSalebleCN2_7: number=0;
  OMore11Days: number=0;
  OStkStickerPending: number=0;
  OStkSticerPendingAmt: number=0;
  OStkGPPending: number=0;
  OStkGPPendingAmt: number=0;
  ONoOfBoxes: number=0;
}


