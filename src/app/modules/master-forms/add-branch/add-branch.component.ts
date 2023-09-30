import { state } from '@angular/animations';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { AppCode } from '../../../app.code';
import { SharedService } from '../../../SharedServices/shared.service';
import { BranchList } from '../Models/BranchModel';
import { MastersServiceService } from '../Services/masters-service.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CityMaster } from '../Models/city-master.model';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent implements OnInit {

  form: FormGroup;
  branchForm: FormGroup;
  submitted = false;
  Branchmodal: BranchList;
  Editmodal: BranchList;
  CityList: any = [];
  StateList: any = [];
  UserId: Number = 0;
  pageState: string = '';
  BranchId: number = 0;
  isLoading: boolean = false;
  IsEmailFlag: boolean = true;
  IsFlag: boolean = true;
  Title: string = "";
  InvalidCity: boolean = false;
  IsInvalidMobile: boolean = false;
  IsInvalidPan: boolean = false;
  IsFlagGst: boolean = true;
  IsInvalidGSTNo: boolean = true;
  //Autocomplete
  filteredOptionsState: Observable<BranchList[]>;
  InvalidState: boolean = false;


  State: any = {
    state: ''
  };

  defaultform: any = {
    BranchCode: '',
    BranchName: '',
    Email: '',
    CourierName: '',
    ContactNo: '',
    GSTNo: '',
    Address: '',
    Pin: '',
    City: '',
    State: ''
  };

  //FOR AUTOCOMPLETE
  filteredOptionsCity: Observable<CityMaster[]>;

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
    this.Title = "Add Branch";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.pageState = AppCode.saveString;
    this.initForm();
    this.GetCityList();
    this.GetStateList();
    this.route.queryParams.subscribe(params => {
      this.State = params;
    })
    if (this.State.state !== undefined && this.State.state !== null) {
      this.Setdata();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.branchForm.controls;
  }
  // form controls
  initForm() {
    this.branchForm = this.fb.group({
      BranchCode: [
        this.defaultform.BranchCode,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      BranchName: [
        this.defaultform.BranchName,
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
        ]),
      ],
      ContactNo: [
        this.defaultform.ContactNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(22),
        ]),
      ],
      // PANNo: [
      //   this.defaultform.PANNo
      // ],
      PANNo: [
        this.defaultform.PANNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10)
        ])
      ],
      GSTNo: [
        this.defaultform.GSTNo
      ],
      Address: [
        this.defaultform.Address
      ],
      Pin: [
        this.defaultform.Pin
      ],
      City: [
        this.defaultform.City,
        Validators.compose([
          Validators.required
        ]),
      ],
      State: [
        this.defaultform.State,
        Validators.compose([
          Validators.required
        ]),
      ]
    });
  }
  // Get city list
  GetCityList() {
    this._service.getCityList_Service(AppCode.ststString, AppCode.allString, AppCode.CityActiveString)
      .subscribe((data: any) => {
        this.CityList = data.GetCityParameter;
        this.CityList = this.CityList.sort((a: any, b: any) => a.CityName.localeCompare(b.CityName));
        this.filteredOptionsCity = this.f.City.valueChanges
          .pipe(
            startWith<string | BranchList>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.CityName : null),
            map(CityName => CityName ? this.filterCity(CityName) : this.CityList.slice())
          );
        this.chRef.detectChanges();
      },
        (error) => {
          console.error(error);
        })
  }

  // Autocomplete Search Filter
  private filterCity(name: string): BranchList[] {
    this.InvalidCity = false;
    const filterValue = name.toLowerCase();
    return this.CityList.filter((option: any) =>
      option.CityName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnCity(city: BranchList): string {
    return city && city.CityName ? city.CityName : '';
  }

  // Get district list
  GetDistrictList() {
    this._service.getDistrictList_Service(AppCode.ststString, AppCode.allString)
      .subscribe((data: any) => {
        this.CityList = data.GetCityParameter;
        this.chRef.detectChanges();
      },
        (error) => {
          console.error(error);
        })
  }

  // Email validation
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
  // Alpha Number
  GstValidation(event: any) {
    this._appCode.keyPressAlphanumeric(event);
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

  //Get State List
  GetStateList() {
    this.isLoading = true;
    this._service.getRegionList_Service(AppCode.allString)
      .subscribe((data: any) => {
        this.StateList = data.GetStateParameter;
        this.StateList = this.StateList.sort((a: any, b: any) => a.StateName.localeCompare(b.StateName));
        this.filteredOptionsState = this.f.State.valueChanges
          .pipe(
            startWith<string | BranchList>(''),
            map(value => typeof value === 'string' ? value :
              value != null ? value.StateName : null),
            map(StateName => StateName ? this.filterState(StateName) :
              this.StateList.slice())
          );
        this.isLoading = false;
        this.chRef.detectChanges();
      },
        (error) => {
          console.error(error);
        }
      );
  }

  // Autocomplete Search Filter for region
  private filterState(name: string): BranchList[] {
    this.InvalidState = false;
    const filterValue = name.toLowerCase();
    return this.StateList.filter((option: any) =>
      option.StateName.toLowerCase().includes(filterValue) ||
      option.StateCode.toLocaleLowerCase().includes(filterValue))
  }

  // select or choose dropdown for region
  displayFnState(State: BranchList): string {
    return State && State.StateName ? State.StateName : '';
  }

  statevalidation() {
    this.submitted = false;
    if ((this.f.State.value.StateName === '' || this.f.State.value.StateName === null || this.f.State.value.StateName === undefined)) {
      this.InvalidState = true;
      return;
    }
    else {
      this.InvalidState = false;
    }
  }


  // Save Branch
  SaveBranch() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.branchForm.valid) {
      this.InvalidCity = false;
      this.InvalidState = false;
      return;
    } else {
      if (this.f.State.value.StateCode === null) {
        this.InvalidState = true;
        return;
      }
      if (this.InvalidCity === false && this.IsInvalidMobile === false && this.IsInvalidGSTNo === true && this.IsInvalidPan === false && this.InvalidState === false) {
        this.Branchmodal = new BranchList();
        this.Branchmodal.BranchCode = this.f.BranchCode.value;
        this.Branchmodal.BranchName = this.f.BranchName.value;
        this.Branchmodal.BranchAddress = this.f.Address.value;
        this.Branchmodal.City = this.f.City.value.CityCode;
        this.Branchmodal.Pin = this.f.Pin.value;
        this.Branchmodal.ContactNo = this.f.ContactNo.value;
        this.Branchmodal.Email = this.f.Email.value;
        this.Branchmodal.Pan = this.f.PANNo.value;
        this.Branchmodal.GSTNo = this.f.GSTNo.value;
        this.Branchmodal.StateCode = this.f.State.value.StateCode;
        this.Branchmodal.IsActive = AppCode.IsActiveString;
        this.Branchmodal.Addedby = String(this.UserId);

        if (this.pageState == AppCode.saveString) {
          this.Branchmodal.BranchId = 0;
          this.Branchmodal.Action = AppCode.addString;
        }
        else {
          this.Branchmodal.BranchId = this.BranchId;
          this.Branchmodal.Action = AppCode.editString;
        }
        this._service.SaveBranch_Service(this.Branchmodal)
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

  // redirect after click on cancel button
  redirect() {
    this.ClearForm();
    this.router.navigate(['/modules/masters/branch-list']);
  }

  // Clear form
  ClearForm() {
    this.f.BranchCode.setValue('');
    this.f.BranchName.setValue('');
    this.f.Address.setValue('');
    this.f.City.setValue('');
    this.f.Pin.setValue('');
    this.f.ContactNo.setValue('');
    this.f.Email.setValue('');
    this.f.PANNo.setValue('');
    this.f.GSTNo.setValue('');
    this.f.State.setValue('');
    this.chRef.detectChanges();
  }
  // Set data on click edit button row wise
  Setdata() {
    this.Title = "Update Branch";
    this.f.BranchCode.disable();
    this.pageState = this.State.state;
    this.Branchmodal = new BranchList();
    this.Branchmodal = this._SharedService.getData();
    if (this.Branchmodal !== undefined) {
      this.BranchId = this.Branchmodal.BranchId;
      this.f.BranchCode.setValue(this.Branchmodal.BranchCode);
      this.f.BranchName.setValue(this.Branchmodal.BranchName);
      this.f.Address.setValue(this.Branchmodal.BranchAddress);
      // this.f.City.setValue(this.Branchmodal.City);
      this.f.Pin.setValue(this.Branchmodal.Pin);
      this.f.ContactNo.setValue(this.Branchmodal.ContactNo);
      this.f.Email.setValue(this.Branchmodal.Email);
      this.f.PANNo.setValue(this.Branchmodal.Pan);
      this.f.GSTNo.setValue(this.Branchmodal.GSTNo);

      let city: any = {
        'CityCode': this.Branchmodal.City,
        'CityName': this.Branchmodal.CityName
      }
      this.f.City.setValue(city);

      let State: any = {
        'StateCode': this.Branchmodal.StateCode,
        'StateName': this.Branchmodal.StateName
      }
      this.f.State.setValue(State);
      this.chRef.detectChanges();
    }
    else {
      this.redirect();
    }

  }
  // Validation Mobile No
  mobileNoValidation(event: any) {
    this._appCode.numberonlyandcomma(event);
  }
  // validation Pan No
  PANNoValidation(event: any) {
    this._appCode.keyPressAlphanumeric(event);
  }
}


