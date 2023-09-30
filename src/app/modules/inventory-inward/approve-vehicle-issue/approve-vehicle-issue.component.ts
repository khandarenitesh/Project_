import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApproveVehicleModel, InvInwardAllCountModel } from '../models/ApproveVehicleModel';
import { InsuranceModel } from '../models/InsuranceModel';
import { SharedService } from '../../../SharedServices/shared.service';
import { InventoryInwardService } from '../Services/inventory-inward.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-approve-vehicle-issue',
  templateUrl: './approve-vehicle-issue.component.html',
  styleUrls: ['./approve-vehicle-issue.component.scss']
})
export class ApproveVehicleIssueComponent implements OnInit {
  isLoading: boolean = false;
  ApproveVehicleforApi = ['SrNo', 'LRNo', 'TransporterNo', 'TransporterName', 'LRDate', 'VehicleNo', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  searchModel: string = "";
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  approvevehiclemodel: ApproveVehicleModel;
  DataModel: any;
  invInwardAllCount: InvInwardAllCountModel;
  TodayLRCnt: number = 0;
  TodayMapConcernRaisedCnt: number = 0;
  TodayMapConcernResolvedCnt: number = 0;
  LRCountList: any;
  ResolveVehicleList: any;
  TotalTodaysMapCnrnRaiseCnt: number;
  currentDate = new Date();
  ApproveModel: any;
  showImagesModel: any;
  ResolveVehicleRemark: any;

  constructor(private chref: ChangeDetectorRef, private _service: InventoryInwardService,
    private router: Router, private toaster: ToastrService, private _SharedService: SharedService, private modalService: NgbModal) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.GetMapInwardVehicleRaiseCncrnList();
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompanyId
    }
    this.GetApproveVehicleIssueCounts(this.DataModel);
  }

  //Get Vehicle CheckList
  GetMapInwardVehicleRaiseCncrnList() {
    this.isLoading = true;
    this._service.GetMapInwardVehicleRaiseCncrnList_Service(this.BranchId, this.CompanyId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
        this.ResolveVehicleList = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
      } else {
        this.DataSource.data = [];
      }
      this.isLoading = false;
      this.chref.detectChanges();
      (error: any) => {
        console.log(error);
        this.isLoading = false;
        this.chref.detectChanges();
      }
    });
  }

  // Raise Claim
  GetDataClaim(row: InsuranceModel) {
    this._SharedService.setData(row);
    this.router.navigate(['/modules/inventory-inward/add-insurance-claim'], { queryParams: { state: AppCode.raiseClaimstring } });
  }


  // Open Model for apporve status update
  OpenModelapporve(content: any, row: any) {
    this.approvevehiclemodel = new ApproveVehicleModel();
    this.approvevehiclemodel.PkId = row.PkId;
    this.approvevehiclemodel.ActualNoOfCasesQty = row.ActualNoOfCasesQty;
    this.approvevehiclemodel.NoOfCasesQty = row.NoOfCasesQty;
    this.ApproveModel = this.modalService.open(content, {
      centered: true,
      size: 'md',
      backdrop: 'static'
    });

  }

  //show checklist images
  OpenModelForShowimages(content: any, row: any) {
    this.approvevehiclemodel = new ApproveVehicleModel();
    if (row.Img1 !== "" || row.Img2 !== "" || row.Img3 !== "" || row.Img4 !== "") {
      this.approvevehiclemodel.PkId = row.PkId
      this.approvevehiclemodel.Img1 = row.Img1
      this.approvevehiclemodel.Img2 = row.Img2
      this.approvevehiclemodel.Img3 = row.Img3
      this.approvevehiclemodel.Img4 = row.Img4
    }
    this.showImagesModel = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  ClearImages() {
    this.approvevehiclemodel.Img1 = "";
    this.approvevehiclemodel.Img2 = "";
    this.approvevehiclemodel.Img3 = "";
    this.approvevehiclemodel.Img4 = "";
  }

  //Approve vehicle issues
  ApproveVehicle() {
    this.isLoading = true;
    let DataModel = {
      'BranchId': this.BranchId,
      'PkId': this.approvevehiclemodel.PkId,
      'CompId': this.CompanyId,
      'IsConcern': 0,
      'AddedBy': this.UserId,
      'ActualNoOfCasesQty': this.approvevehiclemodel.ActualNoOfCasesQty,
      'NoOfCasesQty': this.approvevehiclemodel.NoOfCasesQty,
      'ResolveVehicleRemark': this.approvevehiclemodel.ResolveVehicleRemark
    }
    this._service.ResolveVehicleIssue_Url_Service(DataModel)
      .subscribe((data: any) => {
        if (data > 0) {
          this.toaster.success(AppCode.msg_ResolveSuccess);
          this.ClearData();
          this.isLoading = false;
          this.modalService.dismissAll();
          this.GetMapInwardVehicleRaiseCncrnList();
          this.GetApproveVehicleIssueCounts(this.DataModel);
        }
      }, (error: any) => {
        console.error(error);
        this.isLoading = false;
        this.chref.detectChanges();
      });
    this.isLoading = false;
  }

  ClearData() {
    this.approvevehiclemodel.ActualNoOfCasesQty = 0;
    this.approvevehiclemodel.NoOfCasesQty = 0;
    this.approvevehiclemodel.PkId = 0;
    this.chref.detectChanges();
  }

  // Raise SAN
  GetDataSAN(row: InsuranceModel) {
    this._SharedService.setData(row);
    this.router.navigate(['/modules/inventory-inward/add-insurance-claim'], { queryParams: { state: AppCode.raiseSANstring } });
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chref.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  //Get Approve Vehicle Issue Counts Counts
  GetApproveVehicleIssueCounts(DataModel: any) {
    this.isLoading = true;
    this._service.GetInvInwardAllCounts(DataModel)
      .subscribe((data: any) => {
        if (data != null) {
          this.afterCount(data);
        }
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chref.detectChanges();
      });
  }

  afterCount(data: InvInwardAllCountModel) {
    this.invInwardAllCount = new InvInwardAllCountModel();
    this.invInwardAllCount = data;
    this.TodayLRCnt = this.invInwardAllCount.TodayLR;
    this.TotalTodaysMapCnrnRaiseCnt = this.invInwardAllCount.TotalTodaysMapCnrnRaise;
    this.TodayMapConcernRaisedCnt = this.invInwardAllCount.TodayMapConcernRaised;
    this.TodayMapConcernResolvedCnt = this.invInwardAllCount.TodayMapConcernResolved;
    this.isLoading = false;
    this.chref.detectChanges();
  }

  // LR Recived List after filtering count wise
  ShowLRList(Flag: string) {
    this.isLoading = true;
    if (this.ResolveVehicleList != null && this.ResolveVehicleList !== undefined) {
      if (Flag === 'ClaimRaised') {
        this.LRCountList = this.ResolveVehicleList.filter((x: any) => x.IsClaim === 1);
      } else if (Flag === 'TotalTodaysMapCnrnRaiseCnt') {
        this.LRCountList = this.ResolveVehicleList;
      } else if (Flag === 'MapConcernRaised') {
        //this.LRCountList = this.ResolveVehicleList.filter((x: any) => (x.LRDate === String(this.datepipe.transform(this.currentDate, AppCode.DateOnlyFormatT))));
        this.LRCountList = this.ResolveVehicleList.filter((x: any) => (x.IsConcern === 1));
      } else if (Flag === 'MapConcernResolved') {
        //this.LRCountList = this.ResolveVehicleList.filter((x: any) => x.LRDate === String(this.datepipe.transform(this.currentDate, AppCode.DateOnlyFormatT)) || x.ResolvedBy > 0);
        this.LRCountList = this.ResolveVehicleList.filter((x: any) => (x.ResolvedBy > 0));
      }
      this.DataSource = new MatTableDataSource(this.LRCountList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
    }
    this.isLoading = false;
    this.chref.detectChanges();
  }

}
