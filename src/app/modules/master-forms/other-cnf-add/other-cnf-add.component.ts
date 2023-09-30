import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppCode } from 'src/app/app.code';
import { OtherCnfModel } from '../Models/other-cnf-model.Model';
import { MastersServiceService } from '../Services/masters-service.service';

@Component({
  selector: 'app-other-cnf-add',
  templateUrl: './other-cnf-add.component.html',
  styleUrls: ['./other-cnf-add.component.scss']
})
export class OtherCnfAddComponent implements OnInit {
  displayedColumnsForApi = ['SrNo', 'CNFCode', 'CNFName', 'City', 'Email', 'ContactPersonName', 'PersonContactNo', 'Status', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  searchModel: string = '';
  othercnfForm: FormGroup;
  submitted = false;
  othercnfmodel: OtherCnfModel;
  CityList: any = [];
  BranchList: any[] = [];
  UserId: Number = 0;
  pageState: string = '';
  CompanyId: number = 0;
  isLoading: boolean = false;
  IsEmailFlag: boolean = true;
  IsFlag: boolean = true;
  InvalidCity: boolean = false;
  InvalidBranch: boolean = false;
  Title: string = "";
  CNFId: number = 0;
  BranchId: number = 0;
  CompId: number = 0;
  IsInvalidMobile: boolean = false;
  IsFlagGst: boolean = true;
  IsInvalidGSTNo: boolean = true;

  defaultform: any = {
    CNFCode: '',
    CNFName: '',
    City: '',
    Email: '',
    ContactPersonName: '',
    PersonContactNo: '',
    Address: '',
  };

  filteredOptionsCity: Observable<OtherCnfModel[]>;
  BranchNameArray: Observable<OtherCnfModel[]>;

  constructor(
    private fb: FormBuilder,
    private _service: MastersServiceService,
    private chRef: ChangeDetectorRef,
    private toaster: ToastrService,
    private _appCode: AppCode,
    private _MastersServiceService: MastersServiceService
  ) { }

  ngOnInit(): void {
    this.Title = "Add Other CNF Details";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.pageState = AppCode.saveString;
    this.initForm();
    this.GetOtherCNFList();
    this.GetCityList();
    this.GetBranchList();
    if (this.BranchId !== 0) {
      this.f.Branch.disable();
      let objbranch = {
        'BranchName': obj.BranchName,
        'BranchId': obj.BranchId,
      }
      this.f.Branch.setValue(objbranch);
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.othercnfForm.controls;
  }

  initForm() {
    this.othercnfForm = this.fb.group({
      Branch: [
        this.defaultform.Branch,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
      CNFCode: [
        this.defaultform.CompanyCode,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      CNFName: [
        this.defaultform.CompanyName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      City: [
        this.defaultform.City,
        Validators.compose([
          Validators.required
        ]),
      ],
      Email: [
        this.defaultform.Email,
        Validators.compose([
          Validators.email,
          Validators.required,
        ]),
      ],
      ContactPersonName: [
        this.defaultform.CompanyName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      PersonContactNo: [
        this.defaultform.ContactNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(22),
        ]),
      ],
      Address: [
        this.defaultform.Address
      ],
    });
  }

  // Get Other CNF list
  GetOtherCNFList() {
    this.isLoading = true;
    this._MastersServiceService.GetOtherCNFList_Service(this.BranchId, this.CompId, AppCode.allString).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
        this.isLoading = false;
        this.chRef.detectChanges();
      } else {
        this.DataSource.data = [];
        this.isLoading = false;
        this.chRef.detectChanges();
      }
    });
  }
  // Validation Number
  numberValidation(event: any) {
    this._appCode.numberonlyandcomma(event);
  }

  // Validation Mobile No
  mobileNoValidation(event: any) {
    this._appCode.numberonlyandcomma(event);
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
        // this.submitted = true;
        this.chRef.detectChanges();
      }
    }
  }


  // To Avoid Copy Paste For Mobile
  public CopyPasteMblNotSpelcharAllow() {
    let NewFlag: boolean = false;
    if (this.f.PersonContactNo.value === "") {
      this.IsInvalidMobile = false;
    }
    else {
      NewFlag = this._appCode.Copynumberonlyandcomma(this.f.PersonContactNo.value);
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

  // Get Branch List
  GetBranchList() {
    this._service.getBranchList_Service(AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.BranchList = data;
          this.BranchList = this.BranchList.sort((a: any, b: any) => a.BranchName.localeCompare(b.BranchName));
          this.BranchNameArray = this.f.Branch.valueChanges
            .pipe(
              startWith<string | OtherCnfModel>(''),
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
  private filterBranchName(name: string): OtherCnfModel[] {
    this.InvalidBranch = false;
    const filterValue = name.toLowerCase();
    return this.BranchList.filter((option: any) =>
      option.BranchName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnBranchName(name: OtherCnfModel): string {
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
  // Get city list
  GetCityList() {
    this._service.getCityList_Service(AppCode.allString, AppCode.allString, AppCode.CityActiveString)
      .subscribe((data: any) => {
        this.CityList = data.GetCityParameter;
        this.CityList = this.CityList.sort((a: any, b: any) => a.CityName.localeCompare(b.CityName));
        this.filteredOptionsCity = this.f.City.valueChanges
          .pipe(
            startWith<string | OtherCnfModel>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.CityName : null),
            map(CityName => CityName ? this.filterCity(CityName) : this.CityList.slice())
          );
        this.chRef.detectChanges();
      }, (error) => {
        console.error(error);
      });
  }

  // Autocomplete Search Filter
  private filterCity(name: string): OtherCnfModel[] {
    this.InvalidCity = false;
    const filterValue = name.toLowerCase();
    return this.CityList.filter((option: any) =>
      option.CityName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnCity(city: OtherCnfModel): string {
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

  // save compony details
  SaveOtherCNF() {
    this.submitted = true;
    this.isLoading = true;
    if (!this.othercnfForm.valid) {
      this.InvalidCity = false;
      this.isLoading = false;
      return;
    } else {
      if (this.InvalidCity === false && this.IsInvalidMobile === false && this.IsEmailFlag === true) {
        this.othercnfmodel = new OtherCnfModel();
        this.othercnfmodel.CNFCode = this.f.CNFCode.value;
        this.othercnfmodel.CNFName = this.f.CNFName.value;
        this.othercnfmodel.CityCode = this.f.City.value.CityCode;
        this.othercnfmodel.CNFEmail = this.f.Email.value;
        this.othercnfmodel.ContactPerson = this.f.ContactPersonName.value;
        this.othercnfmodel.ContactNo = this.f.PersonContactNo.value;
        this.othercnfmodel.CNFAddress = this.f.Address.value;
        this.othercnfmodel.Addedby = String(this.UserId);
        this.othercnfmodel.CompId = this.CompId;
        if (this.BranchId === 0) {
          this.othercnfmodel.BranchId = this.f.Branch.value.BranchId;
        } else {
          this.othercnfmodel.BranchId = this.BranchId;
        }
        if (this.pageState == AppCode.saveString) {
          this.othercnfmodel.CNFId = 0;
          this.othercnfmodel.IsActive = 'Y'
          this.othercnfmodel.Action = AppCode.addString;
        }
        else {
          this.othercnfmodel.CNFId = this.CNFId;
          this.othercnfmodel.Action = AppCode.editString;
        }
        this._service.SaveOtherCNF_Service(this.othercnfmodel)
          .subscribe((data: any) => {
            if (data > 0) {
              if (this.pageState == AppCode.saveString) {
                this.toaster.success(AppCode.msg_saveSuccess);
                this.GetOtherCNFList();
                this.isLoading = false;
                this.submitted = false;
                this.ClearForm();
              } else {
                this.toaster.success(AppCode.msg_updateSuccess);
                this.GetOtherCNFList();
                this.isLoading = false;
                this.submitted = false;
                this.ClearForm();
              }
            } else if (data < 0) {
              this.toaster.warning(AppCode.msg_exist);
              this.GetOtherCNFList();
              this.isLoading = false;
              this.ClearForm();
              this.chRef.detectChanges();
            } else {
              this.toaster.error(data);
            }
          }, (error: any) => {
            console.error(error);
            this.isLoading = false;
          });
      }
      else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
      }
    }
    this.isLoading = false;
    this.submitted = false;
  }

  // EDIT DATA ROW WISE (UPDATE)
  EditData(row: OtherCnfModel) {
    this.isLoading = true;
    this.pageState = AppCode.updateString;
    this.Title = 'Update Other CNF';
    this.CNFId = row.CNFId;
    this.f.CNFCode.disable();
    this.f.CNFCode.setValue(row.CNFCode);
    this.f.CNFName.setValue(row.CNFName);
    let city: any = {
      'CityCode': row.CityCode,
      'CityName': row.CityName
    }
    this.f.City.setValue(city);
    this.f.Email.setValue(row.CNFEmail);
    this.f.ContactPersonName.setValue(row.ContactPerson);
    this.f.PersonContactNo.setValue(row.ContactNo);
    this.f.Address.setValue(row.CNFAddress);
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  //Delete Record
  ChangeStatus(row: OtherCnfModel) {
    this.isLoading = true;
    this.othercnfmodel = new OtherCnfModel();
    this.othercnfmodel.CNFId = row.CNFId;
    this.othercnfmodel.Action = AppCode.statusString;
    if (row.IsActive == AppCode.IsActiveString) {
      this.othercnfmodel.IsActive = AppCode.IsInActiveString;
    }
    else {
      this.othercnfmodel.IsActive = AppCode.IsActiveString;
    }
    this._service.SaveOtherCNF_Service(this.othercnfmodel)
      .subscribe((data: any) => {
        if (data > 0) {
          this.toaster.success(AppCode.msg_stsChange);
          this.GetOtherCNFList();
          this.isLoading = false;
          this.ClearForm();
        }
      },
        (error) => {
          console.error(error);
        })
  }

  ClearForm() {
    this.pageState = AppCode.saveString;
    this.Title = 'Add Other CNF Details';
    this.othercnfForm.reset();
    this.f.CNFCode.enable();
    this.isLoading = false;
    this.submitted = false;
    this.IsInvalidMobile = false;
    this.IsEmailFlag = true;
    this.InvalidCity = false;
    this.initForm();
    let obj = AppCode.getUser();
    if (this.BranchId !== 0) {
      this.f.Branch.disable();
      let objbranch = {
        'BranchName': obj.BranchName,
        'BranchId': obj.BranchId,
      }
      this.f.Branch.setValue(objbranch);
    }
    this.chRef.detectChanges();
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges();
  }
}
