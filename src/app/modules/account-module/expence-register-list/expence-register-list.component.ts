import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AppCode } from '../../../app.code';
import { AccountModuleService } from '../Services/account-module.service';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from '../../../SharedServices/shared.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentModeModel } from '../models/reimbursement-invoice';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { ExpInvModel, PaymentModel } from '../models/ExpInvModel';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expence-register-list',
  templateUrl: './expence-register-list.component.html',
  styleUrls: ['./expence-register-list.component.scss']
})
export class ExpenceRegisterListComponent implements OnInit {

  searchModel: string = '';
  displayedColumns = ['SrNo', 'BillFromName', 'ExpInvNo', 'InvDate', 'CompId', 'IsReimbursable', 'TaxableAmt', 'TotalAmt', 'Balance', 'ExpInvStatusText', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();

  UserId: number = 0;
  BranchId: number = 0;
  CompId: number = 0;
  isLoading: boolean = false;

  PaymentForm: FormGroup;
  PaymentModal: any;
  ReadyModal: any;
  submited = false;
  maxDate = new Date();
  PaymentModeList: any[];
  InvalidPaymentMode: boolean = false;
  PaymentModeArray: Observable<PaymentModeModel[]>;
  PaymentModel: PaymentModel;
  ExpInvId: number = 0;
  PageState: string = 'Save';
  ExpInvModel: ExpInvModel;

  displayedCol = ['SrNo', 'ExpInvNo', 'PaymentDate', 'PaymentModeText', 'TDS', 'PaymentAmt', 'Actions'];
  @ViewChild('paginator') paginator1: MatPaginator;
  @ViewChild('Sort') Sort1: MatSort;
  public PaymentList = new MatTableDataSource<any>();

  defaultform: any = {
    Date: '',
    TDS: '',
    Payment: '',
    Mode: '',
    ChkUTRNo: '',
    Remark: ''
  };

  constructor(
    private router: Router,
    private _AccountService: AccountModuleService,
    private chRef: ChangeDetectorRef,
    private _SharedService: SharedService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _appCode: AppCode,
    private _Masterservice: MastersServiceService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.GetExpInvList();
  }

  // Get Expense Invoice List
  GetExpInvList() {
    this.isLoading = true;
    this._AccountService.GetExpInvList_Service(this.BranchId).subscribe((data: any) => {
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

  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  SetData(Row: any) {
    this._SharedService.setData(Row);
    this.router.navigate(['/modules/account-module/add-expence-register'], { queryParams: { state: AppCode.updateString } });
  }

  redirect() {
    this.router.navigate(['/modules/account-module/add-expence-register']);
  }

  // Approve - Ready for Payment
  DeleteUpdateSatus(row: ExpInvModel, Flag: any) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.ExpInvModel = new ExpInvModel();
        this.ExpInvModel.ExpInvId = row.ExpInvId;
        this.ExpInvModel.BranchId = this.BranchId;
        if (Flag == 'Delete') {
          this.ExpInvModel.Action = AppCode.deleteString;
        }
        else {
          this.ExpInvModel.Action = AppCode.statusString;
          this.ExpInvModel.ExpInvStatus = 3;
        }
        this.ExpInvModel.AddedBy = this.UserId;
        this._AccountService.SaveExpInv_Service(this.ExpInvModel)
          .subscribe((data: any) => {
            if (data > 0) {
              this.GetExpInvList();
              this.toaster.success(AppCode.msg_ReadyForPayment);
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

  ViewPopup(Row: any, content: any) {
    this.PaymentModal = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    this.initForm();
    this.GetPaymentMode();
    this.ExpInvId = Row.ExpInvId;
    this.GetPaymentList();
    if (Row.InvTypeId == 1) {
      this.GetTransTDS(Row.TransId, Row.TotalAmt);
    }
    if (Row.InvTypeId == 3) {
      this.GetCourTDS(Row.CourierId, Row.TotalAmt)
    }
  }

  GetTransTDS(TransId: number, TotAmt: number) {
    this.isLoading = true;
    this._Masterservice.GetTransporterParent_Service(TransId).subscribe((data: any) => {
      if (data != null && data != "" && data != undefined) {
        this.CalTDS(TotAmt, data);
      } else {
        this.isLoading = false;
      }
    });
  }

  GetCourTDS(CourierId: number, TotAmt: number) {
    this.isLoading = true;
    this._Masterservice.GetParentCourier_Service(CourierId).subscribe((data: any) => {
      if (data != null && data != "" && data != undefined) {
        this.CalTDS(TotAmt, data);
      } else {
        this.isLoading = false;
      }
    });
  }

  CalTDS(TotAmt: number, data: any) {
    let amt = TotAmt;
    let tds = ((Number(data.TDSPer) / 100) * Number(amt)).toFixed(2);
    this.f.TDS.setValue(tds);
    this.f.TDS.disable();
  }

  initForm() {
    this.PaymentForm = this.fb.group({
      Date: [
        this.defaultform.Date,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      TDS: [
        this.defaultform.TDS,
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
        ]),
      ],
      Payment: [
        this.defaultform.Payment,
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
        ]),
      ],
      UTRNo: [
        this.defaultform.UTRNo,
        Validators.compose([
          Validators.maxLength(20),
        ]),
      ],
      Mode: [
        this.defaultform.Mode,
        Validators.compose([
          Validators.required
        ]),
      ],
      Remark: [this.defaultform.Remark]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.PaymentForm.controls;
  }

  // Number validation
  numberValidation(event: any) {
    this._appCode.OnlyNumbersAllow(event);
  }

  // Get Payment Mode
  GetPaymentMode() {
    this._Masterservice.GetGeneralMasterList_Service(AppCode.PaymentMode, AppCode.allString)
      .subscribe((data: any) => {
        this.PaymentModeList = data.GeneralMasterParameter;
        this.PaymentModeList = this.PaymentModeList.sort((a: any, b: any) => a.MasterName.localeCompare(b.MasterName));
        this.PaymentModeArray = this.f.Mode.valueChanges
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
    this.submited = false;
    if ((this.f.Mode.value === '' || this.f.Mode.value === undefined || this.f.Mode.value === null)) {
      this.InvalidPaymentMode = true;
      this.isLoading = false;
      return;
    } else {
      this.InvalidPaymentMode = false;
    }
  }

  // Add Payment Details
  SavePayment() {
    this.submited = true;
    this.isLoading = true;
    if (!this.PaymentForm.valid) {
      this.isLoading = false;
      this.InvalidPaymentMode = false;
      return;
    } else {
      if (this.InvalidPaymentMode === false) {
        this.PaymentModel = new PaymentModel();
        this.PaymentModel.ExpInvId = this.ExpInvId;
        this.PaymentModel.ExpPaymentId = 0;
        this.PaymentModel.PaymentDate = this.f.Date.value;
        this.PaymentModel.TDS = this.f.TDS.value;
        this.PaymentModel.PaymentAmt = this.f.Payment.value;
        this.PaymentModel.PayMode = this.f.Mode.value.pkId;
        this.PaymentModal.UTRNo = this.f.UTRNo.value;
        this.PaymentModel.Remark = this.f.Remark.value;
        this.PaymentModel.Addedby = String(this.UserId);
        this.PaymentModel.Action = AppCode.addString;
        this._AccountService.SaveExpPay_service(this.PaymentModel)
          .subscribe((data: any) => {
            if (data > 0) {
              this.toaster.success(AppCode.msg_saveSuccess);
              this.modalService.dismissAll();
              this.GetExpInvList();
            } else {
              this.toaster.error(AppCode.FailStatus);
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

  //Get Payment List
  GetPaymentList() {
    this.isLoading = true;
    this._AccountService.GetExpPayList_Service(this.ExpInvId).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.PaymentList.data = data;
        this.PaymentList.paginator = this.paginator1;
        this.PaymentList.sort = this.Sort1;
        this.isLoading = false;
        this.chRef.detectChanges();
      } else {
        this.PaymentList.data = [];
        this.isLoading = false;
        this.chRef.detectChanges();
      }
    });
  }

  //Delete Payment
  DeletePayment(Row: any) {
    this.PaymentModel = new PaymentModel();
    this.PaymentModel.ExpPaymentId = Row.ExpPaymentId;
    this.PaymentModel.Action = AppCode.deleteString;
    this._AccountService.SaveExpPay_service(this.PaymentModel)
      .subscribe((data: any) => {
        if (data > 0) {
          this.toaster.success(AppCode.msg_deleteSuccess);
          this.GetPaymentList();
          this.GetExpInvList();
        }
        else {
          this.toaster.error(AppCode.FailStatus);
        }
        this.isLoading = false;
        this.chRef.detectChanges();
      }, (error: any) => {
        console.error(error);
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  ResolveConcern(row: any) {
    this._SharedService.setData(row);
    this.router.navigate(['/modules/account-module/gatepass-bill-list'], { queryParams: { state: 'Concern' } });
  }

}
