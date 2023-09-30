import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';

// Models
import { StokistTransportModel } from '../Models/StokistTransportModel';

// Services
import { MastersServiceService } from '../Services/masters-service.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-stockist-transporter-mapping-list',
  templateUrl: './stockist-transporter-mapping-list.component.html',
  styleUrls: ['./stockist-transporter-mapping-list.component.scss']
})
export class StockistTransporterMappingListComponent implements OnInit {
  isLoading: boolean = false;
  displayedColumnsForApi = ['SrNo', 'StockistNo', 'StockistName', 'Emailid', 'MobNo', 'TransporterName', 'TransporterNo', 'TransitDays', 'MasterName', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  UserId: number = 0;
  CompanyId: number = 0;
  StokistTransportModel: StokistTransportModel;
  RoleId: number = 0;
  searchModel: string = '';
  BranchId:number=0;

  constructor(
    private _MastersServiceService: MastersServiceService,
    private chRef: ChangeDetectorRef,
    private _ToastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.CompanyId = obj.CompanyId;
    this.RoleId = obj.RoleId;
    this.BranchId=obj.BranchId
    if (this.RoleId === 1) { // Super Admin
      this.GetStokistTransportMappingList(0, 0);
    } else {  // Other Login
      this.GetStokistTransportMappingList(this.BranchId,this.CompanyId);
    }
  }

  // Get Stockist Transporter Mapping List
  GetStokistTransportMappingList(BranchId:number,CompanyId: number) {
    this.isLoading = true;
    this._MastersServiceService.getStokistTransportMappingList_Service(BranchId,CompanyId).subscribe((data: any) => {
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

  // Navigate to Stockist Transporter Mapping Add
  redirect() {
    this.router.navigate(['/modules/masters/stockist-transporter-mapping-add']);
  }

  // Change Status - Stokist Transport Mapping Delete
  ChangeStatus(row: StokistTransportModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Sure!'
    }).then((result) =>{
      if (result.isConfirmed) {
    this.isLoading = true;
    this.StokistTransportModel = new StokistTransportModel();
    this.StokistTransportModel.BranchId = row.BranchId;
    this.StokistTransportModel.CompanyId = row.CompanyId;
    this.StokistTransportModel.StockistId = row.StockistId;
    this.StokistTransportModel.TransporterId = row.TransporterId;
    this.StokistTransportModel.TransitDays = row.TransitDays;
    this.StokistTransportModel.SupplyTypeId	 = row.SupplyTypeId;
    this.StokistTransportModel.Addedby = String(this.UserId);
    this.StokistTransportModel.AddedOn = row.AddedOn;
    this.StokistTransportModel.Action = AppCode.deleteString;
    this._MastersServiceService.StokistTransportMappingAddEdit_Service(this.StokistTransportModel)
      .subscribe((data: any) => {
        if (data === AppCode.SuccessStatus) {
          this._ToastrService.success(AppCode.msg_deleteSuccess);
          if (this.RoleId === 1) { // Super Admin
            this.GetStokistTransportMappingList(0,0);
          } else {  // Other Login
            this.GetStokistTransportMappingList(this.BranchId,this.CompanyId);
          }
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
