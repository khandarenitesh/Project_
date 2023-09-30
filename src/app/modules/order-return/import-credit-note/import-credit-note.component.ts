import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';

// Angular Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

//Service
import { ToastrService } from 'ngx-toastr';
import { OrderReturnService } from '../Services/order-return.service';
import Swal from 'sweetalert2';
import { AppCode } from '../../../app.code';

@Component({
  selector: 'app-import-credit-note',
  templateUrl: './import-credit-note.component.html',
  styleUrls: ['./import-credit-note.component.scss']
})
export class ImportCreditNoteComponent implements OnInit {
  importCreditNote = ['SrNo', 'CrDrNoteNo', 'CRDRCreationDate', 'StockistNo', 'StockistName', 'CityName'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  public DataSource = new MatTableDataSource<any>();
  Title: string = "Import Credit Note"
  @ViewChild('fileInput') fileInput: ElementRef;
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  ListTitle: string = "";
  searchModel: string = "";
  fileName: string = "ImportCNTemplate";

  constructor(private _OrderReturnService: OrderReturnService, private chRef: ChangeDetectorRef, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.ListTitle = "Credit Note List";
    var result = AppCode.getUser();
    this.UserId = result.UserId;
    this.BranchId = result.BranchId;
    this.CompanyId = result.CompanyId;
    this.GetCreditNoteDataList(this.BranchId, this.CompanyId); // call for credit note list
  }

  //Get Credit Note List
  GetCreditNoteDataList(BranchId: number, CompId: number) {
    this.isLoading = true;
    this._OrderReturnService.GetCreditNoteList(BranchId, CompId).subscribe((data: any) => {
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

  //Upload Credit-Note Data
  onUpload() {
    this.isLoading = true;
    let formData = new FormData;
    let file = this.fileInput.nativeElement.files[0];
    if (file === undefined) {
      this.toastr.error('Please Select File');
      this.isLoading = false;
      this.chRef.detectChanges();
    } else if (file != undefined && (file.name.split('.').pop() === "xls" || file.name.split('.').pop() === "xlsx")) {
      formData.append('upload', file);
      this._OrderReturnService.ImportCreditNoteData(this.BranchId, this.CompanyId, String(this.UserId), formData).subscribe((data: any) => {
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
        } else if (data.includes("Below Columns has invalid data:")) {
          Swal.fire({
            icon: 'error',
            text: data
          })
        } else if (data.includes("No. of CN Imported: 0")) {
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
        this.GetCreditNoteDataList(this.BranchId, this.CompanyId);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'File is Invalid (Accepts only xls or .xlsx)',
      })
      this.clearFile();
    }
  }

  downloadTemplate() {
    let link = document.createElement("a");
    link.download = this.fileName;
    link.href = "assets/media/ExcelTemplates/" + this.fileName + ".xlsx";
    link.click();
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
