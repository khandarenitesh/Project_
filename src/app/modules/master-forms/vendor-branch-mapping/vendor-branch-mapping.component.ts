import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AppCode } from 'src/app/app.code';
import { MastersServiceService } from '../Services/masters-service.service';
import { startWith, map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export class matrowselected {
  CompanyId: number = 0;
  Checked: number = 0;
}
export class VendorBranchMappingModal {
  BranchId: number = 0;
  BranchCode: string = "";
  BranchName: string = "";
  VendorIdStr: string = '';
  Addedby: string = '';
}

@Component({
  selector: 'app-vendor-branch-mapping',
  templateUrl: './vendor-branch-mapping.component.html',
  styleUrls: ['./vendor-branch-mapping.component.scss']
})

export class VendorBranchMappingComponent implements OnInit {

  pageState: string = "";
  btnCancelText: string = "";
  ListTitle: string;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  submitted: boolean = false;
  isLoading: boolean = false;
  VendorBranhcForm: FormGroup;
  filteredOptBranch: Observable<any[]>;
  InvalidBranch: boolean = false;
  BranchList: any = [];
  IsFlag: boolean = false;
  searchModel: any;
  VendorList: any[] = [];
  selectedBranchList: any[] = [];
  VendorBranchMapping: VendorBranchMappingModal;

  constructor(private chng: ChangeDetectorRef, private toaster: ToastrService, private fb: FormBuilder,
    private _service: MastersServiceService) { }

  displayed = ['Select', 'VendorName', 'Email', 'ContactNumber'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>()
  selectedrows: matrowselected[] = [];

  ngOnInit(): void {
    this.pageState = AppCode.saveString;
    this.btnCancelText = AppCode.cancelString;
    this.ListTitle = "Vendor Branch Mapping";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.UserId;
    this.CompanyId = obj.CompanyId;
    this.InitForm();
    this.GetBranchList();
  }

  InitForm() {
    this.VendorBranhcForm = this.fb.group({
      Branch: ['',
        Validators.compose([
          Validators.required,
          Validators.maxLength(250)
        ]),
      ],
    });
  }


  get f(): { [key: string]: AbstractControl } {
    return this.VendorBranhcForm.controls;
  }

  // Get Branch List
  GetBranchList() {
    this._service.getBranchList_Service(AppCode.IsActiveString).subscribe(
      (data: any) => {
        this.BranchList = data;
        this.BranchList = this.BranchList.sort((a: any, b: any) => a.BranchName.localeCompare(b.BranchName));
        this.filteredOptBranch = this.f.Branch.valueChanges
          .pipe(
            startWith<string | any>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.BranchName : null),
            map(BranchName => BranchName ? this.filterBranch(BranchName) : this.BranchList.slice())
          );
        this.chng.detectChanges();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //Multiple and Single Checkbox
  getCheckboxesData() {
    this.selectedrows = this.DataSource.data.filter((value, index) => {
      return value.Checked
    });
    this.chng.detectChanges();
  }

  // Autocomplete Search Filter
  private filterBranch(name: string): any[] {
    this.InvalidBranch = false;
    const filterValue = name.toLowerCase();
    return this.BranchList.filter((option: any) =>
      option.BranchName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnBranch(branch: any): string {
    return branch && branch.BranchName ? branch.BranchName : '';
  }

  SaveVendorBranchMapping() {
    this.isLoading = true;
    this.submitted = true;
    var arrRole = [];
    if (!this.VendorBranhcForm.valid) {
      this.isLoading = false;
      this.InvalidBranch = false;
      return;
    } else {
      if (this.InvalidBranch === false) {
        this.VendorBranchMapping = new VendorBranchMappingModal();
        this.VendorBranchMapping.BranchId = this.f.Branch.value.BranchId;
        arrRole.push(this.selectedrows);
        arrRole.forEach((element: any) => {
          for (var i = 0; i < element.length; i++) {
            this.VendorBranchMapping.VendorIdStr += element[i].VendorId + ",";
          }
        });
        if (this.selectedrows.length === 0 || this.selectedrows === null || this.selectedrows === undefined) {
          this.toaster.warning('Please select vendor!');
          this.isLoading = false;
          return;
        }
        this.VendorBranchMapping.Addedby = String(this.UserId);
        this._service.BranchVendorAdd_Service(this.VendorBranchMapping)
          .subscribe((data: any) => {
            if (data > 0) {
              if (this.pageState === AppCode.saveString) {
                this.toaster.success(AppCode.msg_saveSuccess);
              }
              else {
                this.toaster.success(AppCode.msg_updateSuccess);
              }
              this.isLoading = false;
              this.submitted = false;
              this.clearForm();
            } else if (data === AppCode.ExistsStatus) {
              this.toaster.warning(AppCode.msg_exist);
              this.isLoading = false;
              this.chng.detectChanges();
            } else {
              this.toaster.error(data);
              this.DataSource.data = [];
              this.VendorBranhcForm.reset();
            }
          }, (error: any) => {
            console.error(error);
            this.isLoading = false;
            this.chng.detectChanges();
          });
      } else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
        this.chng.detectChanges();
      }
    }
  }


  // On Company Change Display Vendor List
  OnChangeBranch() {
    let BranchIdValue: number;
    if ((this.f.Branch.value != "" && this.f.Branch.value != null && this.f.Branch.value != undefined)) {
      BranchIdValue = this.f.Branch.value.BranchId;
    } else {
      BranchIdValue = 0;
    }
    this.VendorList = [];
    if (BranchIdValue > 0) {
      this._service.GetVendorListByBranch_Service(BranchIdValue, AppCode.IsActiveString)
        .subscribe((data: any) => {
          this.IsFlag = true;
          this.VendorList = data;
          this.selectedrows = [];
          this.selectedrows = data.filter((row: any) => (row.Checked === 1));
          this.selectedBranchList = this.VendorList;
          this.DataSource.paginator = this.paginator;
          this.DataSource.data = this.selectedBranchList;
        }, () => {
          this.chng.detectChanges();
        });
    } else {
      this.DataSource.data = [];
      this.IsFlag = false;
      this.GetBranchList();
    }
    this.chng.detectChanges();
  }


  //Branch Validation
  BranchValidation() {
    this.submitted = false;
    if ((this.f.Branch.value.BranchId === '' || this.f.Branch.value.BranchId === undefined || this.f.Branch.value.BranchId === null)) {
      this.InvalidBranch = true;
      this.isLoading = false;
      return;
    } else {
      this.InvalidBranch = false;
    }
    this.chng.detectChanges();
  }

  clearForm() {
    this.VendorBranhcForm.reset();
    this.f.Company.setValue('');
    this.DataSource.data = [];
    this.GetBranchList();
    this.IsFlag = false;
    this.submitted = false;
    this.isLoading = false;
    this.chng.detectChanges();
  }

  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chng.detectChanges(); // IMMEDIATE ACTION FIRED
  }
}
