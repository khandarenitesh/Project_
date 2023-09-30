import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';

import { AppCode } from '../../../app.code';
import { SharedService } from '../../../SharedServices/shared.service';
import { StockistModel } from '../Models/stockist-master';
import { MastersServiceService } from '../Services/masters-service.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stockist-master',
  templateUrl: './stockist-master.component.html',
  styleUrls: ['./stockist-master.component.scss']
})
export class StockistMasterComponent implements OnInit {
  isLoading: boolean = false;
  displayedColumns = ['SrNo', 'StockistNo', 'StockistName', 'Emailid', 'MobNo', 'CityName', 'FoodLicExpDate', 'DLExpDate', 'IsActive', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  Stockistmodel: StockistModel;
  UserId: number = 0;
  CompanyId: number = 0;
  RoleId: number = 0;
  searchModel: string = '';
  BranchId: number = 0;
  NotificationDataList:any;

  constructor(
    private _MastersServiceService: MastersServiceService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private _SharedService: SharedService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.CompanyId = obj.CompanyId;
    this.RoleId = obj.RoleId;
    this.BranchId = obj.BranchId;
    this.GetStockistList(this.BranchId, this.CompanyId);
  }

  // Get Branch List
  GetStockistList(BranchId: number, CompanyId: number) {
    this.isLoading = true;
    this._MastersServiceService.getStockistList_Service(BranchId, CompanyId, AppCode.allString).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.DataSource.data = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
      } else {
        this.DataSource.data = [];
      }
      this.isLoading = false;
      this.chRef.detectChanges();
    });
  }

  redirect() {
    this.router.navigate(['/modules/masters/add-stockist']);
  }

  GetData(row: StockistModel) {
    this._SharedService.setData(row);
    this.router.navigate(['/modules/masters/add-stockist'], { queryParams: { state: AppCode.updateString } });
  }

  ChangeStatus(row: StockistModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to change status?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.Stockistmodel = new StockistModel();
        this.Stockistmodel.Action = AppCode.statusString;
        this.Stockistmodel.Addedby = String(this.UserId);
        this.Stockistmodel.StockistId = row.StockistId;
        this.Stockistmodel.DLExpDate = row.DLExpDate;
        this.Stockistmodel.FoodLicExpDate = row.FoodLicExpDate;
        if (row.IsActive == AppCode.IsActiveString) {
          this.Stockistmodel.IsActive = AppCode.IsInActiveString;
        } else {
          this.Stockistmodel.IsActive = AppCode.IsActiveString;
        }
        this._MastersServiceService.SaveStockist_Service(this.Stockistmodel)
          .subscribe((data: any) => {
            if (data === AppCode.StatusChangedStatus) {
              this.toaster.success(AppCode.msg_stsChange);
            }
            this.GetStockistList(this.BranchId, this.CompanyId);
          }, (error) => {
            console.error(error);
            this.chRef.detectChanges();
          });
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
