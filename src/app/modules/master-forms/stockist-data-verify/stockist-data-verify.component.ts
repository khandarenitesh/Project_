import { AppCode } from './../../../app.code';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MastersServiceService } from '../Services/masters-service.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { StockistBranchModel } from '../Models/Stockist-Branch-Model';
import { map, startWith, } from 'rxjs/operators';
import { StockistCompanyModel } from '../stockist-company-relation/stockist-company-relation.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-stockist-data-verify',
  templateUrl: './stockist-data-verify.component.html',
  styleUrls: ['./stockist-data-verify.component.scss']
})
export class StockistDataVerifyComponent implements OnInit {
  BranchList: any[] = [];
  StockistList: any[] = [];
  StockistDataForVerifyList: any[] = [];
  UserId: number = 0;
  isLoading: boolean = false
  InvalidBranch: boolean = false;
  verifystockistDatatitle: string = "";
  selectedBranchList: any[] = [];
  submitted: boolean = false;
  BranchName: string = "";
  CompanyId: number = 0;
  searchModel: string = '';
  searchModel1: string = '';
  BranchId: number = 0;
  pageState: string = "";
  btnCancelText: string = "";
  stockistVerifyDataForm: FormGroup;
  defaultform: any = {
    Branch: '',
    Company: ''
  };

  stockistcompanyList: any[] = [];
  InvalidCompany: boolean = false;
  selectedCompanyList: any[] = [];
  CompanyList: any[] = [];
  CompanyMasterObj = new FormControl();
  stockistcompnayList: any[] = [];
  savIsFlag: boolean = true;

  // Autocomplete Code
  BranchNameArray: Observable<StockistBranchModel[]>;
  CompanyNameArray: Observable<StockistCompanyModel[]>;
  ColumnDataDisplay = ['SrNo', 'StockistName', 'StockistNo', 'CityName', 'StockistPAN', 'DLExpDate', 'FoodLicExpDate', 'FoodLicNo',
    'GSTNo', 'MobNo', 'Emailid', 'BankAccountNo', 'Pincode'];

  ColumnDataDisplay1 = ['SrNo', 'StockistName1', 'StockistNo', 'MobNo', 'StockistPAN', 'status'];

  public DataSourceInvalidStockistData = new MatTableDataSource<any>();
  public DataSourceCompBrnchInvldMapping = new MatTableDataSource<any>();

  constructor(private fb: FormBuilder, private _service: MastersServiceService, private chRef: ChangeDetectorRef,
    private toaster: ToastrService) { }


  ngOnInit(): void {
    this.verifystockistDatatitle = "Verify Stockist Data";
    this.pageState = AppCode.saveString;
    this.btnCancelText = AppCode.cancelString;
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.initForm();
    this.GetBranchList();
    this.GetCompanyList();
    this.GetStockistDataForVerifyList();
    if (this.UserId !== 1) {
      this.f.Branch.disable();
      let objbranch = {
        'BranchId': obj.BranchId,
        'BranchName': obj.BranchName,
      }
      this.f.Branch.setValue(objbranch);
    }

    if (this.UserId !== 1) {
      this.f.Company.disable();
      let ObjCompany = {
        "CompanyId": obj.CompanyId,
        "CompanyName": obj.CompanyName
      }
      this.f.Company.setValue(ObjCompany);
    }

  }

  get f(): { [key: string]: AbstractControl } {
    return this.stockistVerifyDataForm.controls;
  }

  //form control
  initForm() {
    this.stockistVerifyDataForm = this.fb.group({
      Branch: [
        this.defaultform.Branch,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
      Company: [
        this.defaultform.Company,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
    });
  }

  GetStockistDataForVerifyList() {
    this.isLoading = true;
    this._service.getStockistForVerifyList_Service(this.BranchId, this.CompanyId, AppCode.allString).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.DataSourceCompBrnchInvldMapping.data = [];
        this.DataSourceInvalidStockistData.data = data;
        this.chRef.detectChanges();
      } else {
        this.DataSourceInvalidStockistData.data = [];
      }
      this.isLoading = false;
      this.chRef.detectChanges();
    });
  }

  GetStockistDataBranchCompanyForVerifyList() {
    this.isLoading = true;
    if ((this.f.Branch.value === "" || this.f.Branch.value === null) && this.f.Company.value === "" || this.f.Company.value === null) {
      this.toaster.warning('Please select branch and company!');
      this.isLoading = false;
      return;
    }
    this._service.GetStockistDataForVerifyList_Service(this.f.Branch.value.BranchId, this.f.Company.value.CompanyId, AppCode.IsActiveString)
      .subscribe((data: any) => {
        if (data.length > 0 && data != null && data != "" && data != undefined) {
          this.DataSourceInvalidStockistData.data = [];
          this.DataSourceCompBrnchInvldMapping.data = data;
          this.isLoading = false;
          this.chRef.detectChanges();
        } else {
          this.DataSourceCompBrnchInvldMapping.data = [];
        }
      }, (error) => {
        console.error(error);
      });
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  GetBranchList() {
    this._service.getBranchList_Service(AppCode.IsActiveString)
      .subscribe((data: any) => {
        this.BranchList = data;
        this.BranchList = this.BranchList.sort((a: any, b: any) => a.BranchName.localeCompare(b.BranchName));
        this.BranchNameArray = this.f.Branch.valueChanges
          .pipe(startWith<string | StockistBranchModel>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.BranchName : null),
            map(BranchName => BranchName ? this.filterBranchName(BranchName) : this.BranchList.slice())
          );
        this.chRef.detectChanges();
      }, (error) => {
        console.error(error);
      });
  }

  // Autocomplete Search Filter
  private filterBranchName(name: string): StockistBranchModel[] {
    this.InvalidBranch = false;
    const filterValue = name.toLowerCase();
    return this.BranchList.filter((option: any) => option.BranchName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnBranchName(name: StockistBranchModel): string {
    return name && name.BranchName ? name.BranchName : '';
  }

  //validation invalid string values
  branchValidation() {
    this.submitted = false;
    if ((this.f.Branch.value === null || this.f.Branch.value === "" || this.f.Branch.value.BranchId === '' || this.f.Branch.value.BranchId === undefined || this.f.Branch.value.BranchId === null)) {
      this.InvalidBranch = true;
      this.isLoading = false;
      return;
    } else {
      this.InvalidBranch = false;
    }
  }

  ClearForm() {
    this.stockistVerifyDataForm.reset();
  }

  // Search - Apply Filter
  applyFilterCompBrnchInvldMapping() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSourceCompBrnchInvldMapping.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  // Search - Apply Filter
  applyFilterStockistData() {
    this.isLoading = true;
    this.searchModel = this.searchModel1.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSourceInvalidStockistData.filter = this.searchModel1;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  GetCompanyList() {
    this._service.getCompanyList_Service(AppCode.IsActiveString)
      .subscribe((data: any) => {
        this.CompanyList = data;
        this.CompanyList = this.CompanyList.sort((a: any, b: any) => a.CompanyName.localeCompare(b.CompanyName));
        this.CompanyNameArray = this.f.Company.valueChanges
          .pipe(startWith<string | StockistCompanyModel>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.CompanyName : null),
            map(CompanyName => CompanyName ? this.filterCompanyName(CompanyName) : this.CompanyList.slice())
          );
        this.chRef.detectChanges();
      }, (error) => {
        console.error(error);
      });
  }


  // Autocomplete Search Filter
  private filterCompanyName(name: string): StockistCompanyModel[] {
    this.InvalidCompany = false;
    const filterValue = name.toLowerCase();
    return this.CompanyList.filter((option: any) => option.CompanyName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnCompanyName(name: StockistCompanyModel): string {
    return name && name.CompanyName ? name.CompanyName : '';
  }

  companyValidation() {
    this.submitted = false;
    if ((this.f.Company.value.CompanyId === '' || this.f.Company.value.CompanyId === undefined || this.f.Company.value.CompanyId === null)) {
      this.InvalidCompany = true;
      return;
    } else {
      this.InvalidCompany = false;
    }
  }

}
