import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';

import { MastersServiceService } from '../Services/masters-service.service';
import { CompanyList } from '../Models/CompanyList';
import { SharedService } from '../../../SharedServices/shared.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  isLoading: boolean = false;
  displayedColumnsForApi = ['SrNo', 'CompanyCode', 'CompanyName', 'CompanyEmail', 'ContactNo', 'CompanyPAN', 'GSTNo', 'CityName', 'Pin', 'IsActive', 'IsPicklistAvailable', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  companyModel: CompanyList;
  UserId: number = 0;
  searchModel: string = '';

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
    this.GetCompanyList();
  }

  // Get Company list
  GetCompanyList() {
    this.isLoading = true;
    this._MastersServiceService.getCompanyList_Service(AppCode.allString).subscribe((data: any) => {
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

// Redirect to list page
  redirect() {
    this.router.navigate(['/modules/masters/company-add']);
  }

  GetData(row: CompanyList) {
    this._SharedService.setData(row);
    this.router.navigate(['/modules/masters/company-add'], { queryParams: { state: AppCode.updateString } });
  }
// active and deactive
  ChangeStatus(row: CompanyList) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to change status?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!'
    }).then((result) =>{
      if (result.isConfirmed) {
    this.companyModel = new CompanyList();
    this.companyModel.Action = AppCode.statusString;
    this.companyModel.Addedby = String(this.UserId);
    this.companyModel.CompanyId = row.CompanyId;
    if (row.IsActive == AppCode.IsActiveString) {
      this.companyModel.IsActive = AppCode.IsInActiveString;
    }
    else {
      this.companyModel.IsActive = AppCode.IsActiveString;
    }
    this._MastersServiceService.SaveCompany_Service(this.companyModel)
      .subscribe((data: any) => {
        if (data === AppCode.StatusChangedStatus) {
          this.toaster.success(AppCode.msg_stsChange);
          this.GetCompanyList();
        }
      },
        (error) => {
          console.error(error);
        })
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
