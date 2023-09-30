import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// Datasource- Table
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Services
import { OrderDispatchService } from '../Services/order-dispatch.service';
import { AppCode } from '../../../app.code';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { AllInvCnt } from '../Models/all-inv-cnt.model';
import { ActivatedRoute } from '@angular/router';
export class Rremark {
  Remark: string;
}
@Component({
  selector: 'app-priority-invoice-list',
  templateUrl: './priority-invoice-list.component.html',
  styleUrls: ['./priority-invoice-list.component.scss']
})
export class PriorityInvoiceListComponent implements OnInit {
  DisplayInvoiceData = ['SrNo', 'InvNo', 'InvCreatedDate',
    'StockistNo', 'StockistName', 'CityName', 'InvAmount', 'StatusText', 'IsStockTransfer', 'Actions'];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  @ViewChild('RmarkForm') RmarkForm: NgForm;
  public DataSource = new MatTableDataSource<any>();
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompId: number = 0;
  DataModel: any;
  Title: string = "";
  searchModel: string = '';
  UpdateModal: any;

  InvId: number = 0;
  PriorityFlag: number = 0;
  Remark: string = '';
  Addedby: string = '';
  updateDate: Date = new Date();
  currentDate: Date;
  InvStatus: string;
  rremark: Rremark
  //PriorityFlagmodel: PriorityFlagModel;

  allinvCount: AllInvCnt;
  TodaysWithOldOpen: number = 0;
  TotalInvoices: number = 0;
  DataModelCounts: any;
  CancelInvCtn: number = 0;
  PendingInvCtn: number = 0;
  OnPriorityCtn: number = 0;
  PackerConcern: number = 0;
  GatpassGenCtn: number = 0;
  PendingLR: number = 0;
  IsStockTransferCtn: number = 0;
  StkPrint: number = 0;
  LocalMode: number = 0;
  OtherCity: number = 0;
  ByHand: number = 0;
  InvoicList: any;
  InvDataList: any[] = [];
  id: any;

  constructor(private chRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private _ToastrService: ToastrService,
    private _orderDispatchService: OrderDispatchService, private route: ActivatedRoute) { this.currentDate = new Date(); }

  ngOnInit(): void {
    this.Title = "List View";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompId,
      FromDate: null,
      ToDate: null,
      BillDrawerId: 0
    };
    this.rremark = {
      Remark: "",
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

  // Get Invoice List
  GetInvoiceList(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getInvoice_Service(DataModel).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        if (this.id === "1") {
          var stockTrandata = data.filter((x: any) => x.StatusText != 'Getpass Generated' && x.StatusText != 'Cancel' && x.IsStockTransfer === 1);
          this.DataSource.data = stockTrandata;
          this.InvDataList = stockTrandata;
          this.DataSource.paginator = this.paginator;
          this.DataSource.sort = this.Sort;
        }
        else {
          var OrderDisdata = data.filter((x: any) => x.StatusText != 'Getpass Generated' && x.StatusText != 'Cancel' && x.IsStockTransfer === 0)
          this.DataSource.data = OrderDisdata;
          this.InvDataList = OrderDisdata;
          this.DataSource.paginator = this.paginator;
          this.DataSource.sort = this.Sort;
        }
        // this.GetInvoiceCounts(this.DataModelCounts);
        this.isLoading = false;
        this.chRef.detectChanges();
      }
      else {
        this.DataSource.data = [];
        this.isLoading = false;
        this.chRef.detectChanges();
      }
      (error: any) => {
        console.log(error);
      }

    });
  }

  UpdateFlagPopup(row: any, content: any) {
    this.InvId = row.InvId;
    this.Remark = "";
    this.UpdateModal = this.modalService.open(content, {
      centered: true,
      size: 'md',
      backdrop: 'static'
    });
  }

  UpdatePriorityFlag() {
    // this.isLoading = true;
    let PriorityFlagModel = {
      InvId: this.InvId,
      PriorityFlag: 1,
      Remark: this.Remark,
      Addedby: String(this.UserId),
      updateDate: this.currentDate
    }
    this._orderDispatchService.UpdatePriorityFlag_Service(PriorityFlagModel).subscribe((data: any) => {
      if (data === AppCode.SuccessStatus) {
        this._ToastrService.success(AppCode.msg_saveSuccess);
        if (this.id === "1") {
          this.GetInvStkcnt(this.DataModelCounts);
        }
        else {
          this.GetInvoiceCounts(this.DataModelCounts);
        }
        this.GetInvoiceList(this.DataModel);
        this.modalService.dismissAll();
        this.chRef.detectChanges();
      } else {
        this._ToastrService.error(AppCode.FailStatus);
        this.isLoading = false;
        this.chRef.detectChanges;
      }

    },
      (error) => {
        console.error(error);
      }
    );
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
        this.Title = " List View - Priority" + ' (' + this.OnPriorityCtn + ')';
        this.InvoicList = this.InvDataList.filter(x => x.OnPriority === 1);
      }
      else if (Flag === 'PendingInvCtn') {
        this.Title = " List View - Pending Invoices" + ' (' + this.PendingInvCtn + ')';
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 0);
      }
      else if (Flag === 'PendingLR') {
        this.Title = " List View - Pending LR" + ' (' + this.PendingLR + ')';
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 7 && x.InvStatus === 8);
      }
      else if (Flag === 'IsStockTransferCtn') {
        this.Title = " List View - Stock Transfer" + ' (' + this.IsStockTransferCtn + ')';
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
