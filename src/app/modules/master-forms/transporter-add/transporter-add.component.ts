import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { SharedService } from '../../../SharedServices/shared.service';
import { TransporterModel } from '../Models/TransporterModel';
import { MastersServiceService } from '../Services/masters-service.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-transporter-add',
  templateUrl: './transporter-add.component.html',
  styleUrls: ['./transporter-add.component.scss']
})
export class TransporterAddComponent implements OnInit {
  transporterForm: FormGroup;
  TransporterModel: TransporterModel;
  Editmodal: TransporterModel;
  CityList: any = [];
  RegionList: any = [];
  DistrictList: any = [];
  BranchList: any[] = [];
  UserId: number = 0;
  IsSucess: boolean = false;
  Message: string = "";
  pageState: string = '';
  BranchId: number = 0;
  isLoading: boolean = false;
  TransporterId: number = 0;
  submitted = false;
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
  filteredOptRegion: Observable<TransporterModel[]>;
  filteredOptDistrict: Observable<TransporterModel[]>;
  filteredOptCity: Observable<TransporterModel[]>;
  BranchNameArray: Observable<TransporterModel[]>;

  defaultform: any = {
    TraspoterNumber: '',
    TransporterName: '',
    Email: '',
    ContactNo: '',
    Region: '',
    District: '',
    City: '',
    RatePerBoxes: '',
    Address: ''
  };

  constructor(
    private fb: FormBuilder,
    private _service: MastersServiceService,
    private _SharedService: SharedService,
    private route: ActivatedRoute,
    private commoncode: AppCode,
    private router: Router,
    private chef: ChangeDetectorRef,
    private toaster: ToastrService,
    private _appCode: AppCode
  ) { }

  ngOnInit(): void {
    this.Title = "Add Transporter";
    this.pageState = AppCode.saveString;
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.initForm();
    this.GetRegionList();
    this.GetDistrictList();
    this.GetCityList();
    this.GetBranchList();
    // To Handle BranchId wise display Branch selected value only Branch Admin
    if (this.BranchId !== 0) {
      this.f.Branch.disable();
      let objbranch = {
        'BranchId': obj.BranchId,
        'BranchName': obj.BranchName
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
    return this.transporterForm.controls;
  }

  initForm() {
    this.transporterForm = this.fb.group({
      TransporterNumber: [
        this.defaultform.TransporterNumber,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      TransporterName: [
        this.defaultform.TransporterName,
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
          Validators.minLength(3),
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
        this.defaultform.Region
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
      RatePerBoxes: [
        this.defaultform.RatePerBoxes,
        Validators.compose([
          Validators.required,
          Validators.maxLength(6),
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
    });
  }

  //get city list
  GetCityList() {
    this._service.getCityList_Service(AppCode.allString, AppCode.allString, AppCode.CityActiveString)
      .subscribe((data: any) => {
        this.CityList = data.GetCityParameter;
        this.CityList = this.CityList.sort((a: any, b: any) => a.CityName.localeCompare(b.CityName));
        this.filteredOptCity = this.f.City.valueChanges
          .pipe(
            startWith<string | TransporterModel>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.CityName : null),
            map(CityName => CityName ? this.filterCity(CityName) : this.CityList.slice())
          );
        this.chef.detectChanges();
      }, (error) => {
        console.error(error);
        this.chef.detectChanges();
      });
  }

  // Autocomplete Search Filter
  private filterCity(name: string): TransporterModel[] {
    this.InvalidCity = false;
    const filterValue = name.toLowerCase();
    return this.CityList.filter((option: any) =>
      option.CityName.toLowerCase().includes(filterValue) ||
      option.CityCode.toLocaleLowerCase().includes(filterValue))
  }
  // Select or Choose dropdown values for city
  displayFnCity(city: TransporterModel): string {
    return city && city.CityName ? city.CityName : '';
  }

  // Get Branch List
  GetBranchList() {
    this._service.getBranchList_Service(AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.BranchList = data;
          this.BranchList = this.BranchList.sort((a: any, b: any) => a.BranchName.localeCompare(b.BranchName));
          this.BranchNameArray = this.f.Branch.valueChanges
            .pipe(
              startWith<string | TransporterModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.BranchName : null),
              map(BranchName => BranchName ? this.filterBranchName(BranchName) : this.BranchList.slice())
            );
          this.chef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  // Autocomplete Search Filter
  private filterBranchName(name: string): TransporterModel[] {
    this.InvalidBranch = false;
    const filterValue = name.toLowerCase();
    return this.BranchList.filter((option: any) =>
      option.BranchName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnBranchName(name: TransporterModel): string {
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

  //get state list
  GetRegionList() {
    this._service.getRegionList_Service(AppCode.allString)
      .subscribe((data: any) => {
        this.RegionList = data.GetStateParameter;
        this.RegionList = this.RegionList.sort((a: any, b: any) => a.StateName.localeCompare(b.StateName));
        this.filteredOptRegion = this.f.Region.valueChanges
          .pipe(
            startWith<string | TransporterModel>(''),
            map(value => typeof value === 'string' ? value :
              value !== null ? value.StateName : null),
            map(StateName => StateName ? this.filterRegion(StateName) :
              this.RegionList.slice())
          );
        this.chef.detectChanges();
      }, (error) => {
        console.error(error);
        this.chef.detectChanges();
      });
  }

  // Autocomplete Search Filter for region
  private filterRegion(name: string): TransporterModel[] {
    this.InvalidRegion = false;
    const filterValue = name.toLowerCase();
    return this.RegionList.filter((option: any) =>
      option.StateName.toLowerCase().includes(filterValue) ||
      option.StateCode.toLocaleLowerCase().includes(filterValue))
  }

  // select or choose dropdown for region
  displayFnRegion(Region: TransporterModel): string {
    return Region && Region.StateName ? Region.StateName : '';
  }

  //get district list
  GetDistrictList() {
    this._service.getDistrictList_Service(AppCode.ststString, AppCode.allString)
      .subscribe((data: any) => {
        this.DistrictList = data.GetDistrictParameter;
        this.DistrictList = this.DistrictList.sort((a: any, b: any) => a.DistrictName.localeCompare(b.DistrictName));
        this.filteredOptDistrict = this.f.District.valueChanges
          .pipe(
            startWith<string | TransporterModel>(''),
            map(value => typeof value === 'string' ? value :
              value !== null ? value.DistrictName : null),
            map(DistrictName => DistrictName ? this.filterDistrict(DistrictName) :
              this.DistrictList.slice())
          )
        this.chef.detectChanges();
      }, (error) => {
        console.error(error);
        this.chef.detectChanges();
      });
  }

  // Autocomplete Search Filter for District
  private filterDistrict(name: string): TransporterModel[] {
    this.InvalidDistrict = false;
    const filterValue = name.toLowerCase();
    return this.DistrictList.filter((option: any) =>
      option.DistrictName.toLowerCase().includes(filterValue) ||
      option.DistrictCode.toLocaleLowerCase().includes(filterValue))
  }

  // select or choose dropdown for District
  displayFnDistrict(District: TransporterModel): string {
    return District && District.DistrictName ? District.DistrictName : '';
  }

  // Number validation
  numberValidation(event: any) {
    this.commoncode.numberOnly(event);
  }
  // Validation Mobile No
  mobileNoValidation(event: any) {
    this.commoncode.numberonlyandcomma(event);
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
      flag = this._appCode.emailAddressOnly(this.f.Email.value.toLowerCase());
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

  RegionValidation() {
    this.submitted = false;
    if ((typeof this.f.Region.value === 'string' && this.f.Region.value !== '')) {
      this.InvalidRegion = true;
      return;
    }
    else {
      this.InvalidRegion = false;
    }
    this.chef.detectChanges();
  }

  DistrictValidation() {
    if ((this.f.District.value.DistrictCode === '' || this.f.District.value.DistrictCode === null || this.f.District.value.DistrictCode === undefined)) {
      this.InvalidDistrict = true;
      return;
    } else {
      this.InvalidDistrict = false;
    }
    this.chef.detectChanges();
  }

  CityValidation() {
    if ((this.f.City.value.CityCode === '' || this.f.City.value.CityCode === null || this.f.City.value.CityCode === undefined)) {
      this.InvalidCity = true;
      return;
    } else {
      this.InvalidCity = false;
    }
    this.chef.detectChanges();
  }

  //set / edit /update data
  Setdata() {
    this.Title = "Update Transporter";
    this.f.TransporterNumber.disable();
    this.pageState = this.State.state;
    this.TransporterModel = new TransporterModel();
    this.TransporterModel = this._SharedService.getData();
    if (this.TransporterModel !== undefined) {
      this.TransporterId = this.TransporterModel.TransporterId;
      if (this.BranchId !== 0) { // To Handle BranchId wise display Branch selected value disabled only Branch Admin
        this.f.Branch.disable();
        let branch: any = {
          'BranchId': this.TransporterModel.BranchId,
          'BranchName': this.TransporterModel.BranchName
        }
        this.f.Branch.setValue(branch);
      } else {
        let branch: any = {
          'BranchId': this.TransporterModel.BranchId,
          'BranchName': this.TransporterModel.BranchName
        }
        this.f.Branch.setValue(branch);
      }
      this.f.TransporterNumber.setValue(this.TransporterModel.TransporterNo);
      this.f.TransporterName.setValue(this.TransporterModel.TransporterName);
      this.f.Address.setValue(this.TransporterModel.TransporterAddress);
      let region: any = {
        'StateCode': this.TransporterModel.StateCode,
        'StateName': this.TransporterModel.StateName
      }
      this.f.Region.setValue(region);
      let district: any = {
        'DistrictCode': this.TransporterModel.DistrictCode,
        'DistrictName': this.TransporterModel.DistrictName
      }
      this.f.District.setValue(district);
      let city: any = {
        'CityCode': this.TransporterModel.CityCode,
        'CityName': this.TransporterModel.CityName
      }
      this.f.City.setValue(city);
      this.f.ContactNo.setValue(this.TransporterModel.TransporterMobNo);
      this.f.RatePerBoxes.setValue(this.TransporterModel.RatePerBox);
      this.f.Email.setValue(this.TransporterModel.TransporterEmail);
      this.chef.detectChanges();
    } else {
      this.redirect();
    }
  }

  //save /add data
  saveTransporter() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.transporterForm.valid) {
      this.isLoading = false;
      this.InvalidCity = false;
      this.InvalidDistrict = false;
      this.InvalidBranch = false;
      return;
    }
    this.TransporterModel = new TransporterModel();
    if (this.InvalidRegion === false && this.InvalidDistrict === false && this.InvalidCity === false && this.InvalidBranch === false
      && this.IsInvalidMobile === false && this.IsEmailFlag === true) {
      if (this.BranchId === 0) {
        this.TransporterModel.BranchId = this.f.Branch.value.BranchId;//For Autocomplete
      }
      else {
        this.TransporterModel.BranchId = this.f.Branch.value.BranchId;//For Autocomplete
      }
      this.TransporterModel.TransporterNo = this.f.TransporterNumber.value;
      this.TransporterModel.TransporterName = this.f.TransporterName.value;
      this.TransporterModel.TransporterEmail = this.f.Email.value;
      this.TransporterModel.TransporterMobNo = this.f.ContactNo.value;
      this.TransporterModel.CityCode = this.f.City.value.CityCode;
      this.TransporterModel.DistrictCode = this.f.District.value.DistrictCode;
      this.TransporterModel.StateCode = this.f.Region.value.StateCode;
      this.TransporterModel.TransporterAddress = this.f.Address.value;
      this.TransporterModel.IsActive = AppCode.IsActiveString;
      this.TransporterModel.Addedby = String(this.UserId);
      this.TransporterModel.RatePerBox = this.f.RatePerBoxes.value;
      if (this.pageState == AppCode.saveString) {
        this.TransporterModel.BranchId = this.f.Branch.value.BranchId;//For Autocomplete
        this.TransporterModel.Action = AppCode.addString;
      }
      else {
        this.TransporterModel.BranchId = this.f.Branch.value.BranchId;//For Autocomplete
        this.TransporterModel.TransporterId = this.TransporterId;
        this.TransporterModel.Action = AppCode.editString;
      }
      this._service.SaveTransporter_Service(this.TransporterModel)
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
            this.chef.detectChanges();
          } else {
            this.toaster.warning(data);
            this.redirect();
          }
        }, (error) => {
          console.error(error);
          this.chef.detectChanges();
        });
    }
    else {
      this.toaster.error(AppCode.FailStatus);
      this.isLoading = false;
    }
  }
  // Transporter Number is available
  onTransporterNoChange() {
    this._service.getTransporterNo_Service(this.f.TransporterNumber.value)
      .subscribe((data: any) => {
        if (data !== null) {
          if (data.Flag == -1) {
            Swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: 'This Transporter Number is already exists with' + data.TransporterName,
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
    this.f.TransporterNumber.setValue('');
    this.f.TransporterName.setValue('');
    this.f.ContactNo.setValue('');
    this.f.Region.setValue('');
    this.f.Email.setValue('');
    this.f.District.setValue('');
    this.f.City.setValue('');
    this.f.Address.setValue('');
    this.f.Branch.setValue('');
    if (this.BranchId === 0) {
      this.f.Branch.setValue(''); //For Super Admin clear branch
    }
    this.chef.detectChanges();
  }

  // Redirect to Transporter List
  redirect() {
    this.ClearForm();
    this.router.navigate(['/modules/masters/transporter-list']);
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

}
