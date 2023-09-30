import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PermissionsModel } from '../../../../../modules/auth/models/permissions.model';
import { environment } from '../../../../../../environments/environment';
import { AuthService } from '../../../../../modules/auth';
import { AppCode } from '../../../../../app.code';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  permissions: PermissionsModel;
  isLoading: boolean = false;
  Dashboard: boolean = false;
  EmployeeMaster: boolean = false;
  StockistMaster: boolean = false;
  CartingMaster: boolean = false;
  CourierMaster: boolean = false;
  BranchMaster: boolean = false;
  CompanyMaster: boolean = false;
  StockistTransporterMapping: boolean = false;
  TransporterMaster: boolean = false;
  StockistBranchRelation: boolean = false;
  StockistCompanyRelation: boolean = false;
  GeneralMaster: boolean = false;
  EmailConfig: boolean = false;
  PicklistOperation: boolean = false;
  PicklistAdd: boolean = false;
  PicklistVerify: boolean = false;
  PicklistAllot: boolean = false;
  ReAllotPicklist: boolean = false;
  ImportInvData: boolean = false;
  InvCancelList: boolean = false;
  ReadyToDispatch: boolean = false;
  AssignTransportMode: boolean = false;
  ImportLRData: boolean = false;
  PrintSticker: boolean = false;
  ChqRegister: boolean = false;
  ImportOS: boolean = false;
  ImportChqDeposit: boolean = false;
  ChqSummRpt: boolean = false;
  ChqSummMonthlyRpt: boolean = false;
  ResolveConcernPL: boolean = false;
  ResolveConcernINV: boolean = false;
  PriotiseINV: boolean = false;
  AssignTransportModeEdit: boolean = false;
  AppConfig: boolean = false;
  ImportTransitReport: boolean = false;
  ApproveVehicleIssue: boolean = false;
  InsuranceClaim: boolean = false;
  ApprovalClaim: boolean = false;
  LRReceivedList: boolean = false;
  ResolveClaimConcern: boolean = false;
  ImportSRS: boolean = false;
  CorrectionRequiredList: boolean = false;
  SRSPendingCNList: boolean = false;
  ImportCreditNote: boolean = false;
  UploadDestructionCertificate: boolean = false;
  DestructionCertificateList: boolean = false;
  StockTransferAdd: boolean = false;
  CityMaster: boolean = false;
  ThresholdValueMaster: boolean = false;
  ChecklistMaster: boolean = false;
  OtherCNFMaster: boolean = false;
  ImportDepositedCheque: boolean = false;
  ChequeRegisterSummaryReport: boolean = false;
  RaisedConcernList: boolean = false;
  VersionDetails: boolean = false;
  BranchCompanyRelationMaster: boolean = false;
  ExpenseRegister: boolean = false;
  ReimbursmentInvoice: boolean = false;
  ComissionInvoice: boolean = false;
  GatepassbillSummary: boolean = false;
  CheckInvoice: boolean = false;
  VendorMaster: boolean = true;
  TaxMaster: boolean = false;
  HeadMaster: boolean = false;
  TransportParentMaster: boolean = false;
  TransportParentMapping: boolean = false;
  CourierParentMaster: boolean = false;
  CourierParentMapping: boolean = false;
  CompanyVendorMapping: boolean = false;
  ChequeStatusReport: boolean = false;
  VendorBranchMapping: boolean = false;
  VehicleChecklistForImg: boolean = false;
  VerifyStockistData: boolean = false;

  // FOR ALL DASHBORD PERMISSIONS
  DashBoardOrderReturn: boolean = false;
  DashBoardOrderDispatch: boolean = false;
  DashBoradChequeAcc: boolean = false;
  DashBoardInventoyInward: boolean = false;
  DashBoradStockTrans: boolean = false;
  DashMiniORPendingSRS: boolean = false;
  DashORFOROperator: boolean = false;
  DashCheackAccForOprator: boolean = false;
  DashOrdDisForOperator: boolean = false;
  DashOrdDisForSupervisor: boolean = false;
  DashBoardORForSupervisor: boolean = false;
  DshBranchDRP: boolean = false;
  DshCompanyDRP: boolean = false;
  role:number=0;


  constructor(
    private authService: AuthService,
    private chref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    let RoleId = obj.RoleId;
    this.role=obj.RoleId;
    this.isLoading = true;
    this.GetPermissons(RoleId);
  }

  GetPermissons(RoleId: number) {
    this.authService.GetUserPermissions(RoleId)
      .subscribe((data: any) => {
        this.authService.SendToDashboard(data);
        this.afterpermission(data);
      });
  }

  afterpermission(data: PermissionsModel) {
    this.permissions = data;
    this.isLoading = false;
    this.Dashboard = this.permissions.Dashboard;
    this.EmployeeMaster = this.permissions.EmployeeMaster;
    this.StockistMaster = this.permissions.StockistMaster;
    this.CartingMaster = this.permissions.CartingMaster;
    this.CourierMaster = this.permissions.CourierMaster;
    this.BranchMaster = this.permissions.BranchMaster;
    this.CompanyMaster = this.permissions.CompanyMaster;
    this.StockistTransporterMapping = this.permissions.StockistTransporterMapping;
    this.TransporterMaster = this.permissions.TransporterMaster;
    this.StockistBranchRelation = this.permissions.StockistBranchRelation;
    this.StockistCompanyRelation = this.permissions.StockistCompanyRelation;
    this.GeneralMaster = this.permissions.GeneralMaster;
    this.EmailConfig = this.permissions.EmailConfig;
    this.PicklistOperation = this.permissions.PicklistOperation;
    this.ReAllotPicklist = this.permissions.ReAllotPicklist;
    this.ImportInvData = this.permissions.ImportInvData;
    this.InvCancelList = this.permissions.InvCancelList;
    this.ReadyToDispatch = this.permissions.ReadyToDispatch;
    this.AssignTransportMode = this.permissions.AssignTransportMode;
    this.ImportLRData = this.permissions.ImportLRData;
    this.PrintSticker = this.permissions.PrintSticker;
    this.ChqRegister = this.permissions.ChqRegister;
    this.ImportOS = this.permissions.ImportOS;
    this.ImportChqDeposit = this.permissions.ImportChqDeposit;
    this.ChqSummRpt = this.permissions.ChqSummRpt;
    this.ChqSummMonthlyRpt = this.permissions.ChqSummMonthlyRpt;
    this.ResolveConcernPL = this.permissions.ResolveConcernPL;
    this.ResolveConcernINV = this.permissions.ResolveConcernINV;
    this.PriotiseINV = this.permissions.PriotiseINV;
    this.AssignTransportModeEdit = this.permissions.AssignTransportModeEdit;
    this.AppConfig = this.permissions.AppConfig;
    this.VerifyStockistData = this.permissions.VerifyStockistData;

    // Inventory Inward
    this.ImportTransitReport = this.permissions.ImportTransitReport; // Import Transit Report
    this.ApproveVehicleIssue = this.permissions.ApproveVehicleIssue; // Approve Vehicle Issue
    this.InsuranceClaim = this.permissions.InsuranceClaim;  // Insurance Claim
    this.ApprovalClaim = this.permissions.ApprovalClaim;  //Approval Claim
    this.VehicleChecklistForImg = this.permissions.VehicleChecklistForImg;
    //  Order Return
    this.LRReceivedList = this.permissions.LRReceivedList;
    this.ResolveClaimConcern = this.permissions.ResolveClaimConcern;
    this.ImportSRS = this.permissions.ImportSRS;
    this.CorrectionRequiredList = this.permissions.CorrectionRequiredList;
    this.SRSPendingCNList = this.permissions.SRSPendingCNList;
    this.ImportCreditNote = this.permissions.ImportCreditNote;
    this.UploadDestructionCertificate = this.permissions.UploadDestructionCertificate;
    this.DestructionCertificateList = this.permissions.DestructionCertificateList;
    this.StockTransferAdd = this.permissions.StockTransferAdd;
    this.CityMaster = this.permissions.CityMaster;
    this.ThresholdValueMaster = this.permissions.ThresholdValueMaster;
    this.ChecklistMaster = this.permissions.ChecklistMaster;
    this.OtherCNFMaster = this.permissions.OtherCNFMaster;
    this.ImportDepositedCheque = this.permissions.ImportDepositedCheque;
    this.ChequeRegisterSummaryReport = this.permissions.ChequeRegisterSummaryReport;
    this.RaisedConcernList = this.permissions.RaisedConcernList;
    this.VersionDetails = this.permissions.VersionDetails;
    this.BranchCompanyRelationMaster = this.permissions.BranchCompanyRelationMaster;
    this.TransportParentMaster = this.permissions.TransportParentMaster;
    this.TransportParentMapping = this.permissions.TransportParentMapping;
    this.VendorMaster = this.permissions.VendorMaster;
    this.TaxMaster = this.permissions.TaxMaster;
    this.HeadMaster = this.permissions.HeadMaster;
    this.TransportParentMaster = this.permissions.TransportParentMaster;
    this.TransportParentMapping = this.permissions.TransportParentMapping;
    this.CourierParentMaster = this.permissions.CourierParentMaster;
    this.CourierParentMapping = this.permissions.CourierParentMapping;
    this.CompanyVendorMapping = this.permissions.CompanyVendorMapping;
    this.ChequeStatusReport = this.permissions.ChequeStatusReport;
    this.VendorBranchMapping = this.permissions.VendorBranchMapping

    //Account Module
    this.ExpenseRegister = this.permissions.ExpenseRegister;
    this.ReimbursmentInvoice = this.permissions.ReimbursmentInvoice;
    this.ComissionInvoice = this.permissions.ComissionInvoice;
    this.GatepassbillSummary = this.permissions.GatepassbillSummary;
    this.CheckInvoice = this.permissions.CheckInvoice;

    //For Dashboard
    this.DashBoardOrderReturn = this.permissions.DashBoardOrderReturn;
    this.DashBoardOrderDispatch = this.permissions.DashBoardOrderDispatch;
    this.DashBoradChequeAcc = this.permissions.DashBoradChequeAcc;
    this.DashBoardInventoyInward = this.permissions.DashBoardInventoyInward;
    this.DashBoradStockTrans = this.permissions.DashBoradStockTrans;
    this.DashMiniORPendingSRS = this.permissions.DashMiniORPendingSRS;
    this.DashORFOROperator = this.permissions.DashORFOROperator;
    this.DashCheackAccForOprator = this.permissions.DashCheackAccForOprator;
    this.DashOrdDisForOperator = this.permissions.DashOrdDisForOperator;
    this.DashOrdDisForSupervisor = this.permissions.DashBoardORForSupervisor;
    this.DashBoardORForSupervisor = this.permissions.DashBoardORForSupervisor;
    this.DshBranchDRP = this.permissions.DshBranchDRP;
    this.DshCompanyDRP = this.permissions.DshCompanyDRP;
    this.authService.GetPermissions(this.permissions);
    this.chref.detectChanges();
  }
}
