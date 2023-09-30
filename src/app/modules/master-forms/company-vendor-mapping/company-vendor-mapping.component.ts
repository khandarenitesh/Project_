import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

// Angular Forms Added
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { MastersServiceService } from '../Services/masters-service.service';
import { ToastrService } from 'ngx-toastr';
import { startWith, map } from 'rxjs/operators';
import { CompanyVendorMapping } from '../Models/company-vendor-mapping.model';
import { Observable } from 'rxjs';
import { AppCode } from '../../../app.code';

export class matrowselected {
  CompanyId: number = 0;
  Checked: number = 0;
}
@Component({
  selector: 'app-company-vendor-mapping',
  templateUrl: './company-vendor-mapping.component.html',
  styleUrls: ['./company-vendor-mapping.component.scss']
})
export class CompanyVendorMappingComponent implements OnInit {
  displayed = ['Select', 'VendorName', 'Email', 'ContactNumber'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>()
  //Variable Declaration
  CompanyNameArray: Observable<CompanyVendorMapping[]>;
  CompanyVendorForm: FormGroup;
  companyvendorMapping: CompanyVendorMapping;
  CompanyList: any[] = [];
  VendorList: any[] = [];
  selectedrows: matrowselected[] = [];
  selectedCompanyList: any[] = [];
  pageState: string = "";
  btnCancelText: string = "";
  ListTitle: string = "";
  searchModel: string = "";
  submitted: boolean = false;
  isLoading: boolean = false;
  InvalidCompany: boolean = false;
  IsFlag: boolean = true;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  defaultform: any = {
    Company: '',
    Vendor: ''
  };

  constructor(private chRef: ChangeDetectorRef, private toaster: ToastrService, private fb: FormBuilder, private _service: MastersServiceService) { }

  //Page Load
  ngOnInit(): void {
    this.pageState = AppCode.saveString;
    this.btnCancelText = AppCode.cancelString;
    this.ListTitle = "Company Vendor Mapping";
    this.initForm();
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.GetCompanyList();
    this.IsFlag = false;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.CompanyVendorForm.controls;
  }

  initForm() {
    this.CompanyVendorForm = this.fb.group({
      Company: [
        this.defaultform.Companny,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
    });
  }

  //Get Company List
  GetCompanyList() {
    this._service.getCompanyList_Service(AppCode.IsActiveString)
      .subscribe((data: any) => {
        this.CompanyList = data;
        this.CompanyList = this.CompanyList.sort((a: any, b: any) => a.CompanyName.localeCompare(b.CompanyName));
        this.CompanyNameArray = this.f.Company.valueChanges
          .pipe(startWith<string | CompanyVendorMapping>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.CompanyName : null),
            map(CompanyName => CompanyName ? this.filterCompanyName(CompanyName) : this.CompanyList.slice())
          );
        this.chRef.detectChanges();
      }, (error) => {
        console.error(error);
      });
  }

  // Autocomplete Search Filter
  private filterCompanyName(name: string): CompanyVendorMapping[] {
    this.InvalidCompany = false;
    const filterValue = name.toLowerCase();
    return this.CompanyList.filter((option: any) => option.CompanyName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnCompanyName(name: CompanyVendorMapping): string {
    return name && name.CompanyName ? name.CompanyName : '';
  }

  //Company Validation
  companyValidation() {
    this.submitted = false;
    if ((this.f.Company.value.CompanyId === '' || this.f.Company.value.CompanyId === undefined || this.f.Company.value.CompanyId === null || this.f.Company.value === null)) {
      this.InvalidCompany = true;
      this.selectedrows = [];
      this.isLoading = false;
      return;
    } else {
      this.InvalidCompany = false;
    }
  }

  // On Company Change Display Vendor List
  OnChangeComapny() {
    let CompanyIdValue: number;
    if ((this.f.Company.value != "" && this.f.Company.value != null && this.f.Company.value != undefined)) {
      CompanyIdValue = this.f.Company.value.CompanyId;
    } else {
      CompanyIdValue = 0;
    }
    this.VendorList = [];
    if (CompanyIdValue > 0) {
      this._service.GetVendorListByCompany_Service(CompanyIdValue, AppCode.IsActiveString)
        .subscribe((data: any) => {
          this.IsFlag = true;
          this.VendorList = data;
          this.selectedrows = [];
          this.selectedrows = data.filter((row: any) => (row.Checked === 1));
          this.selectedCompanyList = this.VendorList;
          this.DataSource.paginator = this.paginator;
          this.DataSource.data = this.selectedCompanyList;
        }, () => {
          this.chRef.detectChanges();
        });
    } else {
      this.DataSource.data = [];
      this.IsFlag = false;
      this.GetCompanyList();
    }
    this.chRef.detectChanges();
  }

  //Multiple and Single Checkbox
  getCheckboxesData() {
    this.selectedrows = this.DataSource.data.filter((value, index) => {
      return value.Checked
    });
    this.chRef.detectChanges();
  }

  //Save Company Vendor
  SaveCompanyVendor() {
    this.isLoading = true;
    this.submitted = true;
    var arrRole = [];
    if (!this.CompanyVendorForm.valid) {
      this.isLoading = false;
      this.InvalidCompany = false;
      return;
    } else {
      if (this.InvalidCompany === false) {
        this.companyvendorMapping = new CompanyVendorMapping();
        this.companyvendorMapping.CompanyId = this.f.Company.value.CompanyId;
        arrRole.push(this.selectedrows);
        arrRole.forEach((element: any) => {
          for (var i = 0; i < element.length; i++) {
            this.companyvendorMapping.VendorIdStr += element[i].VendorId + ",";
          }
        });
        if (this.selectedrows.length === 0 || this.selectedrows === null || this.selectedrows === undefined) {
          this.toaster.warning('Please select vendor!');
          this.isLoading = false;
          return;
        }
        this.companyvendorMapping.Addedby = String(this.UserId);
        this._service.CompanyVendorAdd_Service(this.companyvendorMapping)
          .subscribe((data: any) => {
            if (data > 0) {
              if (this.pageState === AppCode.saveString) {
                this.toaster.success(AppCode.msg_saveSuccess);
              }
              else {
                this.toaster.success(AppCode.msg_updateSuccess);
              }
              this.clearForm();
            } else if (data === AppCode.ExistsStatus) {
              this.toaster.warning(AppCode.msg_exist);
              this.isLoading = false;
              this.chRef.detectChanges();
            } else {
              this.toaster.error(data);
              this.DataSource.data = [];
              this.CompanyVendorForm.reset();
            }
          }, (error: any) => {
            console.error(error);
            this.isLoading = false;
            this.chRef.detectChanges();
          });
      } else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
        this.chRef.detectChanges();
      }
    }
  }

  //Clear form
  clearForm() {
    this.CompanyVendorForm.reset();
    this.f.Company.setValue('');
    this.DataSource.data = [];
    this.GetCompanyList();
    this.IsFlag = false;
    this.submitted = false;
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

}
