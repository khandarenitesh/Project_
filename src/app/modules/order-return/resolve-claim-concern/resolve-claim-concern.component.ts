import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppCode } from '../../../app.code';
import { PhysicalCheckModel } from '../models/PhysicalCheckModel';
import { OrderReturnService } from '../Services/order-return.service';
import { LrMismatchCountModel } from '../models/LrMismatchCountModel';

@Component({
  selector: 'app-resolve-claim-concern',
  templateUrl: './resolve-claim-concern.component.html',
  styleUrls: ['./resolve-claim-concern.component.scss'],
  providers: [DatePipe]
})
export class ResolveClaimConcernComponent implements OnInit {
  displayColumns = ['SrNo', 'GatepassNo', 'StockistName', 'LRNo', 'RetCatName', 'ClaimNo', 'ClaimDate', 'ConcernText', 'ConcernByName','Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  RoleId: number = 0;
  UserId: number = 0;
  BranchId: number = 0;
  CompId: number = 0;
  isLoading: boolean = false;
  modalReference: NgbModalRef;
  PhyChkId: number = 0;
  ResolveRemark: string = '';
  lrlistcount: LrMismatchCountModel;
  LREntryId: number = 0;
  LRGP: number = 0;
  ConcernCnt: number = 0;
  ConcernResolveCnt: number = 0;
  RecvdAtOPCnt: number = 0;
  PendingAtExpSCnt: number = 0;
  DataModel: any;
  ResolveClaimConcernList: any;
  ResolveClaimConcernCountList: any;

  constructor(
    private chRef: ChangeDetectorRef,
    private _orderReturnService: OrderReturnService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.RoleId = obj.RoleId;
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompId,
    };
    this.GetLRCounts(this.DataModel);
    this.GetPhysicalCheck1List();
  }


  //  Get LR Page Count List
  GetLRCounts(DataModel: any) {
    this.isLoading = true;
    this._orderReturnService.GetLRCounts_Service(DataModel)
      .subscribe((data: any) => {
        if (data != null) {
          this.afterCount(data);
        }
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  afterCount(data: LrMismatchCountModel) {
    this.lrlistcount = new LrMismatchCountModel();
    this.lrlistcount = data;
    if (this.lrlistcount.LREntryId !== 0 || this.lrlistcount.LREntryId !== null || this.lrlistcount.LREntryId !== undefined) {
      this.LREntryId = this.lrlistcount.LREntryId
      this.LRGP = this.lrlistcount.TodayLRGP;
      this.ConcernCnt = this.lrlistcount.ConcernCnt;
      this.ConcernResolveCnt = this.lrlistcount.ConcernResolveCnt;
      this.RecvdAtOPCnt = this.lrlistcount.RecvdAtOPCnt;
      this.PendingAtExpSCnt = this.lrlistcount.PendingAtExpSCnt;
      this.isLoading = false;
      this.chRef.detectChanges();
    }
  }


  // Get Physical Check1 List
  GetPhysicalCheck1List() {
    this.isLoading = true;
    this._orderReturnService.getPhysicalCheck1List_Service(this.BranchId, this.CompId)
      .subscribe((data: any[]) => {
        if (data.length > 0) {
          let data1 = data.filter(x => x.ClaimStatus === 1)
          this.DataSource.data = data1;
          this.ResolveClaimConcernList = data;
          this.DataSource.paginator = this.paginator;
          this.DataSource.sort = this.Sort;
        } else {
          this.DataSource.data = [];
        }
        this.isLoading = false;
        this.chRef.detectChanges();
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  // Resolve Claim popup code
  onClickResolveModel(content: any, row: PhysicalCheckModel) {
    this.modalReference = this.modalService.open(content, {
      centered: true,
      size: 'md',
      backdrop: 'static'
    });
    this.PhyChkId = row.PhyChkId;
    this.LREntryId = row.LREntryId;
  }

  // Resolve Claim
  ResolveClaim() {
    let model = {
      'ResolveConcernBy': this.UserId,
      'ResolveConcernDate': this.datepipe.transform(new Date, AppCode.DateFormat),
      'ResolveRemark': this.ResolveRemark,
      'PhyChkId': this.PhyChkId,
      'LREntryId': this.LREntryId,
      'Action': AppCode.RESOLVECONCERN
    }
    this._orderReturnService.resolveClaimConcern_service(model)
      .subscribe((data: any) => {
        if (data > 0) {
          this.toaster.success(AppCode.msg_ResolveConernSuccess);
          this.modalService.dismissAll();
          this.ResolveRemark = "";
        }
        else {
          this.toaster.error(AppCode.FailStatus);
        }
        this.Clear();
      }, (error: any) => {
        console.error("ResolveClaim Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  Clear() {
    this.modalService.dismissAll();
    this.ResolveRemark = "";
    this.GetPhysicalCheck1List();
    this.GetLRCounts(this.DataModel);
  }

  // Resolve Claim Concern List after filtering count wise
  ShowResolveClaimConcernList(Flag: string) {
    this.isLoading = true;
    if (this.ResolveClaimConcernList != null && this.ResolveClaimConcernList !== undefined) {
      if (Flag === 'Raise') {
        this.ResolveClaimConcernCountList = this.ResolveClaimConcernList.filter((x: any) => x.ConcernRemark !== null && x.ResolveRemark === null);
        this.isLoading = false;
      } else if (Flag === 'Resolve') {
        this.ResolveClaimConcernCountList = this.ResolveClaimConcernList.filter((x: any) => x.ConcernRemark !== null && x.ResolveRemark !== null);
        this.isLoading = false;
      }
      this.DataSource = new MatTableDataSource(this.ResolveClaimConcernCountList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
      this.isLoading = false;
      this.chRef.detectChanges();
    }
  }

}
