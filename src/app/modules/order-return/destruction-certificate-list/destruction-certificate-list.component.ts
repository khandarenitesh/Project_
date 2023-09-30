import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

// Angular Mat Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

//Service
import { AppCode } from '../../../app.code';
import { OrderReturnService } from '../Services/order-return.service';
import { SRSCNMappingCountsmodel } from '../models/SRSCNMappingCountsmodel';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-destruction-certificate-list',
  templateUrl: './destruction-certificate-list.component.html',
  styleUrls: ['./destruction-certificate-list.component.scss']
})
export class DestructionCertificateListComponent implements OnInit {

  importCreditNote = ['SrNo', 'CrDrNoteNo', 'CRDRCreationDate', 'CrDrAmt', 'StockistNo', 'StockistName', 'CityName', 'SalesOrderNo', 'SalesOrderDate', 'Actions'];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  @ViewChild('fileInput') fileInput: ElementRef;
  public DataSource = new MatTableDataSource<any>();

  ListTitle: string = "";
  isLoading: boolean = false;
  searchModel: string = "";
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  name: string = "";
  fileName: string = "UploadCertificate";
  res: any;
  SRSCNMappingCounts: SRSCNMappingCountsmodel;
  LREntryId: number = 0;
  SRSCnt: number = 0;
  CNCnt: number = 0;
  PendingForCNCnt: number = 0;
  PendingAtExpSCnt: number = 0;
  PendingDestrCertCnt:number=0;
  DataModel:any;

  constructor(private _OrderReturnService: OrderReturnService, private chRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.ListTitle = "Destruction Certificate List"
    var result = AppCode.getUser();
    this.UserId = result.UserId;
    this.BranchId = result.BranchId;
    this.CompanyId = result.CompanyId;
    this.GetcnUploadDestructionCertiList(this.BranchId, this.CompanyId); //call for Transit List
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompanyId,
    };
    this.GetSRSCNMappingCounts(this.DataModel);
  }
  exportAsExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    delete (ws['J1']);
    // J1 is your Column in Excel
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Servers');
    XLSX.writeFile(wb, this.fileName + '.xlsx');
  }
   //Get SRS CN Mapping Counts
   GetSRSCNMappingCounts(DataModel: any) {
    this.isLoading = true;
    this._OrderReturnService.GetSRSCNMappingCounts(DataModel)
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

  afterCount(data: SRSCNMappingCountsmodel) {
    this.SRSCNMappingCounts = new SRSCNMappingCountsmodel();
    this.SRSCNMappingCounts = data;
    this.SRSCnt = this.SRSCNMappingCounts.TodaysSRSCnt
    this.CNCnt = this.SRSCNMappingCounts.TodayCNCnt;
    this.PendingForCNCnt = this.SRSCNMappingCounts.PendingForCNCnt;
    this.PendingDestrCertCnt = this.SRSCNMappingCounts.PendingDestrCertCnt;
    this.chRef.detectChanges();
  }

  //Get Destruction Certificate List
  GetcnUploadDestructionCertiList(BranchId: number, CompId: number) {
    this.isLoading = true;
    this._OrderReturnService.GetCNDestructionCerList(BranchId, CompId).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != [] && data != "" && data != undefined) {
        this.res = data;
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
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }
}
