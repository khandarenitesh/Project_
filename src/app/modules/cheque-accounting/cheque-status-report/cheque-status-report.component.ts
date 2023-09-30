import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Services
import { ChequeAccountingService } from '../Services/cheque-accounting.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppCode } from '../../../app.code';

@Component({
  selector: 'app-cheque-status-report',
  templateUrl: './cheque-status-report.component.html',
  styleUrls: ['./cheque-status-report.component.scss']
})
export class ChequeStatusReportComponent implements OnInit {

  ChequeSmmaryReportColumns = ['SrNo', 'Months', 'StockistName', 'CityName', 'BankName','AccountNo', 'ChqNo','ChqRcptDate',
   'InvNo', 'DueDate', 'ChqAmount', 'ChqRemark'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  public DataSource = new MatTableDataSource<any>()
  ChequeStatusReportForm: FormGroup;
  maxDate = new Date();
  FromDate = new FormControl(new Date());
  ToDate = new FormControl(new Date());
  Title: string = "";
  isLoading: boolean = false;
  searchModel: string = "";
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  fileName: string = "chequeStatusReport";
  submitted = false;
  default: any = {
    FromDate: '',
    ToDate: ''
  }

  constructor(private fb: FormBuilder, private chequeAccountingService: ChequeAccountingService, private chRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.Title = "Cheque Status Report List";
    this.FromDate = new FormControl(new Date());
    this.ToDate = new FormControl(new Date());
    let obj = AppCode.getUser()
    this.UserId = obj.UserId;
    this.CompanyId = obj.CompanyId;
    this.BranchId = obj.BranchId;
    this.intForm();
    this.GetChequeStatusReport(this.BranchId, this.CompanyId);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.ChequeStatusReportForm.controls;
  }

  intForm() {
    this.ChequeStatusReportForm = this.fb.group({
      FromDate: [
        this.default.FromDate
      ],
      ToDate: [
        this.default.ToDate
      ]
    })
  }

  GetChequeStatusReport(BranchIdValue: number, CompanyIdValue: number) {
    this.isLoading = true;
    let ChequeStatusReportBody = {
      "BranchId": BranchIdValue,
      "CompId": CompanyIdValue,
      "FromDate": AppCode.createDateAsUTC(this.FromDate.value),
      "ToDate": AppCode.createDateAsUTC(this.ToDate.value)
    }
    this.chequeAccountingService.getChqStatusReport_Service(ChequeStatusReportBody).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = [];
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

  SaveChequeReport() {
    this.GetChequeStatusReport(this.BranchId, this.CompanyId);
  }

  clear() {
    this.FromDate.reset();
    this.ToDate.reset();
    this.chRef.detectChanges();
  }

  // export To Excel File
  exportAsExcel() {
    AppCode.exportToExcelFile(this.fileName, this.table);
  }

  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

}
