import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceModel } from '../Models/invoice-model';
import { ToastrService } from 'ngx-toastr';
import { OrderDispatchService } from '../Services/order-dispatch.service';
import { AppCode } from '../../../app.code';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { AllInvCnt } from '../Models/all-inv-cnt.model';
import { ActivatedRoute } from '@angular/router';

export class Rconcern {
  Remark: string;
}

@Component({
  selector: 'app-resolve-concern-invoice',
  templateUrl: './resolve-concern-invoice.component.html',
  styleUrls: ['./resolve-concern-invoice.component.scss']
})
export class ResolveConcernInvoiceComponent implements OnInit {

  DisplayInvoiceData = ['SrNo', 'InvNo', 'StockistNo', 'StockistName', 'CityName', 'StatusText', 'BillDrawerName',
    'PackingConcernText', 'PackingRemark', 'IsStockTransfer', 'Actions']; //'DispatchByName', 'DispatchConcernText', 'ReadyToDispatchRemark',

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  @ViewChild('ConcernForm') ConcernForm: NgForm;

  rconcern: Rconcern;
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompId: number = 0;
  invoicemodel: InvoiceModel;
  DataModel: any;
  Title: string = "";
  searchModel: string = '';
  ResolveConernInvModal: any;
  DataModelCounts: any;
  pageState: string = '';
  ModelCount: any;
  currentDate = new Date();
  InvId: number = 0;
  CurrentStatus: number = 0;
  Remark: string;
  AcceptedBy: number = 0;
  allinvCount: AllInvCnt;
  TotalInvoices: number = 0;
  CancelInvCtn: number = 0;
  PendingInvCtn: number = 0;
  OnPriorityCtn: number = 0;
  PackerConcern: number = 0;
  GatpassGenCtn: number = 0;
  TodaysWithOldOpen: number = 0;
  PendingLR: number = 0;
  IsStockTransferCtn: number = 0;
  StkPrint: number = 0;
  LocalMode: number = 0;
  OtherCity: number = 0;
  ByHand: number = 0;
  InvoicList: any;
  InvDataList: any[] = [];
  id: any;

  constructor(private chRef: ChangeDetectorRef, private _ToastrService: ToastrService,
    private _orderDispatchService: OrderDispatchService, private modalService: NgbModal, private route: ActivatedRoute,) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.pageState = "Submit";
    this.Title = "List View"
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompId,
      BillDrawerId: 0
    };
    this.GetInvoiceList(this.DataModel);
    //For Count
    this.DataModelCounts = {
      BranchId: this.BranchId,
      CompId: this.CompId,
    }

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id === "1") {
      this.id = this.id;
      this.GetInvStkcnt(this.DataModelCounts);
    } else if (this.id == null || this.id == undefined) {
      this.id = this.id = 0;
      this.GetInvoiceCounts(this.DataModelCounts);
    }
  }

  GetInvoiceList(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getInvoiceLstResolveCncrn_Service(DataModel).subscribe((data: any) => {
      if (data.length > 0) {
        if (this.id === "1") {
          var stockTrandata = data.filter((x: any) => x.IsStockTransfer === 1)
          this.DataSource.data = stockTrandata;
          this.InvDataList = stockTrandata;
          this.DataSource.paginator = this.paginator;
          this.DataSource.sort = this.Sort;
        }
        else {
          var OrderDisdata = data.filter((x: any) => x.IsStockTransfer === 0)
          this.DataSource.data = OrderDisdata;
          this.InvDataList = OrderDisdata;
          this.DataSource.paginator = this.paginator;
          this.DataSource.sort = this.Sort;
        }
        // this.GetInvoiceCounts(this.DataModelCounts);
        this.isLoading = false;
        this.chRef.detectChanges();
      } else {
        this.DataSource.data = [];
        this.isLoading = false;
        this.chRef.detectChanges();
      }
      (error: any) => {
        console.log(error);
      }
    });
  }

  ResolveConernInvPopup(row: any, content: any) {
    this.CurrentStatus = 0;
    this.InvId = 0;
    this.Remark = "";
    this.InvId = row.InvId;
    this.CurrentStatus = row.InvStatus;
    this.AcceptedBy = row.AcceptedBy;
    this.ResolveConernInvModal = this.modalService.open(content, {
      centered: true,
      size: 'md',
      backdrop: 'static'
    });
  }

  ResolveInvConernSave() {
    this.isLoading = true;
    let model = {
      "InvId": this.InvId,
      'BranchId': this.BranchId,
      "AcceptedBy": this.AcceptedBy,
      "CurrentStatus": this.CurrentStatus,
      'Remark': this.Remark,
      "Addedby": this.UserId,
      "updateDate": this.currentDate
    }
    this._orderDispatchService.ResolveInvConern_Service(model)
      .subscribe((data: any) => {
        if (data === AppCode.SuccessStatus) {
          this._ToastrService.success(AppCode.msg_ResolveConernSuccess);
          this.modalService.dismissAll();
          this.GetInvoiceList(this.DataModel);
          if (this.id === "1") {
            this.GetInvStkcnt(this.DataModelCounts)
          }
          else {
            this.GetInvoiceCounts(this.DataModelCounts);
          }
          this.isLoading = false;
          this.chRef.detectChanges();
        }
        else {
          this._ToastrService.error(AppCode.msg_ResolveConernFail);
          this.isLoading = false;
        }
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
      });
  }



  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    // this.searchModel = this.searchModel.trim(); // Remove whitespace
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  GetInvoiceCounts(DataModelCounts: any) {
    this.isLoading = true;
    this._orderDispatchService.GetInvoiceCounts_Service(DataModelCounts)
      .subscribe((data: any) => {
        this.afterCount(data);
      }, (error: any) => {
        console.error("Error: " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }
  afterCount(data: AllInvCnt) {
    this.allinvCount = new AllInvCnt();
    this.allinvCount = data;
    this.TotalInvoices = this.allinvCount.TotalInvoices;
    this.TodaysWithOldOpen = this.allinvCount.TodaysWithOldOpen;
    this.PendingInvCtn = this.allinvCount.PendingInvCtn;
    this.PackerConcern = this.allinvCount.PackerConcern;
    this.CancelInvCtn = this.allinvCount.CancelInvCtn;
    this.OnPriorityCtn = this.allinvCount.OnPriorityCtn;
    this.GatpassGenCtn = this.allinvCount.GatpassGenCtn;
    this.PendingLR = this.allinvCount.PendingLR;
    this.IsStockTransferCtn = this.allinvCount.IsStockTransferCtn;
    this.StkPrint = this.allinvCount.StkPrint;
    this.LocalMode = this.allinvCount.LocalMode;
    this.OtherCity = this.allinvCount.OtherCity;
    this.ByHand = this.allinvCount.ByHand;
    this.chRef.detectChanges();
  }

  //Get Stock Transfer Count 
  GetInvStkcnt(DataModelCount: any) {
    this.isLoading = true;
    this._orderDispatchService.GetInvForStkCnt_Service(DataModelCount)
      .subscribe((data: any) => {
        this.afterInvStkcnt(data);
      }, (error: any) => {
        console.error("Error: " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  afterInvStkcnt(data: AllInvCnt) {
    this.allinvCount = new AllInvCnt();
    this.allinvCount = data;
    this.TotalInvoices = this.allinvCount.TotalInvoices;
    this.TodaysWithOldOpen = this.allinvCount.TodaysWithOldOpen;
    this.PendingInvCtn = this.allinvCount.PendingInvCtn;
    this.PackerConcern = this.allinvCount.PackerConcern;
    this.CancelInvCtn = this.allinvCount.CancelInvCtn;
    this.OnPriorityCtn = this.allinvCount.OnPriorityCtn;
    this.GatpassGenCtn = this.allinvCount.GatpassGenCtn;
    this.PendingLR = this.allinvCount.PendingLR;
    this.IsStockTransferCtn = this.allinvCount.IsStockTransferCtn;
    this.StkPrint = this.allinvCount.StkPrint;
    this.LocalMode = this.allinvCount.LocalMode;
    this.OtherCity = this.allinvCount.OtherCity;
    this.ByHand = this.allinvCount.ByHand;
    this.chRef.detectChanges();

  }
  ShowPickList(Flag?: any) {
    if (this.InvDataList != null && this.InvDataList != undefined) {

      if (Flag === 'OnPriorityCtn') {
        this.InvoicList = this.InvDataList.filter(x => x.OnPriority === 1);
      }
      else if (Flag === 'IsStockTransferCtn') {
        this.InvoicList = this.InvDataList.filter(x => x.IsStockTransfer === 1);
      }
      else if (Flag === 'PackerConcern') {
        this.Title = " List View - Packer Concern" + ' (' + this.PackerConcern + ')';
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 4);
      }

      this.DataSource = new MatTableDataSource(this.InvoicList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
      this.chRef.detectChanges();

    }
  }

}
