import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MastersServiceService } from '../Services/masters-service.service';
import { CompanyList } from '../Models/CompanyList';
import { SharedService } from '../../../SharedServices/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.scss']
})
export class CompanyAddComponent implements OnInit {
  companyForm: FormGroup;
  submitted = false;
  comapanymodal: CompanyList;
  CityList: any = [];
  UserId: Number = 0;
  pageState: string = '';
  CompanyId: number = 0;
  isLoading: boolean = false;
  IsEmailFlag: boolean = true;
  IsFlag: boolean = true;
  InvalidCity: boolean = false;
  Title: string = "";

  defaultform: any = {
    CompanyCode: '',
    CompanyName: '',
    Email: '',
    ContactNo: '',
    PANNo: '',
    GSTNo: '',
    Address: '',
    City: '',
    Pin: ''
  };

  State: any = {
    state: ''
  };

  IsInvalidMobile: boolean = false;
  IsInvalidPan: boolean = false;
  IsFlagGst: boolean = true;
  IsInvalidGSTNo: boolean = true;
  //FOR AUTOCOMPLETE
  filteredOptionsCity: Observable<CompanyList[]>;

  constructor(
    private fb: FormBuilder,
    private _service: MastersServiceService,
    private _SharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private chRef: ChangeDetectorRef,
    private toaster: ToastrService,
    private _appCode: AppCode,
  ) { }

  ngOnInit(): void {
    this.Title = "Add Company Details";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.pageState = AppCode.saveString;
    this.initForm();
    this.GetCityList();

    this.route.queryParams.subscribe(params => {
      this.State = params;
    })
    if (this.State.state !== undefined && this.State.state !== null) {
      this.Setdata();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.companyForm.controls;
  }

  initForm() {
    this.companyForm = this.fb.group({
      CompanyCode: [
        this.defaultform.CompanyCode,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      CompanyName: [
        this.defaultform.CompanyName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      Email: [
        this.defaultform.Email,
        Validators.compose([
          Validators.email,
          Validators.required,
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
        this.defaultform.GSTNo
      ],
      Address: [
        this.defaultform.Address
      ],
      City: [
        this.defaultform.City,
        Validators.compose([
          Validators.required
        ]),
      ],
      Pin: [
        this.defaultform.Pin
      ],
      PickList: false,
    });
  }

  // Validation Number
  numberValidation(event: any) {
    this._appCode.numberOnly(event);
  }

  // Validation Mobile No
  mobileNoValidation(event: any) {
    this._appCode.numberonlyandcomma(event);
  }

  // Alpha Number
  GstValidation(event: any) {
    this._appCode.keyPressAlphanumeric(event);
  }


  emailValidation() {
    let flag: boolean = false;
    if (this.f.Email.value === "") {
      this.IsFlag = false; // Email Address if Empty
      this.IsEmailFlag = true; // valid email
      this.submitted = false;
      this.chRef.detectChanges();
    } else {
      flag = this._appCode.emailAddressOnly(this.f.Email.value.toLowerCase());
      if (flag === true) {
        this.IsEmailFlag = true; // valid email
        this.IsFlag = true; // Email Address filled
        this.submitted = false;
        this.chRef.detectChanges();
      } else {
        this.IsEmailFlag = false; // invalid email
        this.IsFlag = true; // Email Address if Empty
        this.submitted = true;
        this.chRef.detectChanges();
      }
    }
  }
  // Get city list
  GetCityList() {
    this._service.getCityList_Service(AppCode.ststString, AppCode.allString, AppCode.CityActiveString)
      .subscribe((data: any) => {
        this.CityList = data.GetCityParameter;
        this.CityList = this.CityList.sort((a: any, b: any) => a.CityName.localeCompare(b.CityName));
        this.filteredOptionsCity = this.f.City.valueChanges
          .pipe(
            startWith<string | CompanyList>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.CityName : null),
            map(CityName => CityName ? this.filterCity(CityName) : this.CityList.slice())
          );
        this.chRef.detectChanges();
      }, (error) => {
        console.error(error);
      });
  }

  // Autocomplete Search Filter
  private filterCity(name: string): CompanyList[] {
    this.InvalidCity = false;
    const filterValue = name.toLowerCase();
    return this.CityList.filter((option: any) =>
      option.CityName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnCity(city: CompanyList): string {
    return city && city.CityName ? city.CityName : '';
  }


  // save compony details
  SaveCompany() {
    this.submitted = true;
    if (!this.companyForm.valid) {
      this.InvalidCity = false;
      return;
    } else {
      if (this.InvalidCity === false && this.IsInvalidPan === false && this.IsInvalidMobile === false && this.IsInvalidGSTNo === true) {
        this.comapanymodal = new CompanyList();
        this.comapanymodal.CompanyCode = this.f.CompanyCode.value;
        this.comapanymodal.CompanyName = this.f.CompanyName.value;
        this.comapanymodal.CompanyAddress = this.f.Address.value;
        this.comapanymodal.CompanyCity = this.f.City.value.CityCode;
        this.comapanymodal.Pin = this.f.Pin.value;
        this.comapanymodal.ContactNo = this.f.ContactNo.value;
        this.comapanymodal.CompanyEmail = this.f.Email.value;
        this.comapanymodal.CompanyPAN = this.f.PANNo.value;
        this.comapanymodal.IsPicklistAvailable = this.f.PickList.value;
        this.comapanymodal.GSTNo = this.f.GSTNo.value;
        this.comapanymodal.IsActive = AppCode.IsActiveString;
        this.comapanymodal.Addedby = String(this.UserId);

        if (this.pageState == AppCode.saveString) {
          this.comapanymodal.CompanyId = 0;
          this.comapanymodal.Action = AppCode.addString;
        }
        else {
          this.comapanymodal.CompanyId = this.CompanyId;
          this.comapanymodal.Action = AppCode.editString;
        }
        this._service.SaveCompany_Service(this.comapanymodal)
          .subscribe((data: any) => {
            if (data === AppCode.SuccessStatus) {
              if (this.pageState == AppCode.saveString) {
                this.toaster.success(AppCode.msg_saveSuccess);
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
          }, (error: any) => {
            console.error(error);
          });
      }
      else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
      }
    }
  }

  CityValidation() {
    this.submitted = false;
    if ((this.f.City.value.CityCode === '' || this.f.City.value.CityCode === null || this.f.City.value.CityCode === undefined)) {
      this.InvalidCity = true;
      return;
    } else {
      this.InvalidCity = false;
    }
    this.chRef.detectChanges();
  }

  // Set data on click edit button
  Setdata() {
    this.Title = "Update Company Details";
    this.f.CompanyCode.disable();
    this.pageState = this.State.state;
    this.comapanymodal = new CompanyList();
    this.comapanymodal = this._SharedService.getData();
    if (this.comapanymodal !== undefined) {
      this.CompanyId = this.comapanymodal.CompanyId;
      this.f.CompanyCode.setValue(this.comapanymodal.CompanyCode);
      this.f.CompanyName.setValue(this.comapanymodal.CompanyName);
      this.f.Address.setValue(this.comapanymodal.CompanyAddress);
      // this.f.City.setValue(this.comapanymodal.CompanyCity);
      this.f.Pin.setValue(this.comapanymodal.Pin);
      this.f.ContactNo.setValue(this.comapanymodal.ContactNo);
      this.f.Email.setValue(this.comapanymodal.CompanyEmail);
      this.f.PANNo.setValue(this.comapanymodal.CompanyPAN);
      this.f.GSTNo.setValue(this.comapanymodal.GSTNo);
      this.f.PickList.setValue(this.comapanymodal.IsPicklistAvailable);
      let city: any = {
        'CityCode': this.comapanymodal.CompanyCity,
        'CityName': this.comapanymodal.CityName
      }
      this.f.City.setValue(city);
      this.chRef.detectChanges();
    } else {
      this.redirect();
    }

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
      this.chRef.detectChanges();
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
      this.chRef.detectChanges();
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
      this.chRef.detectChanges();
    }
  }

  // clear form on click cancel button
  ClearForm() {
    this.f.CompanyCode.setValue('');
    this.f.CompanyName.setValue('');
    this.f.Address.setValue('');
    this.f.City.setValue('');
    this.f.Pin.setValue('');
    this.f.ContactNo.setValue('');
    this.f.Email.setValue('');
    this.f.PANNo.setValue('');
    this.f.GSTNo.setValue('');
    this.f.PickList.setValue('');
    this.chRef.detectChanges();
  }

  // validation Pan No
  PANNoValidation(event: any) {
    this._appCode.keyPressAlphanumeric(event);
  }

  // Redirect to Company List
  redirect() {
    this.ClearForm();
    this.router.navigate(['/modules/masters/company-list']);
  }
}
