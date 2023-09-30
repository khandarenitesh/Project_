import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { InventoryInwardService } from '../../inventory-inward/Services/inventory-inward.service';
import { ApproveVehicleModel } from '../../inventory-inward/models/ApproveVehicleModel';

@Component({
  selector: 'app-missing-claim-form-list',
  templateUrl: './missing-claim-form-list.component.html',
  styleUrls: ['./missing-claim-form-list.component.scss']
})
export class MissingClaimFormListComponent implements OnInit {


  isLoading: boolean = false;

  ApproveVehicleforApi = ['SrNo', 'InvNo', 'TransporterNo', 'TransporterName', 'InvoiceDate', 'VehicleNo', 'IsColdStorage', 'Actions']

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();

  searchModel: string = "";
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  approvevehiclemodel: ApproveVehicleModel;

  constructor(private chref: ChangeDetectorRef, private _service: InventoryInwardService,
    private router: Router, private toaster: ToastrService) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;

    //Get Vehicle CheckList call
    this.GetVehiclecheckList();

  }

  //Get Vehicle CheckList
  GetVehiclecheckList() {
    this.isLoading = true;
    this._service.getVehiclecheckList_Service(this.BranchId, this.CompanyId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
      } else {
        this.DataSource.data = [];
      }
      this.isLoading = false;
      this.chref.detectChanges();
      (error: any) => {
        console.log(error);
        this.isLoading = false;
        this.chref.detectChanges();
      }
    })
  }

  //Approve Function
  ApproveVehicle(row: ApproveVehicleModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to approve?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.approvevehiclemodel = new ApproveVehicleModel();
        this.approvevehiclemodel.pkId = row.pkId;
        this.approvevehiclemodel.BranchId = this.BranchId;
        this.approvevehiclemodel.CompId = this.CompanyId;
        this.approvevehiclemodel.IsApproveBy = String(this.UserId);
        this.approvevehiclemodel.IsApprove = "Y";
        this._service.SaveUpdateVehicleIssue_Service(this.approvevehiclemodel)
          .subscribe((data: any) => {
            if (data > 0) {
              this.toaster.success(AppCode.msg_ApproveSuccess);
              this.GetVehiclecheckList();
              this.chref.detectChanges();
            }
          }, (error: any) => {
            console.error(error);
            this.chref.detectChanges();
          });
      }
    });
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.trim(); // Remove whitespace
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chref.detectChanges(); // IMMEDIATE ACTION FIRED
  }


}
