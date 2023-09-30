import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCode } from 'src/app/app.code';
import { SharedService } from 'src/app/SharedServices/shared.service';
import { CartingAgentModel } from '../Models/carting-agent-add';
import { MastersServiceService } from '../Services/masters-service.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-carting-agent-add',
  templateUrl: './carting-agent-add.component.html',
  styleUrls: ['./carting-agent-add.component.scss'],
})
export class CartingAgentAddComponent implements OnInit {
  form: FormGroup;
  cartingagentForm: FormGroup;
  submitted = false;
  Cartingagentmodel: CartingAgentModel;
  Editmodal: CartingAgentModel;
  CityList: any = [];
  RegionList: any = [];
  DistrictList: any = [];
  BranchList: any[] = [];
  UserId: Number = 0;
  pageState: string = '';
  BranchId: number = 0;
  isLoading: boolean = false;
  CAId: number = 0;
  IsEmailFlag: boolean = true;
  IsInvalidGSTNo: boolean = true;
  IsFlag: boolean = true;
  IsFlagGst: boolean = true;
  InvalidRegion: boolean = false;
  InvalidDistrict: boolean = false;
  InvalidCity: boolean = false;
  InvalidBranch: boolean = false;
  IsInvalidMobile: boolean = false;
  IsInvalidPan: boolean = false;
  Title: string = '';
  State: any = {
    state: '',
  };

  //Autocomplete code
  filteredOptRegion: Observable<CartingAgentModel[]>;
  filteredOptDistrict: Observable<CartingAgentModel[]>;
  filteredOptCity: Observable<CartingAgentModel[]>;
  filteredOptBranch: Observable<CartingAgentModel[]>;
  BranchNameArray: Observable<CartingAgentModel[]>;

  defaultform: any = {
    CAId: '',
    CAName: '',
    CAEmail: '',
    CAMobNo: '',
    CAPan: '',
    GSTNo: '',
    Region: '',
    District: '',
    City: '',
    Address: '',
  };

  constructor(
    private fb: FormBuilder,
    private _service: MastersServiceService,
    private _SharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private chRef: ChangeDetectorRef,
    private toaster: ToastrService,
    private _appCode: AppCode
  ) { }

  ngOnInit(): void {
    this.Title = 'Add Carting Agent';
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.initForm();
    this.GetRegionList();
    this.GetDistrictList();
    this.GetCityList();
    this.GetBranchList();
    if (this.BranchId !== 0) {
      this.f.Branch.disable();
      // this.f.Branch.setValue(this.BranchId);
      let objbranch = {
        'BranchName': obj.BranchName,
        'BranchId': obj.BranchId,
      }
      this.f.Branch.setValue(objbranch);
    }
    this.pageState = AppCode.saveString;
    this.route.queryParams.subscribe((params) => {
      this.State = params;
    });
    if (this.State.state !== undefined && this.State.state !== null) {
      this.Setdata();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.cartingagentForm.controls;
  }

  initForm() {
    this.cartingagentForm = this.fb.group({
      CAName: [
        this.defaultform.CAName,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      CAEmail: [
        this.defaultform.CAEmail,
        Validators.compose([
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]),
      ],
      CAMobNo: [
        this.defaultform.CAMobNo,
        Validators.compose([Validators.required, Validators.maxLength(22)]),
      ],
      CAPan: [this.defaultform.CAPan,
      Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10)])],
      GSTNo: [this.defaultform.GSTNo],
      Region: [this.defaultform.Region],
      District: [this.defaultform.District],
      City: [this.defaultform.City],
      Address: [this.defaultform.Address],
      Branch: [
        this.defaultform.Branch,
        Validators.compose([Validators.required, Validators.maxLength(250)]),
      ],
    });
  }
  // Get City list
  GetCityList() {
    this._service
      .getCityList_Service(
        AppCode.allString,
        AppCode.allString,
        AppCode.CityActiveString
      )
      .subscribe(
        (data: any) => {
          this.CityList = data.GetCityParameter;
          this.CityList = this.CityList.sort((a: any, b: any) => a.CityName.localeCompare(b.CityName));
          this.filteredOptCity = this.f.City.valueChanges   // formControlName Used(f)
            .pipe(
              startWith<string | CartingAgentModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.CityName : null),
              map(CityName => CityName ? this.filterCity(CityName) : this.CityList.slice())
            );
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }


  // Autocomplete Search Filter
  private filterCity(name: string): CartingAgentModel[] {
    this.InvalidCity = false;
    const filterValue = name.toLowerCase();
    return this.CityList.filter((option: any) =>
      option.CityName.toLowerCase().includes(filterValue))
  }
  // Select or Choose dropdown values for city
  displayFnCity(city: CartingAgentModel): string {
    return city && city.CityName ? city.CityName : '';
  }

  // Get Branch List
  // GetBranchList() {
  //   this._service.getBranchList_Service(AppCode.allString).subscribe(
  //     (data: any) => {
  //       this.BranchList = data;
  //       this.chRef.detectChanges();
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  // Get Branch List
  GetBranchList() {
    this._service.getBranchList_Service(AppCode.allString)
      .subscribe(
        (data: any) => {
          this.BranchList = data;
          this.BranchList = this.BranchList.sort((a: any, b: any) => a.BranchName.localeCompare(b.BranchName));
          this.BranchNameArray = this.f.Branch.valueChanges
            .pipe(
              startWith<string | CartingAgentModel>(''),
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
  private filterBranchName(name: string): CartingAgentModel[] {
    this.InvalidBranch = false;
    const filterValue = name.toLowerCase();
    return this.BranchList.filter((option: any) =>
      option.BranchName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnBranchName(name: CartingAgentModel): string {
    return name && name.BranchName ? name.BranchName : '';
  }
  branchValidation() {
    this.submitted = false;
    if ((this.f.Branch.value === null || this.f.Branch.value.BranchName === '' || this.f.Branch.value.BranchName === undefined || this.f.Branch.value.BranchName === null)) {
      this.InvalidBranch = true;
      this.isLoading = false;
      return;
    }
    else {
      this.InvalidBranch = false;
    }
  }

  // Validation Mobile No
  mobileNoValidation(event: any) {
    this._appCode.numberonlyandcomma(event);
  }


  // Alpha Number
  GstValidation(event: any) {
    this._appCode.keyPressAlphanumeric(event);
  }
  // Get Region list
  GetRegionList() {
    this._service.getRegionList_Service(AppCode.allString).subscribe(
      (data: any) => {
        this.RegionList = data.GetStateParameter;
        this.RegionList = this.RegionList.sort((a: any, b: any) => a.StateName.localeCompare(b.StateName));
        this.filteredOptRegion = this.f.Region.valueChanges
          .pipe(
            startWith<string | CartingAgentModel>(''),
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
  private filterRegion(name: string): CartingAgentModel[] {
    this.InvalidRegion = false;
    const filterValue = name.toLowerCase();
    return this.RegionList.filter((option: any) =>
      option.StateName.toLowerCase().includes(filterValue) ||
      option.StateCode.toLocaleLowerCase().includes(filterValue))
  }

  // select or choose dropdown for region
  displayFnRegion(Region: CartingAgentModel): string {
    return Region && Region.StateName ? Region.StateName : '';
  }


  // Get District list
  GetDistrictList() {
    this._service
      .getDistrictList_Service(AppCode.ststString, AppCode.allString)
      .subscribe(
        (data: any) => {
          this.DistrictList = data.GetDistrictParameter;
          this.DistrictList = this.DistrictList.sort((a: any, b: any) => a.DistrictName.localeCompare(b.DistrictName));
          this.filteredOptDistrict = this.f.District.valueChanges
            .pipe(
              startWith<string | CartingAgentModel>(''),
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
  private filterDistrict(name: string): CartingAgentModel[] {
    this.InvalidDistrict = false;
    const filterValue = name.toLowerCase();
    return this.DistrictList.filter((option: any) =>
      option.DistrictName.toLowerCase().includes(filterValue) ||
      option.DistrictCode.toLocaleLowerCase().includes(filterValue))
  }

  // select or choose dropdown for District
  displayFnDistrict(District: CartingAgentModel): string {
    return District && District.DistrictName ? District.DistrictName : '';
  }

  // Number validation
  numberValidation(event: any) {
    this._appCode.numberOnly(event);
  }

  // Validation Email
  emailValidation() {
    let flag: boolean = false;
    if (this.f.CAEmail.value === '') {
      this.IsFlag = false; // Email Address if Empty
      this.IsEmailFlag = true; // valid email
    } else {
      flag = this._appCode.emailAddressOnly(this.f.CAEmail.value.toLowerCase());
      if (flag === true) {
        this.IsEmailFlag = true; // valid email
        this.IsFlag = true; // Email Address filled
      } else {
        this.IsEmailFlag = false; // invalid email
        this.IsFlag = true; // Email Address if Empty
      }
    }
  }

  // save carting agent
  SaveCartingAgent() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.cartingagentForm.valid) {
      this.isLoading = false;
      this.InvalidBranch = false;
      return;
    } else {
      if (this.InvalidBranch === false && this.InvalidRegion === false && this.InvalidDistrict === false && this.InvalidCity === false && this.IsInvalidPan === false
        && this.IsInvalidGSTNo === true && this.IsInvalidMobile === false && this.IsEmailFlag === true) {
        this.Cartingagentmodel = new CartingAgentModel();
        this.Cartingagentmodel.CAName = this.f.CAName.value;
        this.Cartingagentmodel.CAMobNo = this.f.CAMobNo.value;
        this.Cartingagentmodel.CAPan = this.f.CAPan.value;
        this.Cartingagentmodel.GSTNo = this.f.GSTNo.value;
        this.Cartingagentmodel.CAEmail = this.f.CAEmail.value;
        this.Cartingagentmodel.StateCode = this.f.Region.value.StateCode;
        this.Cartingagentmodel.DistrictCode = this.f.District.value.DistrictCode;
        this.Cartingagentmodel.CityCode = this.f.City.value.CityCode;
        this.Cartingagentmodel.CAAddress = this.f.Address.value;
        this.Cartingagentmodel.IsActive = AppCode.IsActiveString;
        this.Cartingagentmodel.Addedby = String(this.UserId);
        if (this.BranchId === 0) {
          this.Cartingagentmodel.BranchId = this.f.Branch.value.BranchId;
        } else {
          this.Cartingagentmodel.BranchId = this.BranchId;
        }
        if (this.pageState == AppCode.saveString) {
          this.Cartingagentmodel.Action = AppCode.addString;
        } else {
          this.Cartingagentmodel.CAId = this.CAId;
          this.Cartingagentmodel.Action = AppCode.editString;
        }
        this._service.SaveCartingAgent_Service(this.Cartingagentmodel).subscribe(
          (data: any) => {
            if (data === AppCode.SuccessStatus) {
              if (this.pageState == AppCode.saveString) {
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
  // clear values an click cancel
  ClearForm() {
    this.f.CAName.setValue('');
    this.f.CAMobNo.setValue('');
    this.f.CAPan.setValue('');
    this.f.GSTNo.setValue('');
    this.f.CAEmail.setValue('');
    this.f.Region.setValue('');
    this.f.District.setValue('');
    this.f.City.setValue('');
    this.f.Address.setValue('');
    this.f.Branch.setValue('');
    if (this.BranchId === 0) {
      this.f.Branch.setValue(''); //For Super Admin clear branch
    }
    this.chRef.detectChanges();
  }

  // set data to the input fields
  Setdata() {
    this.Title = 'Update Carting Agent';
    this.f.CAName.disable();
    this.pageState = this.State.state;
    this.Cartingagentmodel = new CartingAgentModel();
    this.Cartingagentmodel = this._SharedService.getData();
    if (this.Cartingagentmodel !== undefined) {
      if (this.BranchId !== 0) {
        // To Handle BranchId wise display Branch selected value disabled only Branch Admin
        this.f.Branch.disable();
        // this.f.Branch.setValue(this.Cartingagentmodel.BranchId);
        let branch: any = {
          'BranchId': this.Cartingagentmodel.BranchId,
          'BranchName': this.Cartingagentmodel.BranchName //For Autocomplete
        }
        this.f.Branch.setValue(branch);
      } else {
        // this.f.Branch.setValue(this.Cartingagentmodel.BranchId);
        let branch: any = {
          'BranchId': this.Cartingagentmodel.BranchId,
          'BranchName': this.Cartingagentmodel.BranchName //For Autocomplete
        }
        this.f.Branch.setValue(branch);
      }
      this.CAId = this.Cartingagentmodel.CAId;
      this.f.CAName.setValue(this.Cartingagentmodel.CAName);
      this.f.CAMobNo.setValue(this.Cartingagentmodel.CAMobNo);
      this.f.CAPan.setValue(this.Cartingagentmodel.CAPan);
      this.f.GSTNo.setValue(this.Cartingagentmodel.GSTNo);
      this.f.CAEmail.setValue(this.Cartingagentmodel.CAEmail);

      // this.f.Region.setValue(this.Cartingagentmodel.StateCode);
      let region: any = {
        'StateCode': this.Cartingagentmodel.StateCode,
        'StateName': this.Cartingagentmodel.StateName
      }
      this.f.Region.setValue(region);

      // this.f.District.setValue(this.Cartingagentmodel.DistrictCode);
      let district: any = {
        'DistrictCode': this.Cartingagentmodel.DistrictCode,
        'DistrictName': this.Cartingagentmodel.DistrictName
      }
      this.f.District.setValue(district);

      // this.f.City.setValue(this.Cartingagentmodel.CityCode);
      let city: any = {
        'CityCode': this.Cartingagentmodel.CityCode,
        'CityName': this.Cartingagentmodel.CityName
      }
      this.f.City.setValue(city);

      this.f.Address.setValue(this.Cartingagentmodel.CAAddress);
      this.chRef.detectChanges();
    } else {
      this.redirect();
    }
  }

  // validation Pan No
  PANNoValidation(event: any) {
    this._appCode.keyPressAlphanumeric(event);
  }

  // redirect to list componant
  redirect() {
    this.ClearForm();
    this.router.navigate(['/modules/masters/carting-agent-list']);
  }

  RegionValidation() {
    this.submitted = false;
    if ((typeof this.f.Region.value === 'string' && this.f.Region.value !== '')) {
      this.InvalidRegion = true;
      return;
    } else {
      this.InvalidRegion = false;
    }
    this.chRef.detectChanges();
  }

  DistrictValidation() {
    if ((typeof this.f.District.value === 'string' && this.f.District.value !== '')) {
      this.InvalidDistrict = true;
      return;
    } else {
      this.InvalidDistrict = false;
    }
    this.chRef.detectChanges();
  }

  CityValidation() {
    if ((typeof this.f.City.value === 'string' && this.f.City.value !== '')) {
      this.InvalidCity = true;
      return;
    } else {
      this.InvalidCity = false;
    }
    this.chRef.detectChanges();
  }

  // Check Carting Agent Number Available
  onCarAgentChange() {
    let model = {
      CAName: this.f.CAName.value,
    };
    this._service.getCheckCarAgentAvl_Service(model).subscribe((data: any) => {
      if (data !== null) {
        if (data.flag == -1) {
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'This Carting Agent Name already exists with ' + data.CAName,
          });
        }
      }
    });
  }

  // To Avoid Copy Paste For Mobile
  public CopyPasteMblNotSpelcharAllow() {
    let NewFlag: boolean = false;
    if (this.f.CAMobNo.value === "") {
      this.IsInvalidMobile = false;
    }
    else {
      NewFlag = this._appCode.Copynumberonlyandcomma(this.f.CAMobNo.value);
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
    if (this.f.CAPan.value === "") {
      this.IsInvalidPan = false;
    }
    else {
      NewFlag = this._appCode.PanCradSplChNotAllow(this.f.CAPan.value);
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

}
