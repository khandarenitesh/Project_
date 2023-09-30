import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ChequeAccountingService } from '../Services/cheque-accounting.service';
import { AppCode } from '../../../app.code';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cheque-register-summary-report',
  templateUrl: './cheque-register-summary-report.component.html',
  styleUrls: ['./cheque-register-summary-report.component.scss']
})
export class ChequeRegisterSummaryReportComponent implements OnInit {
  Chequesmmryreport = ['SrNo', 'StockistNo', 'StockistName', 'BankName', 'IFSCCode', 'AccountNo', 'BlankChqs', 'UtilisedChqs',
    'PrepareChqs', 'DiscardedChqs', 'DepositedChqs', 'ReturnedChqs'];
  ChequeRegisterRprtFilterDataApi = ['SqNo', 'StockistNo', 'StockistName', 'BankName', 'CityName', 'AccountNo', 'IFSCCode', 'ChqNo', 'ChqStatusText'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  public DataSource = new MatTableDataSource<any>();
  public DataSourceFilter = new MatTableDataSource<any>();
  @ViewChild('Sort') Sort1: MatSort;
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
  totalItems = 0;
  IFSCCode: string = "";

  constructor(private chequeAccountingService: ChequeAccountingService, private chRef: ChangeDetectorRef, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.Title = "Cheque Register Summary Report";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.GetStockistOutstanding();
    this.totalItems = this.DataSourceFilter.data.length;
  }

  // get Cheque Register Summary Report List
  GetStockistOutstanding() {
    this.isLoading = true;
    this.chequeAccountingService.getChequeRegistersmryLst_Service(this.BranchId, this.CompanyId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
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

  //open modal for clickable counts
  OpenModalModalForFilterCount(content: any, flag: string, row: any) {
    this.StockistId = row.StokistId;
    this.BlankChqs = row.BlankChqs;
    this.UtilisedChqs = row.UtilisedChqs;
    this.PrepareChqs = row.PrepareChqs;
    this.DepositedChqs = row.DepositedChqs;
    this.DiscardedChqs = row.DiscardedChqs;
    this.SettledChqs = row.SettledChqs;
    this.ReturnedChqs = row.ReturnedChqs;
    this.IFSCCode = row.IFSCCode;
    this.SummaryReportCountFilterModel = this.modalService.open(content, {
      centered: true,
      size: 'xl',
      scrollable: true,
      backdrop: 'static'
    });
    this.GetChequeList(this.StockistId, flag, this.IFSCCode);
  }

  //Get Cheques List
  GetChequeList(StockistId: any, flag: string, IFSCCode: string) {
    this.chequeAccountingService.getChequeList_Service(this.BranchId, this.CompanyId, StockistId).subscribe((data: any) => {
      if (data.length > 0) {
        this.SummaryReportFilterDataList = [];
        this.SummaryReportFilterDataList = data;
        this.FilterChqRgstSmryData(flag, IFSCCode);
      } else {
        this.DataSourceFilter.data = [];
        this.SummaryReportFilterDataList = [];
      }
      this.chRef.detectChanges();
    }, (error: any) => {
      console.log(error);
      this.isLoadingFilter = false;
      this.chRef.detectChanges();
    });
  }

  FilterChqRgstSmryData(flag: string, IFSCCode: string) {
    this.isLoadingFilter = true;
    this.CommonDataListforTable = [];
    switch (flag) {
      case 'BlankChqs':
        this.ModalTitle = `Blank cheque summary report (${this.BlankChqs})`;
        if ((IFSCCode !== "" && IFSCCode !== null && IFSCCode !== undefined)) {
          this.CommonDataListforTable = this.SummaryReportFilterDataList.filter((x: any) => x.ChqStatusText === 'Blank' && x.ChqStatus === 0 && x.IFSCCode === IFSCCode);
        } else {
          this.CommonDataListforTable = this.SummaryReportFilterDataList.filter((x: any) => x.ChqStatusText === 'Blank' && x.ChqStatus === 0 && x.IFSCCode === IFSCCode);
        }
        break;
      case 'UtilisedChqs':
        this.ModalTitle = `Utilised cheque summary report (${this.UtilisedChqs})`;
        if ((IFSCCode !== "" && IFSCCode !== null && IFSCCode !== undefined)) {
          this.CommonDataListforTable = this.SummaryReportFilterDataList.filter((x: any) => x.ChqStatusText === 'Utilised' && x.ChqStatus === 1 && x.IFSCCode === IFSCCode);
        } else {
          this.CommonDataListforTable = this.SummaryReportFilterDataList.filter((x: any) => x.ChqStatusText === 'Utilised' && x.ChqStatus === 1 && x.IFSCCode === IFSCCode);
        }
        break;
      case 'PrepareChqs':
        this.ModalTitle = `Prepare cheque summary report (${this.PrepareChqs})`;
        if ((IFSCCode !== "" && IFSCCode !== null && IFSCCode !== undefined)) { 
          this.CommonDataListforTable = this.SummaryReportFilterDataList.filter((x: any) => x.ChqStatusText === 'Prepare' && x.ChqStatus === 2 && x.IFSCCode === IFSCCode); 
        } else {
          this.CommonDataListforTable = this.SummaryReportFilterDataList.filter((x: any) => x.ChqStatusText === 'Prepare' && x.ChqStatus === 2 && x.IFSCCode === IFSCCode);
        }
        break;
      case 'DiscardedChqs':
        this.ModalTitle = `Discarded cheque summary report (${this.DiscardedChqs})`;
        if ((IFSCCode !== "" && IFSCCode !== null && IFSCCode !== undefined)) {
          this.CommonDataListforTable = this.SummaryReportFilterDataList.filter((x: any) => x.ChqStatusText === 'Discarded' && x.ChqStatus === 3 && x.IFSCCode === IFSCCode);
        } else {
          this.CommonDataListforTable = this.SummaryReportFilterDataList.filter((x: any) => x.ChqStatusText === 'Discarded' && x.ChqStatus === 3 && x.IFSCCode === IFSCCode);
        }
        break;
      case 'DepositedChqs':
        this.ModalTitle = `Deposited cheque summary report (${this.DepositedChqs})`;
        if ((IFSCCode !== "" && IFSCCode !== null && IFSCCode !== undefined)) { 
          this.CommonDataListforTable = this.SummaryReportFilterDataList.filter((x: any) => x.ChqStatusText === 'Deposited' && x.ChqStatus === 4 && x.IFSCCode === IFSCCode); 
        } else {
          this.CommonDataListforTable = this.SummaryReportFilterDataList.filter((x: any) => x.ChqStatusText === 'Deposited' && x.ChqStatus === 4 && x.IFSCCode === IFSCCode);
        }
        break;
      case 'ReturnedChqs':
        this.ModalTitle = `Returned cheque summary report (${this.ReturnedChqs})`;
        if ((IFSCCode !== "" && IFSCCode !== null && IFSCCode !== undefined)) { 
          this.CommonDataListforTable = this.SummaryReportFilterDataList.filter((x: any) => x.ChqStatusText === 'Returned' && x.ChqStatus === 5 && x.IFSCCode === IFSCCode);
        } else {
          this.CommonDataListforTable = this.SummaryReportFilterDataList.filter((x: any) => x.ChqStatusText === 'Returned' && x.ChqStatus === 5 && x.IFSCCode === IFSCCode);
        }
        break;
      case 'SettledChqs':
        this.ModalTitle = `Settled cheque summary report (${this.SettledChqs})`;
        if ((IFSCCode !== "" && IFSCCode !== null && IFSCCode !== undefined)) { 
          this.CommonDataListforTable = this.SummaryReportFilterDataList.filter((x: any) => x.ChqStatusText === 'SettledChqs' && x.ChqStatus === 8 && x.IFSCCode === IFSCCode);
        } else {
          this.CommonDataListforTable = this.SummaryReportFilterDataList.filter((x: any) => x.ChqStatusText === 'SettledChqs' && x.ChqStatus === 8 && x.IFSCCode === IFSCCode);
        }
        break;
      default:
        break;
    }
    this.DataSourceFilter.data = [];
    this.DataSourceFilter = new MatTableDataSource(this.CommonDataListforTable);
    this.isLoadingFilter = false;
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
