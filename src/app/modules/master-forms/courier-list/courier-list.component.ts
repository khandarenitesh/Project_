import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MastersServiceService } from '../Services/masters-service.service';

import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';

import { courierList } from '../Models/courierList';
import { SharedService } from 'src/app/SharedServices/shared.service';
import { AppCode } from 'src/app/app.code';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-courier-list',
  templateUrl: './courier-list.component.html',
  styleUrls: ['./courier-list.component.scss']
})
export class CourierListComponent implements OnInit {
  displayedColumnsForApi = ['SrNo', 'CourierName', 'CourierMobNo', 'CourierEmail', 'StateName', 'DistrictName', 'CityName', 'RatePerBoxes','Addedby','LastUpdatedOn',
   'IsActive', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  isLoading: boolean = false;
  CourierModel: courierList;
  UserId: Number = 0;
  BranchId: number = 0;
  searchModel: string = '';

  constructor(private _MastersServiceService: MastersServiceService, private chRef: ChangeDetectorRef, private router: Router,
    private _SharedService: SharedService, private toaster: ToastrService) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.GetCourierList(this.BranchId);
  }

  // Get Courier List
  GetCourierList(BranchId: number) {
    this.isLoading = true;
    this._MastersServiceService.getGetCourierList_Service(BranchId, AppCode.allString, AppCode.allString).subscribe((data: any) => {
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

  redirect() {
    this.router.navigate(['/modules/masters/courier-add']);
  }

  GetData(row: courierList) {
    this._SharedService.setData(row);
    this.router.navigate(['/modules/masters/courier-add'], { queryParams: { state: AppCode.updateString } });
  }

  ChangeStatus(row: courierList) {
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
        this.isLoading = true;
        this.CourierModel = new courierList();
        this.CourierModel.Action = AppCode.statusString;
        this.CourierModel.Addedby = String(this.UserId);
        this.CourierModel.CourierId = row.CourierId;
        this.CourierModel.BranchId = row.BranchId;
        if (row.IsActive == AppCode.IsActiveString) {
          this.CourierModel.IsActive = AppCode.IsInActiveString;
        }
        else {
          this.CourierModel.IsActive = AppCode.IsActiveString;
        }
        this._MastersServiceService.SaveCurier_Service(this.CourierModel)
          .subscribe((data: any) => {
            if (data === AppCode.StatusChangedStatus) {
              this.toaster.success(AppCode.msg_stsChange);
              this.GetCourierList(this.BranchId);
            }
          }, (error) => {
            console.error(error);
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
