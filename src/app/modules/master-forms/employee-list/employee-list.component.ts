import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SharedService } from '../../../SharedServices/shared.service';
import { EmployeeMasterModel, EmployeeActiveModel } from '../Models/EmployeeModel';

// Services
import { MastersServiceService } from '../Services/masters-service.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  isLoading: boolean = false;
  displayedColumnsForApi = ['SrNo', 'EmpNo', 'EmpName', 'EmpMobNo', 'BranchName', 'BloodGroupName',
  'AadharNo','IsActive','IsUser','Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  EmployeeMasterModel: EmployeeMasterModel;
  EmployeeActiveModel: EmployeeActiveModel;
  UserId: number = 0;
  BranchId: number = 0;
  RoleId: number = 0;
  searchModel: string = '';

  constructor(
    private _MastersServiceService: MastersServiceService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private _SharedService: SharedService,
    private _ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.RoleId = obj.RoleId;
    if (this.BranchId > 0) { // Other Login
      this.GetEmployeeList(this.BranchId);
    } else {  // Super Admin
      this.GetEmployeeList(this.BranchId);
    }
  }

  // Get Employee List
  GetEmployeeList(BranchId: number) {
    this.isLoading = true;
    this._MastersServiceService.getEmployeeMasterList_Service(BranchId, AppCode.allString).subscribe((data: any) => {
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
    this.router.navigate(['/modules/masters/employee-add']);
  }

  GetData(row: EmployeeMasterModel) {
    this._SharedService.setData(row);
    this.router.navigate(['/modules/masters/employee-add'], { queryParams: { state: AppCode.updateString } });
  }

  // Change Status - Employee Active and Deactive
  ChangeStatus(row: EmployeeActiveModel) {
    this.isLoading = true;
    this.EmployeeActiveModel = new EmployeeActiveModel();
    this.EmployeeActiveModel.EmpId = row.EmpId;
    if (row.IsActive == AppCode.IsActiveString) {
      this.EmployeeActiveModel.IsActive = AppCode.IsInActiveString;
    }
    else {
      this.EmployeeActiveModel.IsActive = AppCode.IsActiveString;
    }
    this.EmployeeActiveModel.Addedby = String(this.UserId);
    this._MastersServiceService.EmployeeMasterActivate_Service(this.EmployeeActiveModel)
      .subscribe((data: any) => {
        if (data === AppCode.SuccessStatus) {
          this._ToastrService.success(AppCode.msg_stsChange);
          if (this.BranchId > 0) { // Other Login
            this.GetEmployeeList(this.BranchId);
          } else {  // Super Admin
            this.GetEmployeeList(this.BranchId);
          }
        }
      }, (error) => {
        console.error(error);
      });
  }

  // Change User - Employee Active and Deactive
  ChangeUser(row: EmployeeActiveModel, Status: string) {
    this.isLoading = true;
    this.EmployeeActiveModel = new EmployeeActiveModel();
    this.EmployeeActiveModel.EmpId = row.EmpId;
    this.EmployeeActiveModel.IsActive = (Status === AppCode.IsActiveString ? AppCode.IsInActiveString : AppCode.IsActiveString);
    this.EmployeeActiveModel.Addedby = String(this.UserId);
    this._MastersServiceService.UserActiveDeactive_Service(this.EmployeeActiveModel)
        .subscribe((data: any) => {
          if (data === AppCode.SuccessStatus) {
            this._ToastrService.success(AppCode.msg_stsChange);
            if (this.BranchId > 0) { // Other Login
              this.GetEmployeeList(this.BranchId);
            } else {  // Super Admin
              this.GetEmployeeList(this.BranchId);
            }
          }
        }, (error) => {
          console.error(error);
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
