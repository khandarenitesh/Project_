import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { AppCode } from '../../../app.code';
import { SharedService } from '../../../SharedServices/shared.service';
import { MastersServiceService } from '../Services/masters-service.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { courierList } from '../Models/courierList';


@Component({
  selector: 'app-curier-add',
  templateUrl: './curier-add.component.html',
  styleUrls: ['./curier-add.component.scss']
})
export class CurierAddComponent implements OnInit {
  form: FormGroup;
  curierForm: FormGroup;
  submitted = false;
  Curiermodel: courierList;
  Editmodal: courierList;
  CityList: any = [];
  RegionList: any = [];
  DistrictList: any = [];
  BranchList: any[] = [];
  UserId: Number = 0;
  pageState: string = '';
  BranchId: number = 0;
  CourierId: number = 0;
  isLoading: boolean = false;
  IsEmailFlag: boolean = true;
  IsFlag: boolean = true;
  Title: string = "";
  InvalidRegion: boolean = false;
  InvalidDistrict: boolean = false;
  InvalidCity: boolean = false;
  InvalidBranch: boolean = false;
  IsInvalidMobile: boolean = false;

  State: any = {
    state: ''
  };

  //Autocomplete code

  filteredOptionsCity: Observable<courierList[]>;
  filteredOptRegion: Observable<courierList[]>;
  filteredOptDistrict: Observable<courierList[]>;
  BranchNameArray: Observable<courierList[]>;

  defaultform: any = {
    CourierName: '',
    Email: '',
    ContactNo: '',
    Region: '',
    District: '',
    City: '',
    Address: '',
    RatePerBoxes: ''
  };
  CityModel: any;
  courierList: any;

  constructor(
    private fb: FormBuilder,
    private _service: MastersServiceService,
    private _SharedService: SharedService,
    private route: ActivatedRoute,
    private commoncode: AppCode,
    private router: Router,
    private chRef: ChangeDetectorRef,
    private toaster: ToastrService,
    private _appCode: AppCode,
  ) { }

  ngOnInit(): void {
    this.Title = "Add Courier Details";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.pageState = AppCode.saveString;
    this.BranchId = obj.BranchId;
    this.initForm();
    this.GetRegionList();
    this.GetDistrictList();
    this.GetCityList();
    this.GetBranchList();
    // To Handle BranchId wise display Branch selected value only Branch Admin
    if (this.BranchId !== 0) {
      this.f.Branch.disable();
      // this.f.Branch.setValue(this.BranchId);
      let objbranch = {
        'BranchName': obj.BranchName,
        'BranchId': obj.BranchId,
      }
      this.f.Branch.setValue(objbranch);
    }
    this.route.queryParams.subscribe(params => {
      this.State = params;
    })
    if (this.State.state !== undefined && this.State.state !== null) {
      this.Setdata();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.curierForm.controls;
  }

  initForm() {
    this.curierForm = this.fb.group({
      CourierName: [
        this.defaultform.CourierName,
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
      Region: [
        this.defaultform.Region,
        Validators.compose([
          Validators.required
        ]),
      ],
      District: [
        this.defaultform.District,
        Validators.compose([
          Validators.required
        ]),
      ],
      City: [
        this.defaultform.City,
        Validators.compose([
          Validators.required
        ]),
      ],
      Address: [
        this.defaultform.Address
      ],
      Branch: [
        this.defaultform.Branch,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
      RatePerBoxes: [
        this.defaultform.RatePerBoxes,
        Validators.compose([
          Validators.required,
          Validators.maxLength(6),
        ]),
      ]
    });
  }

  // Get city list
  GetCityList() {
    this._service.getCityList_Service(AppCode.allString, AppCode.allString, AppCode.CityActiveString)
      .subscribe((data: any) => {
        this.CityList = data.GetCityParameter;
        this.CityList = this.CityList.sort((a: any, b: any) => a.CityName.localeCompare(b.CityName));
        this.filteredOptionsCity = this.f.City.valueChanges //formcontrolName
          .pipe(
            startWith<string | courierList>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.CityName : null),
            map(CityName => CityName ? this.filter(CityName) : this.CityList.slice())
          );
        this.chRef.detectChanges();
      },
        (error) => {
          console.error(error);
        }
      );
  }
  // Autocomplete Search Filter
  private filter(name: string): courierList[] {
    this.InvalidCity = false;
    const filterValue = name.toLowerCase();
    return this.CityList.filter((option: any) =>
      option.CityName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values for city
  displayFn(city: courierList): string {
    return city && city.CityName ? city.CityName : '';
  }


  // Get Branch List
  // GetBranchList() {
  //   this._service.getBranchList_Service(AppCode.allString)
  //     .subscribe((data: any) => {
  //       this.BranchList = data;
  //       this.chRef.detectChanges();
  //     }, (error) => {
  //       console.error(error);
  //     });
  // }

  // Get Branch List
  GetBranchList() {
    this._service.getBranchList_Service(AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.BranchList = data;
          this.BranchList = this.BranchList.sort((a: any, b: any) => a.BranchName.localeCompare(b.BranchName));
          this.BranchNameArray = this.f.Branch.valueChanges
            .pipe(
              startWith<string | courierList>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.BranchName : null),
              map(BranchName => BranchName ? this.filterBranchName(BranchName) : this.BranchList.slice())
            );
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  // Autocomplete Search Filter
  private filterBranchName(name: string): courierList[] {
    this.InvalidBranch = false;
    const filterValue = name.toLowerCase();
    return this.BranchList.filter((option: any) =>
      option.BranchName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnBranchName(name: courierList): string {
    return name && name.BranchName ? name.BranchName : '';
  }
  branchValidation() {
    this.submitted = false;
    if ((this.f.Branch.value === null || this.f.Branch.value.BranchId === '' || this.f.Branch.value.BranchId === undefined || this.f.Branch.value.BranchId === null)) {
      this.InvalidBranch = true;
      this.isLoading = false;
      return;
    }
    else {
      this.InvalidBranch = false;
    }
  }


  // Get region list
  GetRegionList() {
    this._service.getRegionList_Service(AppCode.allString)
      .subscribe((data: any) => {
        this.RegionList = data.GetStateParameter;
        this.RegionList = this.RegionList.sort((a: any, b: any) => a.StateName.localeCompare(b.StateName));
        this.filteredOptRegion = this.f.Region.valueChanges
          .pipe(
            startWith<string | courierList>(''),
            map(value => typeof value === 'string' ? value :
              value !== null ? value.StateName : null),
            map(StateName => StateName ? this.filterRegion(StateName) :
              this.RegionList.slice())
          );
        this.chRef.detectChanges();
      },
        (error) => {
          console.error(error);
        }
      );
  }

  // Autocomplete Search Filter for region
  private filterRegion(name: string): courierList[] {
    this.InvalidRegion = false;
    const filterValue = name.toLowerCase();
    return this.RegionList.filter((option: any) =>
      option.StateName.toLowerCase().includes(filterValue))
  }

  // select or choose dropdown for region
  displayFnRegion(Region: courierList): string {
    return Region && Region.StateName ? Region.StateName : '';
  }



  // Gte District list
  GetDistrictList() {
    this._service.getDistrictList_Service(AppCode.ststString, AppCode.allString)
      .subscribe((data: any) => {
        this.DistrictList = data.GetDistrictParameter;
        this.DistrictList = this.DistrictList.sort((a: any, b: any) => a.DistrictName.localeCompare(b.DistrictName));
        this.filteredOptDistrict = this.f.District.valueChanges //FormcontrolName
          .pipe(
            startWith<string | courierList>(''),
            map(value => typeof value === 'string' ? value :
              value !== null ? value.DistrictName : null),
            map(DistrictName => DistrictName ? this.filterDistrict(DistrictName) :
              this.DistrictList.slice())
          )
        this.chRef.detectChanges();
      },
        (error) => {
          console.error(error);
        }
      );
  }

  // Autocomplete Search Filter for District
  private filterDistrict(name: string): courierList[] {
    this.InvalidDistrict = false
    const filterValue = name.toLowerCase();
    return this.DistrictList.filter((option: any) =>
      option.DistrictName.toLowerCase().includes(filterValue))
  }

  // select or choose dropdown for District
  displayFnDistrict(District: courierList): string {
    return District && District.DistrictName ? District.DistrictName : '';
  }

  numberValidation(event: any) {
    this.commoncode.numberOnly(event);
  }

  // Validation Mobile No
  mobileNoValidation(event: any) {
    this.commoncode.numberonlyandcomma(event);
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

  // Set data on click edit button
  Setdata() {
    this.Title = "Update Courier Details";
    this.f.CourierName.disable();
    this.pageState = this.State.state;
    this.Curiermodel = new courierList();
    this.Curiermodel = this._SharedService.getData();
    if (this.Curiermodel !== undefined) {
      this.CourierId = this.Curiermodel.CourierId;
      if (this.BranchId !== 0) { // To Handle BranchId wise display Branch selected value disabled only Branch Admin
        this.f.Branch.disable();
        //  this.f.Branch.setValue(this.Curiermodel.BranchId);
        let branch: any = {
          'BranchId': this.Curiermodel.BranchId,
          'BranchName': this.Curiermodel.BranchName
        }
        this.f.Branch.setValue(branch);
      } else {
        // this.f.Branch.setValue(this.Curiermodel.BranchId);
        let branch: any = {
          'BranchId': this.Curiermodel.BranchId,
          'BranchName': this.Curiermodel.BranchName
        }
        this.f.Branch.setValue(branch);
      }
      this.f.CourierName.setValue(this.Curiermodel.CourierName);
      this.f.Address.setValue(this.Curiermodel.CourierAddress);
      // this.f.City.setValue(this.Curiermodel.CityCode);
      let city: any = {
        'CityCode': this.Curiermodel.CityCode,
        'CityName': this.Curiermodel.CityName
      }
      this.f.City.setValue(city);

      // this.f.District.setValue(this.Curiermodel.DistrictCode);
      let district: any = {
        'DistrictCode': this.Curiermodel.DistrictCode,
        'DistrictName': this.Curiermodel.DistrictName
      }
      this.f.District.setValue(district);

      // this.f.Region.setValue(this.Curiermodel.StateCode);
      let region: any = {
        'StateCode': this.Curiermodel.StateCode,
        'StateName': this.Curiermodel.StateName
      }
      this.f.Region.setValue(region);
      this.f.RatePerBoxes.setValue(this.Curiermodel.RatePerBox);
      this.f.ContactNo.setValue(this.Curiermodel.CourierMobNo);
      this.f.Email.setValue(this.Curiermodel.CourierEmail);
      this.chRef.detectChanges();
    } else {
      this.redirect();
    }
  }

  RegionValidation() {
    this.submitted = false;
    if ((this.f.Region.value.StateCode === '' || this.f.Region.value.StateCode === null || this.f.Region.value.StateCode === undefined)) {
      this.InvalidRegion = true;
      return;
    } else {
      this.InvalidRegion = false;
    }
    this.chRef.detectChanges();
  }

  DistrictValidation() {
    this.submitted = false;
    if ((this.f.District.value.DistrictCode === '' || this.f.District.value.DistrictCode === null || this.f.District.value.DistrictCode === undefined)) {
      this.InvalidDistrict = true;
      return;
    } else {
      this.InvalidDistrict = false;
    }
    this.chRef.detectChanges();
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


  // save curier details
  saveCurier() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.curierForm.valid) {
      this.isLoading = false;
      this.InvalidCity = false;
      this.InvalidDistrict = false;
      this.InvalidRegion = false;
      this.InvalidBranch = false;
      return;
    }
    else {
      if (this.InvalidRegion === false && this.InvalidDistrict === false && this.InvalidCity === false && this.InvalidBranch === false
        && this.IsInvalidMobile === false && this.IsEmailFlag === true) {
        this.Curiermodel = new courierList();
        this.Curiermodel.CourierName = this.f.CourierName.value;
        this.Curiermodel.CourierEmail = this.f.Email.value;
        this.Curiermodel.CourierMobNo = this.f.ContactNo.value;
        this.Curiermodel.CourierAddress = this.f.Address.value;
        this.Curiermodel.CityCode = this.f.City.value.CityCode;
        this.Curiermodel.StateCode = this.f.Region.value.StateCode;
        this.Curiermodel.DistrictCode = this.f.District.value.DistrictCode;
        this.Curiermodel.RatePerBox = this.f.RatePerBoxes.value;
        this.Curiermodel.IsActive = AppCode.IsActiveString;
        this.Curiermodel.Addedby = String(this.UserId);
        // this.Curiermodel.BranchId = this.BranchId;
        if (this.BranchId === 0) {
          this.Curiermodel.BranchId = this.f.Branch.value.BranchId;//For Autocomplete
        } else {
          this.Curiermodel.BranchId = this.BranchId;
        }
        if (this.pageState == AppCode.saveString) {
          this.Curiermodel.BranchId = this.f.Branch.value.BranchId;//For Autocomplete
          this.Curiermodel.Action = AppCode.addString;
        }
        else {
          this.Curiermodel.BranchId = this.f.Branch.value.BranchId;//For Autocomplete
          this.Curiermodel.CourierId = this.CourierId;
          this.Curiermodel.Action = AppCode.editString;
        }
        this._service.SaveCurier_Service(this.Curiermodel)
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
            } else {
              this.toaster.error(data);
              this.redirect();
            }
          }, (error) => {
            console.error(error);
          });
      }
      else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
      }
    }
  }

  // clear form on click cancel button
  ClearForm() {
    this.f.CourierName.setValue('');
    this.f.ContactNo.setValue('');
    this.f.Region.setValue('');
    this.f.Email.setValue('');
    this.f.District.setValue('');
    this.f.City.setValue('');
    this.f.Address.setValue('');
    this.f.RatePerBoxes.setValue('');
    // if (this.BranchId === 0) {
    //   this.f.Branch.setValue(''); //For Super Admin clear branch
    // }
    this.chRef.detectChanges();
  }

  // redirect to list page
  redirect() {
    this.ClearForm();
    this.router.navigate(['/modules/masters/courier-list']);
  }

  onCourierNamechange() {
    let model = {
      CourierName: this.f.CourierName.value,
    };
    this._service.getCheckCourierNameAvl_Service(model).subscribe((data: any) => {
      if (data !== null) {
        if (data.flag == -1) {
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'This Courier Name already exists',
          });
        }
      }
    });
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
}
