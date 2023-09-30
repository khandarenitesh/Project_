import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';

import { InvoiceModel } from './../Models/invoice-model';

import { SharedService } from '../../../SharedServices/shared.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import { OrderDispatchService } from '../Services/order-dispatch.service';
import { AllInvCnt } from '../Models/all-inv-cnt.model';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {

  DisplayInvoiceData = ['SrNo', 'InvNo', 'InvCreatedDate',
    'StockistNo', 'StockistName', 'CityName', 'InvAmount', 'StatusText', 'IsStockTransfer'];//, 'Actions'

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompId: number = 0;
  invoicemodel: InvoiceModel;
  DataModel: any;
  Title: string = "";
  searchModel: string = '';
  InvoicelistData: any[] = [];
  InvoiceList: any;

  allinvCount: AllInvCnt;
  TodaysWithOldOpen: number = 0;
  TotalInvoices: number = 0;
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

  constructor(private router: Router, private _SharedService: SharedService,
    private chRef: ChangeDetectorRef, private _ToastrService: ToastrService,
    private _orderDispatchService: OrderDispatchService) {
  }

  ngOnInit(): void {
    this.Title = "List View"
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;

    this.DataModelCount = {
      BranchId: this.BranchId,
      CompId: this.CompId
    }
    this.GetInvoiceCounts(this.DataModelCount);

    if (this.BranchId > 0) {  // Branch Login
      this.DataModel = {
        BranchId: this.BranchId,
        CompId: this.CompId,
        FromDate: null,
        ToDate: null,
        BillDrawerId: 0
      };
      this.GetInvoiceList(this.DataModel);
    } else {   // Super Admin Login
      this.DataModel = {
        BranchId: this.BranchId,
        CompId: this.CompId,
        FromDate: null,
        ToDate: null,
        BillDrawerId: 0
      };
      this.GetInvoiceList(this.DataModel);
    }
  }

  GetInvoiceList(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getInvoice_Service(DataModel).subscribe(async (data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        var OrderDisData = data.filter((x: any) => x.IsStockTransfer === 0)
          this.DataSource.data = await OrderDisData;
          this.DataSource.paginator = this.paginator;
          this.DataSource.sort = this.Sort;
          this.InvDataList = await OrderDisData;
          this.GetInvoiceCounts(this.DataModelCount);
      } else {
        this.DataSource.data = [];
      }
      this.isLoading = false;
      this.chRef.detectChanges();
    }, (error: any) => {
      console.log(error);
      this.isLoading = false;
      this.chRef.detectChanges();
    });
  }

  ChangeStatus(row: InvoiceModel) {
    this.isLoading = true;
    this.isLoading = false;
    this.invoicemodel = new InvoiceModel();
    this.invoicemodel.BranchId = row.BranchId;
    this.invoicemodel.CompId = this.CompId;
    this.invoicemodel.InvNo = row.InvNo;
    this.invoicemodel.InvCreatedDate = row.InvCreatedDate;
    this.invoicemodel.ItemCategory = row.ItemCategory;
    this.invoicemodel.IsColdStorage = row.IsColdStorage;
    this.invoicemodel.SoldTo_StokistId = row.SoldTo_StokistId;
    this.invoicemodel.StockistNo = row.StockistNo;
    this.invoicemodel.SoldTo_City = row.SoldTo_City;
    this.invoicemodel.InvAmount = row.InvAmount;
    this.invoicemodel.SONo = row.SONo;
    this.invoicemodel.SODate = row.SODate;
    this.invoicemodel.BilingType = row.BilingType;
    this.invoicemodel.Addedby = String(this.UserId);
    this.invoicemodel.Action = AppCode.deleteString;
    this._orderDispatchService.InvoiceAddEdit_Service(this.invoicemodel)
      .subscribe((data: any) => {
        if (data === AppCode.StatusChangedStatus) {
          this._ToastrService.success(AppCode.msg_deleteSuccess);
          if (this.BranchId > 0) {  // Branch Login
            this.DataModel = {
              BranchId: this.BranchId,
              CompId: this.CompId,
              FromDate: null,
              ToDate: null,
              BillDrawerId: 0

            };
            this.GetInvoiceCounts(this.DataModel);
            this.GetInvoiceList(this.DataModel);
          } else {   // Super Admin Login
            this.DataModel = {
              BranchId: this.BranchId,
              CompId: this.CompId,
              FromDate: null,
              ToDate: null,
              BillDrawerId: 0

            };
            this.GetInvoiceCounts(this.DataModelCount);
            this.GetInvoiceList(this.DataModel);
          }
        }
      }, (error: any) => {
        console.error(error);
      });
  }

  redirect() {
    this.router.navigate(['/modules/order-dispatch/invoice-add']);
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
      .subscribe(async (data: any) => {
        await this.afterCount(data);
      }, (error: any) => {
        console.error("Error: " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  afterCount(data: AllInvCnt) {
    this.allinvCount = new AllInvCnt();
    this.allinvCount = data;
    this.TodaysWithOldOpen = this.allinvCount.TodaysWithOldOpen;
    this.TotalInvoices = this.allinvCount.TotalInvoices;
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

  ShowInvList(Flag?: any) {
    if (this.InvDataList != null && this.InvDataList != undefined) {

      if (Flag === 'OnPriorityCtn') {
        this.Title = " List View - Priority" + ' (' + this.OnPriorityCtn + ')';
        this.InvoicList = this.InvDataList.filter(x => x.OnPriority === 1 && x.InvStatus != 20);
      }
      // } else if (Flag === 'AllInv') {
      //   this.Title = " List View - All Invoices" + ' (' + this.TodaysWithOldOpen + ')';
      //   this.InvoicList = this.InvDataList.filter(x => (x.InvStatus !== 8 ||x.InvStatus !== 9||x.InvStatus !== 20 ) );
      // }
      else if (Flag === 'PackerConcern') {
        this.Title = " List View - Packer Concern" + ' (' + this.PackerConcern + ')';
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 4);
      }
      else if (Flag === 'PendingLR') {
        this.Title = " List View - Pending LR" + ' (' + this.PendingLR + ')';
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 7 || x.InvStatus === 8);
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
