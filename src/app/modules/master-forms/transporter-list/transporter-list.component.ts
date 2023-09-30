import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';

import { SharedService } from '../../../SharedServices/shared.service';
import { MastersServiceService } from '../Services/masters-service.service';
import { TransporterModel } from '../Models/TransporterModel';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transporter-list',
  templateUrl: './transporter-list.component.html',
  styleUrls: ['./transporter-list.component.scss']
})
export class TransporterListComponent implements OnInit {
  isLoading: boolean = false;
  displayedColumnsForApi = ['SrNo', 'TransporterNo', 'TransporterName', 'TransporterMobNo', 'TransporterEmail', 'StateName', 'CityName',
    'RatePerBox', 'Addedby', 'LastUpdatedOn', 'IsActive', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  Transportermodel: TransporterModel;
  UserId: number = 0;
  searchModel: string = '';
  DistrictCode:string='';
  Status:string='';
  BranchId:number=0;

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
    if(obj.BranchId > 0){
      this.BranchId = obj.BranchId;
      this.GetTransporterList(this.BranchId);
    }
    else{
      this.GetTransporterList(this.BranchId);
    }
  }

  GetTransporterList(BranchId:number) {
    this.isLoading = true;
    this._MastersServiceService.GetTransporterListForBranch_Service(AppCode.allString, AppCode.allString,BranchId).subscribe((data: any) => {
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
    this.router.navigate(['/modules/masters/transporter-add']);
  }

  GetData(row: TransporterModel) {
    this._SharedService.setData(row);
    this.router.navigate(['/modules/masters/transporter-add'], { queryParams: { state: AppCode.updateString } });
  }

  ChangeStatus(row: TransporterModel) {
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
        this.Transportermodel = new TransporterModel();
        this.Transportermodel.Addedby = String(this.UserId);
        this.Transportermodel.BranchId = row.BranchId;
        this.Transportermodel.TransporterId = row.TransporterId;
        if (row.IsActive == AppCode.IsActiveString) {
          this.Transportermodel.IsActive = AppCode.IsInActiveString;
        }
        else {
          this.Transportermodel.IsActive = AppCode.IsActiveString;
        }
        this.Transportermodel.Action = AppCode.statusString;
        this._MastersServiceService.SaveTransporter_Service(this.Transportermodel)
          .subscribe((data: any) => {
            if (data === AppCode.StatusChangedStatus) {
              this.toaster.success(AppCode.msg_stsChange);
              this.GetTransporterList(this.BranchId);
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
