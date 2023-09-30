import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

// Services
import { OrderDispatchService } from '../Services/order-dispatch.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-import-invoice',
  templateUrl: './import-invoice.component.html',
  styleUrls: ['./import-invoice.component.scss']
})
export class ImportInvoiceComponent implements OnInit {
  Title: string = 'Import Invoice Data';
  @ViewChild('fileInput') fileInput: ElementRef;
  isLoading: boolean = false;
  isInvoiceList: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  fileName: string = "ImportInvoiceDataTemplate";

  constructor(private _OrderDispatchService: OrderDispatchService, private chRef: ChangeDetectorRef, private toastr: ToastrService) { }

  ngOnInit(): void {
    var result = AppCode.getUser();
    this.UserId = result.UserId;
    this.BranchId = result.BranchId;
    this.CompanyId = result.CompanyId;
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

  DownloadTemplate() {
    let link = document.createElement("a");
    link.download = this.fileName;
    link.href = "assets/media/ExcelTemplates/" + this.fileName + ".xlsx";
    link.click();
  }

  // Upload Invoice Data
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
      this._OrderDispatchService.ImportInvoiceData(this.BranchId, this.CompanyId, String(this.UserId), formData)
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
          else if (data.includes("Below Columns has invalid data:")) {
            Swal.fire({
              icon: 'error',
              text: data
            })
          }
          else if (data.includes("No. of Invoices Imported: 0, Duplicate Invoice Numbers")) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: data
            })
          }
          else {
            Swal.fire({
              icon: 'success',
              title: 'File Uploaded SuccessFully!',
              text: data
            })
          }
          this.clearFile();
          this.isInvoiceList = true; // Visible Invoice List
          this.isLoading = false;
          this.chRef.detectChanges();
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

}
