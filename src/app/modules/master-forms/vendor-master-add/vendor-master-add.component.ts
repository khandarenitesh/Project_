import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MastersServiceService } from '../Services/masters-service.service';
import { AppCode } from 'src/app/app.code';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CityMaster } from '../Models/city-master.model';
import { VendorModel } from '../Models/VendorModel';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/SharedServices/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vendor-master-add',
  templateUrl: './vendor-master-add.component.html',
  styleUrls: ['./vendor-master-add.component.scss']
})
export class VendorMasterAddComponent implements OnInit {

  Title: string = "Add Vendor";
  pageState: string = '';
  InvalidCity: boolean = false;
  VendorForm: FormGroup;
  CityList: any = [];
  submitted: boolean = false;
  IsEmailFlag: boolean = true;
  isLoading: boolean = true;
  VendorModel: VendorModel;
  UserId: number = 0;
  BranchId: number = 0;
  VendorId: number = 0;
  IsGSTChecked: boolean = false;
  IsFlag: boolean = true;
  IsInvalidMobile: boolean = false;
  IsInvalidPan: boolean = false;

  IsFlagGst: boolean = true;
  IsInvalidGSTNo: boolean = true;
  State: any = {
    state: ''
  };

  //FOR AUTOCOMPLETE
  filteredOptionsCity: Observable<CityMaster[]>;

  constructor(
    private fb: FormBuilder,
    private _service: MastersServiceService,
    private chRef: ChangeDetectorRef,
    private _appCode: AppCode,
    private toaster: ToastrService,
    private _SharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private commoncode: AppCode,
  ) { }

  defaultform: any = {
    VendorName: '',
    Email: '',
    ContactNo: '',
    PANNo: '',
    GSTNo: '',
    Address: '',
    City: '',
    IsGST: ''
  };

  GST: string = '';

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
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

  // form controls
  initForm() {
    this.VendorForm = this.fb.group({
      VendorName: [
        this.defaultform.VendorName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      Email: [
        this.defaultform.Email,
        Validators.compose([
          Validators.required,
          Validators.email
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
      IsGST: [
        this.defaultform.IsGST
      ],
      GSTNo: [
        this.defaultform.GSTNo
      ],
      City: [
        this.defaultform.City,
        Validators.compose([
          Validators.required
        ]),
      ],
      Address: [
        this.defaultform.Address,
        Validators.compose([
          Validators.maxLength(200)
        ])
      ]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.VendorForm.controls;
  }

  redirect() {
    this.ClearForm();
    this.router.navigate(['/modules/masters/vendor-master']);
  }

  // Validation Mobile No
  mobileNoValidation(event: any) {
    this._appCode.numberonlyandcomma(event);
  }
  // validation Pan No
  PANNoValidation(event: any) {
    this._appCode.keyPressAlphanumeric(event);
  }

  numberValidation(event: any) {
    this.commoncode.numberOnly(event);
  }
  // Validation Email
  emailValidation() {
    let flag: boolean = false;
    if (this.f.Email.value === "") {
      this.IsFlag = false;
      this.IsEmailFlag = true;
      this.submitted = false;
      this.chRef.detectChanges();
    } else {
      flag = this._appCode.emailAddressOnly(this.f.Email.value.toLowerCase());
      if (flag === true) {
        this.IsEmailFlag = true;
        this.IsFlag = true;
        this.submitted = false;
        this.chRef.detectChanges();
      } else {
        this.IsEmailFlag = false;
        this.IsFlag = true;
        this.submitted = true;
        this.chRef.detectChanges();
      }
    }
  }


  //On click IsGst checkbox
  onchangeIsGstCheckBox(event: any) {
    if (this.pageState === "Save" && event === true) {
      this.IsGSTChecked = true
      this.f.GSTNo.setValue('');
    }
    else {
      this.IsGSTChecked = false;
      if (this.State.state === "Update" && event === false) {
        this.IsGSTChecked = false
        this.GST = "";
      } else if (this.State.state === "Update" && event === true) {
        this.f.IsGST.setValue(this.VendorModel.IsGST);
        this.f.GSTNo.setValue(this.VendorModel.GSTNumber);
        this.IsGSTChecked = true;
      }
    }
    this.chRef.detectChanges();
  }


  // Get city list
  GetCityList() {
    this._service.getCityList_Service(AppCode.ststString, AppCode.allString, AppCode.CityActiveString)
      .subscribe((data: any) => {
        this.CityList = data.GetCityParameter;
        this.CityList = this.CityList.sort((a: any, b: any) => a.CityName.localeCompare(b.CityName));
        this.filteredOptionsCity = this.f.City.valueChanges
          .pipe(
            startWith<string | CityMaster>(''),
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
  private filterCity(name: string): CityMaster[] {
    this.InvalidCity = false;
    const filterValue = name.toLowerCase();
    return this.CityList.filter((option: any) =>
      option.CityName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnCity(city: CityMaster): string {
    return city && city.CityName ? city.CityName : '';
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

  SaveVendor() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.VendorForm.valid) {
      this.InvalidCity = false;
      return;
    } else {
      if (this.InvalidCity === false && this.IsEmailFlag === true && this.IsInvalidMobile === false && this.IsInvalidPan === false && this.IsInvalidGSTNo === true) {
        this.VendorModel = new VendorModel();
        this.VendorModel.VendorName = this.f.VendorName.value;
        this.VendorModel.Email = this.f.Email.value;
        this.VendorModel.ContactNumber = this.f.ContactNo.value;
        this.VendorModel.PANNumber = this.f.PANNo.value;
        this.VendorModel.GSTNumber = this.f.GSTNo.value;
        this.VendorModel.City = this.f.City.value.CityCode;
        this.VendorModel.Address = this.f.Address.value;
        this.VendorModel.IsActive = AppCode.IsActiveString;
        this.VendorModel.Addedby = this.UserId;
        if (this.IsGSTChecked === true) {
          this.VendorModel.IsGST = 'Y';
          this.VendorModel.GSTNumber = this.f.GSTNo.value;
          if (this.f.GSTNo.value === "" || this.f.GSTNo.value === null || this.f.GSTNo.value === undefined || this.f.GSTNo.value === " ") {
            this.toaster.warning("Please enter a GST Number");
            return;
          }
        } else {
          this.VendorModel.IsGST = 'N';
          this.VendorModel.GSTNumber = " ";
        }
        if (this.pageState == AppCode.saveString) {
          this.VendorModel.BranchId = this.BranchId;
          this.VendorModel.Action = AppCode.addString;
          this.VendorModel.VendorId = 0;
        }
        else {
          this.VendorModel.BranchId = this.BranchId;
          this.VendorModel.Action = AppCode.editString;
          this.VendorModel.VendorId = this.VendorId;
        }
        this._service.SaveVendor_Service(this.VendorModel)
          .subscribe((data: any) => {
            if (data > 0) {
              if (this.pageState == AppCode.saveString) {
                this.toaster.success(AppCode.msg_saveSuccess);
                this.submitted = false;
                this.isLoading = false;
              } else {
                this.toaster.success(AppCode.msg_updateSuccess);
                this.isLoading = false;
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
      else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
      }
    }
  }

  // Set data on click edit button row wise
  Setdata() {
    this.Title = "Update Vendor";
    this.pageState = this.State.state;
    this.VendorModel = new VendorModel();
    this.VendorModel = this._SharedService.getData();
    if (this.VendorModel !== undefined) {

      this.VendorId = this.VendorModel.VendorId;
      this.BranchId = this.VendorModel.BranchId;
      this.f.VendorName.setValue(this.VendorModel.VendorName);
      this.f.Email.setValue(this.VendorModel.Email);
      this.f.ContactNo.setValue(this.VendorModel.ContactNumber);
      this.f.PANNo.setValue(this.VendorModel.PANNumber);
      this.f.GSTNo.setValue(this.VendorModel.GSTNumber);
      this.f.Address.setValue(this.VendorModel.Address);

      let city: any = {
        'CityCode': this.VendorModel.City,
        'CityName': this.VendorModel.CityName
      }
      this.f.City.setValue(city);
      if (this.VendorModel.IsGST === 'Y') {
        this.IsGSTChecked = true;
        this.f.IsGST.setValue(this.VendorModel.IsGST);
        this.f.GSTNo.setValue(this.VendorModel.GSTNumber);
        this.f.GSTNo.enable();
        this.GST = (this.VendorModel.IsGST);
      } else {
        this.IsGSTChecked = false;
        this.f.IsGST.setValue('');
        this.GST = (this.VendorModel.IsGST);
      }

      this.chRef.detectChanges();
    }
    else {
      this.redirect();
    }
  }

  // Clear form
  ClearForm() {
    this.f.VendorName.setValue('');
    this.f.Email.setValue('');
    this.f.ContactNo.setValue('');
    this.f.PANNo.setValue('');
    this.f.GSTNo.setValue('');
    this.f.City.setValue('');
    this.f.Address.setValue('');
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
  copyPastNumbeAllow() {
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
  // Alpha Number
  GstValidation(event: any) {
    this.commoncode.keyPressAlphanumeric(event);
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


}
