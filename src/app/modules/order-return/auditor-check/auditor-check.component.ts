import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppCode } from '../../../app.code';
import { OrderReturnService } from '../Services/order-return.service';
import { LrMismatchCountModel } from '../models/LrMismatchCountModel';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-auditor-check',
  templateUrl: './auditor-check.component.html',
  styleUrls: ['./auditor-check.component.scss'],
  providers: [DatePipe]
})
export class AuditorCheckComponent implements OnInit {
  DisplayAuditorCheckData = ['SrNo', 'ClaimNo', 'ClaimDate',
    'StockistNo', 'StockistName', 'SalesDocNo','Netvalue', 'CorrectionReqRemark'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompId: number = 0;
  DataModel: any;
  Title: string = "";
  searchModel: string = '';
  PhyChkId: number = 0;
  lrlistcount: LrMismatchCountModel;
  TotalLR: number = 0;
  ReceivedLR: number = 0;
  ImportedLR: number = 0;
  NotFoundLR: number = 0;
  VerifiedCount: number = 0;
  CorrReqCount: number = 0;
  AuditorCheckList: any;
  AuditorCheckCountList: any;
  currentDate = new Date();

  constructor(private chRef: ChangeDetectorRef, private _orderReturnService: OrderReturnService, private datepipe: DatePipe) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.Title = "List View";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.GetAuditorCheckList(this.BranchId, this.CompId);
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompId,
    };
    this.GetLRmisMatchCounts(this.DataModel);
  }

  // Get Auditor Check List
  GetAuditorCheckList(BranchId: number, CompId: number) {
    this.isLoading = true;
    this._orderReturnService.getauditorchecklist_Service(BranchId, CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data.filter((x: any) => x.IsCorrectionReq == 'Y');
        this.AuditorCheckList = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
      }
      else {
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

  // Get LR misMatch Counts
  GetLRmisMatchCounts(DataModel: any) {
    this.isLoading = true;
    this._orderReturnService.GetLRmisMatchCounts_Service(DataModel)
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
    this.NotFoundLR = this.lrlistcount.NotFoundLR;
    this.ImportedLR = this.lrlistcount.TodayImportedLR;
    this.ReceivedLR = this.lrlistcount.TodayReceivedLR;
    this.TotalLR = this.lrlistcount.TodayTotalLR;
    this.VerifiedCount = this.lrlistcount.TodayVerifiedCount;
    this.CorrReqCount = this.lrlistcount.CorrReqCount;
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase();
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // Auditor Check List after filtering count wise
  ShowAuditorCheckList(Flag: string) {
    this.isLoading = true;
    if (this.AuditorCheckList != null && this.AuditorCheckList !== undefined) {
      // if (Flag === 'TodayVerified') {
      //   this.AuditorCheckCountList = this.AuditorCheckList.filter((x: any) => x.VerifyCorrectionDate === String(this.datepipe.transform(this.currentDate, AppCode.DateOnlyFormatT)) && x.IsVerified === 'Y');
      // } else
      if (Flag === 'CorrectionRequired') {
        this.AuditorCheckCountList = this.AuditorCheckList.filter((x: any) => x.IsCorrectionReq === 'Y');
      }
      this.DataSource = new MatTableDataSource(this.AuditorCheckCountList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
      this.isLoading = false;
      this.chRef.detectChanges();
    }
  }

}
