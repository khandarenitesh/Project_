import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ActivatedRoute, Router } from '@angular/router';

import { AppCode } from '../../../app.code';

// Models
import { PickistModel } from '../Models/picklist-model';

// Services
import { OrderDispatchService } from '../Services/order-dispatch.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PicklistCountModel } from '../Models/picklistcount-model';
import { AuthService } from '../../auth';
import { trigger, state, transition, style, animate } from '@angular/animations';

import * as $ from "jquery";

@Component({
  selector: 'app-picklist-verify',
  templateUrl: './picklist-verify.component.html',
  styleUrls: ['./picklist-verify.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class PicklistVerifyComponent implements OnInit {
  displayedColumnsForApi = ['SrNo', 'PicklistNo', 'PicklistDate', 'FromInv', 'ToInv', 'StatusText', 'RejectReason','IsStockTransfer', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  ColumnsForUser = ['Action', 'Name', 'ContactNumber'];
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('Sort2') Sort2: MatSort;
  public UserData = new MatTableDataSource<any>();
  pageState: string = "";
  BranchId: number = 0;
  CompId: number = 0;
  isLoading: boolean = false;
  defaultform: any = {
    PicklistNo: '',
    Date: '',
    FromInvoiceNo: '',
    ToInvoiceNo: ''
  };
  PicklistStatus: string = "";
  PickListMsg: string = "";
  RoleId: number = 0;
  UserModal: any;
  pickers: string = "";
  UserId: number = 0;
  PicklistId: number = 0;
  DataModel: any;
  currentDate = new Date();
  AllotFlag: boolean = true;
  pickistModel: PickistModel;
  picklistAddForm: FormGroup;
  RejectReason: string = "";
  modalReference: NgbModalRef;
  picklistcount: PicklistCountModel;
  AllPickList: number = 0;
  RejectbyOperator: number = 0;
  PendingForAllot: number = 0;
  AllotedPicklist: number = 0;
  AcceptedPickList: number = 0;
  ConcernRaised: number = 0;
  CompletedPicklists: number = 0;
  CompletedVerified: number = 0;
  searchModel: any;
  PickListTitle: string = "";
  submitted = false;
  isPickListFlag: boolean = false;
  pageStateApprove: string = "";
  minDate = new Date();
  picklistpageState: string = ''
  PickList: any;
  PicklistData: any[] = [];
  permissions: any;
  expandedElement: any;
  id: any;
  TocheckStockTran: any;

  constructor(
    private chRef: ChangeDetectorRef,
    private _orderDispatchService: OrderDispatchService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService, private route: ActivatedRoute,
    private _appCode: AppCode
  ) { }

  ngOnInit(): void {
    this.pageState = AppCode.verifyString;
    let obj = AppCode.getUser();
    this.RoleId = obj.RoleId;
    this.authService.currentPermissions.subscribe(data => this.permissions = data);
    this.picklistpageState = AppCode.saveString;
    this.PickListTitle = "Add PickList";
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
    if (this.RoleId === 1 || this.RoleId === 3) { // Super Admin and Operator/Staff
      this.pageState = "Verify";
      this.PickListMsg = "Verify PickList";
    } else if (this.RoleId === 1 || this.RoleId === 4) { // Super Admin and Supervisor
      this.pageState = "Allot";
      this.PickListMsg = "Allot PickList";
    }
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompId,
      PicklistDate: this.currentDate
    };
    this.GetPickList(this.DataModel);
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id == 1){
      this.id = this.id;
      console.log('Id Received From Stock Transfer! =  ', this.id)
      this.GetPickListCountsstk(this.DataModel);
    } else if (this.id == null || this.id == undefined) {
      this.id = this.id = 0;
      this.GetPickListCounts(this.DataModel);
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.picklistAddForm.controls;
  }

  expandCollapse(element: any) {
    $('.example-element-row').removeClass('is-blue');

    if (this.expandedElement !== null && this.expandedElement !== undefined) {
      $('#' + this.expandedElement.Picklistid).css('display', 'none');
    }
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandedElement !== null && this.expandedElement !== undefined) {
      $('#' + this.expandedElement.Picklistid).css('display', 'block');
      let prevrow = $('#Expand' + this.expandedElement.Picklistid).prev()[0];
      $(prevrow).addClass('is-blue');
    } else {
      $('#' + element.Picklistid).css('display', 'none');
    }
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

  // Get PickList Counts
  GetPickListCounts(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getPickListCounts_Service(DataModel)
      .subscribe((data: any) => {
        this.afterCount(data);
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  afterCount(data: PicklistCountModel) {
    this.picklistcount = new PicklistCountModel();
    this.picklistcount = data;
    this.AllPickList = this.picklistcount.TotalPL;
    this.RejectbyOperator = this.picklistcount.OperatorRejected;
    this.PendingForAllot = this.picklistcount.Pending;
    this.AllotedPicklist = this.picklistcount.Alloted;
    this.AcceptedPickList = this.picklistcount.Accepted;
    this.ConcernRaised = this.picklistcount.Concern;
    this.CompletedPicklists = this.picklistcount.Completed;
    this.CompletedVerified = this.picklistcount.CompletedVerified;
    this.chRef.detectChanges();
  }

  // Get PickList Counts For Stock Transfere
  GetPickListCountsstk(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getPickListCountsstck_Service(DataModel)
      .subscribe((data: any) => {
        this.afterCountstk(data);
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  afterCountstk(data: PicklistCountModel) {
    this.picklistcount = new PicklistCountModel();
    this.picklistcount = data;
    this.AllPickList = this.picklistcount.TotalPL;
    this.RejectbyOperator = this.picklistcount.OperatorRejected;
    this.PendingForAllot = this.picklistcount.Pending;
    this.AllotedPicklist = this.picklistcount.Alloted;
    this.AcceptedPickList = this.picklistcount.Accepted;
    this.ConcernRaised = this.picklistcount.Concern;
    this.CompletedPicklists = this.picklistcount.Completed;
    this.CompletedVerified = this.picklistcount.CompletedVerified;
    this.chRef.detectChanges();
  }


  // Get PickList
  GetPickList(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getPickListByPicker_Service(DataModel)
      .subscribe((data: any) => {
        if (data != null && data != "" && data != undefined) {
          //Is Stock Transefer Data
          if (this.id === "1") {
            var StockTransData = data.filter((x: any) => x.IsStockTransfer === 1)
            this.DataSource.data = StockTransData;
            this.PicklistData = StockTransData;
            this.DataSource.paginator = this.paginator;
            this.DataSource.sort = this.Sort;
            this.isLoading = false;
            this.chRef.detectChanges();
          }
          else {
            var OrderDisData = data.filter((x: any) => x.IsStockTransfer === 0)
            this.DataSource.data = OrderDisData;
            this.PicklistData = OrderDisData;
            this.DataSource.paginator = this.paginator;
            this.DataSource.sort = this.Sort;
            this.isLoading = false;
            this.chRef.detectChanges();
          }

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

  Verify(row: PickistModel) {
    this.pickistModel = new PickistModel();
    this.pickistModel.Picklistid = row.Picklistid;
    this.pickistModel.VerifiedBy = this.UserId;
    this.pickistModel.PicklistStatus = 1;
    this.pickistModel.Action = AppCode.verifyString;
    this._orderDispatchService.SavePiclist_Service(this.pickistModel)
      .subscribe((data: any) => {
        if (data === AppCode.SuccessStatus) {
          this.toaster.success(AppCode.msg_verifySuccess);
          this.GetPickList(this.DataModel);
          if (this.id === "1") {
            this.GetPickListCountsstk(this.DataModel);
          }
          else { this.GetPickListCounts(this.DataModel); }
        }
        else {
          this.toaster.error(AppCode.FailStatus);
        }
      }, (error: any) => {
        this.isLoading = false;
        console.error("Error:  " + JSON.stringify(error));
      });
  }

  onClickRejectModel(content: any, row: PickistModel) {
    this.modalReference = this.modalService.open(content, {
      centered: true,
      size: 'sm',
      backdrop: 'static'
    });
    this.PicklistId = row.Picklistid;
  }

  onClickReject() { 
    if (this.RejectReason !== "") {
      this.isLoading = true;
      this.pickistModel = new PickistModel();
      this.pickistModel.Picklistid = this.PicklistId;
      this.pickistModel.VerifiedBy = this.UserId;
      this.pickistModel.PicklistStatus = 2;
      this.pickistModel.RejectReason = this.RejectReason;
      this.pickistModel.Action = AppCode.verifyString;
      this._orderDispatchService.SavePiclist_Service(this.pickistModel)
        .subscribe((data: any) => {
          if (data === AppCode.SuccessStatus) {
            this.toaster.success(AppCode.msg_rejectSuccess);
            this.GetPickList(this.DataModel);
            if (this.id === "1") {
              this.GetPickListCountsstk(this.DataModel);
            }
            else {
              this.GetPickListCounts(this.DataModel);
            }
            this.RejectReason = "";
            this.modalReference.close();
          }
          else {
            this.toaster.error(AppCode.FailStatus);
          }
        }, (error: any) => {
          this.isLoading = false;
          console.error("Error:  " + JSON.stringify(error));
        });
    }
  }

  GetUserList() {
    this.isLoading = true;
    let model = {
      'RoleId': 5
    }
    this._orderDispatchService.getUserList_Service(this.BranchId, this.CompId, 5)
      .subscribe((data: any) => {
        if (data != null && data != "" && data != undefined) {
          this.UserData.data = data;
          //  this.UserData.paginator = this.paginator;
          this.UserData.sort = this.Sort;
          this.isLoading = false;
          this.chRef.detectChanges();
        } else {
          this.UserData.data = [];
          this.isLoading = false;
          this.chRef.detectChanges();
        }
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  AllotPopup(row: any, content: any) {
    this.GetUserList();
    this.PicklistId = row.Picklistid;
    this.pickers = "";
    this.UserModal = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  AddString(row: any) {
    let newpickers;
    if (this.pickers.includes(row.UserId)) {
      newpickers = this.pickers.replace(row.UserId + ',', '');
      this.pickers = newpickers;
    }
    else {
      this.pickers = this.pickers + row.UserId + ',';
    }
  }

  Allot() {
    if (this.pickers === "") {
      this.toaster.warning(AppCode.msg_selectPicker);
    }
    else {
      let model = {
        'BranchId': this.BranchId,
        'CompId': this.CompId,
        'Picklistid': this.PicklistId,
        'PickerId': this.pickers,
        'AllottedBy': this.UserId
      }
      this._orderDispatchService.AddAllotList_Service(model)
        .subscribe((data: any) => {
          if (data === AppCode.SuccessStatus) {
            this.toaster.success(AppCode.msg_AllotSuccess);
            this.modalService.dismissAll();
            this.GetPickList(this.DataModel);
            if (this.id === "1") {
              this.GetPickListCountsstk(this.DataModel);
            }
            else {
              this.GetPickListCounts(this.DataModel);
            }
          }
          else {
            this.toaster.error(AppCode.msg_AllotFail);
          }
        }, (error: any) => {
          console.error("Error:  " + JSON.stringify(error));
        });
    }
  }
  AddPicklist(content: any, row: any, flag: any) {
    this.UserModal = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    if (flag == "Save") {
      this.GetPickListGenerateNewNo(this.DataModel);
      this.picklistpageState = AppCode.saveString;
    }
    else {
      this.EditData(row);
      this.picklistpageState = AppCode.updateString;
    }
  }

  // Save Picklist
  SavePicklist() {
    this.submitted = true;
    this.isLoading = true;
    if (this.picklistpageState === AppCode.saveString || this.picklistpageState === AppCode.updateString) {
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
    this.pickistModel.IsStockTransfer = this.id;
    if (this.picklistpageState === AppCode.saveString) {  // Save
      this.pickistModel.Picklistid = 0;
      this.pickistModel.VerifiedBy = 0;
      this.pickistModel.PicklistStatus = 0;
      this.pickistModel.Action = AppCode.addString;
    } else if (this.picklistpageState === AppCode.updateString) { // Update
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
          if (this.picklistpageState === AppCode.saveString) { // Save
            this.toaster.success(AppCode.msg_saveSuccess);
            if (this.id === "1") {
              this.GetPickListCountsstk(this.DataModel);
            }
            else {
              this.GetPickListCounts(this.DataModel);
            }
          } else if (this.picklistpageState === AppCode.updateString) { // Update
            this.toaster.success(AppCode.msg_updateSuccess);
            if (this.id === "1") {
              this.GetPickListCountsstk(this.DataModel);
            }
            else {
              this.GetPickListCounts(this.DataModel);
            }
          } else {
            this.toaster.error(AppCode.FailStatus);
          }
        }
        this.GetPickList(this.DataModel);
        this.ClearForm();
      }, (error: any) => {
        this.isLoading = false;
        console.error("Error:  " + JSON.stringify(error));
      });
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

  // Clear Form
  ClearForm() {
    this.isLoading = true;
    if (this.picklistpageState === AppCode.saveString || this.picklistpageState === AppCode.updateString) {
      this.PickListMsg = "Add PickList";
      this.picklistpageState = AppCode.saveString;
      this.pageStateApprove = "";
      this.picklistAddForm.controls['PicklistNo'].disable();
      this.picklistAddForm.reset();
      this.f.Date.setValue(this.currentDate);
      this.isPickListFlag = false;
      this.modalService.dismissAll();
      this.GetPickListGenerateNewNo(this.DataModel);
      this.isLoading = false;
    } else if (this.picklistpageState === AppCode.updateString) {
      this.isLoading = false;
      this.modalService.dismissAll();
      this.chRef.detectChanges();
    }
  }
  // Edit Picklist
  EditData(row: PickistModel) {
    this.isLoading = true;
    this.pageState = "";
    this.picklistpageState = AppCode.updateString;
    this.PickListTitle = "Update PickList";
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
  // Change Status - PickList Delete
  ChangeStatus(row: PickistModel) {
    this.isLoading = true;
    this.pickistModel = new PickistModel();
    this.pickistModel.Picklistid = row.Picklistid;
    this._orderDispatchService.PickListHeaderDelete_Service(this.pickistModel)
      .subscribe((data: any) => {
        if (data === AppCode.SuccessStatus) {
          this.toaster.success(AppCode.msg_deleteSuccess);
          this.GetPickList(this.DataModel);
          if (this.id === "1") {
            this.GetPickListCountsstk(this.DataModel);
          }
          else {
            this.GetPickListCounts(this.DataModel);
          }
        } else {
          this.toaster.warning(AppCode.msg_alredyexist);
          this.GetPickList(this.DataModel);
        }
      }, (error) => {
        console.error(error);
      });
  }

  ShowPickList(Flag?: any) {
    if (this.PicklistData != null && this.PicklistData !== undefined) {

      if (Flag === 'All') {
        this.PickList = this.PicklistData;
      }
      else if (Flag === 'RejectbyOperator') {
        this.PickList = this.PicklistData.filter(x => x.PicklistStatus === 2);

      } else if (Flag === 'PendingForAllot') {
        this.PickList = this.PicklistData.filter(x => x.PicklistStatus === 1 || x.PicklistStatus === 5 || x.PicklistStatus === 7 || x.PicklistStatus === 0);

      } else if (Flag === 'AllotedPicklists') {
        this.PickList = this.PicklistData.filter(x => x.PicklistStatus === 3 || x.PicklistStatus === 6);

      } else if (Flag === 'AcceptedPickList') {
        this.PickList = this.PicklistData.filter(x => x.PicklistStatus === 4);

      } else if (Flag === 'ConcernRaised') {
        this.PickList = this.PicklistData.filter(x => x.PicklistStatus === 9 || x.PicklistStatus === 11);

      } else if (Flag === 'CompletedPicklists') {
        this.PickList = this.PicklistData.filter(x => x.PicklistStatus === 8);

      } else if (Flag === 'CompletedVerified') {
        this.PickList = this.PicklistData.filter(x => x.PicklistStatus === 10);
      }
      this.DataSource = new MatTableDataSource(this.PickList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
      this.chRef.detectChanges();
    }
  }
  applyFilter() {
    this.isLoading = true;
    // this.searchModel = this.searchModel.trim(); // Remove whitespace
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  // Number validation
  numberValidation(event: any) {
    this._appCode.OnlyNumbersAllow(event);
  }

  // validation Pan No
  InvNoValidation(event: any) {
    this._appCode.keyPressAlphanumeric(event);
  }

}
