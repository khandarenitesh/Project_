import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

// Angular Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Services
import { ToastrService } from 'ngx-toastr';
import { InventoryInwardService } from '../Services/inventory-inward.service';
import { AppCode } from '../../../app.code';
import Swal from 'sweetalert2';
import { InvInwardAllCountModel } from '../models/ApproveVehicleModel';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-import-transit-report',
  templateUrl: './import-transit-report.component.html',
  styleUrls: ['./import-transit-report.component.scss']
})
export class ImportTransitReportComponent implements OnInit {
  importTransitDetails = ['SrNo', 'InvoiceNo', 'InvoiceDate', 'DeliveryNo', 'Quantity', 'LrNo', 'LrDate', 'TransporterNo', 'TransporterName', 'VehicleNo'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  public DataSource = new MatTableDataSource<any>();
  Title: string = 'Import Transit Report';
  @ViewChild('fileInput') fileInput: ElementRef;
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  ListTitle: string = "";
  searchModel: string = '';
  fileName: string = "ImportTransitReportTemplate";
  DataModel: any;
  InvInwardAllCount: InvInwardAllCountModel;
  TodayLRCnt: number = 0;
  TodayVehicleMappedCnt: number = 0;
  TodayChklistDoneCnt: number = 0;
  TodayConcernRaisedCnt: number = 0;
  TransitDataList: any;
  TransitCountList: any;
  formatDatestring: any;
  CurrentDateTime = new Date();

  constructor(private _InventoryInwardService: InventoryInwardService, private chRef: ChangeDetectorRef, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.ListTitle = "Transit Report List";
    var result = AppCode.getUser();
    this.UserId = result.UserId;
    this.BranchId = result.BranchId;
    this.CompanyId = result.CompanyId;
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompanyId,
    };
    this.GetInvInwardPagesAllCount(this.DataModel);
    this.GetTransitList(this.BranchId, this.CompanyId);
    this.formatDatestring = formatDate(this.CurrentDateTime, 'yyyy-MM-dd', 'en-US');
  }

  // Get Transit Data List
  GetTransitList(BranchId: number, CompId: number) {
    this.isLoading = true;
    this._InventoryInwardService.GetTransitDataList(BranchId, CompId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
        this.TransitDataList = data
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

  //  Get LR Page Count List
  GetInvInwardPagesAllCount(DataModel: any) {
    this.isLoading = true;
    this._InventoryInwardService.GetInvInwardAllCounts(DataModel)
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

  // Count
  afterCount(data: InvInwardAllCountModel) {
    this.InvInwardAllCount = new InvInwardAllCountModel();
    this.InvInwardAllCount = data;
    this.TodayLRCnt = this.InvInwardAllCount.TodayLR
    this.TodayVehicleMappedCnt = this.InvInwardAllCount.TodayVehicleMapped;
    this.TodayChklistDoneCnt = this.InvInwardAllCount.TodayChklistDone;
    this.TodayConcernRaisedCnt = this.InvInwardAllCount.TodayConcernRaised;
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  ShowLRList(Flag: string) {
    this.isLoading = true;
    if (this.TransitDataList != null && this.TransitDataList !== undefined) {
      if (Flag === 'TodaysImportLR') {
        this.TransitCountList = this.TransitDataList.filter((x: any) => x.AddedOn === this.formatDatestring);
      }
      else if (Flag === 'VehicleMapped') {
        this.TransitCountList = this.TransitDataList.filter((x: any) => x.IsMapDone === 1 && x.LrDate === this.formatDatestring);
      } else if (Flag === 'ChecklistDone') {
        this.TransitCountList = this.TransitDataList.filter((x: any) => x.IsCheckListDone === 1 && x.LrDate === this.formatDatestring);
      }
      this.DataSource = new MatTableDataSource(this.TransitCountList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
    }
    this.isLoading = false;
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

  // Upload Transit Data
  onUpload() {
    this.isLoading = true;
    let formData = new FormData();
    let file = this.fileInput.nativeElement.files[0];
    if (file === undefined) {
      this.toastr.error('Please Select File');
      this.isLoading = false;
      this.chRef.detectChanges();
    } else if (file != undefined && (file.name.split('.').pop() === "xls" || file.name.split('.').pop() === "XLS" || file.name.split('.').pop() === "xlsx" || file.name.split('.').pop() === "XLSX")) {
      formData.append('upload', file);
      this._InventoryInwardService.ImportTransitData(this.BranchId, this.CompanyId, String(this.UserId), formData).subscribe((data: any) => {
        if (data === '-1') {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          });
        } else if (data === "No Record Found") {
          Swal.fire({
            icon: 'error',
            text: data
          });
        } else if (data === "No Record Found in Excel file") {
          Swal.fire({
            icon: 'error',
            text: data
          })
        } else if (data === "Invalid Excel File") {
          Swal.fire({
            icon: 'error',
            text: data
          });
        } else if (data.includes("Transporter Not Available: ")) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data
          });
        } else if (data.includes("No. of Invoices Imported: , Duplicate Invoice Numbers")) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data
          });
        } else if (data.includes("Please Select Today's Date or Previous Date")) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data
          });
        }
        else {
          Swal.fire({
            icon: 'success',
            title: 'File Uploaded SuccessFully!',
            text: data
          });
        }
        this.clearFile();
        this.GetTransitList(this.BranchId, this.CompanyId);
        this.GetInvInwardPagesAllCount(this.DataModel);
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

  downloadTemplate() {
    let link = document.createElement("a");
    link.download = this.fileName;
    link.href = "assets/media/ExcelTemplates/" + this.fileName + ".xlsx";
    link.click();
  }

}
