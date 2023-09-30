import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Router } from '@angular/router';

import { AppCode } from '../../../app.code';

// Models
import { UserModel } from '../../auth';
import { PickistModel } from '../Models/picklist-model';

// Services
import { OrderDispatchService } from '../Services/order-dispatch.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-picklist-add',
  templateUrl: './picklist-add.component.html',
  styleUrls: ['./picklist-add.component.scss']
})
export class PicklistAddComponent implements OnInit {
  picklistAddForm: FormGroup;
  displayedColumnsForApi = ['SrNo', 'PicklistNo', 'Date', 'FromInvoiceNo', 'ToInvoiceNo', 'Status', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  submitted = false;
  authLocalStorageToken: any;
  UserInfo: UserModel;
  UserId: number = 0;
  pageState: string = "";
  pageStateApprove: string = "";
  BranchId: number = 0;
  CompId: number = 0;
  isLoading: boolean = false;
  defaultform: any = {
    Date: '',
    FromInvoiceNo: '',
    ToInvoiceNo: ''
  };
  pickistModel: PickistModel;
  currentDate = new Date();
  PicklistId: number = 0;
  PicklistStatus: string = "";
  PickListMsg: string = "";
  isPickListFlag: boolean = false;
  RejectReason: string = "";
  modalReference: NgbModalRef;
  DataModel: any;
  PickListGenerateNewNo: any[] = [];
  minDate = new Date();
  searchModel:any;

  constructor(
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private _orderDispatchService: OrderDispatchService,
    private toaster: ToastrService
  ) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    if (this.pageState === "") {
      this.pageState = AppCode.saveString;
      this.PickListMsg = "Add PickList";
    }
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompId,
      PicklistDate: this.currentDate
    };
    this.initForm();
    this.GetPickList(this.DataModel);
    this.GetPickListGenerateNewNo(this.DataModel)
    this.f.Date.setValue(this.currentDate);
  }

  // Get PickList Generate New No
  GetPickListGenerateNewNo(DataModel: any) {
    this._orderDispatchService.GetPickListGenerateNewNo_Service(DataModel).subscribe((data: any) => {
      this.f.PicklistNo.setValue(data);
      this.picklistAddForm.controls['PicklistNo'].disable();
      this.chRef.detectChanges();
    }, (error: any) => {
      console.error("Error:" + JSON.stringify(error));
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.picklistAddForm.controls;
  }

  initForm() {
    this.picklistAddForm = this.fb.group({
      PicklistNo: [
      ],
      Date: [
        this.defaultform.Date,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      FromInvoiceNo: [
        this.defaultform.FromInvoiceNo
      ],
      ToInvoiceNo: [
        this.defaultform.ToInvoiceNo
      ],
    });
  }

  // Get PickList
  GetPickList(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getPickList_Service(DataModel)
      .subscribe((data: any) => {
        if (data != null && data != [] && data != "" && data != undefined) {
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
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  // Edit Picklist
  EditData(row: PickistModel) {
    this.isLoading = true;
    this.pageState = "";
    this.pageState = AppCode.updateString;
    this.PickListMsg = "Update PickList";
    this.PicklistId = row.Picklistid;
    this.BranchId = row.BranchId;
    this.CompId = row.CompId;
    this.f.PicklistNo.setValue(row.PicklistNo);
    this.picklistAddForm.controls['PicklistNo'].disable();
    this.f.Date.setValue(row.PicklistDate);
    this.f.FromInvoiceNo.setValue(row.FromInv);
    this.f.ToInvoiceNo.setValue(row.ToInv);
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // Save Picklist
  SavePicklist() {
    this.submitted = true;
    this.isLoading = true;
    if (this.pageState === AppCode.saveString || this.pageState === AppCode.updateString) {
      if (!this.picklistAddForm.valid) {
        this.isLoading = false;
        return;
      }
    }
    // Save and Edit, Picklist
    this.pickistModel = new PickistModel();
    this.pickistModel.BranchId = this.BranchId;
    this.pickistModel.CompId = this.CompId;
    this.pickistModel.PicklistNo = this.f.PicklistNo.value;
    this.pickistModel.PicklistDate = AppCode.createDateAsUTC(new Date(this.f.Date.value));
    this.pickistModel.FromInv = this.f.FromInvoiceNo.value;
    this.pickistModel.ToInv = this.f.ToInvoiceNo.value;
    if (this.pageState === AppCode.saveString) {  // Save
      this.pickistModel.Picklistid = 0;
      this.pickistModel.VerifiedBy = 0;
      this.pickistModel.PicklistStatus = 0;
      this.pickistModel.Action = AppCode.addString;
    } else if (this.pageState === AppCode.updateString) { // Update
      this.pickistModel.Picklistid = this.PicklistId;
      this.pickistModel.VerifiedBy = 0;
      this.pickistModel.PicklistStatus = 0;
      this.pickistModel.Action = AppCode.editString;
    }
    this.pickistModel.Addedby = String(this.UserId);
    this.pickistModel.AddedOn = this.currentDate;
    this.pickistModel.LastUpdatedOn = this.currentDate;
    this._orderDispatchService.SavePiclist_Service(this.pickistModel)
      .subscribe((data: any) => {
        if (data === AppCode.SuccessStatus) {
          if (this.pageState === AppCode.saveString) { // Save
            this.toaster.success(AppCode.msg_saveSuccess);
          } else if (this.pageState === AppCode.updateString) { // Update
            this.toaster.success(AppCode.msg_updateSuccess);
          } else {
            this.toaster.error(AppCode.FailStatus);
            this.redirect();
          }
        }
        this.GetPickList(this.DataModel);
        this.ClearForm();
      }, (error: any) => {
        this.isLoading = false;
        console.error("Error:  " + JSON.stringify(error));
      });
  }
  // Change Status - Stokist Transport Mapping Delete
  ChangeStatus(row: PickistModel) {
    this.isLoading = true;
    this.pickistModel = new PickistModel();
    this.pickistModel.Picklistid = row.Picklistid;
    this._orderDispatchService.PickListHeaderDelete_Service(this.pickistModel)
      .subscribe((data: any) => {
        if (data === AppCode.SuccessStatus) {
          this.toaster.success(AppCode.msg_deleteSuccess);
          this.GetPickList(this.DataModel);
          // if (this.RoleId === 1) { // Super Admin
          //   this.GetStokistTransportMappingList(0);
          // } else {  // Other Login
          //   this.GetStokistTransportMappingList(this.CompanyId);
          // }
        }else{
          this.toaster.warning(AppCode.msg_alredyexist);
          this.GetPickList(this.DataModel);
        }
      }, (error) => {
        console.error(error);
      });
  }
  // Clear Form
  ClearForm() {
    this.isLoading = true;
    if (this.pageState === AppCode.saveString || this.pageState === AppCode.updateString) {
      this.PickListMsg = "Add PickList";
      this.pageState = AppCode.saveString;
      this.pageStateApprove = "";
      this.picklistAddForm.controls['PicklistNo'].disable();
      this.picklistAddForm.reset();
      this.f.Date.setValue(this.currentDate);
      this.isPickListFlag = false;
      this.GetPickListGenerateNewNo(this.DataModel);
      this.redirect();
    } else if (this.pageState === AppCode.verifyString) {
      this.router.navigate(['/modules/order-dispatch/picklist-operation']);
      this.isLoading = false;
      this.chRef.detectChanges();
    }
  }

  redirect() {
    this.router.navigate(['/modules/order-dispatch/picklist-add']);
    this.isLoading = false;
    this.chRef.detectChanges();
  }
  applyFilter() {
    this.isLoading = true;
    // this.searchModel = this.searchModel.trim(); // Remove whitespace
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

}

