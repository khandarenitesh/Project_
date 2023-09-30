import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AppCode } from '../../../app.code';
import { CompanyDivisionModel } from '../Models/Company-Devision';
import { MastersServiceService } from '../Services/masters-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-division-add',
  templateUrl: './company-division-add.component.html',
  styleUrls: ['./company-division-add.component.scss']
})
export class CompanyDivisionAddComponent implements OnInit {
  divisionForm: FormGroup;
  submitted = false;
  pageState: string = '';
  ColdStorage: string = '';
  CategoryList: any = [];
  isLoading: boolean = false;
  isUpdate: boolean = false;
  BranchList: any[] = [];
  BranchId: number = 0;
  CompId: number = 0;
  RoleId: number = 0;

  defaultform: any = {
    DivisionCode: '',
    DivisionName: '',
    FloorName: '',
    IsColdStorage: ''
  };
  // Displyed columns on page
  displayedColumnsForApi = ['SrNo', 'DivisionCode', 'DivisionName', 'Floor', 'ColdStorage', 'Status', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  DevisionModal: CompanyDivisionModel;
  UserId: number = 0;
  DivisionId: number = 0;
  divisionTitle: string = '';
  searchModel: string = '';

  constructor(
    private fb: FormBuilder,
    private _service: MastersServiceService,
    private chRef: ChangeDetectorRef,
    private toaster: ToastrService
  ) { }

  // On Page load get category list and division list
  ngOnInit(): void {
    this.pageState = AppCode.saveString;
    this.divisionTitle = 'Add Company Division';
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.RoleId = obj.RoleId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.initForm();

    // To Handle RoleId wise display Branch selected value only Branch Admin
    if (this.BranchId === 1) {
      this.GetBranchDetailsById(this.BranchId);
    } else {
      this.GetBranchList(); // Super Admin
    }
    this.GetCategoryList();
    this.GetDivisionList();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.divisionForm.controls;
  }
  //  Form controls
  initForm() {
    this.divisionForm = this.fb.group({
      DivisionCode: [
        this.defaultform.DivisionCode,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      DivisionName: [
        this.defaultform.DivisionName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      FloorName: [
        this.defaultform.FloorName,
      ],
      IsColdStorage: [
        this.defaultform.FloorName,
        Validators.compose([
          Validators.required
        ]),
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
  // Get Category List
  GetCategoryList() {
    this.isLoading = true;
    this._service.GetGeneralMasterList_Service(AppCode.splstring, AppCode.allString).subscribe((data: any) => {
      this.CategoryList = data.GeneralMasterParameter;
    },
      (error) => {
        console.error(error);
      });
  }

  // Get Branch Details By Id
  GetBranchDetailsById(BranchId: number) {
    this._service.getBranchById_Service(BranchId)
      .subscribe((data: any) => {
        var arr = [];
        this.BranchList = data;
        arr = this.BranchList.filter(b => b.BranchId === this.BranchId);
        this.f.Branch.setValue(arr);
        this.f.Branch.disable();
        this.chRef.detectChanges();
      }, (error) => {
        console.error(error);
      });
  }
  //use for selected dropdown value for branch
  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  // Get Branch List
  GetBranchList() {
    this._service.getBranchList_Service(AppCode.allString)
      .subscribe((data: any) => {
        this.BranchList = data;
        this.chRef.detectChanges();
      }, (error) => {
        console.error(error);
      });
  }
  // Get Division List
  GetDivisionList() {
    this.isLoading = true;
    this._service.GeDivisionMasterList_Service(AppCode.allString).subscribe((data: any) => {
      if (data != null && data != [] && data != "" && data != undefined) {
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
  // Save Division
  SaveDivision() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.divisionForm.valid) {
      this.isLoading = false;
      return;
    }
    else {
      this.isLoading = true;
      this.DevisionModal = new CompanyDivisionModel();
      this.DevisionModal.DivisionCode = this.f.DivisionCode.value;
      this.DevisionModal.DivisionName = this.f.DivisionName.value;
      this.DevisionModal.FloorName = this.f.FloorName.value;
      this.DevisionModal.IsColdStorage = this.f.IsColdStorage.value;
      this.DevisionModal.AddedBy = String(this.UserId);
      this.DevisionModal.IsActive = AppCode.IsActiveString;
      this.DevisionModal.BranchId = this.BranchId;
      this.DevisionModal.CompanyId = this.CompId;
      if (this.pageState == AppCode.saveString) {
        this.DevisionModal.DivisionId = 0;
        this.DevisionModal.Action = AppCode.addString;
      }
      else {
        this.DevisionModal.DivisionId = this.DivisionId;
        this.DevisionModal.Action = AppCode.editString
      }
      this._service.SaveCompanyDivision_Service(this.DevisionModal)
        .subscribe((data: any) => {
          if (data === AppCode.SuccessStatus) {
            if (this.pageState == AppCode.saveString) {
              this.toaster.success(AppCode.msg_saveSuccess);
            } else {
              this.toaster.success(AppCode.msg_updateSuccess);
            }
            this.clearForm();
            this.isLoading = false;
            this.GetDivisionList();
            this.chRef.detectChanges();
          } else if (data === AppCode.ExistsStatus) {
            this.toaster.warning(AppCode.msg_exist);
            this.isLoading = false;
            this.chRef.detectChanges();
          } else {
            this.toaster.error(data);
            this.clearForm();
            this.isLoading = false;
            this.GetDivisionList();
            this.chRef.detectChanges();
          }
        },
          (error) => {
            console.error(error);
          })
    }
  }
  // To Clear Form On Click  Cancel Button
  clearForm() {
    this.isUpdate = true;
    this.f.DivisionCode.setValue('');
    this.f.DivisionName.setValue('');
    this.f.FloorName.setValue('');
    this.f.IsColdStorage.setValue('');
    this.pageState = AppCode.saveString;
    this.divisionTitle = 'Add Company Division';
    this.f.DivisionCode.enable();
    if (this.BranchId === 1) {
      this.GetBranchDetailsById(this.BranchId);//For Branch Admin not clear branch
    } else {
      this.f.Branch.setValue('');//For Super Admin clear branch
      this.GetBranchList(); // Super Admin
    }
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // Set data when click on edit button
  GetData(row: CompanyDivisionModel) {
    this.pageState = AppCode.updateString;
    this.divisionTitle = 'Update Company Division';
    this.DivisionId = row.DivisionId;
    this.f.DivisionCode.disable();
    this._service.getBranchById_Service(row.BranchId)
        .subscribe((data: any) => {
          var arr = [];
          this.BranchList = data;
          arr = this.BranchList.filter(b => b.BranchId === this.BranchId);
          this.f.Branch.setValue(arr);
          this.chRef.detectChanges();
        }, (error) => {
          console.error(error);
        });
    this.f.DivisionCode.setValue(row.DivisionCode);
    this.f.DivisionName.setValue(row.DivisionName);
    this.f.FloorName.setValue(row.FloorName);
    this.f.IsColdStorage.setValue(row.IsColdStorage);
    this.chRef.detectChanges();
  }

  // to active and deactive
  ChangeStatus(row: CompanyDivisionModel) {
    this.isLoading = true;
    this.DevisionModal = new CompanyDivisionModel();
    this.DevisionModal.Action = AppCode.statusString;
    this.DevisionModal.AddedBy = String(this.UserId);
    this.DevisionModal.DivisionId = row.DivisionId;
    if (row.IsActive == AppCode.IsActiveString) {
      this.DevisionModal.IsActive = AppCode.IsInActiveString;
    }
    else {
      this.DevisionModal.IsActive = AppCode.IsActiveString;
    }
    this._service.SaveCompanyDivision_Service(this.DevisionModal)
      .subscribe((data: any) => {
        if (data === AppCode.StatusChangedStatus) {
          this.toaster.success(AppCode.msg_stsChange);
          this.GetDivisionList();
        }
      },
        (error) => {
          console.error(error);
        })
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.trim(); // Remove whitespace
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

}
