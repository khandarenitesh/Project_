import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

// Angular Material Added
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';

// Angular Forms Added
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Models
import { BranchcompanyModel } from '../Models/branchcompany-model.model';

// Services
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { ToastrService } from 'ngx-toastr';
import { AppCode } from '../../../app.code';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class matrowselected {
  CompanyId: number = 0;
  Checked: number = 0;
}
@Component({
  selector: 'app-branch-company-relation',
  templateUrl: './branch-company-relation.component.html',
  styleUrls: ['./branch-company-relation.component.scss']
})
export class BranchCompanyRelationComponent implements OnInit {
  displayed = ['Select', 'CompanyCode', 'CompanyName'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSoucrce = new MatTableDataSource<any>();
  public DataSource = new MatTableDataSource<any>()
  branchcompanyForm: FormGroup;
  branchcompanyModel: BranchcompanyModel;
  InvalidBranch: boolean = false;
  BranchList: any[] = [];
  CompanyList: any[] = [];
  submitted: boolean = false;
  isLoading: boolean = false;
  savIsFlag: boolean = true;
  pageState: string = "";
  btnCancelText: string = "";
  BranchId: number = 0;
  UserId: number = 0;
  CompanyId: number = 0;
  companybranchList: any[] = [];
  selectedBranchList: any[] = [];
  selectedrows: matrowselected[] = [];
  searchModel: string = '';
  ListTitle: string = "";
  selection = new SelectionModel<any>(true, []);
  defaultform: any = {
    Branch: '',
  };
  @ViewChild('select') select: MatSelect;
  allSelected = false;
  BranchNameArray: Observable<BranchcompanyModel[]>;
  branchcompany: string = "";

  constructor(private chRef: ChangeDetectorRef, private toaster: ToastrService, private fb: FormBuilder, private _service: MastersServiceService) { }

  ngOnInit(): void {
    this.pageState = AppCode.saveString;
    this.btnCancelText = AppCode.cancelString;
    this.branchcompany = "Add Branch Company Relation";
    this.ListTitle = "List View";
    this.initForm();
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.GetBranchList();

    if (this.UserId !== 1) {
      this.f.Branch.disable();
      let ObjBranch = {
        "BranchId": obj.BranchId,
        "BranchName": obj.BranchName
      }
      this.f.Branch.setValue(ObjBranch);
      this.OnChangeCompany();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.branchcompanyForm.controls;
  }

  initForm() {
    this.branchcompanyForm = this.fb.group({
      Branch: [
        this.defaultform.Branch,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
      Company: [
        this.defaultform.Branch,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
    });
  }

  //Branch List
  GetBranchList() {
    this._service.getBranchList_Service(AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.BranchList = data;
          this.BranchList = this.BranchList.sort((a: any, b: any) => a.BranchName.localeCompare(b.BranchName));
          this.BranchNameArray = this.f.Branch.valueChanges
            .pipe(
              startWith<string | BranchcompanyModel>(''),
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

  //Autocomplete Search Filter
  private filterBranchName(name: string): BranchcompanyModel[] {
    this.InvalidBranch = false;
    const filterValue = name.toLowerCase();
    return this.BranchList.filter((option: any) => option.BranchName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnBranchName(name: BranchcompanyModel): string {
    return name && name.BranchName ? name.BranchName : '';
  }

  branchValidation() {
    this.submitted = false;
    if ((this.f.Branch.value === null || this.f.Branch.value === "" || this.f.Branch.value.BranchId === '' || this.f.Branch.value.BranchId === undefined || this.f.Branch.value.BranchId === null)) {
      this.InvalidBranch = true;
      this.selectedrows = [];
      this.isLoading = false;
      return;
    } else {
      this.InvalidBranch = false;
    }
  }

  //get Company branch list
  GetComapnyBranchList() {
    this.isLoading = true;
    this._service.getCompanyBranch_Serive(this.CompanyId).subscribe((data: any) => {
      if (data.length > 0) {
        this.companybranchList = data;
        this.DataSoucrce.data = data;
        this.DataSoucrce.sort = this.Sort;
      } else {
        this.DataSoucrce.data = [];
      }
      this.isLoading = false;
      this.chRef.detectChanges();
    });
  }

  //Get Company List
  OnChangeCompany() {
    this.isLoading = true;
    let BranchIdValue: number;
    this.pageState = '';
    if (this.UserId !== 1) {
      BranchIdValue = this.BranchId;
    }
    if ((this.f.Branch.value != "" && this.f.Branch.value != null && this.f.Branch.value != undefined)) {
      BranchIdValue = this.f.Branch.value.BranchId;
    } else {
      BranchIdValue = 0;
      this.pageState = "Save";
    }
    this.CompanyList = [];
    this.selectedBranchList = [];
    if (BranchIdValue > 0) {
      this._service.getCompanyListByBranch_Service(BranchIdValue, AppCode.allString)
        .subscribe((data: any) => {
          var indexValue = data.findIndex((x: any) => x.Checked === 1);
          if (indexValue >= 0) {
            this.pageState = "Update"
          }
          else {
            this.pageState = "Save";
          }
          this.CompanyList = data;
          this.selectedBranchList = [];
          this.DataSource.data = []; // new array
          this.selectedrows = [];
          this.selectedrows = data.filter((row: any) => (row.Checked === 1));
          this.selectedBranchList = this.CompanyList;
          this.DataSource.paginator = this.paginator;
          this.DataSource.data = this.selectedBranchList; // bind values on table on branch
          this.f.Company.setValue(this.selectedBranchList);
          this.isLoading = false;
          this.chRef.detectChanges();
        }, (error: any) => {
          console.error(error);
          this.chRef.detectChanges();
        });
    } else {
      this.DataSource.data = [];
      this.GetBranchList();
    }
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // Checbox - checked or un checked
  getCheckboxesData() {
    this.selectedrows = this.DataSource.data.filter((value, index) => {
      return value.Checked
    });
    this.chRef.detectChanges();
  }

  // Save Companny Branch
  SaveCompanyBranch() {
    this.isLoading = true;
    this.submitted = true;
    var arrRole = [];
    if (!this.branchcompanyForm.valid) {
      this.isLoading = false;
      this.InvalidBranch = false;
      return;
    } else {
      this.branchcompanyModel = new BranchcompanyModel();
      this.branchcompanyModel.BranchId = this.f.Branch.value.BranchId;
      if (this.UserId !== 1) {
        this.branchcompanyModel.BranchId = this.BranchId;
      }
      //Multiple Company
      arrRole.push(this.selectedrows);
      arrRole.forEach((element: any) => {
        for (var i = 0; i < element.length; i++) {
          this.branchcompanyModel.CompanyIdstr += element[i].CompanyId + ","; // CompanyIdstr API Response
        }
      });
      if (this.pageState == AppCode.saveString || this.pageState == AppCode.updateString) {
        this.branchcompanyModel.Action = AppCode.addString;
      }
      else {
        this.branchcompanyModel.Action = AppCode.deleteString;
      }
      if (this.pageState === "Save" && this.selectedrows.length <= 0) {
        this.toaster.warning('Please select company!');
        this.isLoading = false;
        return;
      }
      else {
        this.savIsFlag = true;
      }
      if (this.pageState === 'Update' && this.selectedrows.length > 0) {
        this.savIsFlag = true;
      }
      if (this.savIsFlag === true) {
        this.branchcompanyModel.Addedby = String(this.UserId);
        this._service.CompanyBranchAdd_Service(this.branchcompanyModel)
          .subscribe((data: any) => {
            if (this.pageState == AppCode.saveString || this.pageState == AppCode.updateString) {
              this.toaster.success(AppCode.msg_saveSuccess);
              if (this.UserId != 1) {
                this.OnChangeCompany();
              }
              else {
                this.clearForm();
                this.OnChangeCompany();
              }
              this.submitted = false;
              this.selectedrows = []
              this.DataSource.data = [];
              this.selectedBranchList = [];
              this.isLoading = false;
              this.chRef.detectChanges();
            } else {
              this.toaster.error(data);
            }
          }, (error: any) => {
            console.error(error);
            this.isLoading = false;
            this.chRef.detectChanges();
          });
      }
      else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
        this.chRef.detectChanges();
      }
    }
  }

  clearForm() {
    this.branchcompanyForm.reset();
    this.submitted = false;
    this.isLoading = false;
    this.InvalidBranch = false;
    this.DataSource.data = [];
    this.chRef.detectChanges();
    this.BranchList = [];
    this.CompanyList = [];
    this.selectedBranchList = [];
    this.selectedrows = [];
    this.f.Branch.setValue('');
    this.GetBranchList();


  }


  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

}
