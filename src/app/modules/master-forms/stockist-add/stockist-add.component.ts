import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { AppCode } from '../../../app.code';
import { SharedService } from '../../../SharedServices/shared.service';
import { StockistModel } from '../Models/stockist-master';
import { MastersServiceService } from '../Services/masters-service.service';
import { ToastrService } from 'ngx-toastr';
import { BankModel } from '../Models/Bankmodel';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { startWith, map, filter } from 'rxjs/operators';
import { CustomErrorStateMatcher } from '../CustomErrorStateMatcher';
import { ToolbarComponent } from 'src/app/_metronic/layout/components/toolbar/toolbar.component';

export class BankModel1 {
  pkId: number = 0;
  MasterName: string = "";
}

@Component({
  selector: 'app-stockist-add',
  templateUrl: './stockist-add.component.html',
  styleUrls: ['./stockist-add.component.scss'],
  providers: [ToolbarComponent]
})
export class StockistAddComponent implements OnInit {
  ColumnsForBank = ['SrNo', 'BankName', 'AccountNumber', 'IFSCCode', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  StokistForm: FormGroup;
  BankForm: FormGroup;
  defaultform: any = {
    CustomerCode: '',
    CustomerName: '',
    Email: '',
    ContactNo: '',
    PANNo: '',
    GSTNo: '',
    City: '',
    // Location: '',
    Pin: '',
    Address: '',
    DLNo: '',
    DLExpiryDate: '',
    FoodLicNo: '',
    FoodLicExpiry: '',
    BankName: '',
    BankAccountNo: '',
    IFSCCode: '',
  };

  pageState: string = '';
  CityList: any = [];
  BankList: any = [];
  stockistmodel: StockistModel;
  Banks: BankModel[] = [];
  isLoading: boolean = false;
  UserId: number = 0;
  StockistId: number = 0;
  submitted = false;
  submittedBnk = false;
  IsEmailFlag: boolean = true;
  IsFlag: boolean = true;
  State: any = {
    state: ''
  };
  StockistMsg: string = "";
  BranchId: number = 0;
  CompanyId: number = 0;
  minDate = new Date();

  cityArray: Observable<StockistModel[]>;
  BankListArray: Observable<BankModel1[]>;
  InvalidCity: boolean = false;
  InvalidBankName: boolean = false;
  customErrorStateMatcherType: CustomErrorStateMatcher = new CustomErrorStateMatcher();
  IsInvalidMobile: boolean = false;
  IsInvalidPan: boolean = false;
  IsFlagGst: boolean = true;
  IsInvalidGSTNo: boolean = true;

  constructor(
    private fb: FormBuilder,
    private _service: MastersServiceService,
    private _SharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToastrService,
    private chef: ChangeDetectorRef,
    private _appCode: AppCode,
    private toolbarComponent: ToolbarComponent
  ) { }

  ngOnInit(): void {
    this.StockistMsg = "Add Stockist Master";
    this.pageState = AppCode.saveString;
    this.initForm();
    this.bankforminit();
    this.GetCityList();
    this.getBankList();
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.route.queryParams.subscribe(params => {
      this.State = params;
    })
    if (this.State.state !== undefined && this.State.state !== null) {
      this.Setdata();
    }
    this.CallToToolBarComponent();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.StokistForm.controls;
  }

  get b(): { [key: string]: AbstractControl } {
    return this.BankForm.controls;
  }

  initForm() {
    this.StokistForm = this.fb.group({
      CustomerCode: [
        this.defaultform.CustomerCode,
        Validators.compose([
          Validators.required,
          Validators.maxLength(25),
          this.noSpecialCharValidator,
          this.noZeroStartValidator
        ]),
      ],
      CustomerName: [
        this.defaultform.CustomerName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      Email: [
        this.defaultform.Email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(320),
        ]),
      ],
      ContactNo: [
        this.defaultform.ContactNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(22),
        ]),
      ],
      PANNo: [
        this.defaultform.PANNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10)
        ]),
      ],
      GSTNo: [
        this.defaultform.GSTNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(15),
        ]),
      ],
      City: [
        this.defaultform.City,
        Validators.compose([
          Validators.required
        ]),
      ],
      Pin: [
        this.defaultform.Pin,
      ],
      Address: [
        this.defaultform.Address,
      ],
      DLNo: [
        this.defaultform.DLNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(30),
        ]),
      ],
      DLExpiryDate: [
        this.defaultform.DLExpiryDate,
        Validators.compose([
          Validators.required,
        ]),
      ],
      FoodLicNo: [
        this.defaultform.FoodLicNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
        ]),
      ],
      FoodLicExpiry: [
        this.defaultform.FoodLicExpiry,
        Validators.compose([
          Validators.required
        ]),
      ]
    });
  }

  bankforminit() {
    this.BankForm = this.fb.group({
      BankName: [
        this.defaultform.BankName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      BankAccountNo: [
        this.defaultform.BankAccountNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      IFSCCode: [
        this.defaultform.IFSCCode,
        Validators.compose([
          Validators.maxLength(50),
        ]),
      ]
    })
  }

  public CallToToolBarComponent() {
    this.toolbarComponent.ngOnInit();
  }


  // Alpha Number
  GstValidation(event: any) {
    this._appCode.keyPressAlphanumeric(event);
  }

  // Validation Mobile No
  mobileNoValidation(event: any) {
    this._appCode.numberonlyandcomma(event);
  }

  // To Avoid Copy Paste For Mobile
  public CopyPasteMblNotSpelcharAllow() {
    let NewFlag: boolean = false;
    if (this.f.ContactNo.value === "") {
      this.IsInvalidMobile = false;
    }
    else {
      NewFlag = this._appCode.Copynumberonlyandcomma(this.f.ContactNo.value);
      if (NewFlag === true) {
        this.IsInvalidMobile = true;
      }
      else {
        this.IsInvalidMobile = false;
      }
      this.submitted = false;
      this.chef.detectChanges();
    }
  }

  //Copy Paste Pan CARD
  copyPastPanNumbeAllow() {
    let NewFlag: boolean = false;
    if (this.f.PANNo.value === "") {
      this.IsInvalidPan = false;
    }
    else {
      NewFlag = this._appCode.PanCradSplChNotAllow(this.f.PANNo.value);
      if (NewFlag === true) {
        this.IsInvalidPan = true
      }
      else {
        this.IsInvalidPan = false;
      }
      this.submitted = false;
      this.chef.detectChanges();
    }
  }

  //Copy Paste GST
  copyPastGSTNoNumbeAllow() {
    let NewFlag: boolean = false;
    if (this.f.GSTNo.value === "") {
      this.IsFlagGst = false;
      this.IsInvalidGSTNo = true;
    }
    else {
      NewFlag = this._appCode.GSTSplChNotAllow(this.f.GSTNo.value);
      if (NewFlag === true) {
        this.IsInvalidGSTNo = true
        this.IsFlagGst = true;
      }
      else {
        this.IsInvalidGSTNo = false;
        this.IsFlagGst = true;
      }
      this.submitted = false;
      this.chef.detectChanges();
    }
  }

  // Get Bank List
  getBankList() {
    this._service.GetGeneralMasterList_Service(AppCode.bankString, AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.BankList = data.GeneralMasterParameter;
          this.BankList = this.BankList.sort((a: any, b: any) => a.MasterName.localeCompare(b.MasterName));
          this.BankListArray = this.b.BankName.valueChanges
            .pipe(
              startWith<string | BankModel1>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.MasterName : null),
              map(MasterName => MasterName ? this.filterBank(MasterName) : this.BankList.slice())
            );
          this.chef.detectChanges();
        },
        (error) => {
          console.error(error);
          this.chef.detectChanges();
        }
      );
  }

  // Autocomplete Search Filter
  private filterBank(name: string): BankModel1[] {
    this.InvalidBankName = false;
    const filterValue = name.toLowerCase();
    return this.BankList.filter((option: any) =>
      option.MasterName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnBank(bnk: BankModel1): string {
    return bnk && bnk.MasterName ? bnk.MasterName : '';
  }

  // Get City List
  GetCityList() {
    this._service.getCityList_Service(AppCode.ststString, AppCode.allString, AppCode.CityActiveString)
      .subscribe(
        (data: any) => {
          this.CityList = data.GetCityParameter;
          this.CityList = this.CityList.sort((a: any, b: any) => a.CityName.localeCompare(b.CityName));
          this.cityArray = this.f.City.valueChanges
            .pipe(
              startWith<string | StockistModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.CityName : null),
              map(CityName => CityName ? this.filterCity(CityName) : this.CityList.slice())
            );
          this.chef.detectChanges();
        },
        (error) => {
          console.error(error);
          this.chef.detectChanges();
        }
      );
  }

  // Autocomplete Search Filter
  private filterCity(name: string): StockistModel[] {
    this.InvalidCity = false;
    const filterValue = name.toLowerCase();
    return this.CityList.filter((option: any) =>
      option.CityName.toLowerCase().includes(filterValue) ||
      option.CityCode.toLocaleLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnCity(city: StockistModel): string {
    return city && city.CityName ? city.CityName : '';
  }

  bankValidation() {
    if (!this.BankForm.valid) {
      if ((this.b.BankName.value.pkId === "" || this.b.BankName.value.pkId === null || this.b.BankName.value.pkId === undefined)) {
        this.InvalidBankName = true;
        this.isLoading = false;
        return;
      } else {
        this.InvalidBankName = false;
      }
    }
  }

  AddBankToList() {
    this.isLoading = true;
    this.submittedBnk = true;
    if (!this.BankForm.valid) {
      this.isLoading = false;
      return;
    }
    let bank = {
      'BankId': this.b.BankName.value.pkId,
      'BankName': this.b.BankName.value.MasterName,
      'AccountNo': this.b.BankAccountNo.value,
      'IFSCCode': this.b.IFSCCode.value
    }
    let count = this.Banks.filter(b => b.AccountNo == bank.AccountNo).length;
    if (count > 0) {
      this.toaster.info('Account already exist!');
      this.isLoading = false;
      this.chef.detectChanges();
    }
    else {
      if (this.InvalidBankName === false) {
        this.Banks.push(bank);
        this.DataSource.data = this.Banks;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
        this.clearBankForm();
        this.isLoading = false;
        this.InvalidBankName = false;
        this.submittedBnk = false;
        this.chef.detectChanges();
      } else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
      }

    }
  }

  // AcountNo is available
  onAcountNoChange() {
    let bank = {
      'BankName': this.b.BankName.value.MasterName, //this.formControlBank.value.MasterName
      'AccountNo': this.b.BankAccountNo.value,
    }
    let count = this.Banks.filter(b => b.AccountNo == bank.AccountNo).length;
    if (count > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Account already exist! with ' + bank.BankName,
      });
    }
  }

  clearBankForm() {
    this.BankForm.reset();
    this.bankforminit();
    this.chef.detectChanges();
  }

  RemoveBank(i: number) {
    this.Banks.splice(i, 1);
    this.DataSource.data = this.Banks;
    this.DataSource.paginator = this.paginator;
    this.DataSource.sort = this.Sort;
    this.chef.detectChanges();
  }
  cityValidation() {
    this.submitted = false;
    if ((this.f.City.value.CityCode === "" || this.f.City.value.CityCode === null || this.f.City.value.CityCode === undefined)) {
      this.InvalidCity = true;
      this.isLoading = false;
      return;
    } else {
      this.InvalidCity = false;
    }
  }

  SaveStokist() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.StokistForm.valid) {
      this.isLoading = false;
      this.InvalidCity = false;
      // this.submitted = false;
      return;
    }
    else {
      if (this.InvalidCity === false && this.IsInvalidPan == false && this.IsInvalidGSTNo === true &&
        this.IsInvalidMobile === false && this.IsEmailFlag === true) {
        this.stockistmodel = new StockistModel();
        this.stockistmodel.BranchId = this.BranchId;
        this.stockistmodel.CompanyId = this.CompanyId;
        this.stockistmodel.StockistNo = this.f.CustomerCode.value;
        this.stockistmodel.StockistName = this.f.CustomerName.value;
        this.stockistmodel.Emailid = this.f.Email.value;
        this.stockistmodel.MobNo = this.f.ContactNo.value;
        this.stockistmodel.StockistPAN = this.f.PANNo.value;
        this.stockistmodel.GSTNo = this.f.GSTNo.value;
        this.stockistmodel.CityCode = this.f.City.value.CityCode; // (Array - formControl) // this.f.City.value; (Use formControlName)
        this.stockistmodel.Pincode = this.f.Pin.value;
        this.stockistmodel.StockistAddress = this.f.Address.value;
        this.stockistmodel.DLNo = this.f.DLNo.value;
        this.stockistmodel.DLExpDate = AppCode.createDateAsUTC(new Date(this.f.DLExpiryDate.value));
        this.stockistmodel.FoodLicNo = this.f.FoodLicNo.value;
        this.stockistmodel.FoodLicExpDate = AppCode.createDateAsUTC(new Date(this.f.FoodLicExpiry.value));
        this.stockistmodel.BnkDtls = this.Banks;
        this.stockistmodel.Addedby = String(this.UserId);

        if (this.pageState === AppCode.saveString) {
          this.stockistmodel.StockistId = 0;
          this.stockistmodel.Action = AppCode.addString;
        }
        else {
          this.stockistmodel.StockistId = this.StockistId;
          this.stockistmodel.Action = AppCode.editString;
        }
        if (this.f.City.value.CityCode !== undefined) {
          this._service.SaveStockist_Service(this.stockistmodel)
            .subscribe((data: any) => {
              if (data === AppCode.SuccessStatus) {
                if (this.pageState === AppCode.saveString) {
                  this.toaster.success(AppCode.msg_saveSuccess);
                } else {
                  this.toaster.success(AppCode.msg_updateSuccess);
                }
                this.InvalidCity = false;
                this.redirecttolist();
              } else if (data === AppCode.ExistsStatus) {
                this.toaster.warning(AppCode.msg_exist);
                this.isLoading = false;
                this.InvalidCity = false;
                this.chef.detectChanges();
              } else {
                this.toaster.error(data);
                this.redirecttolist();
              }
            }, (error) => {
              console.error(error);
              this.chef.detectChanges();
            })
        }
        else {
          this.toaster.error(AppCode.FailStatus);
          this.isLoading = false;
          this.InvalidCity = true;
        }
      }
      else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
        this.InvalidCity = true;
      }
    }
  }

  // StockistNo is available
  onStockistNoChange() {
    this._service.getStockistNoChange_Service(this.f.CustomerCode.value)
      .subscribe((data: any) => {
        if (data !== null) {
          if (data.Flag == -1) {
            Swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: 'This CustomerCode is already exists with ' + data.StockistName,
            });
          }
          this.chef.detectChanges();
        }
      }, (error) => {
        console.error(error);
        this.chef.detectChanges();
      });
  }

  ClearForm() {
    this.StokistForm.reset();
    this.isLoading = false;
    this.chef.detectChanges();
  }

  Setdata() {
    this.isLoading = true;
    this.StockistMsg = "Update Stockist Master";
    this.f.CustomerCode.disable();
    this.pageState = this.State.state;
    this.stockistmodel = new StockistModel();
    this.stockistmodel = this._SharedService.getData();
    if (this.stockistmodel !== undefined) {
      this._service.GetStockistBankList_Service(this.stockistmodel.StockistId)
        .subscribe((data: any) => {
          this.Banks = data;
          this.DataSource.data = this.Banks;
          this.DataSource.paginator = this.paginator;
          this.DataSource.sort = this.Sort;
          this.isLoading = false;
        }, (error) => {
          console.error(error);
        });

      this.BranchId = this.stockistmodel.BranchId;
      this.CompanyId = this.stockistmodel.CompanyId;
      this.StockistId = this.stockistmodel.StockistId;
      this.f.CustomerCode.setValue(this.stockistmodel.StockistNo);
      this.f.CustomerName.setValue(this.stockistmodel.StockistName);
      this.f.Email.setValue(this.stockistmodel.Emailid);
      this.f.ContactNo.setValue(this.stockistmodel.MobNo);
      this.f.PANNo.setValue(this.stockistmodel.StockistPAN);
      this.f.GSTNo.setValue(this.stockistmodel.GSTNo);

      let s: any = {
        CityCode: this.stockistmodel.CityCode,
        CityName: this.stockistmodel.CityName
      };
      this.f.City.setValue(s);
      // this.f.City.setValue(this.stockistmodel.CityCode);
      this.f.Pin.setValue(this.stockistmodel.Pincode);
      this.f.Address.setValue(this.stockistmodel.StockistAddress);
      this.f.DLNo.setValue(this.stockistmodel.DLNo);
      const date = new Date('1900-01-01T00:00:00');
      const DLdate = new Date(this.stockistmodel.DLExpDate);
      const FLdate = new Date(this.stockistmodel.FoodLicExpDate);
      if (date.getFullYear() == DLdate.getFullYear()) {
        this.f.DLExpiryDate.setValue(null);
      }
      else if (date.getFullYear() == FLdate.getFullYear()) {
        this.f.FoodLicExpiry.setValue(null);
      }
      else {
        this.f.DLExpiryDate.setValue(this.stockistmodel.DLExpDate);
        this.f.FoodLicExpiry.setValue(this.stockistmodel.FoodLicExpDate);
      }
      this.f.FoodLicNo.setValue(this.stockistmodel.FoodLicNo);
      this.isLoading = false;
      this.chef.detectChanges();
    } else {
      this.redirecttolist();
    }
  }

  // Validation Email
  emailValidation() {
    let flag: boolean = false;
    if (this.f.Email.value === "") {
      this.IsEmailFlag = true; // valid email
      this.submitted = false;
      this.chef.detectChanges();
    } else {
      flag = this._appCode.emailAddressOnly(this.f.Email.value.toLowerCase());
      if (flag === true) {
        this.IsEmailFlag = true; // valid email
        this.submitted = false;
        this.chef.detectChanges();
      } else {
        this.IsEmailFlag = false; // invalid email
        this.submitted = false;
        this.chef.detectChanges();
      }
    }
  }

  // validation Pan No
  PANNoValidation(event: any) {
    this._appCode.keyPressAlphanumeric(event);
  }

  // validation IFSC Code
  IFSCValidation(event: any) {
    this._appCode.keyPressAlphanumeric(event);
  }

  // Validation Mobile No.
  AcctNoValidation(event: any) {
    this._appCode.numberOnly(event);
  }

  redirecttolist() {
    this.ClearForm();
    this.CallToToolBarComponent();
    this.router.navigate(['/modules/masters/stockist-master']);
  }

  //alphanumeric validation function(Customer code should not startith zero(0))
  noZeroStartValidator(control: AbstractControl) {
    if (control.value && control.value.charAt(0) === '0' || control.value && control.value.charAt(0) === "0") {
      return { noZeroStart: true };
    }
    return null;
  }

  //accept only alphanumeric value
  noSpecialCharValidator(control: AbstractControl) {
    if (control.value && !/^[a-zA-Z0-9]+$/.test(control.value)) {
      return { noSpecialChar: true };
    }
    return null;
  }


}
