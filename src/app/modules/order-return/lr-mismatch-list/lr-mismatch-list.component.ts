import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AppCode } from '../../../app.code';
import { OrderReturnService } from '../Services/order-return.service';
import { UpdateLRMismatchModel } from '../models/UpdateLRMismatchModel';
import { SelectionModel } from '@angular/cdk/collections';
import { LrMismatchCountModel } from '../models/LrMismatchCountModel';
import { DatePipe, formatDate } from '@angular/common';

export interface PeriodicElement {
  LRNo: string;
  LRDate: Date;
  StockistName: string;
  Location: string;
  TransporterCourier: string;
  Amount: string;
}
export class matrowselected {
  LREntryId: number;
}

@Component({
  selector: 'app-lr-mismatch-list',
  templateUrl: './lr-mismatch-list.component.html',
  styleUrls: ['./lr-mismatch-list.component.scss'],
  providers: [DatePipe]
})
export class LrMismatchListComponent implements OnInit {
  displayedColumnsForApi = ['Select', 'LRNo', 'LRDate', 'StockistName', 'Location', 'TransporterCourier', 'Amount'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  isLoading: boolean = false;
  searchModel: string = '';
  LRNoList: any;
  pageState: string;
  LREntryId: number = 0;
  RecvdAtOPFlag: number = 0;
  selectedrows: matrowselected[] = [];
  selection = new SelectionModel<any>(true, []);
  updateLRmismatchModel: UpdateLRMismatchModel;
  lrlistcount: LrMismatchCountModel;
  LRGP: number = 0;
  ConcernCnt: number = 0;
  ConcernResolveCnt: number = 0;
  RecvdAtOPCnt: number = 0;
  PendingAtExpSCnt: number = 0;
  DataModel: any;
  LRCountList: any;
  currentDate = new Date();
  TodayDateForFilter: any;

  constructor(private chRef: ChangeDetectorRef, private toastr: ToastrService, private _Service: OrderReturnService, private datepipe: DatePipe) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.pageState = "Submit";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompanyId,
    };
    this.GetLRCounts(this.DataModel);
    this.GetLrMismatchList();

    this.TodayDateForFilter = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
  }

  //  Get LR Page Count List
  GetLRCounts(DataModel: any) {
    this.isLoading = true;
    this._Service.GetLRCounts_Service(DataModel)
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

  //Get LR mismatch List
  GetLrMismatchList() {
    this.isLoading = true;
    this._Service.GetLrMismatchList_Service(this.BranchId, this.CompanyId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data.filter((row: any) => row.RecvdAtOP === false);
        this.LRNoList = data;
        this.selectedrows =  this.LRNoList.filter((x: any) => x.RecvdAtOP === false);
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
      } else {
        this.DataSource.data = [];
      }
      this.isLoading = false;
      this.chRef.detectChanges();
      (error: any) => {
        console.log(error);
        this.isLoading = false;
        this.chRef.detectChanges();
      }
    });
  }

  getCheckboxesData(row: any, i: string) {
    if ((<HTMLInputElement>document.getElementById('check' + i)).checked === true) {
      if (this.selectedrows.length === 0 || this.selectedrows.findIndex(t => t.LREntryId === row.LREntryId)) {
        var item = new matrowselected();
        item.LREntryId = row.LREntryId;
        this.selectedrows.push(item);
      } else {
        if ((<HTMLInputElement>document.getElementById('check' + i)).checked == true) {
          (<HTMLInputElement>document.getElementById('check' + i)).checked = false;
        }
        this.selection.deselect(row);
      }
    } else {
      var indexValue = this.selectedrows.findIndex(t => t.LREntryId === row.LREntryId);
      this.selectedrows.splice(indexValue, 1);
    }
    this.chRef.detectChanges();
  }

  // Update LR Mismatch
  UpdateLRMismatch() {
    this.isLoading = true;
    var arrRole = [];
    this.updateLRmismatchModel = new UpdateLRMismatchModel();
    arrRole.push(this.selectedrows);
    arrRole.forEach((element: any) => {
      for (var i = 0; i < element.length; i++) {
        this.updateLRmismatchModel.LREntryId += element[i].LREntryId + ",";
      }
    });
    this.updateLRmismatchModel.BranchId = this.BranchId;
    this.updateLRmismatchModel.CompId = this.CompanyId;
    this.updateLRmismatchModel.AddedBy = String(this.UserId);
    this._Service.SaveUpdateLRMismatch_Service(this.updateLRmismatchModel)
      .subscribe((data: any) => {
        if (data > 0) {
          this.toastr.success(AppCode.msg_UpdateLRMismatch);
        } else {
          this.toastr.error(AppCode.FailStatus);
        }
        this.selectedrows=[];
        this.GetLrMismatchList();
        this.GetLRCounts(this.DataModel);
      }, (error: any) => {
        console.error(error);
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  // Count LR
  afterCount(data: LrMismatchCountModel) {
    this.lrlistcount = new LrMismatchCountModel();
    this.lrlistcount = data;
    this.LREntryId = this.lrlistcount.LREntryId
    this.LRGP = this.lrlistcount.TodayLRGP;
    this.ConcernCnt = this.lrlistcount.ConcernCnt;
    this.ConcernResolveCnt = this.lrlistcount.ConcernResolveCnt;
    this.RecvdAtOPCnt = this.lrlistcount.RecvdAtOPCnt;
    this.PendingAtExpSCnt = this.lrlistcount.PendingAtExpSCnt;
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  // LR Recived List after filtering count wise
  ShowLRList(Flag: string) {
    this.isLoading = true;
    if (this.LRNoList != null && this.LRNoList !== undefined) {
      if (Flag === 'TodayLR') {
        this.LRCountList = this.LRNoList.filter((x: any) => x.ReceiptDate === this.TodayDateForFilter && x.ClaimFormAvailable ===1);
      } else if (Flag === 'Received') {
        this.LRCountList = this.LRNoList.filter((x: any) => x.RecvdAtOPDate === this.TodayDateForFilter);
      } else if (Flag === 'Raise') {
        this.LRCountList = this.LRNoList.filter((x: any) => x.ConcernDate !== null && x.ResolveConcernDate === null);
      } else if (Flag === 'Resolve') {
        this.LRCountList = this.LRNoList.filter((x: any) => x.ConcernDate !== null && x.ResolveConcernDate !== null);
      } else if (Flag === 'Pending') {
        this.LRCountList = this.LRNoList.filter((x: any) => x.RecvdAtOP === false && x.ClaimFormAvailable ===1);
      }
      this.DataSource = new MatTableDataSource(this.LRCountList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
      this.isLoading = false;
      this.chRef.detectChanges();
    }
  }

}


