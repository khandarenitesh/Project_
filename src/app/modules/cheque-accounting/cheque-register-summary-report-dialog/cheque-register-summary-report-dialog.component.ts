import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChequeAccountingService } from '../Services/cheque-accounting.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCode } from 'src/app/app.code';
import { SharedService } from 'src/app/SharedServices/shared.service';

export class ChequeRegister {
  ChqRegId: number = 0;
  CompId: number = 0;
  BranchId: number = 0;
  StokistId: number = 0;
  StockistNo: string = "";
  StockistName: string = "";
  StockistCode: string = "";
  StockistCity: number = 0;
  ChqReceivedDate: Date = new Date();
  BankId: number = 0;
  BankName: string = "";
  City: string = "";
  AccountNo: number = 0;
  IFSCCode: string = "";
  ChqNo: string = "";
  FromChqNo: string = "";
  ToChqNo: string = "";
  IsActive: string = '';
  Addedby: string = '';
  Updatedby: string = '';
  Action: string = '';
}

@Component({
  selector: 'app-cheque-register-summary-report-dialog',
  templateUrl: './cheque-register-summary-report-dialog.component.html',
  styleUrls: ['./cheque-register-summary-report-dialog.component.scss']
})

export class ChequeRegisterSummaryReportDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ChequeRegisterSummaryReportDialogComponent>,
    private chequeAccountingService: ChequeAccountingService, private _appCode: AppCode,
    private router: Router, private route: ActivatedRoute, private _SharedService: SharedService,
    private chRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  public DataSourceFilter = new MatTableDataSource<any>();
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  ChequeRegisterRprtFilterDataApi = ['SrNo', 'StockistNo', 'StockistName', 'BankName', 'CityName', 'AccountNo', 'IFSCCode', 'ChqNo', 'ChqStatusText'];
  isLoading: boolean = false;
  isLoadingFilter: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  searchModel: string = '';
  Title: string;
  fileName: string = "chequeRegisterSummaryCountReport";
  SummaryReportCountFilterModel: any;
  StockistId: any;
  ModalTitle: any;
  BlankChqs: number = 0;
  UtilisedChqs: number = 0;
  PrepareChqs: number = 0;
  DepositedChqs: number = 0;
  DiscardedChqs: number = 0;
  SettledChqs: number = 0;
  ReturnedChqs: number = 0;
  CommonDataListforTable: any[] = [];
  SummaryReportFilterDataList: any[] = [];
  ngOnInit(): void {
    console.log('Dialog got', this.data);
  }

  closeDialog() {
    this.dialogRef.close();
  }
  // set data on click edit button
  GetData(row: ChequeRegister) {
    debugger
    this._SharedService.setData(row);
    this.router.navigate(['/modules/cheque-accounting/cheque-summary-report-details'], { queryParams: { state: AppCode.updateString } });
  }
  //Get Cheques List
  GetChequeList(StockistId: any, flag: string) {
    debugger
    this.isLoadingFilter = true;
    this.chequeAccountingService.getChequeList_Service(this.BranchId, this.CompanyId, StockistId).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.DataSourceFilter.data = [];
        this.SummaryReportFilterDataList = [];
        this.DataSourceFilter.data = data;
        this.SummaryReportFilterDataList = data;
        this.FilterChqRgstSmryData(flag);
      } else {
        this.DataSourceFilter.data = [];
        this.SummaryReportFilterDataList = [];
      }
      this.isLoadingFilter = false;
      this.chRef.detectChanges();
    });
    this.isLoadingFilter = false;
  }


  FilterChqRgstSmryData(flag: string) {
    this.CommonDataListforTable = [];
    switch (flag) {
      case 'BlankChqs':
        this.ModalTitle = `Blank cheque summary report (${this.BlankChqs})`;
        this.CommonDataListforTable = this.SummaryReportFilterDataList.filter(x => x.ChqStatusText === 'Blank' && x.ChqStatus === 0);
        break;
      case 'UtilisedChqs':
        this.ModalTitle = `Utilised cheque summary report (${this.UtilisedChqs})`;
        this.CommonDataListforTable = this.SummaryReportFilterDataList.filter(x => x.ChqStatusText === 'Utilised' && x.ChqStatus === 1);
        break;
      case 'PrepareChqs':
        this.ModalTitle = `Prepare cheque summary report (${this.PrepareChqs})`;
        this.CommonDataListforTable = this.SummaryReportFilterDataList.filter(x => x.ChqStatusText === 'Prepare' && x.ChqStatus === 2);
        break;
      case 'DiscardedChqs':
        this.ModalTitle = `Discarded cheque summary report (${this.DiscardedChqs})`;
        this.CommonDataListforTable = this.SummaryReportFilterDataList.filter(x => x.ChqStatusText === 'Discarded' && x.ChqStatus === 3);
        break;
      case 'DepositedChqs':
        this.ModalTitle = `Deposited cheque summary report (${this.DepositedChqs})`;
        this.CommonDataListforTable = this.SummaryReportFilterDataList.filter(x => x.ChqStatusText === 'Deposited' && x.ChqStatus === 4);
        break;
      case 'ReturnedChqs':
        this.ModalTitle = `Returned cheque summary report (${this.ReturnedChqs})`;
        this.CommonDataListforTable = this.SummaryReportFilterDataList.filter(x => x.ChqStatusText === 'Returned' && x.ChqStatus === 5);
        break;
      case 'SettledChqs':
        this.ModalTitle = `Settled cheque summary report (${this.SettledChqs})`;
        this.CommonDataListforTable = this.SummaryReportFilterDataList.filter(x => x.ChqStatusText === 'SettledChqs' && x.ChqStatus === 8);
        break;
      default:
        break;
    }

    // this.DataSourceFilter.data = [];
    // this.DataSourceFilter.data = this.CommonDataListforTable;
    // this.DataSourceFilter.paginator = this.paginatorRefChqAc;

    this.DataSourceFilter = new MatTableDataSource(this.CommonDataListforTable);
    this.DataSourceFilter.paginator = this.paginator;

    this.chRef.detectChanges();
  }

}
