import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';
import { ChequeAccountingService } from '../Services/cheque-accounting.service';
import { AppCode } from '../../../app.code';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-import-stockist-outstanding',
  templateUrl: './import-stockist-outstanding.component.html',
  styleUrls: ['./import-stockist-outstanding.component.scss']
})
export class ImportStockistOutstandingComponent implements OnInit {
  Title: string = 'Import Stockist OutStanding';
  importSODerails = ['SrNo', 'StockistCode', 'StockistName', 'City', 'OpenAmt', 'RV', 'AB', 'CD', 'CC', 'DG', 'DR', 'DZ', 'Other'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('TABLE') table: ElementRef;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  OSDate: Date;
  ListTitle: string = "";
  searchModel: string = '';
  DataModel: any;
  stockistId: number = 0;
  ReportList: any[] = []
  OpenAmt: number = 0;
  RV: number = 0;
  AB: number = 0;
  CD: number = 0;
  CC: number = 0;
  DG: number = 0;
  DR: number = 0;
  DZ: number = 0;
  Other: number = 0;
  fileName: string = "ImportStockistOutStandingTemplate";
  fileNameOsDocTypesReport: string = "OsDocTypesReport";

  constructor(private chequeAccountingService: ChequeAccountingService, private chRef: ChangeDetectorRef, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.ListTitle = "List View";
    var result = AppCode.getUser();
    this.UserId = result.UserId;
    this.BranchId = result.BranchId;
    this.CompanyId = result.CompanyId;
    this.GetStockistOutstandingDtls();
  }

  GetStockistOutstandingDtls() {
    this.isLoading = true;
    this.chequeAccountingService.GetOsReportLst(this.BranchId, this.CompanyId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
        this.ColumnTotalDataCount(data);
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
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

  // Upload Import Stockist Outstanding Data
  onUpload() {
    this.isLoading = true;
    let formData = new FormData();
    let file = this.fileInput.nativeElement.files[0];
    this.OSDate = new Date();
    if (file === undefined) {
      this.toastr.error('Please Select File');
      this.isLoading = false;
      this.chRef.detectChanges();
    } else if (file != undefined && (file.name.split('.').pop() === "xls" || file.name.split('.').pop() === "xlsx")) {
      formData.append('upload', file);
      this.chequeAccountingService.ImportStockistOutstandingData(this.BranchId, this.CompanyId, String(this.UserId), formData)
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
          }
          else if (data === "Invalid Template File") {
            Swal.fire({
              icon: 'error',
              text: data
            })
          } else if (data === "Invalid Column Name") {
            Swal.fire({
              icon: 'error',
              text: data
            })
          } else if (data.includes("Below Columns has invalid data:")) {
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
          this.GetStockistOutstandingDtls();
        });
    } else {
      this.toastr.warning('File is Invalid (Accepts only xls or .xlsx)');
      this.clearFile();
    }
  }

  ColumnTotalDataCount(data: any) {
    this.RV = 0; this.AB = 0; this.CD = 0;
    this.CC = 0; this.DG = 0; this.DR = 0;
    this.DZ = 0; this.Other = 0;
    for (let q = 0; q < data.length; q++) {
      this.OpenAmt = this.OpenAmt + data[q].OpenAmt;
      this.RV = this.RV + data[q].RV;
      this.AB = this.AB + data[q].AB;
      this.CD = this.CD + data[q].CD;
      this.CC = this.CC + data[q].CC;
      this.DG = this.DG + data[q].DG;
      this.DR = this.DR + data[q].DR;
      this.DZ = this.DZ + data[q].DZ;
      this.Other = this.Other + data[q].Other;
    }
  }

  SendEmails() {
    this.isLoading1 = true;
    this.chequeAccountingService.SendEmails_Service(this.BranchId, this.CompanyId).subscribe((data: any) => {
      if (data.length > 0) {
        this.toastr.success("Email sent successfully");
      } else {
        this.toastr.error("Sent email failed");
      }
      this.isLoading1 = false;
      this.chRef.detectChanges();
      (error: any) => {
        console.log(error);
        this.isLoading1 = false;
        this.chRef.detectChanges();
      }
    })
  }

  // export excel
  exportAsExcel() {
    AppCode.exportToExcelFile(this.fileNameOsDocTypesReport, this.table);
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
