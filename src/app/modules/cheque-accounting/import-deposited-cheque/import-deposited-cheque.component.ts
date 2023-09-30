import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';
import { ChequeAccountingService } from '../Services/cheque-accounting.service';
import { AppCode } from '../../../app.code';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-import-deposited-cheque',
  templateUrl: './import-deposited-cheque.component.html',
  styleUrls: ['./import-deposited-cheque.component.scss']
})
export class ImportDepositedChequeComponent implements OnInit {
  Title: string = 'Import Deposited Cheque';
  importDepositedCheque = ['SrNo', 'StockistName', 'DepositeDate', 'BankName', 'AccountNo', 'ChequeNo', 'Amount'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  @ViewChild('fileInput') fileInput: ElementRef;
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  ListTitle: string = "";
  searchModel: string = '';
  fileName: string = "ImportDepositedChequeDataTemplate";

  constructor(private chequeAccountingService: ChequeAccountingService, private chRef: ChangeDetectorRef, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.ListTitle = "List View";
    var result = AppCode.getUser();
    this.UserId = result.UserId;
    this.BranchId = result.BranchId;
    this.CompanyId = result.CompanyId;
    this.GetDepositedCheque();
  }

  // Get Deposited Cheque List through imported excel
  GetDepositedCheque() {
    this.isLoading = true;
    this.chequeAccountingService.getDepositedCheque_Service(this.BranchId, this.CompanyId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
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

  // Upload Import Deposited Cheque Data
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
      this.chequeAccountingService.ImportDepositedChequeData(this.BranchId, this.CompanyId, String(this.UserId), formData)
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
          } else if (data === "Invalid Excel File") {
            Swal.fire({
              icon: 'error',
              text: data
            })
          } 
          else if (data.includes("These Cheques Are Already Processed")) {
            Swal.fire({
              icon: 'error',
              text: data
            })
          } // New
          else if (data.includes("Below Columns has invalid data")) {
            Swal.fire({
              icon: 'error',
              text: data
            })
          } // Date: 19-04-2023 else if - Below Columns has invalid data -> added because Production issue comes
          else if (data.includes("Cheque Number Not Found")) {
            Swal.fire({
              icon: 'error',
              text: data
            })
          } // Date: 19-04-2023 else if - Cheque Number Not Found -> added because Production issue comes
          else {
            Swal.fire({
              icon: 'success',
              title: 'File Uploaded SuccessFully!',
              text: data
            })
          }
          this.clearFile();
          this.GetDepositedCheque();
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

}
