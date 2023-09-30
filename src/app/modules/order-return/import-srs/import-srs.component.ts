import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

// Angular Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Model
import { LrMismatchCountModel } from '../models/LrMismatchCountModel';

//Services
import { ToastrService } from 'ngx-toastr';
import { OrderReturnService } from '../Services/order-return.service';
import Swal from 'sweetalert2';
import { AppCode } from '../../../app.code';

@Component({
  selector: 'app-import-srs',
  templateUrl: './import-srs.component.html',
  styleUrls: ['./import-srs.component.scss']
})
export class ImportSrsComponent implements OnInit {
  importSRSDetails = ['SrNo', 'LRNo', 'LRDate', 'StockistNo', 'StockistName', 'CityName', 'ReceiptDate', 'TransCourName', 'RecvdAtOPDate'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  public DataSource = new MatTableDataSource<any>();
  Title: String = 'Import SRS';
  @ViewChild('fileInput') fileInput: ElementRef;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  isLoading: boolean = false;
  ListTitle: string = "";
  searchModel: string = '';
  fileName: string = "ImportSRSTemplate";
  lrlistcount: LrMismatchCountModel;
  TotalLR: number = 0;
  ReceivedLR: number = 0;
  ImportedLR: number = 0;
  NotFoundLR: number = 0;
  DataModel: any;

  constructor(private _OrderReturnService: OrderReturnService, private toastr: ToastrService, private chRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.ListTitle = "LR - SRS Mismatch List";
    var result = AppCode.getUser();
    this.UserId = result.UserId;
    this.BranchId = result.BranchId;
    this.CompanyId = result.CompanyId;
    this.GetLRmisMatchList();
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompanyId,
    };
    this.GetLRmisMatchCounts(this.DataModel);
  }

  // Get LR Mismatch List
  GetLRmisMatchList() {
    this.isLoading = true;
    this._OrderReturnService.GetLRmisMatchList_Service(this.BranchId, this.CompanyId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
        this.GetLRmisMatchCounts(this.DataModel)
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

  // Get LR misMatch Counts
  GetLRmisMatchCounts(DataModel: any) {
    this.isLoading = true;
    this._OrderReturnService.GetLRmisMatchCounts_Service(DataModel)
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
    this.chRef.detectChanges();
  }

  // Select File on change event occurs
  onChange() {
    let file = this.fileInput.nativeElement.files[0];
    if (file.name.split('.').pop() !== "xls" || file.name.split('.').pop() !== "XLS" || file.name.split('.').pop() !== "xlsx" || file.name.split('.').pop() !== "XLSX") { } else {
      this.toastr.error("Accepts only xls or .xlsx");
      this.fileInput.nativeElement.value = null;
    }
  }

  downloadTemplate() {
    let link = document.createElement("a");
    link.download = this.fileName;
    link.href = "assets/media/ExcelTemplates/" + this.fileName + ".xlsx";
    link.click();
  }

  // Upload SRS Data
  onUpload() {
    this.isLoading = true;
    let formData = new FormData;
    let file = this.fileInput.nativeElement.files[0];
    if (file == undefined) {
      this.toastr.error('Please Select File');
      this.isLoading = false;
      this.chRef.detectChanges();
    } else if (file != undefined && (file.name.split('.').pop() === "xls" || file.name.split('.').pop() === "xlsx")) {
      formData.append('upload', file);
      this._OrderReturnService.ImportSRSData(this.BranchId, this.CompanyId, String(this.UserId), formData).subscribe((data: any) => {
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
        } else if (data === "Invalid Excel File") {
          Swal.fire({
            icon: 'error',
            text: data
          })
        } else if (data.includes("Stockiests Not Exist:")) {
          Swal.fire({
            icon: 'error',
            text: data
          })
        } else {
          Swal.fire({
            icon: 'success',
            title: 'File Uploaded SuccessFully!',
            text: data
          })
        } 
        this.clearFile();
        this.GetLRmisMatchList();
        this.GetLRmisMatchCounts(this.DataModel);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'File is Invalid (Accepts only xls or .xlsx)',
      })
      this.clearFile();
    }
  }

  // export To Excel File
  exportAsExcel() {
    AppCode.exportToExcelFile(this.fileName, this.table);
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

}
