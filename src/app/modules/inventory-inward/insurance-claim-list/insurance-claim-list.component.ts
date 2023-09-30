import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { InsuranceModel } from '../models/InsuranceModel';
import { InvInwardAllCountModel } from '../models/ApproveVehicleModel';

import { SharedService } from '../../../SharedServices/shared.service';
import { InventoryInwardService } from '../Services/inventory-inward.service';
import { ToastrService } from 'ngx-toastr';
import { AppCode } from '../../../app.code';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insurance-claim-list',
  templateUrl: './insurance-claim-list.component.html',
  styleUrls: ['./insurance-claim-list.component.scss']
})
export class InsuranceClaimListComponent implements OnInit {
  isLoading: boolean = false;
  InsuranceClaim = ['SrNo', 'LRNo', 'ClaimSANNo', 'ClaimSANDate', 'ClaimSANAmount', 'ClaimType', 'EmailSendDate', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  insuranceModel: InsuranceModel;
  UserId: number = 0;
  searchModel: string = '';
  BranchId: number = 0;
  CompanyId: number = 0;
  insurancemodel: InsuranceModel;
  TotalClaimSANCnt: number = 0;
  TotalClaimRaisedCnt: number = 0;
  TotalSANRaisedCnt: number = 0;
  PendingClaim: number = 0;
  PendingSAN: number = 0;
  InsuranceClaimList: any;
  LRCountList: any;
  DataModel: any;
  invInwardAllCount: InvInwardAllCountModel;

  constructor(private chRef: ChangeDetectorRef, private _SharedService: SharedService,
              private router: Router, private _service: InventoryInwardService, private toaster: ToastrService) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.GetInsuranceClaimList();
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompanyId
    }
    this.GetInsuranceCounts(this.DataModel);
  }

  GetInsuranceClaimList() {
    this.isLoading = true;
    this._service.getInsuranceClaimList_Service(this.BranchId, this.CompanyId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
        this.InsuranceClaimList = data;
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

  // Get Data
  GetData(row: InsuranceModel) {
    this._SharedService.setData(row);
    if (row.ClaimType !== '' && row.ClaimType !== null) {
      this.router.navigate(['/modules/inventory-inward/add-insurance-claim'], { queryParams: { state: AppCode.updateClaimstring } });
    } else {
      this.router.navigate(['/modules/inventory-inward/add-insurance-claim'], { queryParams: { state: AppCode.updateSANstring } });
    }
  }

  // Delete
  DeleteData(row: InsuranceModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.insurancemodel = new InsuranceModel();
        this.insurancemodel.BranchId = this.BranchId;
        this.insurancemodel.CompId = this.CompanyId;
        this.insurancemodel.LRNo = row.LRNo;
        this.insurancemodel.ClaimNo = row.ClaimNo;
        this.insurancemodel.ClaimDate = AppCode.createDateAsUTC(new Date(row.ClaimDate));
        this.insurancemodel.ClaimAmount = row.ClaimAmount;
        this.insurancemodel.ClaimType = row.ClaimType;
        this.insurancemodel.ClaimId = row.ClaimId;
        this.insurancemodel.EmailSendDate = AppCode.createDateAsUTC(new Date(row.EmailSendDate));
        this.insurancemodel.Remark = row.Remark;
        this.insurancemodel.Action = AppCode.deleteString;
        this.insurancemodel.Addedby = String(this.UserId);
        this._service.SaveInsuranceData_Service(this.insurancemodel)
          .subscribe((data: any) => {
            if (data > 0) {
              this.GetInsuranceClaimList();
              this.GetInsuranceCounts(this.DataModel);
              this.toaster.success(AppCode.msg_deleteSuccess);
              this.chRef.detectChanges();
            }
          }, (error: any) => {
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
  //Get Approve Vehicle Issue Counts Counts
  GetInsuranceCounts(DataModel: any) {
    this.isLoading = true;
    this._service.GetInvInwardAllCounts(DataModel)
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

  afterCount(data: InvInwardAllCountModel) {
    this.invInwardAllCount = new InvInwardAllCountModel();
    this.invInwardAllCount = data;
    this.TotalClaimSANCnt = this.invInwardAllCount.TotalClaimSAN;
    this.TotalClaimRaisedCnt = this.invInwardAllCount.TotalClaimRaised;
    this.TotalSANRaisedCnt = this.invInwardAllCount.TotalSANRaised;
    this.PendingClaim = this.invInwardAllCount.PendingClaim;
    this.PendingSAN = this.invInwardAllCount.PendingSAN;
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // LR Recived List after filtering count wise
  ShowLRList(Flag: string) {
    this.isLoading = true;
    if (this.InsuranceClaimList != null && this.InsuranceClaimList !== undefined) {
      if (Flag === 'TotalClaimSAN') {
        this.LRCountList = this.InsuranceClaimList;
      } else if (Flag === 'ClaimRaised') {
        this.LRCountList = this.InsuranceClaimList.filter((x: any) => x.IsClaim === 1);
      } else if (Flag === 'SANRaised') {
        this.LRCountList = this.InsuranceClaimList.filter((x: any) => x.IsSAN === 1);
      }
      this.DataSource = new MatTableDataSource(this.LRCountList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
    }
    this.isLoading = false;
    this.chRef.detectChanges();
  }

}
