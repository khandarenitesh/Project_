import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AppCode } from 'src/app/app.code';
import { AccountModuleService } from '../Services/account-module.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/SharedServices/shared.service';
import { CheckInvModel } from '../models/gatepas-bill-list';


@Component({
  selector: 'app-check-invoice-list',
  templateUrl: './check-invoice-list.component.html',
  styleUrls: ['./check-invoice-list.component.scss']
})
export class CheckInvoiceListComponent implements OnInit {

  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  ExpenseRegisterList: any[] = [];

  displayedColumnsForApi = ['SrNo', 'BillFromName', 'ExpInvNo', 'InvDate', 'CompanyName', 'NoOfBox', 'TaxableAmt', 'TotalAmt', 'ExpInvStatusText', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  searchModel: string = '';

  constructor(
    private _AccountService: AccountModuleService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private _SharedService: SharedService
  ) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.GetExpenseRegisterList();

  }

  GetExpenseRegisterList() {
    this.isLoading = true;
    this._AccountService.GetExpenseRegisterList_Service(this.BranchId).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
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
    });
  }

  // set data on click edit button
  GetData(row: CheckInvModel) {
    this._SharedService.setData(row);
    this.router.navigate(['/modules/account-module/gatepass-bill-list'], { queryParams: { state: 'Verify' } });
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase();
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges();
  }

}
