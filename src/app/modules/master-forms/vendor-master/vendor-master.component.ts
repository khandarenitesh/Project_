import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MastersServiceService } from '../Services/masters-service.service';
import { AppCode } from 'src/app/app.code';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from 'src/app/SharedServices/shared.service';
import Swal from 'sweetalert2';
import { VendorModel } from '../Models/VendorModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vendor-master',
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.scss']
})
export class VendorMasterComponent implements OnInit {

  searchModel: string = '';
  isLoading: boolean = false;
  displayedColumnsForApi = ['SrNo', 'VendorName', 'Email', 'ContactNumber', 'GSTNumber', 'CityName', 'IsActive', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  VendorModel: VendorModel;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  constructor(
    private router: Router,
    private _MastersServiceService: MastersServiceService,
    private chRef: ChangeDetectorRef,
    private _SharedService: SharedService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.GetVendorList();
  }

  // redirect on click cancel button
  redirect() {
    this.router.navigate(['/modules/masters/add-vendor']);
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase();
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // Get Vendor List
  GetVendorList() {
    this.isLoading = true;
    this._MastersServiceService.getVendorList_Service(this.BranchId,this.CompanyId,AppCode.allString).subscribe((data: any) => {
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

  SetData(Row: any) {
    this._SharedService.setData(Row);
    this.router.navigate(['/modules/masters/add-vendor'], { queryParams: { state: AppCode.updateString } });
  }

  ChangeStatus(row: any) {
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
        this.VendorModel = new VendorModel();
        this.VendorModel.Addedby = this.UserId;
        this.VendorModel.BranchId = row.BranchId;
        this.VendorModel.VendorId = row.VendorId;
        this.VendorModel.IsActive = (row.IsActive === AppCode.IsActiveString ? AppCode.IsInActiveString : AppCode.IsActiveString);
        this.VendorModel.Action = AppCode.statusString;
        this._MastersServiceService.VendorDeleteDeactivate_Service(this.VendorModel)
          .subscribe((data: any) => {
            if (data > 0) {
              this.toaster.success(AppCode.msg_stsChange);
              this.GetVendorList();
            }
          }, (error) => {
            console.error(error);
          });
      }
    });
  }

}
