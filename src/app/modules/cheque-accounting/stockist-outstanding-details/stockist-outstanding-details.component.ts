import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChequeAccountingService } from '../Services/cheque-accounting.service';
import { AppCode } from '../../../app.code';
// import * as XLSX from 'xlsx';


@Component({
  selector: 'app-stockist-outstanding-details',
  templateUrl: './stockist-outstanding-details.component.html',
  styleUrls: ['./stockist-outstanding-details.component.scss']
})
export class StockistOutstandingDetailsComponent implements OnInit {

  Title: string = '';
  SODetails = ['SrNo', 'OpenAmt', 'RV', 'AB', 'CD', 'CC', 'DG', 'DR', 'DZ', 'Other']; //,'DistrChannel', 'StockistCode', 'StockistName', 'DocName', 'DueDate',
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  @ViewChild('TABLE') table: ElementRef;
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  searchModel: any;
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
  fileName: string = "OsDocTypesReport";

  constructor(private chRef: ChangeDetectorRef, private chequeAccountingService: ChequeAccountingService) { }

  ngOnInit(): void {
    this.Title = 'List View';
    let result = AppCode.getUser();
    this.BranchId = result.BranchId;
    this.CompanyId = result.CompanyId;
    this.GetStockistOutstandingDtls();
  }

  GetStockistOutstandingDtls() {
    this.isLoading = true;
    this.chequeAccountingService.GetOsReportLst(this.BranchId, this.CompanyId).subscribe((data: any) => {
      if (data.length > 0) {
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
        this.DataSource.data = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
        this.isLoading = false;
        this.chRef.detectChanges();
      } else {
        this.DataSource.data = [];
        this.isLoading = false;
        this.chRef.detectChanges();
      }
      (error: any) => {
        console.log(error);
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

  //export excel
  exportAsExcel() {
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'All Data Export');
    // XLSX.writeFile(wb, 'OsDocTypesReport.xlsx');

    AppCode.exportToExcelFile(this.fileName, this.table);
  }
}
