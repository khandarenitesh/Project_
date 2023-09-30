import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppCode } from '../../app.code';
import { DashboardService } from './dashboard.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../modules/auth/services/auth.service';
import {
  ChequeAcctModel, DashbordorderDispatchcountmodel, InventoryCountModel, OrderReturnModel,
  StockTransferModel, OwnerLoginDashCnt
} from './dashbordcountmodel.model';
import { formatDate } from '@angular/common';
import { ChartData, DashboardModel } from './dashboard-model.model';
import { Chart, registerables } from '../../../../node_modules/chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MatTableDataSource } from '@angular/material/table';
import { OrderDispatchService } from '../../modules/order-dispatch/Services/order-dispatch.service';
import { ChequeAccountingService } from '../../modules/cheque-accounting/Services/cheque-accounting.service';
import { InventoryInwardService } from '../../modules/inventory-inward/Services/inventory-inward.service'
import { data } from 'jquery';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {

  //create model object
  dashboardModel: DashboardModel;
  OrderdispatchModulecount: DashbordorderDispatchcountmodel;
  invCount: InventoryCountModel;
  OrderReturncnt: OrderReturnModel;
  cheacctcnt: ChequeAcctModel;
  StockTrsCnt: StockTransferModel;

  //flag for spinner
  isLoading: boolean = false;
  isLoadingSpinner: boolean = false;
  isLoadingSpinnerOrderDis: boolean = false;
  isLoadingSpinnerCHQ: boolean = false;
  isLoadingSpinnerOrdrRtrn: boolean = false;
  isLoadingSpinnerStckTrns: boolean = false;
  isLoadingSpinnerInvtryInv: boolean = false;
  isLoadingSpinnerStkTrsfr: boolean = false;
  isLoadingSpinnerOrderDispPL: boolean = false;
  isLoadingSpinnerOrderDisCummPl: boolean = false;
  isLoadingSpinnerOrderDisCummInvoice: boolean = false;
  isLoadingSpinnerChqAcntCummDepo: boolean = false;
  isLoadingSpinnerCummVehicle: boolean = false;
  isLoadingSpinnerOrdrDisSmmaryCnt: boolean = false;
  isLoadingSpinnerstockTrnsfrSmmaryCnt: boolean = false;
  isLoadingSpinnerStockistOutstand: boolean = false;
  isLoadingSpinnerOrPenCN: boolean = false;

  BranchId: number = 0;
  CompId: number = 0;
  UserId: number = 0;
  DashbordsModel: any;
  DataModelCountModel: any;
  // FOR ALL Order Dispatch module
  TodayInv: number = 0;
  TodayInvstockTrnsfr: number = 0;
  TotalInvoices: number = 0;
  CummPL: number = 0;
  OrderDispatchCummPL: number = 0;
  InvPerMonth: number = 0;
  TodaysBoxes: number = 0;
  CummBoxes: number = 0;
  PendingLR: number = 0;
  PendingLRstockTrnsfr: number = 0;
  DispatchN: number = 0;
  DispatchN1: number = 0;
  DispatchN2: number = 0;
  DispatchNPer: number = 0;
  DispatchN1Per: number = 0;
  DispatchN2Per: number = 0;
  DispatchPending: number = 0;
  SalesAmtToday: number = 0;
  SalesAmtCumm: number = 0;
  NotDispPckdInv: number = 0;
  NotDispPckdBox: number = 0;
  LocalMode: number = 0;
  OtherCity: number = 0;
  ByHand: number = 0;
  CompanyId: number = 0;
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

  //New Order dispatch
  PendingInv: number = 0;
  PriorityInvToday: number = 0;
  PriorityPending: number = 0;
  InvConcernPending: number = 0;
  StkPrinted: number = 0
  StkPending: number = 0;
  GPTodayCreated: number = 0;
  GPPending: number = 0;
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

  // For All Stock Transfer Count
  CummInvstockTrnsfr: number = 0;
  PendingDispatch: number = 0;
  TodayBox: number = 0;
  CummBox: number = 0;
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

  // For ALL Inventory inward supervisor
  TotalVeh: number = 0;
  TodayVeh: number = 0;
  TotalCaseQty: number = 0;
  TodayCaseQty: number = 0;
  TodayClaimCnt: number = 0;
  PendClaimCnt: number = 0;
  TodaySANCnt: number = 0;
  PendSANCnt: number = 0;
  CummVehicle: number = 0;
  InvntryCummBoxes: number = 0;

  //For ALL Order Return supervisor Counts
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
  ExpCNMore45DPer: number = 0;

  //For All Cheque Accoounting Operator Count
  TodayBounce: number = 0;
  TotalChqBounced: number = 0;
  DueforFirstNotice: number = 0;
  DueforLegalNotice: number = 0;
  TodayDeposited: number = 0;
  Overduestk: number = 0;
  CummDiposited: number = 0;
  OverDueAmt: number = 0;
  CurrentDateTime = new Date();
  minDate = new Date();
  maxDate = new Date();
  PicklistDataOrderDispatch: any;
  PicklistDataStockTrasnfer: any;
  OrderDisCummInvoiceData: any;
  StockTrnsferCummInvoiceData: any;
  IsColorFlag: boolean = false;
  isCollapsed = false;
  isCollapsed1 = false;
  DataModel: any;
  InvoicList: any;
  ModalcountTitle: string = "";
  TodayDateForFilter: any;
  DModel: any;
  DataLoadModel: any;
  model: any;
  currentValue: any;
  BranchIdValue: number = 0;
  StkrPendingAmtFormat: any = 0;
  GPPendingAmtFormat: any = 0;
  StockTrnsfrStkrPendingAmtFormat: any = 0;
  StockTrnsfrGPPendingAmtFormat: any = 0;
  TodaySaleaAmtFormat: any = 0;
  CummSaleAmtFormat: any = 0;

  // Owner Login 
  RoleId: number = 0;
  OwnerDashbordsModel: any;
  OwnerModalcountTitle: string = "";
  isLoadingForOwner: boolean = false;
  ownerLoginDashCnt: OwnerLoginDashCnt;

  //Owner Login Count Model 
  oPriorityPending: number = 0;
  oStkPending: number = 0;
  oStkPendingAmt: number = 0;
  oGPPending: number = 0;
  oGPPendingAmt: number = 0;
  oTPBox: number = 0;
  oTotalChqBounced: number = 0;
  oDueforFirstNotice: number = 0;
  oDueforLegalNotice: number = 0;
  oOverDueStk: number = 0;
  oOverDueAmt: number = 0;
  oPendSANCnt: number = 0;
  oPendClaimCnt: number = 0;
  oConsignPending: number = 0;
  oSalebleCN2_7: number = 0;
  oMore11Days: number = 0;
  oStkStickerPending: number = 0;
  oStkSticerPendingAmt: number = 0;
  oStkGPPending: number = 0;
  oStkGPPendingAmt: number = 0;
  oNoOfBoxes: number = 0;

  //chart model
  ChartDataModel: ChartData = new ChartData;

  //Table Data Display
  displayedColumnsForApiFilterList = ['SrNo', 'InvNo', 'NoOfBox', 'InvCreatedDate', 'StockistNo', 'StockistName', 'InvAmount', 'TransportModeId'];
  displayedColumnsForApiFilterOrderReturn = ['SrNo', 'StockistNo', 'StockistName', 'LRNo', 'TransporterName', 'GatepassNo', 'ClaimNo'];
  displayedColumnsForApiFilterchqAcnt = ['SrNo', 'StockistName', 'Date', 'BankName', 'City', 'BankAccountNo', 'ChequeNo', 'ChequeSts', 'DateDiff'];
  displayedColumnsForApiFilterInventoryInwrd = ['SrNo', 'InvNo', 'InvoiceDate', 'LrNo', 'LrDate', 'TransporterName', 'TransporterNo', 'VehicleNo'];
  displayedColumnsForApiFilterOutStandingStk = ['SrNo', 'OSDate', 'StockistCode', 'StockistName', 'CityName', 'DueDate', 'OverdueAmt'];
  displayedColumnsForApiFilterInventoryClaimSAN = ['SrNo', 'InvNo', 'LrNo', 'LrDate', 'ClaimSANNo', 'ClaimSANDate', 'TransporterName', 'TransporterNo'];
  displayedColumnsForApiFilterStockTransfer = ['SrNo', 'InvNo', 'NoOfBox', 'InvCreatedDate', 'StockistNo', 'StockistName', 'InvAmount'];
  displayedColumnsForApiFilterOrderDispPL = ['SrNo', 'PicklistNo', 'PicklistDate', 'FromInv', 'ToInv', 'StatusText'];
  displayedColumnsForApiFilterOrderDispBoxesSummary = ['SrNo', 'InvDate', 'InvCount', 'InvAmount', 'NoOfBox'];
  displayedColumnsForApiFilterStockTransferBoxesSummary = ['SrNo', 'StkInvDate', 'StkInvCount', 'StkInvAmount', 'StkNoOfBox'];
  displayedColumnsForApiFilterOrderDispCummPicklist = ['SrNo', 'PicklistNo', 'PLDate', 'StatusText', 'FromInv', 'ToInv'];
  displayedColumnsForApiFilterOrderDispCummInvoice = ['SrNo', 'StockistNo', 'StockistName', 'InvAmount', 'InvNo', 'InvCreatedDate', 'NoOfBox'];
  displayedColumnsForApiFilterChqAcntCummDeposited = ['SrNo', 'StockistNo', 'StockistName', 'ChqReceivedDate', 'CityName', 'AccountNo', 'ChqAmount', 'ChqNo'];
  displayedColumnsForApiFilterInvtryInwCummVehicle = ['SrNo', 'InvNo', 'InvoiceDate', 'LrNo', 'TotalCaseQty', 'TransporterNo', 'TransporterName', 'VehicleNo'];

  displayedClmsForLRPendingList = ['SrNo', 'InvNo', 'StockistNo', 'StockistName', 'LRNo', 'LRBox'];
  displayedClmsForStkLRPendingList = ['SrNo', 'InvNo', 'StockistNo', 'StockistName', 'LRNo', 'LRBox'];
  displayedClumsForprioInvList = ['SrNo', 'InvNo', 'NoOfBox', 'InvCreatedDate', 'StockistNo', 'StockistName', 'InvAmount', 'TransportModeId'];

  // Owner Login
  displayedClmsForODPendInvApiFilterList = ['SrNoNew', 'BranchName', 'CompanyName', 'PrioPending', 'StkrPending', 'GPPending'];
  displayedClmsForODPendBoxesApiFilterList = ['SrNoNew', 'BranchName', 'CompanyName', 'InvCount', 'InvAmount', 'NoOfBoxes'];
  displayedClmsForChqAccApiFilterList = ['SrNoNew', 'BranchName', 'CompanyName', 'TotalBounce', 'DueforFirstNotice', 'DueforLegalNotice'];
  displayedClmsForInvInwardApiFilterList = ['SrNoNew', 'BranchName', 'CompanyName', 'PendSANCnt', 'PendClaimCnt'];
  displayedClmsForORConsgPendApiFilterList = ['SrNoNew', 'BranchName', 'CompanyName', 'TotalPending'];
  displayedClmsForSalebleCNApiFilterList = ['SrNoNew', 'BranchName', 'CompanyName', 'More2Day', 'More11Day'];
  displayedClmsForStkPendInvApiFilterList = ['SrNoNew', 'BranchName', 'CompanyName', 'StkStkrPending', 'StkGPPending'];
  displayedClmsForStkPendBoxesApiFilterList = ['SrNoNew', 'BranchName', 'CompanyName', 'StkInvCount', 'StkInvAmount', 'StkNoOfBoxes'];

  //declare array for data sharing
  InvDataList: any[] = [];
  CummInvDataList: any[] = [];
  InvPLDataList: any[] = [];
  InvDatalTOList: any[] = [];
  CommonDataListforTable: any[] = []
  DataordrreturnList: any[] = [];
  ChequeData: any[] = [];
  OutStandingStk: any[] = [];
  InventoryInwrdData: any[] = [];
  StockTransferList: any[] = [];
  OrdrDisCummPltList: any[] = [];
  OrdrDisCummInvoiceList: any[] = [];
  OrderDisSummaryCount: any[] = [];
  PendiInvList: any[] = [];
  ChqBounceList: any[] = [];
  InvInwardList: any[] = [];
  OrderReturnList: any[] = [];
  StkPendiInvList: any[] = [];


  //declare datasource for table
  public DataSource = new MatTableDataSource<any>();
  public DataSourceForLRSRSCNforDataOrdrRtrn = new MatTableDataSource<any>();
  public DataSourcePendingCN = new MatTableDataSource<any>();//
  public DataSourceForInvPickListStockTrnsfer = new MatTableDataSource<any>();
  public DataSourceChequeData = new MatTableDataSource<any>();
  public DataSourceInveontoryInward = new MatTableDataSource<any>();
  public DataSourceOutStandingStk = new MatTableDataSource<any>();
  public DataSourceInveontoryClaimSAN = new MatTableDataSource<any>();
  public DataSourceStockTransfer = new MatTableDataSource<any>();
  public DataSourceOrderDispPL = new MatTableDataSource<any>();
  public DataSourceOrderDispCummPl = new MatTableDataSource<any>();
  public DataSourceOrderDispCummInvoice = new MatTableDataSource<any>();
  public DataSourceChqAcntCummdeposited = new MatTableDataSource<any>();
  public DataSourceOrderRtrnCummVehicle = new MatTableDataSource<any>();
  public DataSourceSummaryCount = new MatTableDataSource<any>();
  public DataSourceStockTrnsferSummaryCount = new MatTableDataSource<any>();

  public DataSourceLRPending = new MatTableDataSource<any>();
  public DataSourceStkLRPending = new MatTableDataSource<any>();
  public DataSourcePendingInvoice = new MatTableDataSource<any>();
  public DataSourcePrioPendInv = new MatTableDataSource<any>();


  // Owner Dash Data Source
  public DataSourceOwnODPendInv = new MatTableDataSource<any>();
  public DataSourceOwnODPendBoxes = new MatTableDataSource<any>();
  public DataSourceOwnChqAcc = new MatTableDataSource<any>();
  public DataSourceOwnInvInward = new MatTableDataSource<any>();
  public DataSourceOwnORConsng = new MatTableDataSource<any>();
  public DataSourceOwnORSalebleCn = new MatTableDataSource<any>();
  public DataSourceOwnStkPendInv = new MatTableDataSource<any>();
  public DataSourceOwnStkPendBoxes = new MatTableDataSource<any>();

  //constructor inject the services.
  constructor(private chRef: ChangeDetectorRef, private authService: AuthService,
    private _Service: DashboardService, private modalService: NgbModal, private _orderDispatchService: OrderDispatchService,
    private chequeService: ChequeAccountingService, private InvwrdService: InventoryInwardService) {
  }

  //angular hook ngOnint method started
  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.UserId = obj.UserId;
    this.RoleId = obj.RoleId;
    this.authService.currentData.subscribe((currentData: any) => {
      this.currentValue = currentData
    });
    this.DataLoadModel = {
      "BranchId": this.BranchId,
      "CompanyId": this.CompId,
    }
    this.TodayDateForFilter = formatDate(this.CurrentDateTime, 'yyyy-MM-dd', 'en-US');
    if (this.RoleId === 11) {
      this.model = {
        "BranchId": 0,
        "CompanyId": 0,
      }
      this.GetOwnerLoginDashCount(this.model);
    } else {
      //call for all count api
      this.GetDashboardCount(this.DataLoadModel);
      this.GetInventoryInwardCount(this.DataLoadModel);
      this.GetOrderReturnCount(this.DataLoadModel);
      this.GetChequeAccountingCount(this.DataLoadModel);
      this.GetStockTranscount(this.DataLoadModel);
      // for all list API
      this.GetInvoiceListforOrderDispatch();
      this.GetCummInvoiceLRList();
      this.GetLRSRSCNListforFilterDataOrdrRtrn();
      this.GetChequeList();
      this.GetOutStandingStkList();
      this.InventoryInwardlistForFilter();
      this.GetStockTransferListForFilter();
      this.GetInvoicePLListforOrderDispatch();
    }
  }

  //On click cross icon modal for new instance.
  OnClickCross() {
    this.InvoicList = [];
    this.CommonDataListforTable = [];
    this.DataSourceForLRSRSCNforDataOrdrRtrn = new MatTableDataSource();
    this.DataSourcePendingCN = new MatTableDataSource();
    this.DataSourceInveontoryInward = new MatTableDataSource();
    this.DataSourceChequeData = new MatTableDataSource();
    this.DataSourceForInvPickListStockTrnsfer = new MatTableDataSource();
    this.DataSource = new MatTableDataSource();
    this.DataSourceOrderDispCummPl = new MatTableDataSource<any>();
    this.DataSourceOrderDispCummPl = new MatTableDataSource<any>();
    this.DataSourceOrderDispCummInvoice = new MatTableDataSource<any>();
    this.DataSourceChqAcntCummdeposited = new MatTableDataSource<any>();
    this.DataSourceOrderRtrnCummVehicle = new MatTableDataSource<any>();
    this.DataSourceSummaryCount = new MatTableDataSource<any>();
    this.DataSourcePrioPendInv = new MatTableDataSource<any>();
    this.modalService.dismissAll();
    this.IsColorFlag = false;
  }

  // Get Order Dispatch All count.
  GetDashboardCount(DataModelCount: any) {
    this.isLoading = true;
    this._Service.GetOrderDisCount(DataModelCount)
      .subscribe((data: any) => {
        if (data !== null && data !== undefined && data !== "") {
          this.afterOrderDispatchCount(data);
        }
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  // Order dispatch after count s getting assign a variables to bind the data.
  afterOrderDispatchCount(data: DashbordorderDispatchcountmodel) {
    this.OrderdispatchModulecount = new DashbordorderDispatchcountmodel();
    this.OrderdispatchModulecount = data;
    this.TodayInv = this.OrderdispatchModulecount.TodayInv;
    this.PendingInv = this.OrderdispatchModulecount.PendingInv;
    this.PriorityInvToday = this.OrderdispatchModulecount.PriorityInvToday
    this.PriorityPending = this.OrderdispatchModulecount.PriorityPending;
    this.InvConcernPending = this.OrderdispatchModulecount.InvConcernPending;
    this.StkPrinted = this.OrderdispatchModulecount.StkPrintedToday;
    this.StkPending = this.OrderdispatchModulecount.StkPending;
    this.GPTodayCreated = this.OrderdispatchModulecount.GPTodayCreated;
    this.GPPending = this.OrderdispatchModulecount.GPPending;
    this.PendingLR = this.OrderdispatchModulecount.PendingLR;
    this.TPBox = this.OrderdispatchModulecount.TPBox;
    this.TPStockiest = this.OrderdispatchModulecount.TPStockiest;
    this.StkInv = this.OrderdispatchModulecount.StkInv;
    this.PLToday = this.OrderdispatchModulecount.PLToday;
    this.PLPending = this.OrderdispatchModulecount.PLPending;
    this.PLConcern = this.OrderdispatchModulecount.PLConcern;
    this.PLVerifiedToday = this.OrderdispatchModulecount.PLVerifiedToday;
    this.PLVerifiedPending = this.OrderdispatchModulecount.PLVerifiedPending;
    this.PLAllotedToday = this.OrderdispatchModulecount.PLAllotedToday;
    this.PLAllotedPending = this.OrderdispatchModulecount.PLAllotedPending;
    this.LocalMode = this.OrderdispatchModulecount.LocalMode;
    this.OtherCity = this.OrderdispatchModulecount.OtherCity;
    this.ByHand = this.OrderdispatchModulecount.ByHand;
    this.TotalInvoices = this.OrderdispatchModulecount.TotalInvoices;
    this.DispatchN = this.OrderdispatchModulecount.DispatchN;
    this.DispatchN1 = this.OrderdispatchModulecount.DispatchN1;
    this.DispatchN2 = this.OrderdispatchModulecount.DispatchN2;
    this.DispatchNPer = this.OrderdispatchModulecount.DispatchNPer;
    this.DispatchN1Per = this.OrderdispatchModulecount.DispatchN1Per;
    this.DispatchN2Per = this.OrderdispatchModulecount.DispatchN2Per;
    this.DispatchPending = this.OrderdispatchModulecount.DispatchPending;
    this.StkrPendingAmt = this.OrderdispatchModulecount.StkrPendingAmt;
    this.GPPendingAmt = this.OrderdispatchModulecount.GPPendingAmt;
    this.CummInvCnt = this.OrderdispatchModulecount.CummInvCnt;
    this.CummBoxesCnt = this.OrderdispatchModulecount.CummBoxes;
    this.CummPLCnt = this.OrderdispatchModulecount.CummPLCnt;
    this.TodaySalesAmt = this.OrderdispatchModulecount.TodaySalesAmt;
    this.CummSalesAmt = this.OrderdispatchModulecount.CummSalesAmt;
    this.LocalTotalDisp = this.OrderdispatchModulecount.LocalTotalDisp;
    this.OtherTotalDisp = this.OrderdispatchModulecount.OtherTotalDisp;
    this.ByHandTotalDisp = this.OrderdispatchModulecount.ByHandTotalDisp;
    this.StkrPendingAmtFormatData(this.GPPendingAmt, "GPPendingAmt");
    this.StkrPendingAmtFormatData(this.StkrPendingAmt, "StkrPendingAmt");
    this.StkrPendingAmtFormatData(this.TodaySalesAmt, "TodaySalesAmt");
    this.StkrPendingAmtFormatData(this.CummSalesAmt, "CummSalesAmt");
    this.chRef.detectChanges();
  }

  //Get LR Pending List
  GetLRPendingList() {
    this.isLoadingForOwner = true;
    this._Service.GetLRPendingList_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSourceLRPending.data = data;
      } else {
        this.DataSourceLRPending.data = [];
      }
      this.isLoadingForOwner = false;
      this.chRef.detectChanges();
    })
  }

  //Get Stk LR Pending List
  GetStkLRPendingList() {
    this.isLoadingForOwner = true;
    this._Service.GetStkLRPendingList_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSourceStkLRPending.data = data;
      } else {
        this.DataSourceStkLRPending.data = [];
      }
      this.isLoadingForOwner = false;
      this.chRef.detectChanges();
    })
  }

  //Get Inventory Inward All Count
  GetInventoryInwardCount(DataModelCount: any) {
    this.isLoading = true;
    this._Service.GetInvenInwardCount(DataModelCount)
      .subscribe((data: any) => {
        if (data !== null && data !== undefined && data !== "") {
          this.afterCountforInven(data);
        }
      }, (error: any) => {
        console.error("Error: " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      })
  }

  // Inventory Inward after count is getting assign a variables to bind the data.
  afterCountforInven(data: InventoryCountModel) {
    this.invCount = new InventoryCountModel();
    this.invCount = data;
    this.TotalVeh = this.invCount.TotalVeh;
    this.TodayVeh = this.invCount.TodayVeh;
    this.TotalCaseQty = this.invCount.TotalCaseQty;
    this.TodayCaseQty = this.invCount.TodayCaseQty;
    this.TodayClaimCnt = this.invCount.TodayClaimCnt;
    this.PendClaimCnt = this.invCount.PendClaimCnt;
    this.TodaySANCnt = this.invCount.TodaySANCnt;
    this.PendSANCnt = this.invCount.PendSANCnt;
    this.CummVehicle = this.invCount.CummVehicle;
    this.InvntryCummBoxes = this.invCount.CummBoxes;
    this.chRef.detectChanges();
  }

  //Get Order Return All Count
  GetOrderReturnCount(DataModelCount: any) {
    this.isLoading = true;
    this._Service.GetOrderReturnNewDashbord(DataModelCount)
      .subscribe((data: any) => {
        if (data !== null && data !== undefined && data !== "") {
          this.afterCountforOrderReturn(data);
        }
      }, (error: any) => {
        console.error("Error: " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      })
  }

  // Order Return after count is getting assign a variables to bind the data.
  afterCountforOrderReturn(data: OrderReturnModel) {
    this.OrderReturncnt = new OrderReturnModel();
    this.OrderReturncnt = data;
    this.ConsignToday = this.OrderReturncnt.ConsignToday;
    this.ConsignPending = this.OrderReturncnt.ConsignPending;
    this.atWarehouse = this.OrderReturncnt.atWarehouse;
    this.atOperator = this.OrderReturncnt.atOperator;
    this.atAuditorChk = this.OrderReturncnt.atAuditorChk;
    this.SalebleClaim = this.OrderReturncnt.SalebleClaim;
    this.DestrPending = this.OrderReturncnt.DestrPending;
    this.PendingCN = this.OrderReturncnt.PendingCN;
    this.SalebleCN1 = this.OrderReturncnt.SalebleCN1;
    this.SalebleCN2 = this.OrderReturncnt.SalebleCN2;
    this.SalebleMore2 = this.OrderReturncnt.SalebleMore2;
    this.SalebleCN1Per = this.OrderReturncnt.SalebleCN1Per;
    this.SalebleCN2Per = this.OrderReturncnt.SalebleCN2Per;
    this.Salemore2DaysPer = this.OrderReturncnt.Salemore2DaysPer;
    this.ExpCN15D = this.OrderReturncnt.ExpCN15D;
    this.ExpCN30D = this.OrderReturncnt.ExpCN30D;
    this.ExpCN45D = this.OrderReturncnt.ExpCN45D;
    this.ExpCNMore45D = this.OrderReturncnt.ExpCNMore45D;
    this.ExpCN15DPer = this.OrderReturncnt.ExpCN15DPer;
    this.ExpCN30DPer = this.OrderReturncnt.ExpCN30DPer;
    this.ExpCN45DPer = this.OrderReturncnt.ExpCN45DPer;
    this.ExpCNMore45DPer = this.OrderReturncnt.ExpCNMore45DPer;
    this.chRef.detectChanges()
  }

  //Get Cheque Accounting All Count
  GetChequeAccountingCount(DataModelCount: any) {
    this.isLoading = true;
    this._Service.GetChequeAccountingDashbord(DataModelCount)
      .subscribe((data: any) => {
        if (data !== null && data !== undefined && data !== "") {
          this.afterCountforChequeAcc(data);
        }
      }, (error: any) => {
        console.error("Error:" + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      })

  }

  // Cheque Accounting after count is getting assign a variables to bind the data.
  afterCountforChequeAcc(data: ChequeAcctModel) {
    this.cheacctcnt = new ChequeAcctModel();
    this.cheacctcnt = data;
    this.TodayBounce = this.cheacctcnt.TodayBounce;
    this.TotalChqBounced = this.cheacctcnt.TotalChqBounced;
    this.DueforFirstNotice = this.cheacctcnt.DueforFirstNotice;
    this.DueforLegalNotice = this.cheacctcnt.DueforLegalNotice;
    this.TodayDeposited = this.cheacctcnt.TodayDeposited;
    this.Overduestk = this.cheacctcnt.Overduestk;
    this.CummDiposited = this.cheacctcnt.CummDiposited;
    this.OverDueAmt = this.cheacctcnt.OverDueAmt;
    this.chRef.detectChanges();
  }

  //Get Stock Transfer Model Count
  GetStockTranscount(DataModelCount: any) {
    this.isLoading = true;
    this._Service.GetstocktransferCountdashbord(DataModelCount)
      .subscribe((data: any) => {
        if (data !== null && data !== undefined && data !== "") {
          this.afterCountStockTransfer(data);
        }
      }, (error: any) => {
        console.error("Error : " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      })
  }

  //Stock Transfer after count is getting assign a variables to bind the data.
  afterCountStockTransfer(data: StockTransferModel) {
    this.StockTrsCnt = new StockTransferModel();
    this.StockTrsCnt = data;
    this.InvPending = this.StockTrsCnt.InvPending;
    this.InvToday = this.StockTrsCnt.InvToday;
    this.ConcernPending = this.StockTrsCnt.ConcernPending;
    this.StkrToday = this.StockTrsCnt.StkrToday;
    this.StkrPending = this.StockTrsCnt.StkrPending;
    this.StkGPToday = this.StockTrsCnt.StkGPToday;
    this.StkGPPending = this.StockTrsCnt.StkGPPending;
    this.StkCummInvCnt = this.StockTrsCnt.StkCummInvCnt
    this.StkCummBoxCnt = this.StockTrsCnt.StkCummBoxCnt;
    this.StkCummPLCnt = this.StockTrsCnt.StkCummPLCnt;
    this.NoOfBoxes = this.StockTrsCnt.NoOfBoxes;
    this.LRPendingStockTrnsfer = this.StockTrsCnt.LRPendingStockTrnsfer;
    this.StkSticerPendingAmt = this.StockTrsCnt.StkSticerPendingAmt;
    this.StkGPPendingAmt = this.StockTrsCnt.StkGPPendingAmt;
    this.StkrPendingAmtFormatData(this.StkSticerPendingAmt, "StkSticerPendingAmt");
    this.StkrPendingAmtFormatData(this.StkGPPendingAmt, "StkGPPendingAmt");
    this.chRef.detectChanges();
  }

  //get Inoice Header List
  GetInvoiceListforOrderDispatch() {
    this.isLoadingSpinnerOrderDis = true;
    this._orderDispatchService.getDashboardInvoice_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.InvDataList = data;
        this.isLoadingSpinnerOrderDis = false;
      } else {
        this.InvDataList = [];
      }
      this.isLoadingSpinnerOrderDis = false;
      this.chRef.detectChanges();
      (error: any) => {
        console.log(error);
        this.isLoadingSpinnerOrderDis = false;
        this.chRef.detectChanges();
      }
    });
  }

  //get Inoice Header List
  GetCummInvoiceLRList() {
    this.isLoadingSpinnerOrderDis = true;
    this._Service.GetlistcummInvoicefilter_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.CummInvDataList = data;
        this.isLoadingSpinnerOrderDis = false;
      }
      this.isLoadingSpinnerOrderDis = false;
      this.chRef.detectChanges();
      (error: any) => {
        console.log(error);
        this.isLoadingSpinnerOrderDis = false;
        this.chRef.detectChanges();
      }
    });
  }

  //Get Invoice Picklist List Order dispatch
  GetInvoicePLListforOrderDispatch() {
    this.isLoadingSpinnerOrderDispPL = true;
    this._orderDispatchService.getDashboardPLInvoice_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.InvPLDataList = data;
      } else {
        this.DataSourceOrderDispPL.data = [];
      }
      this.isLoadingSpinnerOrderDispPL = false;
      this.chRef.detectChanges();
      (error: any) => {
        console.log(error);
        this.isLoadingSpinnerOrderDispPL = false;
        this.chRef.detectChanges();
      }
    });
  }

  //Get Order Return List
  GetLRSRSCNListforFilterDataOrdrRtrn() {
    this.isLoadingSpinnerOrdrRtrn = true;
    this._orderDispatchService.GetLRSRSCNListforFilterDataOrdrRtrn_service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataordrreturnList = data;
      } else {
        this.DataSourceForLRSRSCNforDataOrdrRtrn.data = [];
        this.DataordrreturnList = [];
      }
      this.isLoadingSpinnerOrdrRtrn = false;
      this.chRef.detectChanges();
      (error: any) => {
        console.log(error);
        this.isLoadingSpinnerOrdrRtrn = false;
        this.chRef.detectChanges();
      }
    });
  }

  //Get Pending CN List
  GetPendingCNList() {
    this.isLoadingSpinnerOrPenCN = true;
    this._orderDispatchService.GetPendingCN_service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSourcePendingCN.data = data;
      } else {
        this.DataSourcePendingCN.data = [];
      }
      this.isLoadingSpinnerOrPenCN = false;
      this.chRef.detectChanges();
    })
  }

  //Get Saleable Count List
  GetSaleableCntList() {
    this.isLoadingSpinnerOrPenCN = true;
    this._orderDispatchService.GetSaleableCnt_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSourcePendingCN.data = data;
      } else {
        this.DataSourcePendingCN.data = [];
      }
      this.isLoadingSpinnerOrPenCN = false;
      this.chRef.detectChanges();
    })
  }

  //Get Cheques List
  GetChequeList() {
    this.isLoadingSpinnerCHQ = true;
    this.chequeService.getDashBoardChequeList_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.ChequeData = data;
        this.isLoadingSpinnerCHQ = false;
      } else {
        this.DataSourceChequeData.data = [];
        this.ChequeData = [];
        this.isLoadingSpinnerCHQ = false;
      }
      this.isLoadingSpinnerCHQ = false;
      this.chRef.detectChanges();
    });
  }

  //Get for outstanding stockist List.
  GetOutStandingStkList() {
    this.isLoadingSpinnerStockistOutstand = true;
    this.chequeService.GetOutStandingStkList_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.OutStandingStk = data;
        this.isLoadingSpinnerStockistOutstand = false;
      } else {
        this.DataSourceOutStandingStk.data = [];
        this.OutStandingStk = [];
        this.isLoadingSpinnerStockistOutstand = false;
      }
      this.isLoadingSpinnerStockistOutstand = false;
      this.chRef.detectChanges();
    });
  }

  //Get Inveontory Inward list
  InventoryInwardlistForFilter() {
    this.isLoadingSpinnerInvtryInv = true;
    this.InvwrdService.InventoryInwardlistForFilter_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.InventoryInwrdData = data;
        this.isLoadingSpinnerInvtryInv = false;
      } else {
        this.DataSourceInveontoryInward.data = [];
        this.InventoryInwrdData = [];
      }
      this.isLoadingSpinnerInvtryInv = false;
      this.chRef.detectChanges();
    })
  }

  //stock transfer list
  GetStockTransferListForFilter() {
    this.isLoadingSpinnerStkTrsfr = true;
    this._Service.GetStockTransferListForFilter_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.StockTransferList = data;
      } else {
        this.DataSourceStockTransfer.data = [];
        this.StockTransferList = [];
      }
      this.isLoadingSpinnerStkTrsfr = false;
      this.chRef.detectChanges();
    });
  }

  //list for cumm. picklist order dispatch
  GetOrderDispatchListForCummPicklistFilter(OrderDisPicklist: any) {
    this.isLoadingSpinnerOrderDisCummPl = true;
    this._Service.Getlistcummpicklistfilter_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSourceOrderDispCummPl.data = [];
        this.OrdrDisCummPltList = [];
        this.OrdrDisCummPltList = data;
        this.PicklistDataOrderDispatch = this.OrdrDisCummPltList.filter((row: any) => (row.IsStockTransfer === 0));
        this.PicklistDataStockTrasnfer = this.OrdrDisCummPltList.filter((row: any) => (row.IsStockTransfer === 1));
        if (OrderDisPicklist === 'OrderDisPicklist') {
          this.DataSourceOrderDispCummPl.data = this.PicklistDataOrderDispatch;
        } else {
          this.DataSourceOrderDispCummPl.data = this.PicklistDataStockTrasnfer;
        }
      } else {
        this.DataSourceOrderDispCummPl.data = [];
        this.OrdrDisCummPltList = [];
      }
      this.isLoadingSpinnerOrderDisCummPl = false;
      this.chRef.detectChanges();
    });
  }

  //list for cumm. invoice Order dispatch
  GetOrderDispatchListForCummInvoiceFilter(Flag: any) {
    this.isLoadingSpinnerOrderDisCummInvoice = true;
    this._Service.GetlistcummInvoicefilter_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.OrdrDisCummInvoiceList = [];
        this.DataSourceOrderDispCummInvoice.data = [];
        this.OrdrDisCummInvoiceList = data;
        this.OrderDisCummInvoiceData = this.OrdrDisCummInvoiceList.filter((row: any) => (row.IsStockTransfer === 0));
        this.StockTrnsferCummInvoiceData = this.OrdrDisCummInvoiceList.filter((row: any) => (row.IsStockTransfer === 1));
        if (Flag === "OrderDisCummInvCnt") {
          this.DataSourceOrderDispCummInvoice.data = this.OrderDisCummInvoiceData;
        } else {
          this.DataSourceOrderDispCummInvoice.data = this.StockTrnsferCummInvoiceData;
        }
      } else {
        this.DataSourceOrderDispCummInvoice.data = [];
        this.OrdrDisCummInvoiceList = [];
      }
      this.isLoadingSpinnerOrderDisCummInvoice = false;
      this.chRef.detectChanges();
    });
  }

  //list for cumm. deposited cheque accounting
  GetChequeAccntListForFilterCummdeposited() {
    this.isLoadingSpinnerChqAcntCummDepo = true;
    this._Service.GetFilterCummdeposited_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSourceChqAcntCummdeposited.data = data;
      } else {
        this.DataSourceChqAcntCummdeposited.data = [];
      }
      this.isLoadingSpinnerChqAcntCummDepo = false;
      this.chRef.detectChanges();
    })
  }

  //list for cumm. vehicle order return
  OrderRtrnCummVehicleFilterList() {
    this.isLoadingSpinnerCummVehicle = true;
    this._Service.OrderRtrnCummVehicleFilterList_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSourceOrderRtrnCummVehicle.data = data;
      }
      else {
        this.DataSourceOrderRtrnCummVehicle.data = [];
      }
      this.isLoadingSpinnerCummVehicle = false;
      this.chRef.detectChanges();
    });
  }

  //Get Order Dispatch Summary Count  List
  GetOrderDispatchSummaryCountList() {
    this.isLoadingSpinnerOrdrDisSmmaryCnt = true;
    this._Service.GetOrderDispatchSummaryCountList_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSourceSummaryCount.data = data;
      } else {
        this.DataSourceSummaryCount.data = [];
      }
      this.isLoadingSpinnerOrdrDisSmmaryCnt = false;
      this.chRef.detectChanges();
    })
  }

  //Get Order Dispatch Summary Count  List
  GetStockTransferSummaryCountList() {
    this.isLoadingSpinnerstockTrnsfrSmmaryCnt = true;
    this._Service.GetStockTransferSummaryCountList_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSourceStockTrnsferSummaryCount.data = data;
      } else {
        this.DataSourceStockTrnsferSummaryCount.data = [];
      }
      this.isLoadingSpinnerstockTrnsfrSmmaryCnt = false;
      this.chRef.detectChanges();
    })
  }

  //open modal for clickable counts
  OpenModalModalForFilterCount(content: any, flag: string) {
    this.DashbordsModel = this.modalService.open(content, {
      centered: true,
      size: 'xl',
      scrollable: true,
      backdrop: 'static'
    });
    this.ShowFilteredCountList(flag);
  }

  //Filter All Count
  ShowFilteredCountList(Flag?: any) {
    this.InvoicList = [];
    this.CommonDataListforTable = [];
    if (this.InvDataList != null && this.InvDataList != undefined || this.DataordrreturnList !== null || this.StockTransferList !== null || this.ChequeData !== null
      || this.InventoryInwrdData !== null) {
        
      // Order Dispatch Filter ---------------------
      if (Flag === 'TodayInv') {
        this.ModalcountTitle = "List View - Today's Invoices" + ' (' + this.TodayInv + ')';
        this.CommonDataListforTable = this.InvDataList.filter(x => x.InvCreatedDate === this.TodayDateForFilter && x.IsStockTransfer === 0);
      }
      else if (Flag === 'TPBox') {
        this.ModalcountTitle = "List View - Pending Boxes" + ' (' + this.TPBox + ')';
      }
      else if (Flag === 'PendingInv') {
        this.ModalcountTitle = "List View - Pending Invoices" + ' (' + this.PendingInv + ')';
        this.CommonDataListforTable = this.InvDataList.filter(x => (x.InvStatus < 7) && x.IsStockTransfer === 0);
      }
      else if (Flag === 'PriorityInvToday') {
        this.ModalcountTitle = "List View - Priority Invoices Today" + ' (' + this.PriorityInvToday + ')';
        this.CommonDataListforTable = this.InvDataList.filter(x => x.OnPriority === 1 && x.InvCreatedDate === this.TodayDateForFilter);
      }
      else if (Flag === 'PriorityInvPending') {
        this.ModalcountTitle = "List View - Priority Invoices Pending" + ' (' + this.PriorityPending + ')';
      }
      else if (Flag === 'InvConcernPending') {
        this.ModalcountTitle = "List View - Concern Invoices Pending" + ' (' + this.InvConcernPending + ')';
        this.CommonDataListforTable = this.InvDataList.filter(x => (x.InvStatus === 4 || x.InvStatus === 6));
      }
      else if (Flag === 'StkPrinted') {
        this.ModalcountTitle = "List View - Sticker Pending" + ' (' + this.StkPrinted + ')';
        this.CommonDataListforTable = this.InvDataList.filter(x => x.ReadyToDispatchDate === this.TodayDateForFilter);
      }
      else if (Flag === 'StkPending') {
        this.ModalcountTitle = "List View - Packing Invoice" + ' (' + this.StkPending + ')' + " - " + "Total Amount " + '- ' + this.StkrPendingAmtFormat;
        this.CommonDataListforTable = this.InvDataList.filter(x => x.InvStatus !== 5 && x.InvStatus !== 8 && x.InvStatus !== 7 && x.InvStatus !== 9 && x.IsStockTransfer === 0);
      }
      else if (Flag === 'GPTodayCreated') {
        this.ModalcountTitle = "List View - Gatepass Created Today" + ' (' + this.GPTodayCreated + ')';
        this.CommonDataListforTable = this.InvDataList.filter(x => x.InvStatus === 5 && x.GatepassDate === this.TodayDateForFilter);
      }
      else if (Flag === 'GPPending') {
        this.ModalcountTitle = "List View - Dispatch Invoice" + ' (' + this.GPPending + ')' + " - " + "Total Amount " + '- ' + this.GPPendingAmtFormat;
        this.CommonDataListforTable = this.InvDataList.filter(x => x.InvStatus === 5 && x.IsStockTransfer === 0);
      }
      else if (Flag === 'PendingLR') {
        this.ModalcountTitle = "List View - Pending LR Updation " + '(' + this.PendingLR + ')';
      }
      else if (Flag === 'StkInv') {
        this.ModalcountTitle = "List View - Stockist No of Invoices" + '(' + this.StkInv + ')';
        this.CommonDataListforTable = this.InvDataList.filter(x => (x.InvStatus === 7));
      }
      else if (Flag === 'LocalMode') {
        this.ModalcountTitle = "List View - No of boxes dispatched - Local " + '(' + this.LocalMode + ')' + " - " + "Total Pending" + '(' + this.LocalTotalDisp + ')';
        this.CommonDataListforTable = this.InvDataList.filter(x => x.TransportModeId === 1 && x.InvStatus < 7 && x.IsStockTransfer === 0);
      }
      else if (Flag === 'OtherCity') {
        this.ModalcountTitle = "List View - No of boxes dispatched - Other City " + '(' + this.OtherCity + ')' + " - " + "Total Pending" + '(' + this.OtherTotalDisp + ')';
        this.CommonDataListforTable = this.InvDataList.filter(x => x.TransportModeId === 2 && x.InvStatus < 7 && x.IsStockTransfer === 0);
      }
      else if (Flag === 'ByHand') {
        this.ModalcountTitle = "List View - No of boxes dispatched - By Hand " + '(' + this.ByHand + ')' + " - " + "Total Pending" + '(' + this.ByHandTotalDisp + ')';
        this.CommonDataListforTable = this.InvDataList.filter(x => x.TransportModeId === 3 && x.InvStatus < 7 && x.IsStockTransfer === 0);
      }
      else if (Flag === 'PLToday') {
        this.ModalcountTitle = "List View - Today's Picklist" + ' (' + this.PLToday + ')';
        this.CommonDataListforTable = this.InvPLDataList.filter(x => x.PLDate === this.TodayDateForFilter && x.IsStockTransfer === 0);
      }
      else if (Flag === 'PLPending') {
        this.ModalcountTitle = "List View - Pending Picklist" + ' (' + this.PLPending + ')';
        this.CommonDataListforTable = this.InvPLDataList.filter(x => (x.PicklistStatus !== 8 && x.PicklistStatus !== 10 && x.PicklistStatus !== 11) && x.IsStockTransfer === 0);
      }
      else if (Flag === 'PLConcern') {
        this.ModalcountTitle = "List View - Pending Concern" + ' (' + this.PLConcern + ')';
        this.CommonDataListforTable = this.InvPLDataList.filter(x => (x.PicklistStatus === 9) && x.IsStockTransfer === 0);
      }
      else if (Flag === 'PLVerifiedToday') {
        this.ModalcountTitle = "List View - Verified Picklist Today" + ' (' + this.PLVerifiedToday + ')';
        this.CommonDataListforTable = this.InvPLDataList.filter(x => x.VerifiedDate === this.TodayDateForFilter && x.IsStockTransfer === 0);
      }
      else if (Flag === 'PLVerifiedPending') {
        this.ModalcountTitle = "List View - Pending Verified Picklist Today " + ' (' + this.PLVerifiedPending + ')';
        this.CommonDataListforTable = this.InvPLDataList.filter(x => x.PicklistStatus === 0 && x.IsStockTransfer === 0);
      }
      else if (Flag === 'PLAllotedToday') {
        this.ModalcountTitle = "List View - Picklist Alloted Today " + ' (' + this.PLAllotedToday + ')';
        this.CommonDataListforTable = this.InvPLDataList.filter(x => (x.PicklistStatus === 3 || x.PicklistStatus === 6) && x.AllottedDate === this.TodayDateForFilter && x.IsStockTransfer === 0);
      }
      else if (Flag === 'PLAllotedPending') {
        this.ModalcountTitle = "List View - Picklist Alloted Pending " + ' (' + this.PLAllotedPending + ')';
        this.CommonDataListforTable = this.InvPLDataList.filter(x => x.PicklistStatus !== 0 && x.PicklistStatus !== 11 && x.PicklistStatus !== 3 && x.PicklistStatus !== 4 && x.PicklistStatus !== 6 && x.PicklistStatus !== 9 && x.PicklistStatus !== 10 && x.IsStockTransfer === 0);
      }
      else if (Flag === 'DispatchN') {
        this.ModalcountTitle = "List View - Total Dispatch - N " + '(' + this.DispatchN + ')';
        this.CommonDataListforTable = this.CummInvDataList.filter(x => x.DispatchN === 1 && x.IsStockTransfer === 0);
      }
      else if (Flag === 'DispatchN1') {
        this.ModalcountTitle = "List View - Total Dispatch - N + 1" + '(' + this.DispatchN1 + ')';
        this.CommonDataListforTable = this.CummInvDataList.filter(x => x.DispatchN1 === 1 && x.IsStockTransfer === 0);
      }
      else if (Flag === 'DispatchN2') {
        this.ModalcountTitle = "List View - Total Dispatch - N + 2" + '(' + this.DispatchN2 + ')';
        this.CommonDataListforTable = this.CummInvDataList.filter(x => x.DispatchN2 === 1 && x.IsStockTransfer === 0);
      }
      else if (Flag === 'DispatchPending') {
        this.ModalcountTitle = "List View - Dispatch Pending " + '(' + this.DispatchPending + ')';
        this.CommonDataListforTable = this.InvDataList.filter(x => x.InvStatus < 7);
      }
      if (Flag === 'CummInvCnt') {
        this.ModalcountTitle = "List View - Cumm. Invoice" + ' (' + this.CummInvCnt + ')';
      }
      if (Flag === 'CummPLCnt') {
        this.ModalcountTitle = "List View - Cumm. Picklist" + ' (' + this.CummPLCnt + ')';
      }

      // Cheque Accounting Filter---------------------
      else if (Flag === 'TodayBounce') {
        this.ModalcountTitle = "List View - Today Cheque Bounced  " + '(' + this.TodayBounce + ')';
        this.CommonDataListforTable = this.ChequeData.filter(x => x.ChqStatus === 5 && x.ReturnedDate === this.TodayDateForFilter);
      }
      else if (Flag === 'TotalChqBounced') {
        this.IsColorFlag = false;
        this.ModalcountTitle = "List View - Total Cheque Bounced  " + '(' + this.TotalChqBounced + ')';
        this.CommonDataListforTable = this.ChequeData.filter(x => x.ChqStatus === 5);
      }
      else if (Flag === 'DueforFirstNotice') {
        this.IsColorFlag = true;
        this.ModalcountTitle = "List View - Due for 1st Notice" + '(' + this.DueforFirstNotice + ')';
        this.CommonDataListforTable = this.ChequeData.filter(x => x.ChqStatus === 5 && x.IsDueforFirstNotice === 1);
      }
      else if (Flag === 'DueforLegalNotice') {
        this.ModalcountTitle = "List View - Due for Legal Notice" + '(' + this.DueforLegalNotice + ')';
        this.CommonDataListforTable = this.ChequeData.filter(x => x.ChqStatus === 6 && x.IsDueforLegalNotice === 1);
      }
      else if (Flag === 'TodayDeposited') {
        this.ModalcountTitle = "List View - Today's Deposited  " + '(' + this.TodayDeposited + ')';
        this.CommonDataListforTable = this.ChequeData.filter(x => x.ChqStatus === 4 && x.DepositedDate === this.TodayDateForFilter);
      }
      else if (Flag === 'Overduestk') {
        this.ModalcountTitle = "List View - Overdue Stockist" + '(' + this.Overduestk + ')' + " - " + "Total Amount " + '- ' + this.OverDueAmt;
        this.CommonDataListforTable = this.OutStandingStk.filter(x => x.OverdueAmt > 0);
      }

      else if (Flag === 'CummDiposited') {
        this.ModalcountTitle = "List View - Cumm. Deposited" + '(' + this.CummDiposited + ')';
        this.CommonDataListforTable = this.OutStandingStk.filter(x => x.OverdueAmt > 0);
      }

      //Inventory Inward Filter
      else if (Flag === 'CummVehicle') {
        this.ModalcountTitle = "List View - Cumm. Vehical" + '(' + this.CummVehicle + ')';
      }
      else if (Flag === 'TodayVeh') {
        this.ModalcountTitle = "List View - Today's Vehical" + '(' + this.TodayVeh + ')';
        this.CommonDataListforTable = this.InventoryInwrdData.filter(x => (x.AddedOn !== "0001-01-01" || x.AddedOn !== "" || x.AddedOn !== null) && x.AddedOn === this.TodayDateForFilter);
      }
      else if (Flag === 'TodayClaimCnt') {
        this.ModalcountTitle = " List View - Today Claim" + '(' + this.TodayClaimCnt + ')';
        this.CommonDataListforTable = this.InventoryInwrdData.filter(x => (x.ClaimNo !== "" && x.ClaimNo !== null) && x.ClaimDate === this.TodayDateForFilter);
      }
      else if (Flag === 'PendClaimCnt') {
        this.ModalcountTitle = " List View - Cumm. Pending Claim" + '(' + this.PendClaimCnt + ')';
        this.CommonDataListforTable = this.InventoryInwrdData.filter(x => (x.ClaimNo !== null && x.ClaimNo !== "") && (x.ClaimApproveBy === null));
      }
      else if (Flag === 'TodaySANCnt') {
        this.ModalcountTitle = " List View - Today's SAN" + '(' + this.TodaySANCnt + ')';
        this.CommonDataListforTable = this.InventoryInwrdData.filter(x => (x.SANNo !== "" && x.SANNo !== null) && x.SANDate === this.TodayDateForFilter);
      }
      else if (Flag === 'PendSANCnt') {
        this.ModalcountTitle = " List View - Cumm. Pending SAN " + '(' + this.PendSANCnt + ')';
        this.CommonDataListforTable = this.InventoryInwrdData.filter(x => (x.SANNo !== null && x.SANNo !== "") && (x.SANApproveBy === null));
      }
      else if (Flag === 'TodayCaseQty') {
        this.ModalcountTitle = "List View - Today's Boxes" + '(' + this.TodayCaseQty + ')';
        this.CommonDataListforTable = this.InventoryInwrdData.filter(x => x.VehicleNo !== "");
      }

      // Order Return Filter List
      else if (Flag === 'ConsignToday') {
        this.ModalcountTitle = "List View - Settlement Period - Today's Consignment  " + '(' + this.ConsignToday + ')';
        this.CommonDataListforTable = this.DataordrreturnList.filter(x => x.LREntryDateFormat === this.TodayDateForFilter);
      }
      else if (Flag === 'ConsignPending') {
        this.ModalcountTitle = "List View - All Pending Consignment" + '(' + this.ConsignPending + ')';
        this.CommonDataListforTable = this.DataordrreturnList.filter(x => x.CNId === 0);
      }
      else if (Flag === 'atWarehouse') {
        this.ModalcountTitle = "List View - At Ware house " + '(' + this.atWarehouse + ')';
        this.CommonDataListforTable = this.DataordrreturnList.filter(x => x.RecvdAtOP === false);
      }
      else if (Flag === 'atOperator') {
        this.ModalcountTitle = "List View - At Operator End  " + '(' + this.atOperator + ')';
        this.CommonDataListforTable = this.DataordrreturnList.filter(x => x.RecvdAtOP === true && (x.SRSId === 0 || x.SRSId === null));
      }
      else if (Flag === 'atAuditorChk') {
        this.ModalcountTitle = "List View - At Auditor Check " + '(' + this.atAuditorChk + ')';
        this.CommonDataListforTable = this.DataordrreturnList.filter(x => x.SRSId > 0 && x.IsVerified === null && (x.CNId === 0 || x.CNId === null));
      }
      else if (Flag === 'SalebleClaim') {
        this.ModalcountTitle = "List View -Saleable Claim  " + '(' + this.SalebleClaim + ')';
      }
      else if (Flag === 'DestrPending') {
        this.ModalcountTitle = "List View - Pending For Distruction" + '(' + this.DestrPending + ')';
        this.CommonDataListforTable = this.DataordrreturnList.filter(x => x.DestrCertDate === null && (x.DestrCertFile === '' || x.DestrCertFile === null || x.DestrCertAddedBy === 0) && x.CNId === 0);
      }
      else if (Flag === 'SalebleCN1') {
        this.ModalcountTitle = "List View - Saleable Credit Note - 1 days " + '(' + this.SalebleCN1 + ')';
        this.CommonDataListforTable = this.DataordrreturnList.filter(x => x.SalebleCN1 === 1);
      }
      else if (Flag === 'SalebleCN2') {
        this.ModalcountTitle = "List View - Saleable Credit Note - 2 days " + '(' + this.SalebleCN2 + ')';
        this.CommonDataListforTable = this.DataordrreturnList.filter(x => x.SalebleCN2 === 1);
      }
      else if (Flag === 'SalebleMore2') {
        this.ModalcountTitle = "List View - Saleable Credit Note - More than 2 Days" + '(' + this.SalebleMore2 + ')';
        this.CommonDataListforTable = this.DataordrreturnList.filter(x => x.SalebleMore2 === 1);
      }
      else if (Flag === 'PendingCN') {
        this.ModalcountTitle = "List View - Pending CN " + '(' + this.PendingCN + ')';
      }
      else if (Flag === 'ExpCN15D') {
        this.ModalcountTitle = "List View - Settlement Period - 15 days " + '(' + this.ExpCN15D + ')';
        this.CommonDataListforTable = this.DataordrreturnList.filter(x => x.ExpCN15D === 1);
      }
      else if (Flag === 'ExpCN30D') {
        this.ModalcountTitle = "List View - Settlement Period - 30 Days " + '(' + this.ExpCN30D + ')';
        this.CommonDataListforTable = this.DataordrreturnList.filter(x => x.ExpCN30D === 1);
      }
      else if (Flag === 'ExpCN45D') {
        this.ModalcountTitle = "List View - Settlement Period - 45 Days " + '(' + this.ExpCN45D + ')';
        this.CommonDataListforTable = this.DataordrreturnList.filter(x => x.ExpCN45D === 1);
      }
      else if (Flag === 'ExpCNMore45D') {
        this.ModalcountTitle = "List View - Settlement Period - > 45 Days " + '(' + this.ExpCNMore45D + ')';
        this.CommonDataListforTable = this.DataordrreturnList.filter(x => x.ExpCNMore45D === 1);
      }

      // Stock Transfer Filter List
      else if (Flag === 'StkTrnsfrInvToday') {
        this.ModalcountTitle = "List View - Today's Invoices Stock Transfer" + ' (' + this.InvToday + ')';
        this.CommonDataListforTable = this.StockTransferList.filter(x => x.InvCreatedDate === this.TodayDateForFilter && x.IsStockTransfer === 1);
      }
      else if (Flag === 'StkTrnsfInvPending') {
        this.ModalcountTitle = "List View - Pending Invoices Stock Transfer" + ' (' + this.InvPending + ')';
        this.CommonDataListforTable = this.StockTransferList.filter(x => x.InvStatus < 7 && x.IsStockTransfer === 1);
      }
      else if (Flag === 'StkTrnsfConcernPending') {
        this.ModalcountTitle = "List View - Concern Pending Stock Transfer" + ' (' + this.ConcernPending + ')';
        this.CommonDataListforTable = this.StockTransferList.filter(x => x.InvStatus === 4 && x.InvStatus === 6 && x.IsStockTransfer === 1);
      }
      else if (Flag === 'StkTrnsfrStkrToday') {
        this.ModalcountTitle = "List View - Today's Print Sticker Stock Transfer" + ' (' + this.StkrToday + ')';
        this.CommonDataListforTable = this.StockTransferList.filter(x => x.ReadyToDispatchDate === this.TodayDateForFilter && x.IsStockTransfer === 1);
      }
      else if (Flag === 'StkTrnsfrStkrPending') {
        this.ModalcountTitle = "List View - Pending Sticker Stock Transfer" + ' (' + this.StkrPending + ')' + "";
        this.CommonDataListforTable = this.StockTransferList.filter(x => x.InvStatus !== 5 && x.InvStatus !== 20 && x.InvStatus !== 8 && x.InvStatus !== 7 && x.InvStatus !== 9 && x.IsStockTransfer === 1);
      }
      else if (Flag === 'SStkTrnsfrGPToday') {
        this.ModalcountTitle = "List View - Gatepass Today's Created" + ' (' + this.StkGPToday + ')';
        this.CommonDataListforTable = this.StockTransferList.filter(x => x.ReadyToDispatchDate === this.TodayDateForFilter && x.IsStockTransfer === 1);
      }
      else if (Flag === 'StkTrnsfrGPPending') {
        this.ModalcountTitle = "List View - Pending Gatepass" + ' (' + this.StkGPPending + ')' + "";
        this.CommonDataListforTable = this.StockTransferList.filter(x => x.InvStatus === 5 && x.IsStockTransfer === 1);
      }
      else if (Flag === 'CummPicklistStockTrnsf') {
        this.ModalcountTitle = "List View - Cumm. Picklist" + ' (' + this.StkCummPLCnt + ')';
      }
      else if (Flag === 'CummInvoiceStockTrnsfer') {
        this.ModalcountTitle = "List View - Cumm. Invoice" + ' (' + this.StkCummInvCnt + ')';
      }
      else if (Flag === 'PendingLRStockTrnsfer') {
        this.ModalcountTitle = "List View - Pending LR Updation " + '(' + this.LRPendingStockTrnsfer + ')';
      }
      else if (Flag === 'NoOfBoxes') {
        this.ModalcountTitle = "List View - Pending Boxes" + ' (' + this.NoOfBoxes + ')';
      }
      // new instance for MatTableDataSource
      this.DataSource.data = [];
      this.DataSourceForLRSRSCNforDataOrdrRtrn.data = [];
      this.DataSourceInveontoryInward.data = [];
      this.DataSourceForInvPickListStockTrnsfer.data = [];
      this.DataSourceInveontoryInward = new MatTableDataSource(this.CommonDataListforTable);
      this.DataSourceChequeData = new MatTableDataSource(this.CommonDataListforTable);
      this.DataSourceOutStandingStk = new MatTableDataSource(this.CommonDataListforTable);
      this.DataSourceInveontoryClaimSAN = new MatTableDataSource(this.CommonDataListforTable);
      this.DataSourceForLRSRSCNforDataOrdrRtrn = new MatTableDataSource(this.CommonDataListforTable);
      this.DataSourceStockTransfer = new MatTableDataSource(this.CommonDataListforTable);
      this.DataSource = new MatTableDataSource(this.CommonDataListforTable);
      this.DataSourceOrderDispPL = new MatTableDataSource(this.CommonDataListforTable);
      this.chRef.detectChanges();

    }
  }

  StkrPendingAmtFormatData(value: any, flag: string) {
    var testdata = Number(value);
    const val = Math.abs(testdata);
    //Packing Invoice Order Dispatch
    if (flag === "StkrPendingAmt") {
      if (val > 1000 && val < 10000) {
        this.StkrPendingAmtFormat = (val / 1000).toFixed(2) + ' K';
      }
      else if (val > 100000 && val < 10000000) {
        this.StkrPendingAmtFormat = (val / 100000).toFixed(2) + ' L';
      }
      else if (val > 10000000) {
        this.StkrPendingAmtFormat = (val / 1000000).toFixed(2) + ' Cr';
      }
    }
    //Dispatch Invoice Order Dispatch
    else if (flag === "GPPendingAmt") {
      if (val > 1000 && val < 10000) {
        this.GPPendingAmtFormat = (val / 1000).toFixed(2) + ' K';
      }
      else if (val > 100000 && val < 10000000) {
        this.GPPendingAmtFormat = (val / 100000).toFixed(2) + ' L';
      }
      else if (val > 10000000) {
        this.GPPendingAmtFormat = (val / 1000000).toFixed(2) + ' Cr';
      }
    }
    //Packing Invoice Stock Transfer
    else if (flag === "StkSticerPendingAmt") {
      if (val > 1000 && val < 10000) {
        this.StockTrnsfrStkrPendingAmtFormat = (val / 1000).toFixed(2) + ' K';
      }
      else if (val > 100000 && val < 10000000) {
        this.StockTrnsfrStkrPendingAmtFormat = (val / 100000).toFixed(2) + ' L';
      }
      else if (val > 10000000) {
        this.StockTrnsfrStkrPendingAmtFormat = (val / 1000000).toFixed(2) + ' Cr';
      }
    }
    //Dispatch Invoice Stock Transfer
    else if (flag === "StkGPPendingAmt") {
      if (val > 1000 && val < 10000) {
        this.StockTrnsfrGPPendingAmtFormat = (val / 1000).toFixed(2) + ' K';
      }
      else if (val > 100000 && val < 10000000) {
        this.StockTrnsfrGPPendingAmtFormat = (val / 100000).toFixed(2) + ' L';
      }
      else if (val > 10000000) {
        this.StockTrnsfrGPPendingAmtFormat = (val / 1000000).toFixed(2) + ' Cr';
      }
    }
    else if (flag === "TodaySalesAmt") {
      if (val > 1000 && val < 10000) {
        this.TodaySaleaAmtFormat = (val / 1000).toFixed(2) + ' K';
      }
      else if (val > 100000 && val < 10000000) {
        this.TodaySaleaAmtFormat = (val / 100000).toFixed(2) + ' L';
      }
      else if (val > 10000000) {
        this.TodaySaleaAmtFormat = (val / 1000000).toFixed(2) + ' Cr';
      }
    }
    else if (flag === "CummSalesAmt") {
      if (val > 1000 && val < 10000) {
        this.CummSaleAmtFormat = (val / 1000).toFixed(2) + ' K';
      }
      else if (val > 100000 && val < 10000000) {
        this.CummSaleAmtFormat = (val / 100000).toFixed(2) + ' L';
      }
      else if (val > 10000000) {
        this.CummSaleAmtFormat = (val / 1000000).toFixed(2) + ' Cr';
      }
    }

  }

  //Get Own Order Dispatch Pend Inv List
  GetPrioPendInvList() {
    this.isLoadingForOwner = true;
    this._Service.GetPrioPendInvList_Service(this.BranchId, this.CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSourcePrioPendInv.data = data;
      } else {
        this.DataSourcePrioPendInv.data = [];
      }
      this.isLoadingForOwner = false;
      this.chRef.detectChanges();
    })
  }

  // Owner Login Start
  // Get Owner Login Dash Count
  GetOwnerLoginDashCount(DataModelCount: any) {
    this.isLoading = true;
    this._Service.GetOwnerLoginDashCount_Service(DataModelCount)
      .subscribe((data: any) => {
        if (data !== null && data !== undefined && data !== "") {
          this.afterOwnerLoginDashCount(data);
        }
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }
  // Get AFTER Owner Login Dash Count.
  afterOwnerLoginDashCount(data: OwnerLoginDashCnt) {
    this.ownerLoginDashCnt = new OwnerLoginDashCnt();
    this.ownerLoginDashCnt = data;
    this.oPriorityPending = this.ownerLoginDashCnt.OPrioPending;
    this.oStkPending = this.ownerLoginDashCnt.OStkrPending;
    this.oStkPendingAmt = this.ownerLoginDashCnt.OStkrPendingAmt;
    this.oGPPending = this.ownerLoginDashCnt.OGPPending;
    this.oGPPendingAmt = this.ownerLoginDashCnt.OGPPendingAmt;
    this.oTPBox = this.ownerLoginDashCnt.OTPBox;
    this.oTotalChqBounced = this.ownerLoginDashCnt.OTotalChqBounced;
    this.oDueforFirstNotice = this.ownerLoginDashCnt.ODueforFirstNotice;
    this.oDueforLegalNotice = this.ownerLoginDashCnt.ODueforLegalNotice;
    this.oOverDueStk = this.ownerLoginDashCnt.OOverDueStk;
    this.oOverDueAmt = this.ownerLoginDashCnt.OOverDueAmt;
    this.oPendSANCnt = this.ownerLoginDashCnt.OPendSANCnt;
    this.oPendClaimCnt = this.ownerLoginDashCnt.OPendClaimCnt;
    this.oConsignPending = this.ownerLoginDashCnt.OConsignPending;
    this.oSalebleCN2_7 = this.ownerLoginDashCnt.OSalebleCN2_7;
    this.oMore11Days = this.ownerLoginDashCnt.OMore11Days;
    this.oStkStickerPending = this.ownerLoginDashCnt.OStkStickerPending;
    this.oStkSticerPendingAmt = this.ownerLoginDashCnt.OStkSticerPendingAmt;
    this.oStkGPPending = this.ownerLoginDashCnt.OStkGPPending;
    this.oStkGPPendingAmt = this.ownerLoginDashCnt.OStkGPPendingAmt;
    this.oNoOfBoxes = this.ownerLoginDashCnt.ONoOfBoxes;
    this.StkrPendingAmtFormatData(this.oStkPendingAmt, "StkrPendingAmt");
    this.StkrPendingAmtFormatData(this.oGPPendingAmt, "GPPendingAmt");
    this.StkrPendingAmtFormatData(this.oStkSticerPendingAmt, "StkSticerPendingAmt");
    this.StkrPendingAmtFormatData(this.oStkGPPendingAmt, "StkGPPendingAmt");
    this.chRef.detectChanges();
  }

  OpenModalOwnerLoginFilterCount(content: any, Type: string) {
    this.OwnerDashbordsModel = this.modalService.open(content, {
      centered: true,
      size: 'xl',
      scrollable: true,
      backdrop: 'static'
    });
    this.ShowOwnerFilteredCountList(Type);
  }

  ShowOwnerFilteredCountList(Type?: any) {
    // Order Dispatch 
    if (Type === 'oPriorityPending') {
      this.OwnerModalcountTitle = "List View - Priority Invoices Pending" + ' (' + this.oPriorityPending + ')';
      this.InvType = 'oPriorityPending';
    }
    else if (Type === 'oStkPending') {
      this.OwnerModalcountTitle = "List View - Packing Invoice" + ' (' + this.oStkPending + ')' + " - " + "Total Amount " + '- ' + this.StkrPendingAmtFormat;
      this.InvType = 'oStkPending';
    }
    else if (Type === 'oGPPending') {
      this.OwnerModalcountTitle = "List View - Dispatch Invoice" + ' (' + this.oGPPending + ')' + " - " + "Total Amount " + '- ' + this.GPPendingAmtFormat;
      this.InvType = 'oGPPending';
    }
    else if (Type === 'oTPBox') {
      this.OwnerModalcountTitle = "List View - Pending Boxes" + ' (' + this.oTPBox + ')';
    }
    // Cheque Accounting
    else if (Type === 'oTotalChqBounced') {
      this.IsColorFlag = false;
      this.OwnerModalcountTitle = "List View - Total Cheque Bounced  " + '(' + this.oTotalChqBounced + ')';
      this.InvType = 'oTotalChqBounced';
    }
    else if (Type === 'oDueforFirstNotice') {
      this.IsColorFlag = true;
      this.OwnerModalcountTitle = "List View - Due for 1st Notice" + '(' + this.oDueforFirstNotice + ')';
      this.InvType = 'oDueforFirstNotice';
    }
    else if (Type === 'oDueforLegalNotice') {
      this.OwnerModalcountTitle = "List View - Due for Legal Notice" + '(' + this.oDueforLegalNotice + ')';
      this.InvType = 'oDueforLegalNotice';
    }
    else if (Type === 'oOverDueStk') {
      this.OwnerModalcountTitle = "List View - Overdue Stockist" + '(' + this.oOverDueStk + ')' + " - " + "Total Amount " + '- ' + this.oOverDueAmt; // need to check
      this.InvType = 'oGPPending';
    }
    // Inventory Inward
    else if (Type === 'oPendClaimCnt') {
      this.OwnerModalcountTitle = " List View - Cumm. Pending Claim" + '(' + this.oPendClaimCnt + ')';
      this.InvType = 'oPendClaimCnt';
    }
    else if (Type === 'oPendSANCnt') {
      this.OwnerModalcountTitle = " List View - Cumm. Pending SAN" + '(' + this.oPendSANCnt + ')';
      this.InvType = 'oPendSANCnt';
    }
    // Order Return
    else if (Type === 'oConsignPending') {
      this.OwnerModalcountTitle = "List View - All Pending Consignment" + '(' + this.oConsignPending + ')';
    }
    else if (Type === 'oSalebleCN2_7') {
      this.OwnerModalcountTitle = "List View - Saleable Credit Note - More than 2 Days" + '(' + this.oSalebleCN2_7 + ')';
      this.InvType = 'oSalebleCN2_7';
    }
    else if (Type === 'oMoreThan11Days') {
      this.OwnerModalcountTitle = "List View - Settlement Period -> 45Days " + '(' + this.oMore11Days + ')';
      this.InvType = 'oMoreThan11Days';
    }
    // Stock Transfer
    if (Type === 'oStkStickerPending') {
      this.OwnerModalcountTitle = "List View - Priority Invoices Pending" + ' (' + this.oStkStickerPending + ')';
      this.InvType = 'oStkStickerPending';
    }
    else if (Type === 'oStkGPPending') {
      this.OwnerModalcountTitle = "List View - Packing Invoice" + ' (' + this.oStkGPPending + ')';
      this.InvType = 'oStkGPPending';
    }
    else if (Type === 'oNoOfBoxes') {
      this.OwnerModalcountTitle = "List View - Pending Boxes" + ' (' + this.oNoOfBoxes + ')';
    }
    this.chRef.detectChanges();
  }
  InvType: string = '';
  //Get Own Order Dispatch Pend Inv List
  GetOwnOrderDispatchPendInvList(FlagType: any) {
    this.isLoadingForOwner = true;
    this._Service.GetOwnODInvSmmryList_Service().subscribe((data: any) => {
      if (data.length > 0) {
        this.PendiInvList = data;
        if (FlagType === 'oPriorityPending') {
          this.DataSourceOwnODPendInv.data = this.PendiInvList.filter(x => x.PrioPending !== 0);
        }
        else if (FlagType === 'oStkPending') {
          this.DataSourceOwnODPendInv.data = this.PendiInvList.filter(x => x.StkrPending !== 0);
        }
        else if (FlagType === 'oGPPending') {
          this.DataSourceOwnODPendInv.data = this.PendiInvList.filter(x => x.GPPending !== 0);
        }
      } else {
        this.DataSourceOwnODPendInv.data = [];
      }
      this.isLoadingForOwner = false;
      this.chRef.detectChanges();
    })
  }
  //Get Own Order Dispatch Pend Boxes List
  GetOwnOrderDispatchPendBoxesList() {
    this.isLoadingForOwner = true;
    this._Service.GetOwnODBoxesSmmryList_Service().subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSourceOwnODPendBoxes.data = data;
      } else {
        this.DataSourceOwnODPendBoxes.data = [];
      }
      this.isLoadingForOwner = false;
      this.chRef.detectChanges();
    })
  }
  //Get Own Chq Acc List
  GetOwnChqAccList(FlagType: any) {
    this.isLoadingForOwner = true;
    this._Service.GetOwnChqAccSmmryList_Service().subscribe((data: any) => {
      if (data.length > 0) {
        this.ChqBounceList = data;
        if (FlagType === 'oTotalChqBounced') {
          this.DataSourceOwnChqAcc.data = this.ChqBounceList.filter(x => x.TotalBounce !== 0);
        }
        else if (FlagType === 'oDueforFirstNotice') {
          this.DataSourceOwnChqAcc.data = this.ChqBounceList.filter(x => x.DueforFirstNotice !== 0);
        }
        else if (FlagType === 'oDueforLegalNotice') {
          this.DataSourceOwnChqAcc.data = this.ChqBounceList.filter(x => x.DueforLegalNotice !== 0);
        }
      } else {
        this.DataSourceOwnChqAcc.data = [];
      }
      this.isLoadingForOwner = false;
      this.chRef.detectChanges();
    })
  }
  //Get Own Inv Inward List
  GetOwnInvInwardList(FlagType: any) {
    this.isLoadingForOwner = true;
    this._Service.GetOwnInvInwardSmmryList_Service().subscribe((data: any) => {
      if (data.length > 0) {
        this.InvInwardList = data;
        if (FlagType === 'oPendClaimCnt') {
          this.DataSourceOwnInvInward.data = this.InvInwardList.filter(x => x.PendClaimCnt !== 0);
        }
        else if (FlagType === 'oPendSANCnt') {
          this.DataSourceOwnInvInward.data = this.InvInwardList.filter(x => x.PendSANCnt !== 0);
        }
      } else {
        this.DataSourceOwnInvInward.data = [];
      }
      this.isLoadingForOwner = false;
      this.chRef.detectChanges();
    })
  }
  //Get Own OR Consgn List
  GetOwnORConsignList() {
    this.isLoadingForOwner = true;
    this._Service.GetOwnORPendConsigList_Service().subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSourceOwnORConsng.data = data;
      } else {
        this.DataSourceOwnORConsng.data = [];
      }
      this.isLoadingForOwner = false;
      this.chRef.detectChanges();
    })
  }
  //Get Own Saleable CN List
  GetOwnSaleableCNList(FlagType: any) {
    this.isLoadingForOwner = true;
    this._Service.GetOwnSaleableCNList_Service().subscribe((data: any) => {
      if (data.length > 0) {
        this.OrderReturnList = data;
        if (FlagType === 'oSalebleCN2_7') {
          this.DataSourceOwnORSalebleCn.data = this.OrderReturnList.filter(x => x.More2Day !== 0);
        }
        else if (FlagType === 'oMoreThan11Days') {
          this.DataSourceOwnORSalebleCn.data = this.OrderReturnList.filter(x => x.More11Day !== 0);
        }
      } else {
        this.DataSourceOwnORSalebleCn.data = [];
      }
      this.isLoadingForOwner = false;
      this.chRef.detectChanges();
    })
  }
  //Get Own Stk Trnsfr Pend Inv List
  GetOwnStkTrnsfrPendInvList(FlagType: any) {
    this.isLoadingForOwner = true;
    this._Service.GetOwnStkTrnsfrInvList_Service().subscribe((data: any) => {
      if (data.length > 0) {
        this.StkPendiInvList = data
        if (FlagType === 'oStkStickerPending') {
          this.DataSourceOwnStkPendInv.data = this.StkPendiInvList.filter(x => x.StkStkrPending !== 0);
        }
        else if (FlagType === 'oStkGPPending') {
          this.DataSourceOwnStkPendInv.data = this.StkPendiInvList.filter(x => x.StkGPPending !== 0);
        }
      } else {
        this.DataSourceOwnStkPendInv.data = [];
      }
      this.isLoadingForOwner = false;
      this.chRef.detectChanges();
    })
  }
  //Get Own Stk Trnsfr Pend Boxes List
  GetOwnStkTrnsfrPendBoxesList() {
    this.isLoadingForOwner = true;
    this._Service.GetOwnStkTrnsfrBoxesList_Service().subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSourceOwnStkPendBoxes.data = data;
      } else {
        this.DataSourceOwnStkPendBoxes.data = [];
      }
      this.isLoadingForOwner = false;
      this.chRef.detectChanges();
    })
  }
  OnOwnClickCross() {
    this.InvType = '';
    this.DataSource = new MatTableDataSource();
    this.DataSourceOwnODPendInv = new MatTableDataSource();
    this.DataSourceOwnODPendBoxes = new MatTableDataSource();
    this.DataSourceOwnChqAcc = new MatTableDataSource();
    this.DataSourceOwnInvInward = new MatTableDataSource();
    this.DataSourceOwnORConsng = new MatTableDataSource<any>();
    this.DataSourceOwnORSalebleCn = new MatTableDataSource<any>();
    this.DataSourceOwnStkPendInv = new MatTableDataSource<any>();
    this.DataSourceOwnStkPendBoxes = new MatTableDataSource<any>();
    this.modalService.dismissAll();
    this.IsColorFlag = false;
  }

}
