import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountModuleService } from '../Services/account-module.service';
import { InvCommisionModel } from '../models/inv-commision-model.model';
import { Observable } from 'rxjs';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { AppCode } from 'src/app/app.code';
import { startWith, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../SharedServices/shared.service';
import { formatDate } from '@angular/common';
import { TaxModel } from '../../master-forms/Models/TaxModel';

@Component({
  selector: 'app-add-comssion-invoice',
  templateUrl: './add-comssion-invoice.component.html',
  styleUrls: ['./add-comssion-invoice.component.scss']
})
export class AddComssionInvoiceComponent implements OnInit {

  //Declaration
  ComInvoiceForm: FormGroup;
  BranchId: number = 0;
  CompanyId: number = 0;
  UserId: number = 0;
  totalAmtValue: number = 0;
  submitted: boolean = false;
  InvalidInvCom: boolean = false;
  isLoading: boolean = false;
  InvalidCompany: boolean = false;
  InvalidInvType: boolean = false;
  invcommisiomModel: InvCommisionModel;
  InvTypeArray: Observable<InvCommisionModel[]>;
  CompanyNameArray: Observable<InvCommisionModel[]>;
  filteredOptInvType: Observable<InvCommisionModel[]>;
  currentDate = new Date();
  maxDate = new Date();
  InvTypeList: any = [];
  CompanyList: any[] = [];
  selectedCompanyList: any[] = [];
  btnCancelText: string = '';
  pageState: string = '';
  CommInvoiceMsg: string = '';
  checkStatus: any
  TodayDateForFilter: any;
  ComInvId: number = 0;
  CGSTValue: any;
  SGSTValue: any;
  CGST: number = 0;
  SGST: number = 0;
  TaxTypeList: any[];
  GSTTypeFilterList: Observable<TaxModel[]>;
  InvalidTaxType: boolean = false;

  //Default Form
  defaultform: any = {
    InvoiceNumber: '',
    InvoiceDate: '',
    InvType: '',
    CompanyName: '',
    CompanyAddress: '',
    Description: '',
    CompanyCity: '',
    TaxableAmount: '',
    CGST: '',
    SGST: '',
    TotalAmt: '',
    TaxType: '',
  };
  State: any = {
    state: '',
  };

  constructor(private fb: FormBuilder, private _service: AccountModuleService, private _services: MastersServiceService,
    private chRef: ChangeDetectorRef, private router: Router, private toaster: ToastrService, private route: ActivatedRoute, private commoncode: AppCode,
    private _SharedService: SharedService) {
    this.currentDate = new Date();
  }

  //Page Load
  ngOnInit(): void {
    this.CommInvoiceMsg = 'Add Commission Invoice';
    this.pageState = AppCode.saveString;
    this.btnCancelText = AppCode.cancelString;
    let obj = AppCode.getUser();
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.UserId = obj.UserId;
    this.initForm();
    this.TodayDateForFilter = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
    this.f.InvoiceDate.setValue(this.currentDate);
    this.GetTaxMasterList();
    this.GetCompanyList();
    this.GetGeneralMasterList();
    this.GetTaxTypeList();
    this.route.queryParams.subscribe((params) => {
      this.State = params;
    });
    if (this.State.state !== undefined && this.State.state !== null) {
      this.Setdata();
    } else {
      this.GetCommInvoiceNewNo(this.BranchId, this.TodayDateForFilter);
    }

    //disable company city and company address or Total amount field
    this.f.CompanyAddress.disable();
    this.f.CompanyCity.disable();
    this.f.TotalAmt.disable();
  }


  get f(): { [key: string]: AbstractControl } {
    return this.ComInvoiceForm.controls;
  }

  // To Init Form
  initForm() {
    this.ComInvoiceForm = this.fb.group({
      InvoiceNumber: [
        this.defaultform.InvoiceNumber,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      InvoiceDate: [
        this.defaultform.InvoiceDate,
        Validators.compose([
          Validators.required,
        ]),
      ],
      InvType: [
        this.defaultform.InvType,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      CompanyName: [
        this.defaultform.CompanyName,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      CompanyCity: [this.defaultform.CompanyCity],
      CompanyAddress: [this.defaultform.CompanyAddress],
      Description: [this.defaultform.Description],
      TaxableAmount: [
        this.defaultform.TaxableAmount,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      CGST: [this.defaultform.CGST],
      SGST: [this.defaultform.SGST],
      TotalAmt: [this.defaultform.TotalAmt],
      TaxType: [this.defaultform.TaxType]
    })
  }

  // Edit/Update Commision Invoice
  Setdata() {
    this.isLoading = true;
    let invcommisiomModel = this._SharedService.getData();
    if (invcommisiomModel !== undefined) {
      this.CommInvoiceMsg = "Update Commission Invoice";
      this.pageState = this.State.state;
      this.ComInvId = invcommisiomModel.ComInvId;
      //Invoice Number
      this.f.InvoiceNumber.setValue(invcommisiomModel.InvNo);
      this.f.InvoiceNumber.disable();
      //Invoice Date
      this.f.InvoiceDate.setValue(invcommisiomModel.InvDate);
      //Invoice Type
      let InvTypeModel = {
        "pkId": invcommisiomModel.pkId,
        "MasterName": invcommisiomModel.InvType
      }
      this.f.InvType.setValue(InvTypeModel);

      // Company
      let CompanyModel = {
        "CompanyId": invcommisiomModel.CompanyId,
        "CompanyName": invcommisiomModel.CompanyName
      }
      this.f.CompanyName.setValue(CompanyModel);

      //Company Address
      this.f.CompanyAddress.setValue(invcommisiomModel.CompanyAddress);
      this.f.CompanyAddress.disable();

      //Description
      this.f.Description.setValue(invcommisiomModel.Discription);

      let TaxModel = {
        "TaxId": invcommisiomModel.TaxId,
        "GSTType": invcommisiomModel.GSTType,
      }
      this.f.TaxType.setValue(TaxModel);

      this.f.CompanyCity.setValue(invcommisiomModel.CityName);
      this.f.CompanyCity.disable();

      //Taxable Amt
      this.f.TaxableAmount.setValue(invcommisiomModel.TaxableAmt);

      this.f.CGST.setValue(invcommisiomModel.CGST);
      this.f.CGST.disable();
      this.f.SGST.setValue(invcommisiomModel.SGST);
      this.f.SGST.disable();
      this.f.TotalAmt.setValue(invcommisiomModel.TotalAmt);
      this.f.TotalAmt.disable();
      this.isLoading = false;
      this.chRef.detectChanges();
    } else {
      this.CommInvoiceMsg = 'Commission Invoice List';
      this.redirect();
    }

  }

  //To Get Commsion Invoice Number
  GetCommInvoiceNewNo(BranchId: number, TodayDateForFilter: Date) {
    this._service.GetCommInvGenerateNewNo(BranchId, TodayDateForFilter)
      .subscribe((data: any) => {
        this.f.InvoiceNumber.setValue(data);
        this.f.InvoiceNumber.disable();
      }, (error: any) => {
        console.error(error);
        this.chRef.detectChanges();
      });
  }

  // Get Invoice Type List
  GetGeneralMasterList() {
    this._services
      .GetGeneralMasterList_Service(AppCode.InvTypestring, AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.InvTypeList = data.GeneralMasterParameter;
          this.InvTypeList = this.InvTypeList.sort((a: any, b: any) => a.MasterName.localeCompare(b.MasterName));
          this.filteredOptInvType = this.f.InvType.valueChanges //formgroup
            .pipe(
              startWith<string | InvCommisionModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.MasterName : null),
              map(MasterName => MasterName ? this.filterInvType(MasterName) : this.InvTypeList.slice()
              )
            );
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  // Autocomplete Search Filter Invoice Type
  private filterInvType(name: string): InvCommisionModel[] {
    this.InvalidInvType = false;
    const filterValue = name.toLowerCase();
    return this.InvTypeList.filter((option: any) =>
      option.MasterName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnInvType(InvTypeName: InvCommisionModel): string {
    return InvTypeName && InvTypeName.MasterName ? InvTypeName.MasterName : '';
  }

  //Invoice Type Validation
  InvTypeValidation() {
    if ((typeof this.f.InvType.value === 'string' && this.f.InvType.value !== '')) {
      this.InvalidInvType = true;
      return;
    } else {
      this.InvalidInvType = false;
    }
    this.chRef.detectChanges();
  }

  // Get Company Name List
  GetCompanyList() {
    this._services.getCompanyList_Service(AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.CompanyList = data;
          this.CompanyList = this.CompanyList.sort((a: any, b: any) => a.CompanyName.localeCompare(b.CompanyName));
          this.CompanyNameArray = this.f.CompanyName.valueChanges
            .pipe(
              startWith<string | InvCommisionModel>(''),
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

  // On Company Change Comapany City and Company Address Bind
  OnChangeCompany() {
    this.isLoading = true;
    if (this.f.CompanyName.value !== null && this.f.CompanyName.value !== "") {
      let data = this.CompanyList.filter(x => x.CompanyId === this.f.CompanyName.value.CompanyId);
      this.f.CompanyCity.setValue(data[0].CityName);
      this.f.CompanyCity.disable();
      this.f.CompanyAddress.setValue(data[0].CompanyAddress);
      this.f.CompanyAddress.disable();
      this.chRef.detectChanges();
    } else {
      this.f.CompanyCity.setValue('');
      this.f.CompanyCity.disable();
      this.f.CompanyAddress.setValue('');
      this.f.CompanyAddress.disable();
    }
  }

  // Autocomplete Search Filter
  private filterCompanyName(name: string): InvCommisionModel[] {
    this.InvalidCompany = false;
    const filterValue = name.toLowerCase();
    return this.CompanyList.filter((option: any) =>
      option.CompanyName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnCompanyName(name: InvCommisionModel): string {
    return name && name.CompanyName ? name.CompanyName : '';
  }

  // Company Validtaion
  companyValidation() {
    this.submitted = false;
    if ((this.f.CompanyName.value.CompanyId === '' || this.f.CompanyName.value.CompanyId === undefined || this.f.CompanyName.value.CompanyId === null)) {
      this.InvalidCompany = true;
      return;
    } else {
      this.InvalidCompany = false;
    }
  }

  // Number validation
  numberValidation(event: any) {
    this.commoncode.numberOnly(event);
  }

  TaxCal() {
    let taxamt = this.f.TaxableAmount.value;
    if (taxamt === '') {
      this.f.CGST.setValue('');
      this.f.SGST.setValue('');
      this.f.TotalAmt.setValue(taxamt);
    }
    else {
      if (taxamt !== '') {
        let CGST = ((this.CGSTValue / 100) * Number(taxamt)).toFixed(2);
        this.f.CGST.setValue(CGST);
        let SGST = ((this.SGSTValue / 100) * Number(taxamt)).toFixed(2);
        this.f.SGST.setValue(SGST);
        let TotAmt = (Number(taxamt) + Number(CGST) + Number(SGST)).toFixed(2);
        this.f.TotalAmt.setValue(TotAmt);
      }
    }
  }

  // To Get Value of SGST And CGST
  GetTaxMasterList() {
    this.f.CGST.disable();
    this.f.SGST.disable();
    this._services.getTaxList_Service()
      .subscribe((data: any) => {
        if (data.length === 0) {
          this.toaster.warning('Please add a tax CGST and SGST from tax master');
          return;
        }
        else if (data.length > 0) {
          data.forEach((element: any) => {
            if (element.TaxName === "CGST") {
              this.f.CGST.disable();
              this.CGSTValue = element.TaxPercentage;
            } else if (element.TaxName === "SGST") {
              this.f.SGST.disable();
              this.SGSTValue = element.TaxPercentage;
            }
          });
        }
        this.chRef.detectChanges();
      }, (error: any) => {
        console.error(error);
        this.chRef.detectChanges();
      });
  }


  // Add Edit For the Commisio Invoice
  SaveCommInvoice() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.ComInvoiceForm.valid) {
      this.isLoading = false;
      return;
    }
    else {
      if (this.InvalidCompany === false && this.InvalidInvCom === false && this.InvalidInvType === false) {
        this.invcommisiomModel = new InvCommisionModel();
        this.invcommisiomModel.InvoiceNumber = this.f.InvoiceNumber.value;
        this.invcommisiomModel.InvoiceDate = AppCode.createDateAsUTC(new Date(this.f.InvoiceDate.value));
        this.invcommisiomModel.InvType = this.f.InvType.value.pkId;
        this.invcommisiomModel.CompanyId = this.f.CompanyName.value.CompanyId;
        this.invcommisiomModel.BranchId = this.BranchId;
        this.invcommisiomModel.CompanyAddress = this.f.CompanyAddress.value;
        this.invcommisiomModel.Description = this.f.Description.value;
        this.invcommisiomModel.TaxId = this.f.TaxType.value.TaxId;
        this.invcommisiomModel.CompanyCity = this.f.CompanyCity.value;
        this.invcommisiomModel.TaxableAmount = this.f.TaxableAmount.value;
        this.invcommisiomModel.CGST = this.f.CGST.value;
        this.invcommisiomModel.SGST = this.f.SGST.value;
        this.invcommisiomModel.TotalAmt = this.f.TotalAmt.value;
        this.invcommisiomModel.Addedby = String(this.UserId);
        if (this.pageState === AppCode.saveString) {
          this.invcommisiomModel.ComInvId = 0;
          this.invcommisiomModel.Action = AppCode.addString;
        } else {
          this.invcommisiomModel.ComInvId = this.ComInvId;
          this.invcommisiomModel.Action = AppCode.editString;
        }
        this._service.CommInvoiceAddEdit(this.invcommisiomModel).subscribe(
          (data: any) => {
            if (data === AppCode.SuccessStatus) {
              if (this.pageState === AppCode.saveString) {
                this.toaster.success(AppCode.msg_saveSuccess);
                this.submitted = false;
              } else {
                this.toaster.success(AppCode.msg_updateSuccess);
              }
              this.redirect();
            } else if (data === AppCode.ExistsStatus) {
              this.toaster.warning(AppCode.msg_exist);
              this.isLoading = false;
              this.chRef.detectChanges();
            } else {
              this.toaster.error(data);
              this.redirect();
            }
          },
          (error) => {
            console.error(error);
          });
      }
      else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
      }
    }

  }

  // Clear Form
  ClearForm() {
    this.f.InvoiceNumber.setValue('');
    this.f.InvoiceDate.setValue(this.currentDate = new Date());//Date
    this.f.InvType.setValue('');
    this.f.CompanyName.setValue('');
    this.f.CompanyAddress.setValue('');
    this.f.Description.setValue('');
    this.f.CompanyCity.setValue('');
    this.f.TaxableAmount.setValue('');
    this.f.CGST.setValue('');
    this.f.SGST.setValue('');
    this.f.TotalAmt.setValue('');
  }


  // Redirect to Add Commission List
  redirect() {
    this.ClearForm();
    this.router.navigate(['/modules/account-module/commsion-invoice-list']);
    this.GetCompanyList();
    this.chRef.detectChanges();
  }

  GetTaxTypeList() {
    this._services.getTaxList_Service()
      .subscribe(
        (data: any) => {
          this.TaxTypeList = data;
          this.TaxTypeList = this.TaxTypeList.sort((a: any, b: any) => a.GSTType.localeCompare(b.GSTType));
          this.GSTTypeFilterList = this.f.TaxType.valueChanges
            .pipe(
              startWith<string | TaxModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.GSTType : null),
              map(GSTType => GSTType ? this.filterTaxType(GSTType) : this.TaxTypeList.slice())
            );
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  // Autocomplete Search Filter
  private filterTaxType(name: string): TaxModel[] {
    this.InvalidTaxType = false;
    const filterValue = name.toLowerCase();
    return this.TaxTypeList.filter((option: any) =>
      option.GSTType.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnTaxType(name: TaxModel): string {
    return name && name.GSTType ? name.GSTType : '';
  }

  TaxTypeValidation() {
    this.submitted = false;
    if ((this.f.TaxType.value.TaxId === '' || this.f.TaxType.value.TaxId === undefined || this.f.TaxType.value.TaxId === null)) {
      this.InvalidTaxType = true;
    } else {
      this.InvalidTaxType = false;
    }
  }

  // On Change Tax Type CGST and SGST Value Bind
  // OnChangeTaxType() {
  //   this.isLoading = true;
  //   if (this.f.TaxType.value !== null && this.f.TaxType.value !== "") {
  //     let data = this.TaxTypeList.filter(x => x.TaxId === this.f.TaxType.value.TaxId)
  //     this.f.SGST.setValue(data[0].SGST);
  //     this.f.CGST.setValue(data[0].CGST);
  //     this.chRef.detectChanges();
  //   }
  //   else {
  //     this.f.SGST.setValue('');
  //     this.f.CGST.setValue('');

  //   }

  // }

  // On Change Tax Type CGST and SGST Value Bind
  SetGSTValue(name: TaxModel) {
    if ((this.f.TaxType.value.GSTType !== null && this.f.TaxType.value.GSTType !== "" && this.f.TaxType.value.GSTType !== undefined)) {
      //this.GetTaxTypeList(this.f.GSTType.value.TaxId)
      if (name.GSTType == this.f.TaxType.value.GSTType) {
        this.CGSTValue = name.CGST;
        this.SGSTValue = name.SGST
        this.TaxCal();
      }
    }
  }


}
