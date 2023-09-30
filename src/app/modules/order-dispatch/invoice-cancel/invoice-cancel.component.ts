import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

// Datasource- Table
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Router
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AppCode } from '../../../app.code';

// Model
import { InvoiceModel } from '../Models/invoice-model';

// Services
import { OrderDispatchService } from '../Services/order-dispatch.service';
import Swal from 'sweetalert2';
import { AllInvCnt } from '../Models/all-inv-cnt.model';

@Component({
  selector: 'app-invoice-cancel',
  templateUrl: './invoice-cancel.component.html',
  styleUrls: ['./invoice-cancel.component.scss']
})
export class InvoiceCancelComponent implements OnInit {
  DisplayInvoiceData = ['SrNo', 'InvNo', 'InvCreatedDate',
    'StockistNo', 'StockistName', 'CityName', 'InvAmount', 'StatusText', 'IsStockTransfer', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompId: number = 0;
  invoicemodel: InvoiceModel;
  DataModel: any;
  searchModel: string = '';
  InvId: number = 0;
  currentDate: Date;
  Title: string = "";
  allinvCount: AllInvCnt;
  TotalInvoices: number = 0;
  TodaysWithOldOpen: number = 0;
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
  DataModelCount: any;
  id: any;

  constructor(private router: Router,
    private chRef: ChangeDetectorRef,
    private _ToastrService: ToastrService,
    private _orderDispatchService: OrderDispatchService, private route: ActivatedRoute,) {
    this.currentDate = new Date(); // Today's Current Date
  }

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
    this.GetInvoiceList(this.DataModel);
    this.DataModelCount = {
      BranchId: this.BranchId,
      CompId: this.CompId
    }
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id == 1) {
      this.id = this.id;
      this.GetInvStkcnt(this.DataModelCount);
    } else if (this.id == null || this.id == undefined) {
      this.id = this.id = 0;
      this.GetInvoiceCounts(this.DataModelCount);
    }
  }

  // Get Invoice List
  GetInvoiceList(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getInvoice_Service(DataModel).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        if (this.id === "1") {
          var StockTransData = data.filter((x: any) => x.IsStockTransfer === 1)
          this.DataSource.data = StockTransData;
          this.InvDataList = StockTransData;
          this.DataSource.paginator = this.paginator;
          this.DataSource.sort = this.Sort;
          this.isLoading = false;
          this.chRef.detectChanges();
        }
        else {
          var OrderDispatchData = data.filter((x: any) => x.IsStockTransfer === 0)
          this.DataSource.data = OrderDispatchData;
          this.InvDataList = OrderDispatchData;
          this.DataSource.paginator = this.paginator;
          this.DataSource.sort = this.Sort;
          this.isLoading = false;
          this.chRef.detectChanges();
        }
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

  // To cancel invoice
  ChangeStatus(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.InvId = row.InvId;
        this.isLoading = true;
        let cancelInvoiceBody = {
          InvId: row.InvId,
          BranchId: this.BranchId,
          CompId: this.CompId,
          InvStatus: AppCode.cancelStatusForINV, // 20 Cancel
          NoOfBox: 0,
          InvWeight: 0,
          IsColdStorage: false,
          IsCourier: 0,
          ConcernId: 0,
          Remark: '',
          Addedby: String(this.UserId),
          UpdateDate: this.currentDate
        }
        this._orderDispatchService.InvoiceHeaderStatusUpdate_Service(cancelInvoiceBody)
          .subscribe((data: any) => {
            if (data === AppCode.SuccessStatus) {
              this._ToastrService.success(AppCode.msg_cancelled);
            }
            this.isLoading = false;
            this.GetInvoiceList(this.DataModel);
            if (this.id === "1") {
              this.GetInvStkcnt(this.DataModelCount);
            }
            else {
              this.GetInvoiceCounts(this.DataModelCount);
            }
          }, (error: any) => {
            console.error("Error:  " + JSON.stringify(error));
          });
      }
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

  GetInvoiceCounts(DataModelCount: any) {
    this.isLoading = true;
    this._orderDispatchService.GetInvoiceCounts_Service(DataModelCount)
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
      else if (Flag === 'PendingLR') {
        this.Title = " List View - Pending LR" + ' (' + this.PendingLR + ')';
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 7 || x.InvStatus === 8);
      }
      else if (Flag === 'PackerConcern') {
        this.Title = " List View - Packer Concern" + ' (' + this.PackerConcern + ')';
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 4);
      }
      else if (Flag === 'PendingInvCtn') {
        this.Title = " List View - Pending Invoices" + ' (' + this.PendingInvCtn + ')';
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 0);
      }
      else if (Flag === 'IsStockTransferCtn') {
        this.Title = " List View - Stock Transfer" + ' (' + this.IsStockTransferCtn + ')';
        this.InvoicList = this.InvDataList.filter(x => x.IsStockTransfer === 1);
      }
      this.DataSource = new MatTableDataSource(this.InvoicList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
      this.chRef.detectChanges();

    }
  }

}
