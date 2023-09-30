import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AppCode } from '../../../app.code';
import { GeneralModel } from '../Models/general-model';
import { MastersServiceService } from '../Services/masters-service.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-general-master',
  templateUrl: './general-master.component.html',
  styleUrls: ['./general-master.component.scss']
})
export class GeneralMasterComponent implements OnInit {
  displayedColumnsForApi = ['SrNo', 'CategoryName', 'MasterName', 'DescriptionText', 'isActive', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();

  isSave: boolean = true;
  isUpdate: boolean = false;
  generalForm: FormGroup;
  submitted = false;
  Generalmodal: GeneralModel;
  CategoryList: any = [];
  UserId: Number = 0;
  CategoryName: string = "";
  MasterName: string = "";
  DescriptionText: string = "";
  pageState: string = '';
  pkId: number = 0;
  isLoading: boolean = false;
  InvalidCategory : boolean = false;

  defaultform: any = {
    CategoryName: '',
    MasterName: ''
  };
  generalTitle: string = '';
  searchModel: string = '';

  // Autocomplete Code
  // formControlCategoryName = new FormControl('');
  CategoryNameArray: Observable<GeneralModel[]>;

  constructor(
    private fb: FormBuilder,
    private _service: MastersServiceService,
    private chRef: ChangeDetectorRef,
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {
    this.pageState = AppCode.saveString;
    this.generalTitle = 'Add General Master';
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.initForm();
    this.GetCategoryList();//ON PAGE LOAD BIND CATEGORY LIST TO DROPDOWN
    this.GetGeneralMasterList(); // SHOW MASTER LIST ON PAGE (TABLE)
  }
  get f(): { [key: string]: AbstractControl } {
    return this.generalForm.controls;
  }
  initForm() {

    this.generalForm = this.fb.group({
      CategoryName: [
        this.defaultform.CategoryName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      MasterName: [
        this.defaultform.MasterName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
    });
  }
  // Get Bank List
  GetCategoryList() {
    this._service.getCategoryList_Service()
      .subscribe(
        (data: any) => {
          this.CategoryList = data.CategoryParameter;
          this.CategoryList = this.CategoryList.sort((a:any, b:any) => a.CategoryName.localeCompare(b.CategoryName));
          this.CategoryNameArray = this.f.CategoryName.valueChanges
            .pipe(
              startWith<string | GeneralModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.CategoryName : null),
              map(CategoryName => CategoryName ? this.filterCategoryName(CategoryName) : this.CategoryList.slice())
            );
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  // Autocomplete Search Filter
  private filterCategoryName(name: string): GeneralModel[] {
    this.InvalidCategory = false;
    const filterValue = name.toLowerCase();
    return this.CategoryList.filter((option: any) =>
      option.CategoryName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnCategoryName(name: GeneralModel): string {
    return name && name.CategoryName ? name.CategoryName : '';
  }

  // GET GENERAL MASTER LIST
  GetGeneralMasterList() {
    this.isLoading = true;
    this._service.GetGeneralMasterList_Service(AppCode.allString, AppCode.allString).subscribe((data: any) => {
      if (data != null && data != [] && data != "" && data != undefined) {
        this.DataSource.data = data.GeneralMasterParameter;
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

  // SAVE GENERAL MODEL
  SaveGeneral() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.generalForm.valid) {
      this.isLoading = false;
      this.InvalidCategory = false;
      return;
    }
    else {
      if (this.InvalidCategory === false){
      this.Generalmodal = new GeneralModel();
      this.Generalmodal.CategoryName = this.f.CategoryName.value.CategoryName; //this.f.CategoryName.value;
      this.Generalmodal.MasterName = this.f.MasterName.value;
      this.Generalmodal.DescriptionText = this.DescriptionText;
      this.Generalmodal.isActive = AppCode.IsActiveString;
      if (this.pageState == AppCode.saveString) {
        this.Generalmodal.pkId = 0;
        this.Generalmodal.Action = AppCode.addString;
      }
      else {
        this.Generalmodal.pkId = this.pkId;
        this.Generalmodal.Action = AppCode.editString;
      }
      if(this.f.CategoryName.value.CategoryName !== undefined){
      this._service.SaveGeneral_Service(this.Generalmodal)
        .subscribe((data: any) => {
          if (data === AppCode.SuccessStatus) {
            if (this.pageState == AppCode.saveString) {
              this.toaster.success(AppCode.msg_saveSuccess);
            } else {
              this.toaster.success(AppCode.msg_updateSuccess);
            }
            this.ClearForm();
            this.GetGeneralMasterList();
            this.InvalidCategory = false;
            this.chRef.detectChanges();
          } else if (data === AppCode.ExistsStatus) {
            this.toaster.warning(AppCode.msg_exist);
            this.isLoading = false;
            this.chRef.detectChanges();
          } else {
            this.toaster.error(data);
            this.ClearForm();
            this.GetGeneralMasterList();
          }
        },
          (error) => {
            console.error(error);
          })
        }
        else{
          this.toaster.error(AppCode.FailStatus);
          this.isLoading = false;
          this.InvalidCategory = true;
        }
      }
      else{
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
        this.InvalidCategory = true;
      }
    }
  }
  categoryvalidation(){
        this.submitted = false;
    if ((this.f.CategoryName.value.CategoryName === '' || this.f.CategoryName.value.CategoryName === null || this.f.CategoryName.value.CategoryName  === undefined)) {
      this.InvalidCategory = true;
      this.submitted = false;
      return;
    }else{
      this.InvalidCategory = false;
    }
  }
  // EDIT DATA ROW WISE (UPDATE)
  EditData(row: GeneralModel) {
    this.isLoading = true;
    this.pageState = AppCode.updateString;
    this.generalTitle = 'Update General Master';
    this.isUpdate = true;
    this.pkId = row.pkId;
    let s: any = {
      'pkId': row.pkId,
      'CategoryName': row.CategoryName
    }
    this.f.CategoryName.setValue(s);
    this.MasterName = row.MasterName;
    this.DescriptionText = row.DescriptionText;
    this.isLoading = false;
    this.chRef.detectChanges();
  }
  // ACTIVE AND DEACTIVE STATUS
  ChangeStatus(row: GeneralModel) {
    this.isLoading = true;
    this.Generalmodal = new GeneralModel();
    this.Generalmodal.Action = AppCode.statusString;
    this.Generalmodal.pkId = row.pkId;
    if (row.isActive == AppCode.IsActiveString) {
      this.Generalmodal.isActive = AppCode.IsInActiveString;
    }
    else {
      this.Generalmodal.isActive = AppCode.IsActiveString;
    }
    this._service.SaveGeneral_Service(this.Generalmodal)
      .subscribe((data: any) => {
        // if user activated
        if (data === AppCode.StatusChangedStatus) {
          this.toaster.success(AppCode.msg_stsChange);
          this.ClearForm();
        }
      },
        (error) => {
          console.error(error);
        })
  }
  // CLEAR MODEL
  ClearForm() {
    this.isUpdate = false;
    this.CategoryName = "";
    this.MasterName = "";
    this.DescriptionText = "";
    this.pageState = AppCode.saveString;
    this.generalTitle = 'Add General Master';
    this.InvalidCategory = false;
    this.submitted = false;
    this.f.CategoryName.reset();
    this.GetGeneralMasterList();
    this.GetCategoryList();
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

}
