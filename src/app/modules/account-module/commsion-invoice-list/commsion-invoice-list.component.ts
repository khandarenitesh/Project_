import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InvCommisionListModel } from '../models/inv-commision-list-model.model';
import { AppCode } from '../../../app.code';
import { SharedService } from '../../../SharedServices/shared.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AccountModuleService } from '../Services/account-module.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-commsion-invoice-list',
  templateUrl: './commsion-invoice-list.component.html',
  styleUrls: ['./commsion-invoice-list.component.scss']
})
export class CommsionInvoiceListComponent implements OnInit {

  displayedColumnsForApi = ['SrNo', 'InvNo', 'InvDate', 'InvType', 'CompanyName', 'TaxableAmt', 'TotalAmt', 'PaymentAmt', 'Actions'];
  ColumnsForUser = ['SrNo', 'InvNo', 'PaymentDate', 'TDSAmt', 'PaymentAmt', 'UTRNo', 'Actions'];
  InvCommisionListModel: InvCommisionListModel;
  filteredOptPayMode: Observable<InvCommisionListModel[]>;
  public DataSource = new MatTableDataSource<any>();
  public DataSourcePayment = new MatTableDataSource<any>();
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;

  BranchId: number = 0;
  AddEditModel: any;
  pageState: string = '';
  btnCancelText: string = '';
  searchModel: string = '';
  Title: string = '';
  submitted = false;
  isLoading: boolean = false;
  InvalidPayMode: boolean = false;
  PayModList: any = [];
  ComInvPaymentId: number = 0;
  ComInvId: number = 0;
  UserId: number = 0;
  CompanyId: number = 0;
  PaymentForm: FormGroup;
  currentDate = new Date();
  maxDate = new Date();
  PassDataByRow: any;
  defaultform: any = {
    PaymentDate: '',
    TDSAmt: '',
    PaymentAmt: '',
    PayMode: '',
    UTRNo: '',
    Remark: '',
  };


  constructor(private chRef: ChangeDetectorRef, private router: Router, private _SharedService: SharedService, private toastr: ToastrService,
    private _AccountModuleService: AccountModuleService, private _services: MastersServiceService, private toaster: ToastrService,
    private modalService: NgbModal, private fb: FormBuilder) { this.currentDate = new Date(); }

  // Page Load
  ngOnInit(): void {
    this.pageState = AppCode.saveString;
    this.btnCancelText = AppCode.cancelString;
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.initForm();
    this.GetCommisionInvoiceList(this.BranchId);
    this.f.PaymentDate.setValue(this.currentDate);
  }

  // Add Edit Payment
  AddEditPayment(content: any, row: any) {
    this.GetGeneralMasterList();
    this.PassDataByRow = row;
    this.GetInvcommPaymentList(this.PassDataByRow.ComInvId);
    this.AddEditModel = this.modalService.open(content, {
      centered: true,
      size: 'xl',
      backdrop: 'static'
    });
    if (row == "row") {
      (<HTMLInputElement>document.getElementById('cancel')).focus();
      this.f.PaymentDate.setValue(this.currentDate);
      this.pageState = 'Save';
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.PaymentForm.controls;
  }

  // Init Form
  initForm() {
    this.PaymentForm = this.fb.group({
      PaymentDate: [
        this.defaultform.PaymentDate,
        Validators.compose([
          Validators.required
        ]),
      ],
      TDSAmt: [
        this.defaultform.TDSAmt,
      ],
      PaymentAmt: [
        this.defaultform.PaymentAmt,
        Validators.compose([
          Validators.required
        ]),
      ],
      PayMode: [
        this.defaultform.PayMode,
        Validators.compose([
          Validators.required
        ]),
      ],
      UTRNo: [this.defaultform.UTRNo,
      Validators.compose([
        Validators.required
      ])],
      Remark: [
        this.defaultform.Remark,
      ],
    })
  }

  //Get Commision Invoice List
  GetCommisionInvoiceList(BranchId: number) {
    this.isLoading = true;
    this._AccountModuleService.getInvoiceComisionList_Service(BranchId).subscribe((data: any) => {
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

  // Get Payment Mode List
  GetGeneralMasterList() {
    this._services
      .GetGeneralMasterList_Service(AppCode.PayModestring, AppCode.allString)
      .subscribe(
        (data: any) => {
          this.PayModList = data.GeneralMasterParameter;
          this.PayModList = this.PayModList.sort((a: any, b: any) => a.MasterName.localeCompare(b.MasterName));
          this.filteredOptPayMode = this.f.PayMode.valueChanges //formgroup
            .pipe(
              startWith<string | InvCommisionListModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.MasterName : null),
              map(MasterName => MasterName ? this.filterPayMode(MasterName) : this.PayModList.slice()
              )
            );
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  // Autocomplete Search Filter Payment Mode
  private filterPayMode(name: string): InvCommisionListModel[] {
    this.InvalidPayMode = false;
    const filterValue = name.toLowerCase();
    return this.PayModList.filter((option: any) =>
      option.MasterName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnPayMode(MasterName: InvCommisionListModel): string {
    return MasterName && MasterName.MasterName ? MasterName.MasterName : '';
  }

  //Payment Mode Validation
  PayModeValidation() {
    if ((typeof this.f.PayMode.value === 'string' && this.f.PayMode.value !== '')) {
      this.InvalidPayMode = true;
      return;
    } else {
      this.InvalidPayMode = false;
    }
    this.chRef.detectChanges();
  }

  // Redirect Method For Got Add Commision Invoice
  redirect() {
    this.router.navigate(['/modules/account-module/add-comssion-invoice']);
  }

  // Get Data
  GetData(row: InvCommisionListModel) {
    this._SharedService.setData(row);
    this.router.navigate(['/modules/account-module/add-comssion-invoice'], { queryParams: { state: AppCode.updateString } });
  }

  //Delete data row wise
  DeleteStatus(row: InvCommisionListModel) {
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
        this.InvCommisionListModel = new InvCommisionListModel();
        this.InvCommisionListModel.ComInvId = row.ComInvId;
        this.InvCommisionListModel.Action = AppCode.deleteString;
        this._AccountModuleService.CommInvoiceAddEdit(this.InvCommisionListModel)
          .subscribe((data: any) => {
            if (data === 'Success') {
              this.toastr.success(AppCode.msg_deleteSuccess);
            } else {
              this.toastr.warning(AppCode.msg_PaymentAlredy);
            }
            this.GetCommisionInvoiceList(this.BranchId);
          }, (error) => {
            console.error(error);
            this.chRef.detectChanges();
          });
      }
    })
  }

  //Get Payment List
  GetInvcommPaymentList(ComInvId: number) {
    this.isLoading = true;
    this._AccountModuleService.getPaymentInvCom_Service(ComInvId).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.DataSourcePayment.data = data;
        this.isLoading = false;
        this.chRef.detectChanges();
      } else {
        this.DataSourcePayment.data = [];
        this.isLoading = false;
        this.chRef.detectChanges();
      }
    });
  }

  // Add Payment
  SavePayment() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.PaymentForm.valid) {
      this.isLoading = false;
      return
    }
    else {
      if (this.InvalidPayMode === false) {
        this.InvCommisionListModel = new InvCommisionListModel();
        this.InvCommisionListModel.PaymentDate = AppCode.createDateAsUTC(new Date(this.f.PaymentDate.value));
        this.InvCommisionListModel.TDSAmt = this.f.TDSAmt.value;
        this.InvCommisionListModel.PaymentAmt = this.f.PaymentAmt.value;
        this.InvCommisionListModel.PaymentModeId = this.f.PayMode.value.pkId;
        this.InvCommisionListModel.UTRNo = this.f.UTRNo.value;
        this.InvCommisionListModel.Remark = this.f.Remark.value;
        this.InvCommisionListModel.Addedby = String(this.UserId);
        this.InvCommisionListModel.ComInvId = this.PassDataByRow.ComInvId;
        if (this.pageState === AppCode.saveString) {
          this.InvCommisionListModel.ComInvPaymentId = 0;
          this.InvCommisionListModel.Action = AppCode.addString;
        } else {
          this.InvCommisionListModel.ComInvPaymentId = this.ComInvPaymentId;
          this.InvCommisionListModel.Action = AppCode.deleteString;
        }
        this._AccountModuleService.AddCommInvPaymentAddDelete(this.InvCommisionListModel).subscribe(
          (data: any) => {
            if (data === AppCode.SuccessStatus) {
              if (this.pageState === AppCode.saveString) {
                this.toastr.success(AppCode.msg_saveSuccess);
                this.GetInvcommPaymentList(this.InvCommisionListModel.ComInvId);
                this.modalService.dismissAll();
                this.GetCommisionInvoiceList(this.BranchId);
                this.submitted = false;
                this.isLoading = false;
              }
              this.clear();
            } else if (data === AppCode.ExistsStatus) {
              this.toaster.warning(AppCode.msg_exist);
              this.isLoading = false;
              this.chRef.detectChanges();
            } else {
              this.toaster.error(data);
              this.clear();
            }
          },
          (error) => {
            console.error(error);
            this.isLoading = false;
          });
      }
      else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
      }
    }
  }

  // Delete Payment
  DeletePayment(row: InvCommisionListModel) {
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
        this.InvCommisionListModel = new InvCommisionListModel();
        this.InvCommisionListModel.ComInvPaymentId = row.ComInvPaymentId;
        this.InvCommisionListModel.Action = AppCode.deleteString;
        this._AccountModuleService.AddCommInvPaymentAddDelete(this.InvCommisionListModel)
          .subscribe((data: any) => {
            if (data === 'Success') {
              this.toastr.success(AppCode.msg_deleteSuccess);
              this.modalService.dismissAll();
              this.GetCommisionInvoiceList(this.BranchId);
            } else {
              this.toastr.warning(AppCode.msg_AllotFail);
            }
            this.GetInvcommPaymentList(this.InvCommisionListModel.ComInvId);
          }, (error) => {
            console.error(error);
            this.chRef.detectChanges();
          });
      }
    })
  }

  // Clear Function
  clear() {
    this.PaymentForm.reset();
    this.f.PaymentDate.setValue(this.currentDate);
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
