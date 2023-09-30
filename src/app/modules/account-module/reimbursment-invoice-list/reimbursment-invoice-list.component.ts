import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators, AbstractControl, } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// models
import { ReimbursementInvoiceAddEditModel, ReimbursementPaymentAddEditModel, PaymentModeModel } from '../models/reimbursement-invoice';

// Services
import { ToastrService } from 'ngx-toastr';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { AccountModuleService } from '../Services/account-module.service';
import { SharedService } from '../../../SharedServices/shared.service';
import { AppCode } from '../../../app.code';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-reimbursment-invoice-list',
  templateUrl: './reimbursment-invoice-list.component.html',
  styleUrls: ['./reimbursment-invoice-list.component.scss']
})
export class ReimbursmentInvoiceListComponent implements OnInit {
  // Reimbursment Invoice
  reimbursmentInvDetails = ['SrNo', 'InvNo', 'InvDate', 'CompanyName', 'TaxableAmt', 'TotalAmt', 'PaymentAmt', 'RIActions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPaymentList') paginatorPaymentList: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  @ViewChild('SortPaymentList') SortPaymentList: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  public DataSourceReimbursmentInv = new MatTableDataSource<any>();
  public DataSourceForPaymentList = new MatTableDataSource<any>();
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  ReimbursmentInvoiceListTitle: string = "";
  searchModel: string = "";
  reimbursementAddEditModel: ReimbursementInvoiceAddEditModel;

  // Payment Details
  paymentList = ['SrNo', 'InvNo', 'PaymentDate', 'TDS', 'PaymentAmt', 'PaymentMode', 'UTRNo', 'Actions'];
  paymentListMsg: string = "Payment List";
  paymentDtsAddEditForm: FormGroup;
  defaultform: any = {
    PaymentDate: '',
    TDSLess: '',
    PaymentReceived: '',
    PaymentMode: '',
    UTRNo: ''
  };
  PaymentDetailsTitle: string = "";
  paymentDtsPageState: string = "";
  paymentDtsMsg: string = "";
  maxDate = new Date();
  currentDate = new Date();
  modalReference: NgbModalRef;
  PaymentDetailsModal: any;
  PaymentModeList: any = [];
  InvalidPaymentMode: boolean = false;
  PaymentModeArray: Observable<PaymentModeModel[]>;
  submitted = false;
  PaymentDetailsRemark: string = "";
  paymentAddEditModel: ReimbursementPaymentAddEditModel;
  ReimId: number = 0;
  ReimPaymentId: number = 0;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private _service: MastersServiceService,
    private _AccountService: AccountModuleService, private chRef: ChangeDetectorRef, private toastr: ToastrService,
    private router: Router, private _SharedService: SharedService, private _appCode: AppCode) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.ReimbursmentInvoiceListTitle = "Reimbursement Invoice List";
    let result = AppCode.getUser();
    this.UserId = result.UserId;
    this.BranchId = result.BranchId;
    this.CompanyId = result.CompanyId;
    this.GetReimbursementInvoiceList(this.BranchId);

    // Payment Details
    this.paymentDtsPageState = AppCode.saveString;
    this.initPaymentDetailsForm();
    this.f.PaymentDate.setValue(this.currentDate);
    this.GetPaymentModeDDL();
  }

  // Get Reimbursement List
  GetReimbursementInvoiceList(BranchId: number) {
    this.isLoading = true;
    this._AccountService.GetReimbursementInvoiceList(BranchId)
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.DataSourceReimbursmentInv.data = data;
          this.DataSourceReimbursmentInv.paginator = this.paginator;
          this.DataSourceReimbursmentInv.sort = this.Sort;
        } else {
          this.DataSourceReimbursmentInv.data = [];
        }
        this.isLoading = false;
        this.chRef.detectChanges();
      }, (error: any) => {
        console.log(error);
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSourceReimbursmentInv.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  // Redirect to Reimbursement Invoice Add
  redirect() {
    this.router.navigate(['/modules/account-module/reimbursment-invoice-add']);
  }

  // Edit Data For Reimbursment Invoice
  EditDataForReimbInv(row: any) {
    this._SharedService.setData(row);
    this.router.navigate(['/modules/account-module/reimbursment-invoice-add'], { queryParams: { state: AppCode.updateString } });
    this.chRef.detectChanges();
  }

  // Delete Data For Reimbursment Invoice
  DeleteDataForReimbInv(row: ReimbursementInvoiceAddEditModel) {
    Swal.fire({
      title: 'Reimbursment Invoice',
      text: "Are you sure you want to delete this Reimbursment Invoice?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Sure!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reimbursementAddEditModel = new ReimbursementInvoiceAddEditModel();
        this.reimbursementAddEditModel.BranchId = this.BranchId;
        this.reimbursementAddEditModel.CompanyId = this.CompanyId;
        this.reimbursementAddEditModel.ReimId = row.ReimId;
        this.reimbursementAddEditModel.Action = AppCode.deleteString;
        this._AccountService.ReimbursementInvoiceAddEdit(this.reimbursementAddEditModel)
          .subscribe((data: any) => {
            if (data > 0) {
              this.toastr.success(AppCode.msg_deleteSuccess);
              this.GetReimbursementInvoiceList(this.BranchId);
              this.ClearForm();
            } else if (data === -1) {
              this.toastr.warning(AppCode.msg_ReimbInvDelete);
            } else {
              this.toastr.error(AppCode.FailStatus);
            }
          }, (error: any) => {
            console.error(error);
            this.chRef.detectChanges();
          });
      }
    });
  }

  // To Init Payment Details Form
  initPaymentDetailsForm() {
    this.paymentDtsAddEditForm = this.fb.group({
      PaymentDate: [this.defaultform.PaymentDate, Validators.compose([Validators.required, Validators.maxLength(50)])],
      TDSLess: [this.defaultform.TDSLess, Validators.compose([Validators.maxLength(50)])],
      PaymentReceived: [this.defaultform.PaymentReceived, Validators.compose([Validators.required, Validators.maxLength(50)])],
      PaymentMode: [this.defaultform.PaymentMode, Validators.compose([Validators.required, Validators.maxLength(50)])],
      UTRNo: [this.defaultform.UTRNo, Validators.compose([Validators.required,Validators.maxLength(25)])]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.paymentDtsAddEditForm.controls;
  }

  // Get Payment Mode
  GetPaymentModeDDL() {
    this._service.GetGeneralMasterList_Service(AppCode.PaymentMode, AppCode.allString)
      .subscribe((data: any) => {
        this.PaymentModeList = data.GeneralMasterParameter;
        this.PaymentModeList = this.PaymentModeList.sort((a: any, b: any) => a.MasterName.localeCompare(b.MasterName));
        this.PaymentModeArray = this.f.PaymentMode.valueChanges
          .pipe(startWith<string | PaymentModeModel>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.MasterName : null),
            map(MasterName => MasterName ? this.filterPaymentMode(MasterName) : this.PaymentModeList.slice()));
        this.chRef.detectChanges();
      }, (error: any) => {
        console.error(error);
        this.chRef.detectChanges();
      });
  }

  // Autocomplete Search Filter
  private filterPaymentMode(name: string): PaymentModeModel[] {
    this.InvalidPaymentMode = false;
    const filterValue = name.toLowerCase();
    return this.PaymentModeList.filter((option: any) => option.MasterName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnPaymentMode(name: PaymentModeModel): string {
    return name && name.MasterName ? name.MasterName : '';
  }

  // Payment Mode Validation
  PaymentModeValidation() {
    this.submitted=false;
    if ((typeof this.f.PaymentMode.value === 'string' || this.f.PaymentMode.value === null || this.f.PaymentMode.value === undefined)) {
      this.InvalidPaymentMode = true;
    } else {
      this.InvalidPaymentMode = false;
    }
    this.chRef.detectChanges();
  }

  // To Add/Edit Payment
  AddEditPayment(content: any, row: any) {
    this.submitted = false;
    this.InvalidPaymentMode = false;
    this.ReimId = row.ReimId;
    this.ReimPaymentId = row.ReimPaymentId;
    this.PaymentDetailsRemark = "";
    this.PaymentDetailsModal = this.modalService.open(content, {
      centered: true,
      size: 'xl',
      backdrop: 'static'
    });
    this.PaymentDetailsTitle = "Add Payment Details";
    this.paymentDtsPageState = AppCode.saveString;
    this.GetReimbursementPaymentList(this.ReimId);
  }

  // Add/Edit Payment Details
  SavePaymentDetails() {
    this.submitted = true;
    this.isLoading = true;
    if (!this.paymentDtsAddEditForm.valid) {
      this.isLoading = false;
      this.InvalidPaymentMode = false;
      return;
    } else {
      if (this.InvalidPaymentMode === false) {
        this.paymentAddEditModel = new ReimbursementPaymentAddEditModel();
        this.paymentAddEditModel.ReimId = this.ReimId;
        this.paymentAddEditModel.PaymentDate = AppCode.createDateAsUTC(new Date(this.f.PaymentDate.value));
        this.paymentAddEditModel.TDS = this.f.TDSLess.value;
        this.paymentAddEditModel.PaymentAmt = this.f.PaymentReceived.value;
        this.paymentAddEditModel.PaymentModeId = this.f.PaymentMode.value.pkId;
        this.paymentAddEditModel.UTRNo = this.f.UTRNo.value;
        this.paymentAddEditModel.Remark = this.PaymentDetailsRemark;
        this.paymentAddEditModel.Addedby = String(this.UserId);
        if (this.paymentDtsPageState === AppCode.saveString) {
          this.paymentAddEditModel.ReimPaymentId = 0;
          this.paymentAddEditModel.Action = AppCode.addString;
        } else {
          this.paymentAddEditModel.ReimPaymentId = this.ReimPaymentId;
          this.paymentAddEditModel.Action = AppCode.editString;
        }
        this._AccountService.ReimbursementPaymentAddEdit(this.paymentAddEditModel)
          .subscribe((data: any) => {
            if (data > 0) {
              if (this.paymentDtsPageState === AppCode.saveString) {
                this.toastr.success(AppCode.msg_saveSuccess);
              } else {
                this.toastr.success(AppCode.msg_updateSuccess);
              }
              this.GetReimbursementPaymentList(this.ReimId);
              this.GetReimbursementInvoiceList(this.BranchId);
              this.ClearForm();
            } else if (data === -1) {
              this.toastr.warning(AppCode.msg_exist);
            } else {
              this.toastr.error(AppCode.FailStatus);
            }
            this.isLoading = false;
            this.chRef.detectChanges();
          }, (error: any) => {
            console.error(error);
            this.isLoading = false;
            this.chRef.detectChanges();
          });
      }
    }
  }

  // Payment List - Delete
  DeleteDataForPayment(row: any) {
    Swal.fire({
      title: 'Payment Details',
      text: "Are you sure you want to delete this Payment?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Sure!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.paymentAddEditModel = new ReimbursementPaymentAddEditModel();
        this.paymentAddEditModel.ReimPaymentId = row.ReimPaymentId;
        this.paymentAddEditModel.Action = AppCode.deleteString;
        this._AccountService.ReimbursementPaymentAddEdit(this.paymentAddEditModel)
          .subscribe((data: any) => {
            if (data > 0) {
              this.toastr.success(AppCode.msg_deleteSuccess);
              this.GetReimbursementPaymentList(row.ReimId);
              this.ClearForm();
            } else if (data === -1) {
              this.toastr.warning(AppCode.msg_exist);
            } else {
              this.toastr.error(AppCode.FailStatus);
            }
            this.isLoading = false;
            this.chRef.detectChanges();
          }, (error: any) => {
            console.error(error);
            this.isLoading = false;
            this.chRef.detectChanges();
          });
      }
    });
  }

  // Get Reimbursement Payment List
  GetReimbursementPaymentList(ReimId: number) {
    this.isLoading = true;
    this._AccountService.GetReimbursementPaymentList(ReimId)
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.DataSourceForPaymentList.data = data;
          this.DataSourceForPaymentList.paginator = this.paginatorPaymentList;
          this.DataSourceForPaymentList.sort = this.SortPaymentList;
        } else {
          this.DataSourceForPaymentList.data = [];
        }
        this.isLoading = false;
        this.chRef.detectChanges();
      }, (error: any) => {
        console.log(error);
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  // Clear Form
  ClearForm() {
    this.isLoading = true;
    this.paymentDtsMsg = "Add Payment Details";
    this.paymentDtsPageState = AppCode.saveString;
    this.paymentDtsAddEditForm.reset();
    this.f.PaymentDate.setValue(this.currentDate);
    this.modalService.dismissAll();
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  NumValidation(event: any) {
    this._appCode.numberOnly(event);
  }

}
