import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Angular Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Model
import { CompanyList } from '../Models/CompanyList';
import { Companythreshold } from '../Models/companythreshold.model';

//Services
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MastersServiceService } from '../Services/masters-service.service';
import { AppCode } from '../../../app.code';

@Component({
  selector: 'app-threshold-value-master',
  templateUrl: './threshold-value-master.component.html',
  styleUrls: ['./threshold-value-master.component.scss']
})
export class ThresholdValueMasterComponent implements OnInit {
  thresholdvalueDetails = ['SrNo', 'CompanyName', 'ThresholdValue', 'RaiseClaimDay', 'ClaimSettlementDay', 'InStateAmt', 'OutStateAmt',
    'SaleSettlPeriod', 'NonsaleSettlePeriod', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  thresholdForm: FormGroup;
  pageState: string = '';
  allSelected = false;
  CompanyList: any[] = [];
  UserId: number = 0;
  BranchId: number = 0;
  submitted: boolean = false;
  ListTitle: string = "";
  Thresholdvalue: string = "";
  PkId: number = 0;
  CompanyId: number = 0;
  Companythreshold: Companythreshold;
  InvalidBranch: boolean = false;
  BranchList: any[] = [];
  isLoading: boolean = false;
  searchModel: string = '';
  ThresholdValueMasterTlt: string = '';
  BranchIdValue: number = 0;

  defaultform: any = {
    PkId: '',
    Branch: '',
    Company: '',
    Thresholdvalue: '',
    RaiseClaimDay: '',
    ClaimSettlementDay: '',
    InStateAmt: '',
    OutStateAmt: '',
    SaleSettlePeriod: '',
    NonsaleSettlePeriod: ''
  }
  //FOR AUTOCOMPLETE
  filteredOptionsCompany: Observable<CompanyList[]>;
  InvalidCompany: boolean = false;

  // Autocomplete Code
  formControlBranchName = new FormControl('');
  BranchNameArray: Observable<Companythreshold[]>;

  constructor(private fb: FormBuilder, private _service: MastersServiceService, private chef: ChangeDetectorRef, private toaster: ToastrService, private _appCode: AppCode) { }

  //On Page Load
  ngOnInit(): void {
    this.ThresholdValueMasterTlt = 'SLA Master';
    this.pageState = AppCode.saveString;
    this.ListTitle = "SLA Master List";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.initForm();
    this.GetBranchList();
    if (this.UserId !== 1) {
      this.f.Company.disable();
      this.f.Branch.disable();
      let objCompany = {
        'CompanyId': obj.CompanyId,
        'CompanyName': obj.CompanyName
      }
      let objbranch = {
        'BranchName': obj.BranchName,
        'BranchId': obj.BranchId,
      }
      this.f.Company.setValue(objCompany);
      this.f.Branch.setValue(objbranch);
    }
    this.GetThresholdValueList();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.thresholdForm.controls;
  }

  initForm() {
    this.thresholdForm = this.fb.group({
      Branch: [
        this.defaultform.Branch,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
      Company: [
        this.defaultform.Company,
        Validators.compose([Validators.required,
        Validators.maxLength(250)]),
      ],
      Thresholdvalue: [
        this.defaultform.Thresholdvalue,
        Validators.compose([Validators.required,
        Validators.maxLength(50)]),
      ],
      RaiseClaimDay: [
        this.defaultform.RaiseClaimDay,
        Validators.compose([Validators.required,
        Validators.maxLength(50)]),
      ],
      ClaimSettlementDay: [
        this.defaultform.ClaimSettlementDay,
        Validators.compose([Validators.required,
        Validators.maxLength(50)]),
      ],
      InStateAmt: [
        this.defaultform.InStateAmt
      ],
      OutStateAmt: [
        this.defaultform.OutStateAmt
      ],
      SaleSettlePeriod: [
        this.defaultform.SaleSettlePeriod
      ],
      NonsaleSettlePeriod: [
        this.defaultform.NonsaleSettlePeriod
      ]
    })
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
              startWith<string | Companythreshold>(''),
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
  private filterBranchName(name: string): Companythreshold[] {
    this.InvalidBranch = false;
    const filterValue = name.toLowerCase();
    return this.BranchList.filter((option: any) =>
      option.BranchName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnBranchName(name: Companythreshold): string {
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


  // Get Company List
  GetComapanyList() {
    this.isLoading = true;
    let BranchIdValue: number;
    if (this.UserId !== 1) {
      BranchIdValue = this.BranchId; // Branchadmin
    }
    if ((this.f.Branch.value != "" && this.f.Branch.value != null && this.f.Branch.value != undefined)) {
      BranchIdValue = this.f.Branch.value.BranchId;
    } else {
      BranchIdValue = 0;
    }
    this.CompanyList = [];
    if (BranchIdValue > 0) {
      this._service.getCompanyBranch_Serive(BranchIdValue).subscribe((data: any) => {
        if (data != null && data != "" && data != undefined) {
          this.CompanyList = data;
          this.CompanyList = this.CompanyList.sort((a: any, b: any) => a.CompanyName.localeCompare(b.CompanyName));
          this.filteredOptionsCompany = this.f.Company.valueChanges
            .pipe(
              startWith<string | CompanyList>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.CompanyName : null),
              map(CompanyName => CompanyName ? this.filteredCompany(CompanyName) : this.CompanyList.slice())
            );
          this.isLoading = false;
          this.chef.detectChanges();
        }
        else {
          this.isLoading = false;
          this.toaster.warning("Please Add Branch & Company Relation");
          this.chef.detectChanges();
        }
      },
        (error) => {
          console.error(error);
        })
    }

  }

  // Autocomplete Search Filter
  private filteredCompany(name: string): CompanyList[] {
    this.InvalidCompany = false;
    const filterValue = name.toLowerCase();
    return this.CompanyList.filter((option: any) =>
      option.CompanyName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnCompany(company: CompanyList): string {
    return company && company.CompanyName ? company.CompanyName : '';
  }

  CompanyValidation() {
    this.submitted = false;
    if ((this.f.Company.value.CompanyId === '' || this.f.Company.value.CompanyId === null || this.f.Company.value.CompanyId === undefined)) {
      this.InvalidCompany = true;
      return;
    } else {
      this.InvalidCompany = false;
    }
    this.submitted = false;
    this.chef.detectChanges();
  }

  // Get Threshold value List
  GetThresholdValueList() {
    this.isLoading = true;
    let companyIdValue: number;
    if (this.UserId !== 1) {
      companyIdValue = this.f.Company.value.CompanyId;
    }
    else {
      companyIdValue = 0;
    }
    // this.isLoading = true;
    this._service.getThresholdvalueMasterList_Service(this.BranchId, companyIdValue).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.DataSource.data = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
      } else {
        this.DataSource.data = [];
      }
      this.isLoading = false;
      this.chef.detectChanges();
    });
  }

  // SAVE Threshold value
  SaveThresholdvalue() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.thresholdForm.valid) {
      this.isLoading = false;
      this.InvalidCompany = false;
      this.InvalidBranch = false;
      return;
    } else {
      if (this.InvalidCompany === false && this.InvalidBranch === false) {
        this.Companythreshold = new Companythreshold();
        this.Companythreshold.BranchId = this.f.Branch.value.BranchId;
        this.Companythreshold.CompanyId = this.f.Company.value.CompanyId;
        this.Companythreshold.ThresholdValue = this.f.Thresholdvalue.value;
        this.Companythreshold.RaiseClaimDay = this.f.RaiseClaimDay.value;
        this.Companythreshold.ClaimSettlementDay = this.f.ClaimSettlementDay.value;
        this.Companythreshold.InStateAmt = this.f.InStateAmt.value;
        this.Companythreshold.OutStateAmt = this.f.OutStateAmt.value;
        this.Companythreshold.SaleSettlePeriod = this.f.SaleSettlePeriod.value;
        this.Companythreshold.NonSaleSettlePeriod = this.f.NonsaleSettlePeriod.value;
        this.Companythreshold.addedby = String(this.UserId);
        if (this.pageState == AppCode.saveString) {
          this.Companythreshold.PkId = 0;
          this.Companythreshold.Action = AppCode.addString;
        }
        else {
          this.Companythreshold.PkId = this.PkId;
          this.Companythreshold.Action = AppCode.editString;
        }
        // if (this.f.Company.value.CompanyId !== undefined) {
        this._service.SaveThresholdValue_Service(this.Companythreshold).subscribe(
          (data: any) => {
            if (data > 0) {
              if (this.pageState == AppCode.saveString) {
                this.toaster.success(AppCode.msg_saveSuccess);
              } else {
                this.toaster.success(AppCode.msg_updateSuccess);
              }
              this.ClearForm();
              this.GetThresholdValueList();
              this.GetComapanyList();
              this.InvalidCompany = false;
              this.InvalidBranch = false;
              this.chef.detectChanges();
            } else if (data === -1) {
              Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'This Comapany Name already exists with ' + this.f.Company.value.CompanyName,
              });
              this.isLoading = false;
              this.chef.detectChanges();
            } else {
              this.toaster.error(data);
              this.ClearForm();
              this.GetThresholdValueList();
              this.GetComapanyList();
            }
          },
          (error) => {
            console.error(error);
            this.isLoading = false;
            this.chef.detectChanges();
          });
        // } else {
        //   this.InvalidCompany = true;
        //   this.InvalidBranch = false;
        //   this.toaster.error(AppCode.FailStatus);
        //   this.isLoading = false;
        // }
      }
      else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
      }
    }
  }

  // Number validation
  numberValidation(event: any) {
    this._appCode.OnlyNumbersAllow(event);
  }

  // Set Data
  EditData(row: Companythreshold) {
    this.isLoading = true;
    this.pageState = AppCode.updateString;
    this.ThresholdValueMasterTlt = 'Update Threshold Master';
    this.PkId = row.PkId;
    this.f.Company.disable();
    this.f.Branch.disable();
    // this.CompanyId = row.CompanyId;
    let s: any = {
      'CompanyId': row.CompanyId,
      'CompanyName': row.CompanyName
    }
    this.f.Company.setValue(s);
    let b: any = {
      'BranchId': row.BranchId,
      'BranchName': row.BranchName
    }
    this.f.Company.setValue(s);
    this.f.Branch.setValue(b);
    this.f.Thresholdvalue.setValue(row.ThresholdValue);
    this.f.RaiseClaimDay.setValue(row.RaiseClaimDay);
    this.f.ClaimSettlementDay.setValue(row.ClaimSettlementDay);
    this.f.InStateAmt.setValue(row.InStateAmt);
    this.f.OutStateAmt.setValue(row.OutStateAmt);
    this.f.SaleSettlePeriod.setValue(row.SaleSettlePeriod);
    this.f.NonsaleSettlePeriod.setValue(row.NonSaleSettlePeriod);
    this.InvalidCompany = false;
    this.isLoading = false;
    this.chef.detectChanges();
  }

  // Delete Data
  DeleteData(row: Companythreshold) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Sure!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.Companythreshold = new Companythreshold();
        this.Companythreshold.PkId = row.PkId;
        this.Companythreshold.BranchId = row.BranchId;
        this.Companythreshold.CompanyId = row.CompanyId
        this.Companythreshold.ThresholdValue = row.ThresholdValue;
        this.Companythreshold.RaiseClaimDay = row.RaiseClaimDay;
        this.Companythreshold.ClaimSettlementDay = row.ClaimSettlementDay;
        this.Companythreshold.InStateAmt = row.InStateAmt;
        this.Companythreshold.OutStateAmt = row.OutStateAmt;
        this.Companythreshold.SaleSettlePeriod = row.SaleSettlePeriod;
        this.Companythreshold.NonSaleSettlePeriod = row.NonSaleSettlePeriod;
        this.Companythreshold.addedby = String(this.UserId);
        this.Companythreshold.Action = AppCode.deleteString;
        this._service.SaveThresholdValue_Service(this.Companythreshold)
          .subscribe((data: any) => {
            if (data > 0) {
              this.toaster.success(AppCode.msg_deleteSuccess);
              this.GetThresholdValueList();
              this.GetComapanyList();
            }
            else {
              this.toaster.error(AppCode.FailStatus);
              this.isLoading = false;
              this.chef.detectChanges();
            }
          }, (error) => {
            console.error(error);
            this.isLoading = false;
            this.chef.detectChanges();
          });
      }
    });
  }

  // CLEAR MODEL
  ClearForm() {
    this.ThresholdValueMasterTlt = 'Add Threshold Value Master';
    this.pageState = AppCode.saveString;
    if (this.UserId == 1) {
      this.thresholdForm.reset();
      this.f.Branch.enable();
      this.f.Company.enable();
    }
    else {
      this.f.Thresholdvalue.setValue('');
      this.f.RaiseClaimDay.setValue('');
      this.f.ClaimSettlementDay.setValue('');
      this.f.InStateAmt.setValue('');
      this.f.OutStateAmt.setValue('');
      this.f.SaleSettlePeriod.setValue('');
      this.f.NonsaleSettlePeriod.setValue('');
    }
    this.isLoading = false;
    this.submitted = false;
    this.InvalidCompany = false;
    this.chef.detectChanges();
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase();
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

}
