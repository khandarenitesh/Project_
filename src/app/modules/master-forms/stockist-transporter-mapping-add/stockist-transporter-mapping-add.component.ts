import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

// Models
import { StokistTransportModel } from '../Models/StokistTransportModel';

// Services
import { MastersServiceService } from '../Services/masters-service.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stockist-transporter-mapping-add',
  templateUrl: './stockist-transporter-mapping-add.component.html',
  styleUrls: ['./stockist-transporter-mapping-add.component.scss']
})
export class StockistTransporterMappingAddComponent implements OnInit {
  stockistTransporterMappingForm: FormGroup;
  stokistTransportModel: StokistTransportModel;
  StockistNoList: any[] = [];
  StockistNameList: any[] = [];
  CityList: any = [];
  // LocationList: any = [];
  TransporterNoList: any[] = [];
  TransporterNameList: any[] = [];
  SupplyTypesList: any = [];
  UserId: Number = 0;
  defaultform: any = {
    StockistNo: '',
    StockistName: '',
    Email: '',
    MobileNo: '',
    City: '',
    // Location: '',
    TransporterNumber: '',
    TransporterName: '',
    TransitDays: '',
    SupplyTypes: ''
  };
  pageState: string = "";
  btnCancelText: string = "";
  stockistTransporterMappingMsg: string = "";
  currentDate = new Date();
  BranchId: number = 0;
  CompanyId: number = 0;
  submitted: boolean = false;
  IsEmailFlag: boolean = true;
  IsFlag: boolean = true;
  StockistNoArray: Observable<StokistTransportModel[]>;
  StockistNameArray: Observable<StokistTransportModel[]>;
  StockistTransporterNo: Observable<StokistTransportModel[]>;
  StockistTransporterName: Observable<StokistTransportModel[]>;
  StockistSupplyTypes: Observable<StokistTransportModel[]>;
  StockistNo: boolean = false;
  StockistName: boolean = false;
  TransportNo: boolean = false;
  TransportName: boolean = false;
  SupplyType: boolean = false;
  MasterName: boolean = false;
  StockitsTransporterList: any;
  Repeat: any
  RepeatDATA: any;

  constructor(
    private fb: FormBuilder,
    private _service: MastersServiceService,
    private router: Router,
    private _appCode: AppCode,
    private _ToastrService: ToastrService,
    private chef: ChangeDetectorRef,
    private _MastersServiceService: MastersServiceService,
  ) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.stockistTransporterMappingMsg = "Add Stockist Transporter Mapping";
    this.pageState = AppCode.saveString;
    this.btnCancelText = AppCode.cancelString;
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.initForm();
    this.GetStockistList();
    this.GetCityList();
    this.GetGeneralMasterList();
    this.GetTransporterList();
    this.GetStokistTransportMappingList(this.BranchId, this.CompanyId);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.stockistTransporterMappingForm.controls;
  }

  initForm() {
    this.stockistTransporterMappingForm = this.fb.group({
      StockistNo: [
        this.defaultform.StockistNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      StockistName: [
        this.defaultform.StockistName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      Email: [
        { value: '', disabled: true },
        this.defaultform.Email
      ],
      MobileNo: [
        { value: '', disabled: true },
        this.defaultform.MobileNo
      ],
      City: [
        { value: '', disabled: true },
        this.defaultform.City
      ],
      TransporterNumber: [
        this.defaultform.TransporterNumber,
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
        ]),
      ],
      TransporterName: [
        this.defaultform.TransporterName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
        ]),
      ],
      TransitDays: [
        this.defaultform.TransitDays,
        // Validators.compose([
        //   Validators.required,
        //   Validators.maxLength(50),
        // ]),
      ],
      SupplyTypes: [
        this.defaultform.SupplyTypes,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
    });
  }

  // Get Stockist No. and Stockist Name
  GetStockistList() {
    this._service.getStockistList_Service(this.BranchId, this.CompanyId, AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.StockistNoList = data;
          this.StockistNameList = data;
          this.StockistNoList = this.StockistNoList.sort((a: any, b: any) => a.StockistNo.localeCompare(b.StockistNo));
          this.StockistNoArray = this.f.StockistNo.valueChanges
            .pipe(
              startWith<string | StokistTransportModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.StockistNo : null),
              map(StockistNo => StockistNo ? this.filterStockistNo(StockistNo) : this.StockistNoList.slice())
            );
          this.StockistNameList = this.StockistNameList.sort((a: any, b: any) => a.StockistName.localeCompare(b.StockistName));
          this.StockistNameArray = this.f.StockistName.valueChanges
            .pipe(
              startWith<string | StokistTransportModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.StockistName : null),
              map(StockistName => StockistName ? this.filterStockistNo(StockistName) : this.StockistNameList.slice())
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
  private filterStockistNo(name: string): StokistTransportModel[] {
    this.StockistNo = false;
    this.StockistName = false;
    const filterValue = name.toLowerCase();
    return this.StockistNoList.filter((option: any) =>
      option.StockistNo.toLowerCase().includes(filterValue) ||
      option.StockistName.toLocaleLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnStockistNo(StockstNo: StokistTransportModel): string {
    return StockstNo && StockstNo.StockistNo ? StockstNo.StockistNo : '';
  }

  // Select or Choose dropdown values
  displayFnStockistName(StockstName: StokistTransportModel): string {
    return StockstName && StockstName.StockistName ? StockstName.StockistName : '';
  }

  // Stockist Number on change event occurs - Display Stockist Name, Email, Mobile No., City and Location
  onChangeStockistNo() {
    if (this.f.StockistNo.value !== null && this.f.StockistNo.value !== "" && this.f.StockistNo.value !== undefined) {
      let data = this.StockistNoList.filter(x => x.StockistId === this.f.StockistNo.value.StockistId);
      let name = {
        "StockistId": data[0].StockistId,
        "StockistName": data[0].StockistName
      }
      this.f.StockistName.setValue(name);
      this.f.Email.setValue(data[0].Emailid);
      this.f.MobileNo.setValue(data[0].MobNo);
      this.f.City.setValue(data[0].CityCode);
    }
    else {
      let name = {
        "StockistId": "",
        "StockistName": ""
      }
      this.f.StockistName.setValue(name);
      this.f.Email.setValue("");
      this.f.MobileNo.setValue("");
      this.f.City.setValue("");
    }
    this.chef.detectChanges();
  }

  // Stockist Name on change event occurs - Display Stockist No, Email, Mobile No., City and Location
  onChangeStockistName() {
    if (this.f.StockistName.value !== null && this.f.StockistName.value !== "" && this.f.StockistName.value !== undefined) {
      let data = this.StockistNameList.filter(x => x.StockistId === this.f.StockistName.value.StockistId);
      let number = {
        "StockistId": data[0].StockistId,
        "StockistNo": data[0].StockistNo
      }
      this.f.StockistNo.setValue(number);
      this.f.Email.setValue(data[0].Emailid);
      this.f.MobileNo.setValue(data[0].MobNo);
      this.f.City.setValue(data[0].CityCode);
    }
    else {
      let number = {
        "StockistId": "",
        "StockistNo": ""
      }
      this.f.StockistNo.setValue(number);
      this.f.Email.setValue("");
      this.f.MobileNo.setValue("");
      this.f.City.setValue("");
    }
    this.chef.detectChanges();
  }

  // Get City List
  GetCityList() {
    this._service.getCityList_Service(AppCode.allString, AppCode.allString, AppCode.allString)
      .subscribe((data: any) => {
        this.CityList = data.GetCityParameter;
        this.chef.detectChanges();
      }, (error) => {
        console.error(error);
        this.chef.detectChanges();
      });
  }

  // Get Stockist Transporter Mapping List
  GetStokistTransportMappingList(BranchId: number, CompanyId: number) {
    this._MastersServiceService.getStokistTransportMappingList_Service(BranchId, CompanyId).subscribe((data: any) => {
      this.StockitsTransporterList = data;
      this.chef.detectChanges();
    }, (error) => {
      console.error(error);
      this.chef.detectChanges();
    });
  }

  // Get Location and SupplyType List
  GetGeneralMasterList() {
    this._service.GetGeneralMasterList_Service(AppCode.splstring, AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.SupplyTypesList = data.GeneralMasterParameter;
          this.SupplyTypesList = this.SupplyTypesList.sort((a: any, b: any) => a.MasterName.localeCompare(b.MasterName));
          this.StockistSupplyTypes = this.f.TransporterNumber.valueChanges
            .pipe(
              startWith<string | StokistTransportModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.MasterName : null),
              map(MasterName => MasterName ? this.filterSupplyTypes(MasterName) : this.SupplyTypesList.slice())
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
  private filterSupplyTypes(name: string): StokistTransportModel[] {
    this.MasterName = false;
    const filterValue = name.toLowerCase();
    return this.SupplyTypesList.filter((option: any) =>
      option.MasterName.toLowerCase().includes(filterValue) ||
      option.pkId.toLocaleLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnSupplyTypes(SupplyTypes: StokistTransportModel): string {
    return SupplyTypes && SupplyTypes.MasterName ? SupplyTypes.MasterName : '';
  }

  // Get Transporter No. and Transporter Name
  GetTransporterList() {
    this._service.getGetTransporterList_Service(AppCode.allString, AppCode.IsActiveString, this.BranchId)
      .subscribe(
        (data: any) => {
          this.TransporterNoList = data;
          this.TransporterNameList = data;
          this.TransporterNoList = this.TransporterNoList.sort((a: any, b: any) => a.TransporterNo.localeCompare(b.TransporterNo));
          this.StockistTransporterNo = this.f.TransporterNumber.valueChanges
            .pipe(
              startWith<string | StokistTransportModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.TransporterNo : null),
              map(TransporterNo => TransporterNo ? this.filterTransporterNo(TransporterNo) : this.TransporterNoList.slice())
            );
          this.TransporterNameList = this.TransporterNameList.sort((a: any, b: any) => a.TransporterName.localeCompare(b.TransporterName));
          this.StockistTransporterName = this.f.TransporterName.valueChanges
            .pipe(
              startWith<string | StokistTransportModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.TransporterName : null),
              map(TransporterName => TransporterName ? this.filterTransporterNo(TransporterName) : this.TransporterNameList.slice())
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
  private filterTransporterNo(name: string): StokistTransportModel[] {
    this.TransportNo = false;
    this.TransportName = false;
    const filterValue = name.toLowerCase();
    return this.TransporterNoList.filter((option: any) =>
      option.TransporterNo.toLowerCase().includes(filterValue) ||
      option.TransporterName.toLocaleLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnTransporterNo(TrnsptrNo: StokistTransportModel): string {
    return TrnsptrNo && TrnsptrNo.TransporterNo ? TrnsptrNo.TransporterNo : '';
  }

  // Select or Choose dropdown values
  displayFnautoTransporterName(TrnsptrName: StokistTransportModel): string {
    return TrnsptrName && TrnsptrName.TransporterName ? TrnsptrName.TransporterName : '';
  }

  // Validation Email
  emailValidation() {
    let flag: boolean = false;
    if (this.f.Email.value === "") {
      this.IsFlag = false; // Email Address if Empty
      this.IsEmailFlag = true; // valid email
      this.submitted = false;
      this.chef.detectChanges();
    } else {
      flag = this._appCode.emailAddressOnly(this.f.Email.value);
      if (flag === true) {
        this.IsEmailFlag = true; // valid email
        this.IsFlag = true; // Email Address filled
        this.submitted = false;
        this.chef.detectChanges();
      } else {
        this.IsEmailFlag = false; // invalid email
        this.IsFlag = true; // Email Address if Empty
        this.submitted = true;
        this.chef.detectChanges();
      }
    }
  }

  // Validation Mobile No.
  mobileNoValidation(event: any) {
    this._appCode.numberOnly(event);
  }

  // Transport Number on change event occurs - Display Transport Name
  onChangeTransporterNumber() {
    if (this.f.TransporterNumber.value !== null && this.f.TransporterNumber.value !== "" && this.f.TransporterNumber.value !== undefined) {
      let data = this.TransporterNoList.filter(x => x.TransporterId === this.f.TransporterNumber.value.TransporterId);
      let obj = {
        "TransporterId": data[0].TransporterId,
        "TransporterName": data[0].TransporterName
      }
      this.f.TransporterName.setValue(obj);
    }
    else {
      let obj = {
        "TransporterId": 0,
        "TransporterName": ""
      }
      this.f.TransporterName.setValue(obj);
    }
    this.chef.detectChanges();
  }
  // Transport Name on change event occurs - Display Transport Number
  onChangeTransporterName() {
    if (this.f.TransporterName.value !== null && this.f.TransporterName.value !== "" && this.f.TransporterName.value !== undefined) {
      let data = this.TransporterNameList.filter(x => x.TransporterId === this.f.TransporterName.value.TransporterId);
      let obj = {
        "TransporterId": data[0].TransporterId,
        "TransporterNo": data[0].TransporterNo
      }
      //this.f.TransporterNumber.enable();
      this.f.TransporterNumber.setValue(obj);
    }
    else {
      let obj = {
        "TransporterId": "",
        "TransporterNo": ""
      }
      this.f.TransporterNumber.setValue(obj);
    }
    this.chef.detectChanges();
  }
  onSupplytypesChange() {
    this.MasterName = false;
    this.chef.detectChanges();
  }

  stockistnoValidation() {
    this.submitted = false;
    if ((this.f.StockistNo.value.StockistId === "" || this.f.StockistNo.value.StockistId === null || this.f.StockistNo.value.StockistId === undefined)) {
      this.StockistNo = true;
      return;
    } else {
      this.StockistNo = false;
    }
  }

  stockistnameValidation() {
    this.submitted = false;
    if ((this.f.StockistName.value.StockistName === "" || this.f.StockistName.value.StockistName === null || this.f.StockistName.value.StockistName === undefined)) {
      this.StockistName = true;
      return;
    } else {
      this.StockistName = false;
    }
  }
  transportnoValidation() {
    this.submitted = false;
    if ((this.f.TransporterNumber.value.TransporterId === "" || this.f.TransporterNumber.value.TransporterId === null || this.f.TransporterNumber.value.TransporterId === undefined)) {
      this.TransportNo = true;
      return;
    } else {
      this.TransportNo = false;
    }
  }
  transportnameValidation() {
    this.submitted = false;
    if ((this.f.TransporterName.value.TransporterName === "" || this.f.TransporterName.value.TransporterName === null || this.f.TransporterName.value.TransporterName === undefined)) {
      this.TransportName = true;
      return;
    } else {
      this.TransportName = false;
    }
  }
  suppytypeValidation() {
    this.submitted = false;
    if ((this.f.SupplyTypes.value.MasterName === "" || this.f.SupplyTypes.value.MasterName === null || this.f.SupplyTypes.value.MasterName === undefined)) {
      this.MasterName = true;
      return;
    } else {
      this.MasterName = false;
    }
  }
  // Save Stockist Transporter Mapping
  SaveStockistTransporterMapping() {
    this.submitted = true;
    if (!this.stockistTransporterMappingForm.valid) {
      this.StockistNo = false;
      this.StockistName = false;
      this.TransportNo = false;
      this.TransportName = false;
      this.MasterName = false;
      return;
    } else {
      this.Repeat = this.StockitsTransporterList.find((x: any) => x.StockistId === this.f.StockistNo.value.StockistId) ? 'true' : 'false';
      if (this.Repeat === 'true') {
        this._ToastrService.warning("Stockist Alredy Mapped!");
        return;
      }
      if (this.StockistNo === false && this.StockistName === false && this.TransportNo === false && this.TransportName === false && this.MasterName === false
        && this.IsEmailFlag === true) {
        if (this.pageState === AppCode.saveString) {
          // Save - Email Valid or Invalid Check condition only
          this.IsEmailFlag = this._appCode.emailAddressOnly(this.f.Email.value);
          if (this.IsEmailFlag === true) {
            this.stokistTransportModel = new StokistTransportModel();
            this.stokistTransportModel.BranchId = this.BranchId;
            this.stokistTransportModel.CompanyId = this.CompanyId;
            this.stokistTransportModel.StockistId = this.f.StockistNo.value.StockistId;
            this.stokistTransportModel.TransporterId = this.f.TransporterNumber.value.TransporterId;
            this.stokistTransportModel.TransitDays = this.f.TransitDays.value;
            this.stokistTransportModel.SupplyTypeId = this.f.SupplyTypes.value.pkId;
            this.stokistTransportModel.Addedby = String(this.UserId);
            this.stokistTransportModel.AddedOn = this.currentDate;
            this.stokistTransportModel.Action = AppCode.addString;
            this._service.StokistTransportMappingAddEdit_Service(this.stokistTransportModel)
              .subscribe((data: any) => {
                if (data === AppCode.SuccessStatus) {
                  this._ToastrService.success(AppCode.msg_saveSuccess);
                  this.redirect();
                } else if (data === AppCode.ExistsStatus) {
                  this._ToastrService.warning(AppCode.msg_exist);
                  this.chef.detectChanges();
                } else {
                  this._ToastrService.error(data);
                  this.redirect();
                }
              }, (error) => {
                console.error(error);
                this.chef.detectChanges();
              });
          }
        } else {
          this._ToastrService.warning(AppCode.FailStatus);
          this.chef.detectChanges();
        }
      }
    }
  }

  numberValidation(event: any) {
    this._appCode.numberOnly(event);
  }

  // Redirect to Stockist Transporter Mapping List
  redirect() {
    this.router.navigate(['/modules/masters/stockist-transporter-mapping-list']);
    this.chef.detectChanges();
  }

}
