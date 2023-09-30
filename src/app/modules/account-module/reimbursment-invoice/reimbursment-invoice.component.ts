import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

// angular material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// models
import { ReimbursementInvoiceAddEditModel } from '../models/reimbursement-invoice';

// Services
import { AccountModuleService } from '../Services/account-module.service';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { SharedService } from '../../../SharedServices/shared.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export class matrowselected {
  ExpInvId: number;
  TaxableAmt: number = 0;
  TotalCGST:number=0;
  TotalSGST:number=0;
}

@Component({
  selector: 'app-reimbursment-invoice',
  templateUrl: './reimbursment-invoice.component.html',
  styleUrls: ['./reimbursment-invoice.component.scss']
})
export class ReimbursmentInvoiceComponent implements OnInit {
  reimbursmentForm: FormGroup;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  CompanyList: any[] = [];
  defaultform: any = {
    CompanyName: '',
    InvNo: '',
    InvDate: '',
    ExpHead: '',
    TaxAmt: '',
    CGST: '',
    SGST: '',
    TotalAmt: ''
  };
  reimbursmentMsg: string = '';
  pageState: string = '';
  btnCancelText: string = '';
  State: any = {
    state: '',
  };
  submitted: boolean = false;
  isLoading: boolean = false;
  minDate = new Date();
  currentDate = new Date();
  reimbursementAddEditModel: ReimbursementInvoiceAddEditModel;
  ReimId: number = 0;
  ReimbursementRemark: string = "";
  // Company Name
  InvalidCompany: boolean = false;
  CompanyNameArray: Observable<ReimbursementInvoiceAddEditModel[]>;
  // Expence Head
  ExpHeadList: any = [];
  InvalidExpHead: boolean = false;
  ExpHeadArray: Observable<ReimbursementInvoiceAddEditModel[]>;
  InvDate: any;
  totalAmtValue: number = 0;
  CGSTValue: any;
  SGSTValue: any;
  CGST: number = 0;
  SGST: number = 0;
  reimbursmentAddColumns = ['BillFromName', 'ExpInvNo', 'InvDate', 'NoOfBox', 'TaxableAmt', 'CGST', 'SGST', 'TotalAmt', 'SelectAll'];
  public DataSource = new MatTableDataSource<any>();
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  selectedrows: matrowselected[] = [];
  selection = new SelectionModel<any>(true, []);
  TaxableAmountSum: number = 0;
  ChecValueFlag: any;
  check: any;
  Allcheck: any;
  PaymentAmtDisableFlag: any;
  maxDate = new Date();
  TotalCGSTValue:number=0;
  TotalSGSTValue:number=0;

  constructor(private fb: FormBuilder, private _AccountService: AccountModuleService, private _service: MastersServiceService,
    private _SharedService: SharedService, private route: ActivatedRoute, private router: Router, private chef: ChangeDetectorRef,
    private toastr: ToastrService, private _appCode: AppCode) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.reimbursmentMsg = "Add Reimbursement Invoice";
    this.pageState = AppCode.saveString;
    this.btnCancelText = AppCode.cancelString;
    let result = AppCode.getUser();
    this.UserId = result.UserId;
    this.BranchId = result.BranchId;
    this.CompanyId = result.CompanyId;
    this.initForm();
    this.GetCompanyList();
    this.f.InvDate.setValue(this.currentDate);
    this.InvDate = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
    this.GetReimInvNo(this.BranchId, this.InvDate);
    // this.GetTaxMasterList();
    this.GetExpenceHead();
    this.route.queryParams.subscribe((params) => {
      this.State = params;
    });
    if (this.State.state !== undefined && this.State.state !== null) {
      this.Setdata();
    }

    //taxable amount field is disabled
    this.f.CGST.disable();
    this.f.SGST.disable();
    this.f.TaxAmt.disable();
    this.f.TotalAmt.disable();
  }

  // To Init Form
  initForm() {
    this.reimbursmentForm = this.fb.group({
      CompanyName: [this.defaultform.CompanyName, Validators.compose([Validators.required, Validators.maxLength(50)])],
      InvNo: [this.defaultform.InvNo],
      InvDate: [this.defaultform.InvDate, Validators.compose([Validators.required, Validators.maxLength(50)])],
      ExpHead: [this.defaultform.ExpHead, Validators.compose([Validators.required])],
      TDSLess: [this.defaultform.TDSLess, Validators.compose([Validators.maxLength(50)])],
      TaxAmt: [this.defaultform.TaxAmt, Validators.compose([Validators.required])],
      CGST: [this.defaultform.CGST],
      SGST: [this.defaultform.SGST],
      TotalAmt: [this.defaultform.TotalAmt]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.reimbursmentForm.controls;
  }

  // Get Company List
  GetCompanyList() {
    this._service.getCompanyList_Service(AppCode.IsActiveString)
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.CompanyList = data;
          this.CompanyList = this.CompanyList.sort((a: any, b: any) => a.CompanyName.localeCompare(b.CompanyName));
          this.CompanyNameArray = this.f.CompanyName.valueChanges
            .pipe(startWith<string | ReimbursementInvoiceAddEditModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.CompanyName : null),
              map(CompanyName => CompanyName ? this.filterCompanyName(CompanyName) : this.CompanyList.slice()));
          this.chef.detectChanges();
        }
      }, (error: any) => {
        console.error(error);
        this.chef.detectChanges();
      });
  }

  // Autocomplete Search Filter
  private filterCompanyName(name: string): ReimbursementInvoiceAddEditModel[] {
    this.InvalidCompany = false;
    const filterValue = name.toLowerCase();
    return this.CompanyList.filter((option: any) => option.CompanyName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnCompanyName(name: ReimbursementInvoiceAddEditModel): string {
    return name && name.CompanyName ? name.CompanyName : '';
  }

  // Company Validation
  companyValidation() {
    this.submitted=false;
    if ((typeof this.f.CompanyName.value === 'string' || this.f.CompanyName.value === null || this.f.CompanyName.value === undefined )) {
      this.InvalidCompany = true;
    } else {
      this.InvalidCompany = false;
    }
    this.chef.detectChanges();
  }

  // On Change Company
  OnChangeCompany() {
    this.ChecValueFlag = false;
    this.isLoading = true;
    if (this.f.CompanyName.value !== "" && this.f.CompanyName.value !== undefined && this.f.CompanyName.value !== null) {
      this._AccountService.GetReimbursementInvById(this.BranchId, this.f.CompanyName.value.CompanyId, this.ReimId)
        .subscribe((data: any) => {
          if (data.length > 0) {
            this.DataSource.data = data;
            this.DataSource.paginator = this.paginator;
            this.DataSource.sort = this.Sort;
            if (this.selectedrows = data.filter((row: any) => (row.ReimId === this.ReimId && row.ReimId !== 0))) {
              for (let i = 0; i < this.selectedrows.length; i++) {
                this.ChecValueFlag = true;
              }
            }
          } else {
            this.DataSource.data = [];
            this.ChecValueFlag = false;
          }
          this.isLoading = false;
          this.chef.detectChanges();
        }, (error: any) => {
          console.error(error);
          this.isLoading = false;
          this.chef.detectChanges();
        });
    } else {
      this.DataSource.data = [];
      this.isLoading = false;
      this.updateAllSelectedState();
      this.ChecValueFlag = false;
      this.chef.detectChanges();
    }
  }

  // Check if any row is selected
  isIndeterminate(): boolean {
    const selectedCheckbox = this.selectedrows.length;
    const totalNoRows = this.DataSource.data.length;
    return selectedCheckbox > 0 && selectedCheckbox < totalNoRows;
  }

  // Update the state of "Select All" checkbox
  updateAllSelectedState(): void {
    if (this.selectedrows.length === this.DataSource.data.length) {
      this.ChecValueFlag = true;
    } else if (this.selectedrows.length === 0) {
      this.ChecValueFlag = false;
    } else {
      this.ChecValueFlag = false;
    }
  }

  //Check single check box Code
  getCheckboxesData(row: any, i: string) {
    this.check = document.getElementById('check' + i)
    var check = this.check.checked
    if (check === true) {
      if (this.selectedrows.length === 0) {
        var item = new matrowselected();
        item.ExpInvId = row.ExpInvId;
        item.TaxableAmt = row.TaxableAmt;
        item.TotalCGST = row.CGST;
        item.TotalSGST = row.SGST;
        this.selectedrows.push(item);
      }
      else if (this.selectedrows.length > 0 || this.selectedrows.find(x => x.ExpInvId === row.ExpInvId)) {
        var item = new matrowselected();
        item.ExpInvId = row.ExpInvId;
        item.TaxableAmt = row.TaxableAmt;
        item.TotalCGST = row.CGST;
        item.TotalSGST = row.SGST;
        this.selectedrows.push(item);
      }
    }
    else {
      var indexValue = this.selectedrows.findIndex(t => t.ExpInvId === row.ExpInvId);
      this.selectedrows.splice(indexValue, 1);
      this.ChecValueFlag = false;
    }
    this.TotalOfTaxableAmount(this.selectedrows);
    this.updateAllSelectedState();
    this.chef.detectChanges();
  }

  AllselectndUnselectCheckBox(event: any) {
    this.ChecValueFlag = event.target.checked;
    this.selectedrows = [];
    if (event.target.checked === true) {
      for (var i = 0; i < this.DataSource.data.length; i++) {
        var item = new matrowselected();
        item.ExpInvId = this.DataSource.data[i].ExpInvId;
        item.TaxableAmt = this.DataSource.data[i].TaxableAmt;
        item.TotalCGST = this.DataSource.data[i].CGST;
         item.TotalSGST =this.DataSource.data[i].SGST;
        this.selectedrows.push(item);
        (<HTMLInputElement>document.getElementById('check' + item.ExpInvId)).checked = true;
      }
    } else {
      for (var i = 0; i < this.DataSource.data.length; i++) {
        var indexValue = this.selectedrows.findIndex(t => t.ExpInvId === this.DataSource.data[i].ExpInvId);
        if (indexValue !== -1) {
          this.selectedrows.splice(indexValue, 1);
        }
        (<HTMLInputElement>document.getElementById('check' + this.DataSource.data[i].ExpInvId)).checked = false;
      }
    }
    this.TotalOfTaxableAmount(this.selectedrows);
  }

  // Calculate the sum of taxable amounts
  TotalOfTaxableAmount = (TaxableAmountData: any) => {
    this.TaxableAmountSum = 0;
    this.CGSTValue=0;
    this.SGSTValue=0;
    this.TotalCGSTValue = 0;
    this.TotalSGSTValue=0;
    for (let amt = 0; amt < TaxableAmountData.length; amt++) {
      this.TaxableAmountSum += TaxableAmountData[amt].TaxableAmt;
      if(TaxableAmountData[amt].TotalCGST !== undefined && TaxableAmountData[amt].TotalCGST !==0 && TaxableAmountData[amt].TotalSGST !== undefined && TaxableAmountData[amt].TotalSGST !==0){
        this.TotalCGSTValue += TaxableAmountData[amt].TotalCGST;
        this.TotalSGSTValue += TaxableAmountData[amt].TotalSGST;
      }
      else{
        this.TotalCGSTValue = 0;
        this.TotalSGSTValue = 0;
      }
    }
    this.CGSTValue=this.TotalCGSTValue.toFixed(2);
    this.SGSTValue=this.TotalSGSTValue.toFixed(2);
    this.f.TaxAmt.setValue(this.TaxableAmountSum);
    this.CGST = (this.CGSTValue / 100) * Number(this.f.TaxAmt.value);
    this.SGST = (this.SGSTValue / 100) * Number(this.f.TaxAmt.value) //toFixed(2) use for to show only 2 decimal value.
    this.f.CGST.setValue(this.CGST.toFixed(2));
    this.f.SGST.setValue(this.SGST.toFixed(2));
  };


  // To Get Rem. Inv Generate New No
  GetReimInvNo(BranchId: number, InvDate: Date) {
    this._AccountService.GetReimInvNo(BranchId, InvDate)
      .subscribe((data: any) => {
        this.f.InvNo.setValue(data);
        this.f.InvNo.disable();
      }, (error: any) => {
        console.error(error);
        this.chef.detectChanges();
      });
  }

  // To Get CGST & SGST
  // GetTaxMasterList() {
  //   this._service.getTaxList_Service()
  //     .subscribe((data: any) => {
  //       if (data.length > 0) {
  //         data.forEach((element: any) => {
  //           if (element.TaxName === "CGST") {
  //             this.f.CGST.disable();
  //             this.CGSTValue = element.TaxPercentage;
  //           } else if (element.TaxName === "SGST") {
  //             this.f.SGST.disable();
  //             this.SGSTValue = element.TaxPercentage;
  //           }
  //         });
  //       }
  //       this.chef.detectChanges();
  //     }, (error: any) => {
  //       console.error(error);
  //       this.chef.detectChanges();
  //     });
  // }

  // Get Expence Head
  GetExpenceHead() {
    this._service.GetGeneralMasterList_Service(AppCode.HeadType, AppCode.allString)
      .subscribe((data: any) => {
        this.ExpHeadList = data.GeneralMasterParameter;
        this.ExpHeadList = this.ExpHeadList.sort((a: any, b: any) => a.MasterName.localeCompare(b.MasterName));
        this.ExpHeadArray = this.f.ExpHead.valueChanges
          .pipe(startWith<string | ReimbursementInvoiceAddEditModel>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.MasterName : null),
            map(MasterName => MasterName ? this.filterExpHead(MasterName) : this.ExpHeadList.slice()));
        this.chef.detectChanges();
      }, (error: any) => {
        console.error(error);
        this.chef.detectChanges();
      });
  }

  // Autocomplete Search Filter
  private filterExpHead(name: string): ReimbursementInvoiceAddEditModel[] {
    this.InvalidExpHead = false;
    const filterValue = name.toLowerCase();
    return this.ExpHeadList.filter((option: any) => option.MasterName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnExpHead(name: ReimbursementInvoiceAddEditModel): string {
    return name && name.MasterName ? name.MasterName : '';
  }

  // Expence Head Validation
  ExpHeadValidation() {
    this.submitted=false;
    if ((typeof this.f.ExpHead.value === 'string' || this.f.ExpHead.value === null || this.f.ExpHead.value === undefined)) {
      this.InvalidExpHead = true;
    } else {
      this.InvalidExpHead = false;
    }
    this.chef.detectChanges();
  }

  // Edit/Update Reimbursment Invoice
  Setdata() {
    this.isLoading = true;
    let addReimbursment = this._SharedService.getData();
    if (addReimbursment !== undefined) {
      this.reimbursmentMsg = "Update Reimbursement Invoice";
      this.pageState = this.State.state;
      this.ReimId = addReimbursment.ReimId;
      this.f.InvNo.setValue(addReimbursment.InvNo);
      this.f.InvNo.disable();
      this.f.InvDate.setValue(addReimbursment.InvDate);
      // Company Name
      let CompanyModel = {
        "CompanyId": addReimbursment.CompanyId,
        "CompanyName": addReimbursment.CompanyName
      }
      this.f.CompanyName.setValue(CompanyModel);
      this.f.CompanyName.disable();
      // Expence Head
      let ExpeHeadModel = {
        "pkId": addReimbursment.ExpeHeadId,
        "MasterName": addReimbursment.ExpeHeadName
      }

      this.PaymentAmtDisableFlag = addReimbursment.PaymentAmt;
      this.f.ExpHead.setValue(ExpeHeadModel);
      this.f.TDSLess.setValue(addReimbursment.TDS)
      this.OnChangeCompany();
      this.f.TaxAmt.setValue(addReimbursment.TaxableAmt);
      this.f.TaxAmt.disable();
      this.f.CGST.setValue(addReimbursment.CGST);
      this.f.CGST.disable();
      this.f.SGST.setValue(addReimbursment.SGST);
      this.f.SGST.disable();
      this.f.TotalAmt.setValue(addReimbursment.TotalAmt);
      this.f.TotalAmt.disable();
      this.ReimbursementRemark = addReimbursment.Remark;
      this.isLoading = false;
      this.chef.detectChanges();
    } else {
      this.reimbursmentMsg = 'Reimbursement Invoice List';
      this.redirect();
    }
  }

  // On Taxable Amount values Calculate to Taxable Amount, CGST & SGST
  onTaxableAmount() {
    this.CGST = 0;
    this.SGST = 0;
    this.totalAmtValue = 0;
    if (this.f.TaxAmt.value === "0" || this.f.TaxAmt.value === 0 || this.f.TaxAmt.value === "-1" || this.f.TaxAmt.value === -1) {
      this.toastr.warning("Taxable Amount cannnot be added zero or minus values");
      this.f.TaxAmt.setValue('');
    } else if (this.f.TaxAmt.value !== "" && this.f.TaxAmt.value !== null && this.f.TaxAmt.value !== undefined) {
      this.CGST = (this.CGSTValue / 100) * Number(this.f.TaxAmt.value);
      this.SGST = (this.SGSTValue / 100) * Number(this.f.TaxAmt.value) //toFixed(2) use for to show only 2 decimal value.
      this.totalAmtValue = Number(this.f.TaxAmt.value) + Number(this.CGST.toFixed(2)) + Number(this.SGST.toFixed(2));
    }
    this.f.TotalAmt.setValue(this.totalAmtValue.toFixed(2));
    this.f.TotalAmt.disable();
    this.f.CGST.disable();
    this.f.SGST.disable();
    this.chef.detectChanges();
  }

  // To Save Reimbursment Invoice
  SaveReimbursmentInvoice() {
    this.submitted = true;
    this.isLoading = true;
    var arrExpInvId = [];
    if (!this.reimbursmentForm.valid) {
      this.isLoading = false;
      return;
    } else {
      if (this.InvalidCompany === false && this.InvalidExpHead === false) {
        this.reimbursementAddEditModel = new ReimbursementInvoiceAddEditModel();
        this.reimbursementAddEditModel.BranchId = this.BranchId;
        this.reimbursementAddEditModel.CompanyId = this.f.CompanyName.value.CompanyId;
        this.reimbursementAddEditModel.InvDate = AppCode.createDateAsUTC(new Date(this.f.InvDate.value));
        arrExpInvId.push(this.selectedrows);
        arrExpInvId.forEach((element: any) => {
          for (var i = 0; i < element.length; i++) {
            this.reimbursementAddEditModel.ExpInvIdstr += element[i].ExpInvId + ",";
          }
        });
        if (this.selectedrows.length === 0 || this.selectedrows.length === null || this.selectedrows.length === undefined) {
          this.toastr.warning('Please select at least one checkbox!');
          this.isLoading = false;
          return;
        }
        this.reimbursementAddEditModel.TaxableAmt = this.f.TaxAmt.value;
        this.reimbursementAddEditModel.CGST = this.f.CGST.value;
        this.reimbursementAddEditModel.SGST = this.f.SGST.value;
        this.reimbursementAddEditModel.TotalAmt = this.f.TotalAmt.value;
        this.reimbursementAddEditModel.ExpeHeadId = this.f.ExpHead.value.pkId;
        this.reimbursementAddEditModel.TDS = this.f.TDSLess.value;
        this.reimbursementAddEditModel.Remark = this.ReimbursementRemark;
        this.reimbursementAddEditModel.Addedby = String(this.UserId);
        if (this.pageState === AppCode.saveString) {
          this.reimbursementAddEditModel.ReimId = 0;
          this.reimbursementAddEditModel.Action = AppCode.addString;
        } else {
          this.reimbursementAddEditModel.ReimId = this.ReimId;
          this.reimbursementAddEditModel.Action = AppCode.editString;
        }
        this._AccountService.ReimbursementInvoiceAddEdit(this.reimbursementAddEditModel)
          .subscribe((data: any) => {
            if (data > 0) {
              this.ChecValueFlag = false;
              if (this.pageState === AppCode.saveString) {
                this.toastr.success(AppCode.msg_saveSuccess);
              } else {
                this.toastr.success(AppCode.msg_updateSuccess);
              }
              this.redirect();
            } else if (data === -1) {
              this.toastr.warning(AppCode.msg_exist);
            } else {
              this.toastr.error(AppCode.FailStatus);
            }
            this.isLoading = false;
            this.chef.detectChanges();
          }, (error: any) => {
            console.error(error);
            this.isLoading = false;
            this.chef.detectChanges();
          });
      }
    }
  }

  // Redirect to Reimbursement Invoice List
  redirect() {
    this.router.navigate(['/modules/account-module/reimbursment-invoice-list']);
  }

  // Only Number Allowed
  numberOnly(event: any) {
    this._appCode.numberOnly(event);
  }

}
