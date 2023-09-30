import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';
import { OrderDispatchService } from '../Services/order-dispatch.service';
import { AppCode } from '../../../app.code';
import Swal from 'sweetalert2';
import { AllInvCnt } from '../Models/all-inv-cnt.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-import-lr-details',
  templateUrl: './import-lr-details.component.html',
  styleUrls: ['./import-lr-details.component.scss']
})
export class ImportLRDetailsComponent implements OnInit {
  Title: string = 'Import LR Data';
  importLRDerails = ['SrNo', 'InvNo', 'NoOfBox', 'StockistNo', 'StockistName', 'LRNo', 'LRDatestring', 'LRBox', 'IsStockTransfer'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  @ViewChild('fileInput') fileInput: ElementRef;
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  DataModel: any;
  DataModelCounts: any;
  currentDate: Date;
  ListTitle: string = "";
  searchModel: string = '';
  fileName: string = "ImportLRDataTemplate";
  allinvCount: AllInvCnt;
  TotalInvoices: number = 0;
  TodaysWithOldOpen: number = 0;
  CancelInvCtn: number = 0;
  PendingInvCtn: number = 0;
  OnPriorityCtn: number = 0;
  PendingLR: number = 0;
  PackerConcern: number = 0;
  GatpassGenCtn: number = 0;
  IsStockTransferCtn: number = 0;
  StkPrint: number = 0;
  LocalMode: number = 0;
  OtherCity: number = 0;
  ByHand: number = 0;
  InvoicList: any;
  InvDataList: any[] = [];
  id: any;


  constructor(private _OrderDispatchService: OrderDispatchService, private chRef: ChangeDetectorRef, private toastr: ToastrService, private route: ActivatedRoute,) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.ListTitle = "List View"
    var result = AppCode.getUser();
    this.UserId = result.UserId;
    this.BranchId = result.BranchId;
    this.CompanyId = result.CompanyId;
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompanyId,
      LRDate: this.currentDate
    }
    this.GetLRList(this.DataModel);
    //For Count
    this.DataModelCounts = {
      BranchId: this.BranchId,
      CompId: this.CompanyId,
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

  // Get LR List
  GetLRList(DataModel: any) {
    this.isLoading = true;
    this._OrderDispatchService.getLR_Service(DataModel).subscribe((data: any) => {
      if (data.length > 0) {
        if (this.id === "1") {
          var StockTransData = data.filter((x: any) => x.IsStockTransfer === 1)
          this.DataSource.data = StockTransData;
          this.InvDataList = StockTransData;
          this.DataSource.paginator = this.paginator;
          this.DataSource.sort = this.Sort;
        }
        else {
          var OrderDispatch = data.filter((x: any) => x.IsStockTransfer === 0)
          this.DataSource.data = OrderDispatch;
          this.InvDataList = OrderDispatch;
          this.DataSource.paginator = this.paginator;
          this.DataSource.sort = this.Sort;
        }
      } else {
        this.DataSource.data = [];
      }
      if (this.id === "1") {
        this.GetInvStkcnt(this.DataModelCounts);
      }
      else {
        this.GetInvoiceCounts(this.DataModelCounts);
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

  // Select File on change event occurs
  onChange() {
    let file = this.fileInput.nativeElement.files[0];
    if (file.name.split('.').pop() !== "xls" || file.name.split('.').pop() !== "XLS" || file.name.split('.').pop() !== "xlsx" || file.name.split('.').pop() !== "XLSX") { } else {
      this.toastr.error("Accepts only xls or .xlsx");
      this.fileInput.nativeElement.value = null;
    }
  }

  DownloadTemplate() {
    let link = document.createElement("a");
    link.download = this.fileName;
    link.href = "assets/media/ExcelTemplates/" + this.fileName + ".xlsx";
    link.click();
  }

  // Upload LR Data
  onUpload() {
    this.isLoading = true;
    let formData = new FormData();
    let file = this.fileInput.nativeElement.files[0];
    if (file === undefined) {
      this.toastr.error('Please Select File');
      this.isLoading = false;
      this.chRef.detectChanges();
    } else if (file != undefined && (file.name.split('.').pop() === "xls" || file.name.split('.').pop() === "xlsx")) {
      formData.append('upload', file);
      this._OrderDispatchService.ImportLRData(String(this.UserId), formData)
        .subscribe((data: any) => {
          if (data === '-1') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!'
            })
          } else if (data === "No Record Found") {
            Swal.fire({
              icon: 'error',
              text: data
            })
          } else if (data === "No Record Found in Excel file") {
            Swal.fire({
              icon: 'error',
              text: data
            })
          }
          else if (data === "Invalid Excel File") {
            Swal.fire({
              icon: 'error',
              text: data
            })
          } else if (data === "Invalid Template File") {
            Swal.fire({
              icon: 'error',
              text: data
            })
          } else if (data === '-2') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Invoice Number Not Exist!'
            })
          } else if (data.includes("Gatepass is not generated for these invoices")) {
            Swal.fire({
              icon: 'warning',
              text: data
            })
          } else {
            Swal.fire({
              icon: 'success',
              title: 'File Uploaded SuccessFully!',
              text: "No Of LR Imported : " + data
            })
          }
          this.clearFile();
          this.GetLRList(this.DataModel);
          if (this.id === "1") {
            this.GetInvStkcnt(this.DataModelCounts)
          }
          else {
            this.GetInvoiceCounts(this.DataModelCounts);
          }

        });
    } else {
      this.toastr.warning('File is Invalid (Accepts only xls or .xlsx)');
      this.clearFile();
    }
  }

  // Clear File
  clearFile() {
    this.fileInput.nativeElement.value = null;
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

  GetInvoiceCounts(DataModelCounts: any) {
    this.isLoading = true;
    this._OrderDispatchService.GetInvoiceCounts_Service(DataModelCounts)
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
    this._OrderDispatchService.GetInvForStkCnt_Service(DataModelCount)
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
      else if (Flag === 'CancelInvCtn') {
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 20);
      }
      else if (Flag === 'PendingInvCtn') {
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 0);
      }
      else if (Flag === 'PendingLR') {
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 7 || x.InvStatus === 8);
      }
      else if (Flag === 'IsStockTransferCtn') {
        this.InvoicList = this.InvDataList.filter(x => x.IsStockTransfer === 1);
      }
      else if (Flag === 'PackerConcern') {
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 4);
      }
      this.DataSource = new MatTableDataSource(this.InvoicList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
      this.chRef.detectChanges();

    }
  }

}
