export class DashboardModel {
  BranchId: number = 0;
  BranchName: string = '';
  CompanyName: string = '';
  CompanyId: string = '';
  RoleId: number = 0;

}

//Chart Data
export class ChartData {
  ChartDataArray: any;
  ObjectToArray: any;
  NoofboxesdispatchedPieChartLabel = ['Local Mode', 'Other City', 'By Hand'];
  CheqAccNoticesPieChartLabel = ['Total First Notices', 'Total Legal Notices'];
  StockTransPieChartLabel = ['Invoices/Day', 'Invoices/Month', 'Total Picklist', 'Operator End', 'Pending dispatch'];
  ChequeBouncedLabel = ['Total', 'Total First Notice', 'Total Legal Notice'];
  ChequeDepositedLabel = ['Depo/Day', 'Depo/Month', 'Dealy Depo', 'Over Due Stk'];
  NoofBoxesLRUpdationLabel = ['TodayBoxes', 'Cumm Boxes/Month', 'Pending LR Updation'];
  ClaimDetailsPieChartLabel = ['Pending Claim', 'Pending SAN'];
  PendingClaimPieChartLabel = ['Total', 'Ware House', 'Auditor Check', 'Operator End', 'Saleable Claim'];
  NoofBoxesandLRupdationLabel = ['Today Boxes', 'Cumm Boxes/Month', 'Pending LR updation'];
  TotalInvoicesandpicklistLabel = ['Today Invoice', 'Pending Invoice', 'Priority Invoice Today', 'Priority Pending', 'Invoice Concern Pending', 'Sticker Printed', 'Sticker Pending',
    'Gatepass Today Created', 'Gatepass Pending', 'Pending LR', 'TPBox'];
  //'TPStockiest', 'StkBox', 'StkInv', 'PLToday', 'PLPending', 'PLConcern', 'PLVerifiedToday', 'PLVerifiedPending',
  //'PLAllotedToday', 'PLAllotedPending', 'LocalMode', 'OtherCity', 'ByHand', 'TotalInvoices'];
  TotalDispatchLabel = ['N', 'N + 1', 'N + 2', 'Total Pending'];
  SalesAmtforthedaytilldate = ['Today Sales', 'Cumm Sales/Month'];
  NotyetDispatchedLabel = ['packed Invoice', 'packed boxes'];
  NoofboxesdispatcheLabel = ['Local', 'OtherCity', 'ByHand'];
  InventoryInwardLabel = ['Total Vehicle', 'No.of Boxes'];
  SaleableCreditNoteLabel = ['1 Days', '2 Days', 'More than 2 Days', 'More than 7 Days', 'Pending CN'];
  SettlementPeriodLabel = ['15 Days', '30 Days', '45 Days', 'Above 45 Days'];
  ConsignmentReceivedLabel = ['Today', 'Cumm Monthly'];
  SRSDetailsLabel = ['Pending SRS', 'Pending CN', 'Pending Auditor chk'];
  chartdata: any[] = [];
  ChartModalTitle: string;
  DataModel: any;
  ChartId: any;
  PieChartType: string = 'pie';
  BarChartType: string = 'bar';
  Flag: string = '';
  searchModel: any;

}
