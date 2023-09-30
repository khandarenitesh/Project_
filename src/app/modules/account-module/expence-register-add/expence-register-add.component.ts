import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { AppCode } from 'src/app/app.code';
import { Observable } from 'rxjs';
import { VendorModel } from '../../master-forms/Models/VendorModel';
import { map, startWith } from 'rxjs/operators';
import { TransporterParentModel } from '../../master-forms/Models/TransporterModel';
import { ExpHeadModal } from '../../master-forms/head-master/head-master.component';
import { ExpInvModel, GSTTypeModel } from '../models/ExpInvModel';
import { AccountModuleService } from '../Services/account-module.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/SharedServices/shared.service';
import { CompanyList } from '../../master-forms/Models/CompanyList';
import { CourierParentModel, courierList } from '../../master-forms/Models/courierList';

@Component({
  selector: 'app-expence-register-add',
  templateUrl: './expence-register-add.component.html',
  styleUrls: ['./expence-register-add.component.scss']
})
export class ExpenceRegisterAddComponent implements OnInit {

  Title: string = "Add Expense Invoice";
  pageState: string = 'Save';
  ExpInvForm: FormGroup;
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  VendorList: any[];
  VendorfilteredList: Observable<VendorModel[]>;
  InvalidVendor: boolean = false;
  InvalidTrans: boolean = false;
  InvalidCourier: boolean = false;
  TransporterList: any[];
  FilteredTransporter: Observable<TransporterParentModel[]>;
  CourierList: any[];
  FilteredCourier: Observable<CourierParentModel[]>;
  HeadList: any[];
  InValidHead: boolean = false;
  FilteredHead: Observable<ExpHeadModal[]>;
  InvType: number = 1;
  maxDate = new Date();
  minDate = new Date();
  submitted: boolean = false;
  CompanyList: any[];
  Companyfilterlist: Observable<CompanyList[]>;
  InvalidCompany: boolean = false;
  TaxList: any[];
  CGSTper: number;
  SGSTper: number;
  ExpInvModel: ExpInvModel;
  ExpInvId: number = 0;
  GSTTypeList: any = [];
  GSTTypeNameArray: Observable<GSTTypeModel[]>;
  InvalidGSTType: boolean = false;
  TaxId: number = 0;
  IsGSTFlag: boolean = false;
  currentDate = new Date();

  State: any = {
    state: ''
  };

  defaultform: any = {
    InvType: '',
    VendorName: '',
    TransName: '',
    Courier: '',
    InvNo: '',
    InvDate: '',
    Company: '',
    ExpHead: '',
    GSTType: '',
    NoOfBox: '',
    FromDate: '',
    ToDate: '',
    IsGST: '',
    TaxableAmt: '',
    CGST: '',
    SGST: '',
    TotAmt: '',
    IsReimb: ''
  };

  constructor(
    private fb: FormBuilder,
    private _MastersService: MastersServiceService,
    private chRef: ChangeDetectorRef,
    private _AccountService: AccountModuleService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private _SharedService: SharedService,
    private router: Router,
    private commoncode: AppCode,    
  ) { this.currentDate = new Date();}


  ngOnInit(): void {
    this.initForm();
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.GetVendorList();
    this.GetTransporterList();
    this.GetExpenseHeadList();
    this.GetCompanyList();
    // this.GetTaxList();
    this.GetCourierList();
    this.GetGSTTypeList(this.TaxId)
    this.f.InvDate.setValue(this.currentDate);
    this.route.queryParams.subscribe(params => {
      this.State = params;
    })
    if (this.State.state !== undefined && this.State.state !== null) {
      this.Setdata();
    }
  }

  // form controls
  initForm() {
    this.ExpInvForm = this.fb.group({
      InvType: [
        this.defaultform.InvType,
        Validators.compose([
          Validators.required
        ]),
      ],
      VendorName: [
        this.defaultform.VendorName,
        Validators.compose([
          Validators.required
        ]),
      ],
      TransName: [
        this.defaultform.TransName,
        Validators.compose([
          Validators.required
        ]),
      ],
      Courier: [
        this.defaultform.Courier,
        Validators.compose([
          Validators.required
        ]),
      ],
      InvNo: [
        this.defaultform.InvNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
        ]),
      ],
      InvDate: [
        this.defaultform.InvDate,
        Validators.compose([
          Validators.required
        ]),
      ],
      Company: [
        this.defaultform.Company,
        Validators.compose([
          Validators.required
        ])
      ],
      ExpHead: [
        this.defaultform.ExpHead,
        Validators.compose([
          Validators.required
        ]),
      ],
      NoOfBox: [
        this.defaultform.NoOfBox,
        Validators.compose([
          Validators.maxLength(10)
        ])
      ],
      FromDate: [
        this.defaultform.FromDate,
        Validators.compose([
          Validators.required
        ]),
      ],
      ToDate: [
        this.defaultform.ToDate,
        Validators.compose([
          Validators.required
        ]),
      ],
      IsGST: [this.defaultform.IsGST],
      GSTType: [
        this.defaultform.GSTType,
        Validators.compose([
          Validators.required
        ]),
      ],
      TaxableAmt: [
        this.defaultform.TaxableAmt,
        Validators.compose([
          Validators.required,
          Validators.maxLength(10)
        ])
      ],
      CGST: [
        { value: '', disabled: true },
        this.defaultform.CGST,
      ],
      SGST: [
        { value: '', disabled: true },
        this.defaultform.SGST
      ],
      TotAmt: [
        { value: '', disabled: true },
        this.defaultform.TotAmt
      ],
      IsReimb: [
        this.defaultform.IsReimb,
        { value: false }
      ]
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.ExpInvForm.controls;
  }

  // Get Vendor List
  GetVendorList() {
    this.isLoading = true;
    this._MastersService.getVendorList_Service(this.BranchId, this.CompanyId, AppCode.IsActiveString).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.VendorList = data;
        this.VendorList = this.VendorList.sort((a: any, b: any) => a.VendorName.localeCompare(b.VendorName));
        this.VendorfilteredList = this.f.VendorName.valueChanges
          .pipe(
            startWith<string | VendorModel>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.VendorName : null),
            map(VendorName => VendorName ? this.filterVendor(VendorName) : this.VendorList.slice())
          );
        this.isLoading = false;
        this.chRef.detectChanges();
      } else {
        this.isLoading = false;
        this.chRef.detectChanges();
      }
    });
  }

  filterVendor(Vendor: string) {
    this.InvalidVendor = false;
    const filterValue = Vendor.toLowerCase();
    return this.VendorList.filter((option: any) =>
      option.VendorName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnCity(Vendor: VendorModel): string {
    return Vendor && Vendor.VendorName ? Vendor.VendorName : '';
  }

  VendorValidation(Vendor: any) {
    this.submitted = false;
    if ((this.f.VendorName.value.VendorId === '' || this.f.VendorName.value.VendorId === null || this.f.VendorName.value.VendorId === undefined)) {
      this.InvalidVendor = true;
      return;
    } else {
      this.InvalidVendor = false;
    }
    this.chRef.detectChanges();
  }

  SetVenGST(Vendor: VendorModel) {
    if ((this.f.VendorName.value !== '' && this.f.VendorName.value !== null && this.f.VendorName.value !== undefined)) {
      if (Vendor.IsGST == 'Y') {
        this.f.IsGST.setValue(true);
      }
    }
  }

  // Get Transporter No. and Transporter Name
  GetTransporterList() {
    this._MastersService.GetTransporterParentList_Service(this.BranchId, AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.TransporterList = data;

          this.TransporterList = this.TransporterList.sort((a: any, b: any) => a.ParentTranspName.localeCompare(b.TransporterName));
          this.FilteredTransporter = this.f.TransName.valueChanges
            .pipe(
              startWith<string | TransporterParentModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.ParentTranspName : null),
              map(ParentTranspName => ParentTranspName ? this.filterTransporter(ParentTranspName) : this.TransporterList.slice())
            );
          this.isLoading = false;
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
          this.chRef.detectChanges();
        }
      );
  }

  filterTransporter(Transporter: string) {
    this.InvalidTrans = false;
    const filterValue = Transporter.toLowerCase();
    return this.TransporterList.filter((option: any) =>
      option.ParentTranspName.toLocaleLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  DisplayTransporterName(TrnsptrName: TransporterParentModel): string {
    return TrnsptrName && TrnsptrName.ParentTranspName ? TrnsptrName.ParentTranspName : '';
  }

  TransporterValidation() {
    this.submitted = false;
    if ((this.f.TransName.value.ParentTranspName === null || this.f.TransName.value.ParentTranspName === "" || this.f.TransName.value.ParentTranspName === undefined)) {
      this.InvalidTrans = true;
    } else {
      this.InvalidTrans = false;
    }
  }

  SetTransGST(Transporter: TransporterParentModel) {
    if (this.f.TransName.value !== null && this.f.TransName.value !== "" && this.f.TransName.value !== undefined) {
      if (Transporter.IsGST == 'Y') {
        this.f.IsGST.setValue(true);
        this.IsGSTFlag = true;
      }
      else {
        this.IsGSTFlag = false;
      }
    }
  }

  // Get Courier List
  GetCourierList() {
    this._MastersService.GetParentCourierList_Service(this.BranchId, AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.CourierList = data;

          this.CourierList = this.CourierList.sort((a: any, b: any) => a.ParentCourierName.localeCompare(b.ParentCourierName));
          this.FilteredCourier = this.f.Courier.valueChanges
            .pipe(
              startWith<string | CourierParentModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.ParentCourierName : null),
              map(ParentCourierName => ParentCourierName ? this.filterCourier(ParentCourierName) : this.CourierList.slice())
            );
          this.isLoading = false;
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
          this.chRef.detectChanges();
        }
      );
  }

  filterCourier(Courier: string) {
    this.InvalidCourier = false;
    const filterValue = Courier.toLowerCase();
    return this.CourierList.filter((option: any) =>
      option.ParentCourierName.toLocaleLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  DisplayCourierName(Courier: CourierParentModel): string {
    return Courier && Courier.ParentCourierName ? Courier.ParentCourierName : '';
  }

  CourierValidation() {
    this.submitted = false;
    if ((this.f.Courier.value.Cpid === "" || this.f.Courier.value.Cpid === null || this.f.Courier.value.Cpid === undefined)) {
      this.InvalidCourier = true;
    } else {
      this.InvalidCourier = false;
    }
  }

  SetCourGST(Courier: CourierParentModel) {
    if ((this.f.Courier.value !== "" && this.f.Courier.value !== null && this.f.Courier.value !== undefined)) {
      if (Courier.IsGST == 'Y') {
        this.f.IsGST.setValue(true);
      }
    }
  }

  // Get Expense head
  GetExpenseHeadList() {
    this.isLoading = true;
    this._MastersService.GetHeadMasterList_Service(this.BranchId).subscribe((data: any) => {
      if (data.length > 0) {
        this.HeadList = data;

        this.HeadList = this.HeadList.sort((a: any, b: any) => a.HeadName.localeCompare(b.HeadName));
        this.FilteredHead = this.f.ExpHead.valueChanges
          .pipe(
            startWith<string | ExpHeadModal>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.HeadName : null),
            map(HeadName => HeadName ? this.filterHead(HeadName) : this.HeadList.slice())
          );
        this.isLoading = false;
        this.chRef.detectChanges();
      } else {
        this.isLoading = false;
        this.chRef.detectChanges();
      }
    });
  }

  filterHead(HeadName: string) {
    this.InValidHead = false;
    const filterValue = HeadName.toLowerCase();
    return this.HeadList.filter((option: any) =>
      option.HeadName.toLocaleLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  DisplayHead(Name: ExpHeadModal): string {
    return Name && Name.HeadName ? Name.HeadName : '';
  }

  HeadValidation() {
    this.submitted = false;
    if ((typeof this.f.ExpHead.value ==='string' || this.f.ExpHead.value === null || this.f.ExpHead.value === undefined)) {
      this.InValidHead = true;
    } else {
      this.InValidHead = false;
    }
  }

  onTypeChange() {
    let val = this.f.InvType.value;
    if (val !== '' || val !== undefined || val !== null) {
      if (val == 1) {
        this.InvType = 1;
        this.f.VendorName.setValue('');
        this.f.IsReimb.setValue(true);
        this.f.TransName.setValidators([Validators.required]);
        this.f.TransName.updateValueAndValidity();
        this.f.FromDate.setValidators([Validators.required]);
        this.f.FromDate.updateValueAndValidity();
        this.f.ToDate.setValidators([Validators.required]);
        this.f.ToDate.updateValueAndValidity();
        this.f.VendorName.clearValidators();
        this.f.VendorName.setErrors(null);
        this.f.VendorName.setValidators(null);
        this.f.VendorName.updateValueAndValidity();
        this.f.Courier.clearValidators();
        this.f.Courier.setValidators(null);
        this.f.Courier.setErrors(null);
        this.f.Courier.updateValueAndValidity();
      }
      else if (val == 2) {
        this.InvType = 2;
        this.f.TransName.setValue('');
        this.f.IsReimb.setValue(false);
        this.f.VendorName.setValidators([Validators.required]);
        this.f.VendorName.updateValueAndValidity();
        this.f.TransName.clearValidators();
        this.f.TransName.setErrors(null);
        this.f.TransName.setValidators(null);
        this.f.TransName.updateValueAndValidity();
        this.f.FromDate.clearValidators();
        this.f.FromDate.setValidators(null);
        this.f.FromDate.setErrors(null);
        this.f.FromDate.updateValueAndValidity();
        this.f.ToDate.clearValidators();
        this.f.ToDate.setValidators(null);
        this.f.ToDate.setErrors(null);
        this.f.ToDate.updateValueAndValidity();
        this.f.Courier.clearValidators();
        this.f.Courier.setValidators(null);
        this.f.Courier.setErrors(null);
        this.f.Courier.updateValueAndValidity();
      }
      else {
        this.InvType = 3;
        this.f.VendorName.setValue('');
        this.f.IsReimb.setValue(true);
        this.f.Courier.setValidators([Validators.required]);
        this.f.Courier.updateValueAndValidity();
        this.f.TransName.clearValidators();
        this.f.TransName.setErrors(null);
        this.f.TransName.setValidators(null);
        this.f.TransName.updateValueAndValidity();
        this.f.FromDate.setValidators([Validators.required]);
        this.f.FromDate.updateValueAndValidity();
        this.f.ToDate.setValidators([Validators.required]);
        this.f.ToDate.updateValueAndValidity();
        this.f.VendorName.clearValidators();
        this.f.VendorName.setErrors(null);
        this.f.VendorName.setValidators(null);
        this.f.VendorName.updateValueAndValidity();
      }
    }
  }

  mindateval() {
    this.minDate = this.f.FromDate.value;
  }

  GetCompanyList() {
    this._MastersService.getCompanyList_Service(AppCode.allString)
      .subscribe(
        (data: any) => {
          this.CompanyList = data;
          this.CompanyList = this.CompanyList.sort((a: any, b: any) => a.CompanyName.localeCompare(b.CompanyName));
          this.Companyfilterlist = this.f.Company.valueChanges
            .pipe(
              startWith<string | CompanyList>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.CompanyName : null),
              map(CompanyName => CompanyName ? this.filterCompanyName(CompanyName) : this.CompanyList.slice())
            );
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  numberValidation(event: any) {
    this.commoncode.OnlyNumbersAllow(event);
  }
  // Autocomplete Search Filter
  private filterCompanyName(name: string): CompanyList[] {
    this.InvalidCompany = false;
    const filterValue = name.toLowerCase();
    return this.CompanyList.filter((option: any) =>
      option.CompanyName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnCompanyName(name: CompanyList): string {
    return name && name.CompanyName ? name.CompanyName : '';
  }

  companyValidation() {
    this.submitted = false;
    if ((this.f.Company.value.CompanyId === null || this.f.Company.value.CompanyId === '' || this.f.Company.value.CompanyId === undefined)) {
      this.InvalidCompany = true;
    } else {
      this.InvalidCompany = false;
    }
  }

  TaxCal() {
    let taxamt = this.f.TaxableAmt.value;
    if (this.f.IsGST.value == false) {
      this.f.CGST.setValue('');
      this.f.SGST.setValue('');
      this.f.TotAmt.setValue(taxamt);
    }
    else {
      if (this.f.TaxableAmt.value !== '') {
        let CGST = ((this.CGSTper / 100) * Number(taxamt)).toFixed(2);
        this.f.CGST.setValue(CGST);
        let SGST = ((this.SGSTper / 100) * Number(taxamt)).toFixed(2);
        this.f.SGST.setValue(SGST);
        let TotAmt = (Number(taxamt) + Number(CGST) + Number(SGST)).toFixed(2);
        this.f.TotAmt.setValue(TotAmt);
      }
    }
  }
  SelectGST(event: any) {
    if (event.checked === true) {
      this.IsGSTFlag = true;
      this.f.GSTType.enable();
      if (this.pageState !== 'Save') {
        if (this.ExpInvModel.isGSTApply == 'Y') {
          this.f.IsGST.setValue(true);
          this.IsGSTFlag = true;
          let GstTypeVal: any = {
            'TaxId': this.ExpInvModel.TaxId,
            'GSTType': this.ExpInvModel.GSTType
          }
          this.f.GSTType.setValue(GstTypeVal);
          this.f.GSTType.enable();
        }
        else if (this.ExpInvModel.isGSTApply == 'N') {
          this.f.IsGST.setValue(true);
          this.IsGSTFlag = true;
          this.f.GSTType.enable();
        }
        else {
          this.f.IsGST.setValue(false);
          this.IsGSTFlag = false;
          this.f.GSTType.disable();
        }
      }
    } else {
      this.IsGSTFlag = false;
      this.f.GSTType.disable();
    }
  }

  ClearAll(){
    this.f.InvType.setValue('');
    this.f.VendorName.setValue('');
    this.f.TransName.setValue('');
    this.f.Courier.setValue('');
    this.f.InvNo.setValue('');
    this.f.InvDate.setValue(this.currentDate = new Date());
    this.f.Company.setValue('');
    this.f.ExpHead.setValue('');
    this.f.GSTType.setValue('');
    this.f.NoOfBox.setValue('');
    this.f.FromDate.setValue('');
    this.f.ToDate.setValue('');
    this.f.IsGST.setValue('');
    this.f.TaxableAmt.setValue('');
    this.f.CGST.setValue('');
    this.f.SGST.setValue('');
    this.f.TotAmt.setValue('');
    this.f.IsReimb.setValue('');
  }
  
  redirect() {
    this.ClearAll();
    this.router.navigate(['/modules/account-module/expence-register']);
    this.chRef.detectChanges();
  }

  SaveExpInv() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.ExpInvForm.valid) {
      return;
    } else {
      this.ExpInvModel = new ExpInvModel();
      this.ExpInvModel.ExpInvId = this.ExpInvId;
      this.ExpInvModel.BranchId = this.BranchId;
      this.ExpInvModel.InvTypeId = this.f.InvType.value;
      this.ExpInvModel.VendorId = this.f.VendorName.value.VendorId;
      this.ExpInvModel.TransId = this.f.TransName.value.Tid;
      this.ExpInvModel.CourierId = this.f.Courier.value.Cpid;
      this.ExpInvModel.ExpInvNo = this.f.InvNo.value;
      this.ExpInvModel.FromDate = AppCode.createDateAsUTC(new Date(this.f.FromDate.value));
      this.ExpInvModel.ToDate = AppCode.createDateAsUTC(new Date(this.f.ToDate.value));
      this.ExpInvModel.InvDate = AppCode.createDateAsUTC(new Date(this.f.InvDate.value));
      this.ExpInvModel.CompId = this.f.Company.value.CompanyId;
      this.ExpInvModel.ExpHeadId = this.f.ExpHead.value.pkId;
      this.ExpInvModel.NoOfBox = this.f.NoOfBox.value;
      if (this.f.InvType.value == 2) {
        this.ExpInvModel.ExpInvStatus = 2;
      }
      else {
        this.ExpInvModel.ExpInvStatus = 0;
      }
      if (this.f.IsGST.value == true) {
        this.ExpInvModel.isGSTApply = 'Y';
        this.ExpInvModel.TaxId = this.f.GSTType.value.TaxId;
      }
      else {
        this.ExpInvModel.isGSTApply = 'N';
        this.ExpInvModel.TaxId = 0;
      }
      this.ExpInvModel.TaxableAmt = this.f.TaxableAmt.value;
      this.ExpInvModel.CGST = this.f.CGST.value;
      this.ExpInvModel.SGST = this.f.SGST.value;
      this.ExpInvModel.TotalAmt = this.f.TotAmt.value;
      this.ExpInvModel.AddedBy = this.UserId;
      if (this.f.IsReimb.value == true) {
        this.ExpInvModel.IsReimbursable = 'Y';
      }
      else {
        this.ExpInvModel.IsReimbursable = 'N';
      }

      if (this.pageState == AppCode.saveString) {
        this.ExpInvModel.Action = AppCode.addString;
      }
      else {
        this.ExpInvModel.Action = AppCode.editString;
      }
      this._AccountService.SaveExpInv_Service(this.ExpInvModel)
        .subscribe((data: any) => {
          if (data > 0) {
            if (this.pageState == AppCode.saveString) {
              this.toaster.success(AppCode.msg_saveSuccess);
            } else {
              this.toaster.success(AppCode.msg_updateSuccess);
            }
            this.redirect();
          } else if (data === -1) {
            this.toaster.warning(AppCode.msg_exist);
            this.isLoading = false;
            this.chRef.detectChanges();
          } else {
            this.toaster.error(data);
          }
        },
          (error) => {
            console.error(error);
          });
    }
  }

  Setdata() {
    this.Title = "Update Invoice";
    this.pageState = this.State.state;
    this.ExpInvModel = new ExpInvModel();
    this.ExpInvModel = this._SharedService.getData();
    this.ExpInvId = this.ExpInvModel.ExpInvId;
    if (this.ExpInvModel !== undefined) {
      this.BranchId = this.ExpInvModel.BranchId;
      if (this.ExpInvModel.InvTypeId == 1) {
        this.InvType = 1;
        let Trans: any = {
          'Tid': this.ExpInvModel.TransId,
          'ParentTranspName': this.ExpInvModel.TransName
        }
        this.f.TransName.setValue(Trans);
      }
      else if (this.ExpInvModel.InvTypeId == 2) {
        this.InvType = 2;
        let Vendor: any = {
          'VendorId': this.ExpInvModel.VendorId,
          'VendorName': this.ExpInvModel.VendorName
        }
        this.f.VendorName.setValue(Vendor);
      }
      else {
        this.InvType = 3;
        let Courier: any = {
          'Cpid': this.ExpInvModel.CourierId,
          'ParentCourierName': this.ExpInvModel.CourierName
        }
        this.f.Courier.setValue(Courier);
      }
      this.f.InvType.setValue(this.ExpInvModel.InvTypeId);
      this.f.InvNo.setValue(this.ExpInvModel.ExpInvNo);
      this.f.InvDate.setValue(this.ExpInvModel.InvDate);
      let Comp: any = {
        'CompanyId': this.ExpInvModel.CompId,
        'CompanyName': this.ExpInvModel.CompanyName
      }
      this.f.Company.setValue(Comp);
      let ExpHead: any = {
        'pkId': this.ExpInvModel.ExpHeadId,
        'HeadName': this.ExpInvModel.ExpHeadName
      }
      this.f.ExpHead.setValue(ExpHead);
      this.f.NoOfBox.setValue(this.ExpInvModel.NoOfBox);
      this.f.FromDate.setValue(this.ExpInvModel.FromDate);
      this.minDate = this.ExpInvModel.FromDate;
      this.f.ToDate.setValue(this.ExpInvModel.ToDate);
      this.f.IsGST.setValue(this.ExpInvModel.isGSTApply);
      if (this.ExpInvModel.isGSTApply == 'Y') {
        this.f.IsGST.setValue(true);
        this.IsGSTFlag = true;
        let GstTypeVal: any = {
          'TaxId': this.ExpInvModel.TaxId,
          'GSTType': this.ExpInvModel.GSTType
        }
        this.f.GSTType.setValue(GstTypeVal);
      }
      else {
        this.f.IsGST.setValue(false);
        this.IsGSTFlag = false;
      }
      this.f.TaxableAmt.setValue(this.ExpInvModel.TaxableAmt);
      this.f.CGST.setValue(this.ExpInvModel.CGST);
      this.f.SGST.setValue(this.ExpInvModel.SGST);
      this.f.TotAmt.setValue(this.ExpInvModel.TotalAmt);
      if (this.ExpInvModel.IsReimbursable == 'Y') {
        this.f.IsReimb.setValue(true);
      }
      else {
        this.f.IsReimb.setValue(false);
      }
      this.onTypeChange();
      this.chRef.detectChanges();
    }
    else {
      this.redirect();
    }
  }
  // Get Bank List
  GetGSTTypeList(TaxId: number) {
    this._MastersService.GetGSTTypeList_Service(TaxId)
      .subscribe(
        (data: any) => {
          this.GSTTypeList = data.GSTType;
          this.GSTTypeList = this.GSTTypeList.sort((a: any, b: any) => a.GSTType.localeCompare(b.GSTType));
          this.GSTTypeNameArray = this.f.GSTType.valueChanges
            .pipe(
              startWith<string | GSTTypeModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.GSTType : null),
              map(GSTType => GSTType ? this.filterGSTTypeName(GSTType) : this.GSTTypeList.slice())
            );
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }
  // Autocomplete Search Filter
  private filterGSTTypeName(name: string): GSTTypeModel[] {
    this.InvalidGSTType = false;
    const filterValue = name.toLowerCase();
    return this.GSTTypeList.filter((option: any) =>
      option.GSTType.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnGSTTypeName(name: GSTTypeModel): string {
    return name && name.GSTType ? name.GSTType : '';
  }

  GSTTypeValidation() {
    this.submitted = false;
    if ((typeof this.f.GSTType.value === 'string' || this.f.GSTType.value === null || this.f.GSTType.value === undefined)) {
      this.InvalidGSTType = true;
      return;
    } else {
      this.InvalidGSTType = false;
    }
    this.chRef.detectChanges();
  }
  SetGSTValue(name: GSTTypeModel) {
    if ((this.f.GSTType.value.GSTType !== null && this.f.GSTType.value.GSTType !== "" && this.f.GSTType.value.GSTType !== undefined)) {
      if (name.GSTType == this.f.GSTType.value.GSTType) {
        this.CGSTper = name.CGST;
        this.SGSTper = name.SGST
        this.TaxCal();
      }
    }
  }
}
