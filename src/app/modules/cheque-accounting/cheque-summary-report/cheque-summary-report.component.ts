import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

// Angular Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Models
import { ChqSummaryForMonthlyModel } from '../models/cheque-summary-report.model';

// Services
import { ChequeAccountingService } from '../Services/cheque-accounting.service';

// Generic File common code
import { AppCode } from '../../../app.code';

@Component({
  selector: 'app-cheque-summary-report',
  templateUrl: './cheque-summary-report.component.html',
  styleUrls: ['./cheque-summary-report.component.scss'],
  providers: [DatePipe]
})
export class ChequeSummaryReportComponent implements OnInit {


  ChequeSmmaryReportColumns = ['SrNo', 'InvNo', 'InvCreatedDate', 'DueDate', 'ChqAmount', 'ChqNo', 'StockistNo', 'StockistName'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  public DataSource = new MatTableDataSource<any>()

  ChequeForm: FormGroup;
  default: any = {
    FromDate: '',
    ToDate: ''
  }
  submitted = false;
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  searchModel: string = '';
  Title: string;
  // todayDate: Date;
  fileName: string = "chequeSummaryForMonthlyWeeklyReport";
  chqSummaryForMonthlyModel: ChqSummaryForMonthlyModel;
  minDate = new Date();
  maxDate = new Date();

  FromDate = new FormControl(new Date());
  ToDate = new FormControl(new Date());

  constructor(private fb: FormBuilder, private chequeAccountingService: ChequeAccountingService, private chRef: ChangeDetectorRef, private datePipe: DatePipe) {
    // this.todayDate = new Date();
    this.FromDate = new FormControl(new Date());
    this.ToDate = new FormControl(new Date());
  }

  ngOnInit(): void {
    this.Title = "Cheque Summary Report List";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.intForm();
    this.GetChqSummaryForMonthlyList(this.BranchId, this.CompanyId);
    this.FromDate = new FormControl(new Date());
    this.ToDate = new FormControl(new Date());
  }

  get f(): { [key: string]: AbstractControl } {
    return this.ChequeForm.controls;
  }

  intForm() {
    this.ChequeForm = this.fb.group({
      FromDate: [
        this.default.FromDate,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      ToDate: [
        this.default.ToDate,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ]
    });
  }

  SaveCheqDates() {
    this.GetChqSummaryForMonthlyList(this.BranchId, this.CompanyId);
  }
  // get Cheque Register Summary Report List
  GetChqSummaryForMonthlyList(BranchIdValue: number, CompanyIdValue: number) {
    this.isLoading = true;
    let ChqSummaryForMonthlyBody = {
      "CompId": CompanyIdValue,
      "BranchId": BranchIdValue,
      "FromDate": AppCode.createDateAsUTC(this.FromDate.value), // this.FromDate -> For Formcontrol
      "ToDate": AppCode.createDateAsUTC(this.ToDate.value) // this.ToDate -> For Formcontrol
      // "FromDate": this.datePipe.transform(this.todayDate),
      // "ToDate": this.datePipe.transform(this.todayDate)

    }
    this.chequeAccountingService.getChqSummaryForMonthlyList_Service(ChqSummaryForMonthlyBody).subscribe((data: any) => {
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

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    // this.searchModel = this.searchModel.trim(); // Remove whitespace
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  // export To Excel File
  exportAsExcel() {
    AppCode.exportToExcelFile(this.fileName, this.table);
  }

  clear() {
    this.FromDate.reset();
    this.ToDate.reset();
    this.chRef.detectChanges();
  }

}