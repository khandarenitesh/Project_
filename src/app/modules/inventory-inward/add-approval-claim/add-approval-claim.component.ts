import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { InsuranceModel } from '../models/InsuranceModel';

import { InventoryInwardService } from '../Services/inventory-inward.service';
import { ToastrService } from 'ngx-toastr';
import { AppCode } from '../../../app.code';
import { InvInwardAllCountModel } from '../models/ApproveVehicleModel';

@Component({
  selector: 'app-add-approval-claim',
  templateUrl: './add-approval-claim.component.html',
  styleUrls: ['./add-approval-claim.component.scss']
})
export class AddApprovalClaimComponent implements OnInit {
  isLoading: boolean = false;
  InsuranceClaim = ['SrNo', 'LRNo', 'ClaimSANNo', 'ClaimSANDate', 'ClaimSANAmount', 'ClaimType', 'EmailSendDate', 'ResolveRemark', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  insuranceModel: InsuranceModel;
  UserId: number = 0;
  ClaimId: number = 0;
  ClaimNo: string = '';
  searchModel: string = '';
  BranchId: number = 0;
  CompanyId: number = 0;
  isApproval: boolean = false;
  AddEditModel: any;
  submitted = false;
  submitted1 = false;
  currentDate = new Date();
  SANApproveForm: FormGroup;
  ClaimApproveForm: FormGroup;
  showremarkForm: FormGroup;
  maxDate = new Date();
  SANNo: string = '';
  defaultform: any = { SANNo: '', SANApproveBy: '', SANDate: '', SANRemark: '', ClaimNo: '', ClaimApproveBy: '', ApproveClaimDate: '', ClaimRemark: '' };
  DataModel: any;
  invInwardAllCount: InvInwardAllCountModel;
  TodayLR: number = 0;
  PendingClaimSANApprovedCnt: number = 0;
  TotalClaimApproved: number = 0;
  TotalSANApproved: number = 0;
  PendingClaim: number = 0;
  PendingSAN: number = 0;
  InsuranceClaimList: any;
  LRCountList: any;
  ResolveRemark: string = "";
  TransitId: number = 0;

  constructor(private chRef: ChangeDetectorRef, private _service: InventoryInwardService,
    private toastr: ToastrService, private fb: FormBuilder, private modalService: NgbModal,) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.GetInsuranceClaimList();
    this.initSANForm();
    this.initClaimForm();
    this.initOpenRemark();
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompanyId
    }
    this.GetaddApprovalClaimCounts(this.DataModel);
  }

  // f function for SAN
  get f(): { [key: string]: AbstractControl } {
    return this.SANApproveForm.controls;
  }

  // f1 function for Claim
  get f1(): { [key: string]: AbstractControl } {
    return this.ClaimApproveForm.controls;
  }
  get f2(): { [key: string]: AbstractControl } {
    return this.showremarkForm.controls;
  }

  // SAN Form
  initSANForm() {
    this.SANApproveForm = this.fb.group({
      SANNo: [
        this.defaultform.SANNo,
      ],
      SANApproveBy: [
        this.defaultform.SANApproveBy,
        Validators.compose([
          Validators.required
        ]),
      ],
      SANDate: [
        this.defaultform.SANDate,
        Validators.compose([
          Validators.required
        ]),
      ],
      SANRemark: [
        this.defaultform.SANRemark
      ]
    });
  }

  // Claim Form
  initClaimForm() {
    this.ClaimApproveForm = this.fb.group({
      ClaimNo: [
        this.defaultform.ClaimNo,
      ],
      ClaimApproveBy: [
        this.defaultform.ClaimApproveBy,
        Validators.compose([
          Validators.required
        ]),
      ],
      ApproveClaimDate: [
        this.defaultform.ApproveClaimDate,
        Validators.compose([
          Validators.required
        ]),
      ],
      ClaimRemark: [
        this.defaultform.ClaimRemark
      ]
    });
  }
  initOpenRemark() {
    this.showremarkForm = this.fb.group({
      ResolveRemark: [
        this.defaultform.ResolveRemark,
      ]
    })
  }

  // Get Insurance Claim List
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

  // Add/Edit SAN
  AddEditSAN(content: any, row: any) {
    this.AddEditModel = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    (<HTMLInputElement>document.getElementById('cancel')).focus();
    this.f.SANNo.disable();
    this.f.SANNo.setValue(row.SANNo);
    this.f.SANApproveBy.enable();
    this.f.SANDate.setValue(this.currentDate);
    this.f.SANRemark.enable();
    this.ClaimId = row.ClaimId;
    this.SANNo = row.SANNo;
    this.TransitId = row.TransitId;
    this.chRef.detectChanges();
  }

  // Add/Edit Claim
  AddEditClaim(content: any, row: any) {
    this.AddEditModel = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    (<HTMLInputElement>document.getElementById('cancel')).focus();
    this.f1.ClaimNo.disable();
    this.f1.ClaimNo.setValue(row.ClaimNo);
    this.f1.ClaimApproveBy.enable();
    this.f1.ApproveClaimDate.setValue(this.currentDate);
    this.f1.ClaimRemark.enable();
    this.ClaimId = row.ClaimId;
    this.ClaimNo = row.ClaimNo;
    this.TransitId = row.TransitId;
    this.chRef.detectChanges();
  }

  ViewRemark(content: any, row: any) {
    this.AddEditModel = this.modalService.open(content, {
      centered: true,
      size: 'sm',
      backdrop: 'static'
    });
    this.ResolveRemark = row.ApproveRemark;
    this.chRef.detectChanges();
  }

  // Approve SAN
  ApproveSAN() {
    this.submitted = true;
    this.isLoading = true;
    if (!this.SANApproveForm.valid) {
      this.isLoading = false;
      return;
    } else {
      this.insuranceModel = new InsuranceModel();
      this.insuranceModel.BranchId = this.BranchId;
      this.insuranceModel.CompId = this.CompanyId;
      this.insuranceModel.SANNo = this.SANNo;
      this.insuranceModel.SANApproveBy = this.f.SANApproveBy.value;
      this.insuranceModel.SANDate = AppCode.createDateAsUTC(new Date(this.f.SANDate.value));
      this.insuranceModel.SANRemark = this.f.SANRemark.value;
      this.insuranceModel.Addedby = String(this.UserId);
      this.insuranceModel.ClaimId = this.ClaimId; //insertions
      this.insuranceModel.Action = AppCode.addString;
      this.insuranceModel.TransitId = this.TransitId;
      this._service.ApproveSANAdd_Url_Service(this.insuranceModel)
        .subscribe((data: any) => {
          if (data > 0) {
            this.toastr.success(AppCode.msg_saveSuccess);
            this.GetaddApprovalClaimCounts(this.DataModel);
            this.modalService.dismissAll();
            this.SANApproveForm.reset();
            this.GetInsuranceClaimList();
          } else {
            this.toastr.warning(AppCode.FailStatus);
            this.SANApproveForm.reset();
            this.isLoading = false;
            this.chRef.detectChanges();
          }
        }, (error: any) => {
          console.error(error);
          this.isLoading = false;
          this.chRef.detectChanges();
        });
    }
  }

  // Approve Claim
  ApproveClaim() {
    this.submitted1 = true;
    this.isLoading = true;
    if (!this.ClaimApproveForm.valid) {
      this.isLoading = false;
      return;
    } else {
      this.insuranceModel = new InsuranceModel();
      this.insuranceModel.BranchId = this.BranchId;
      this.insuranceModel.CompId = this.CompanyId;
      this.insuranceModel.ClaimApproveBy = this.f1.ClaimApproveBy.value;
      this.insuranceModel.ApproveClaimDate = AppCode.createDateAsUTC(new Date(this.f1.ApproveClaimDate.value));
      this.insuranceModel.ClaimRemark = this.f1.ClaimRemark.value;
      this.insuranceModel.Addedby = String(this.UserId);
      this.insuranceModel.ClaimId = this.ClaimId; //insertions
      this.insuranceModel.ClaimNo = this.ClaimNo; //insertions
      this.insuranceModel.Action = AppCode.addString;
      this.insuranceModel.TransitId = this.TransitId;
      this._service.ApproveClaimAdd_Url_Service(this.insuranceModel)
        .subscribe((data: any) => {
          if (data > 0) {
            this.toastr.success(AppCode.msg_saveSuccess);
            this.GetaddApprovalClaimCounts(this.DataModel);
            this.modalService.dismissAll();
            this.ClaimApproveForm.reset();
            this.GetInsuranceClaimList();
          } else {
            this.toastr.warning(AppCode.FailStatus);
            this.ClaimApproveForm.reset();
            this.isLoading = false;
            this.chRef.detectChanges();
          }
        }, (error: any) => {
          console.error(error);
          this.isLoading = false;
          this.chRef.detectChanges();
        });
    }
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  // clear form on click cancel button
  ClearForm() {
    this.submitted = false;
    this.submitted1 = false;
    this.SANApproveForm.reset();
    this.ClaimApproveForm.reset();
    this.modalService.dismissAll();
    this.f.ClaimApproveBy.setValue('');
    this.f.SANApproveBy.setValue('');
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  GetaddApprovalClaimCounts(DataModel: any) {
    this.isLoading = true;
    this._service.GetInvInwardAllCounts(DataModel).subscribe((data: any) => {
      if (data != null) {
        this.afterCount(data);
      }
    }, (error: any) => {
      console.error("Error : " + JSON.stringify(error));
      this.isLoading = false;
      this.chRef.detectChanges();
    });
  }

  afterCount(data: InvInwardAllCountModel) {
    this.invInwardAllCount = new InvInwardAllCountModel();
    this.invInwardAllCount = data;
    this.TodayLR = this.invInwardAllCount.TodayLR;
    this.PendingClaimSANApprovedCnt = this.invInwardAllCount.PendingClaimSANApproved;
    this.TotalClaimApproved = this.invInwardAllCount.TotalClaimApproved;
    this.TotalSANApproved = this.invInwardAllCount.TotalSANApproved
    this.PendingClaim = this.invInwardAllCount.PendingClaim;
    this.PendingSAN = this.invInwardAllCount.PendingSAN;
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // LR Recived List after filtering count wise
  ShowLRList(Flag: string) {
    this.isLoading = true;
    if (this.InsuranceClaimList != null && this.InsuranceClaimList !== undefined) {
      if (Flag === 'PendingClaimSANApproved') {
        this.LRCountList = this.InsuranceClaimList.filter((x: any) => x.ClaimApproveBy == null || x.ClaimApproveBy !== null && x.SANApproveBy == null || x.SANApproveBy !== null);
      } else if (Flag === 'ClaimApproved') {
        this.LRCountList = this.InsuranceClaimList.filter((x: any) => x.ClaimApproveBy !== null);
      } else if (Flag === 'SANApproved') {
        this.LRCountList = this.InsuranceClaimList.filter((x: any) => x.SANApproveBy !== null);
      }
      this.DataSource = new MatTableDataSource(this.LRCountList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
    }
    this.isLoading = false;
    this.chRef.detectChanges();
  }

}

