import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { CourierParentModel } from '../Models/curier-add';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import { MastersServiceService } from '../Services/masters-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { matrowselected } from '../branch-company-relation/branch-company-relation.component';

@Component({
  selector: 'app-courier-parent-mapping',
  templateUrl: './courier-parent-mapping.component.html',
  styleUrls: ['./courier-parent-mapping.component.scss']
})
export class CourierParentMappingComponent implements OnInit {
  public DataSource = new MatTableDataSource<any>();
  public DataSources = new MatTableDataSource<any>()
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  displayedColumnsForApi = ['Select', 'CourierName', 'CourierMobNo', 'CourierEmail'];
  // Declaretion
  Title: String = "";
  pageState: String = "";
  searchModel: string = '';
  UserId: number = 0;
  BranchId: number = 0;
  Cpid: number = 0;
  courierParentMappingForm: FormGroup;
  submitted: boolean = false;
  isLoading: boolean = false
  InvalidCourierName: boolean = false;
  CourierList: any[] = [];
  selectedrows: matrowselected[] = [];
  ParentCourierList: any[] = [];
  selectedCourierList: any[] = [];
  CourierNameArray: Observable<CourierParentModel[]>;
  courierModel: CourierParentModel;

  // Default Form for FormControlName
  defaultform: any = {
    ParentCourName: '',
  };

  constructor(private fb: FormBuilder, private chef: ChangeDetectorRef, private toaster: ToastrService, private _MastersServiceService: MastersServiceService,) { }

  // Page Load
  ngOnInit(): void {
    this.Title = " Courier Parent Mapping";
    this.pageState = 'Save';
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.initForm();
    this.GetCourierParentNameList();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.courierParentMappingForm.controls;
  }

  // Init Form
  initForm() {
    this.courierParentMappingForm = this.fb.group({
      ParentCourName: [
        this.defaultform.ParentCourName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
    });
  }

  //Get Courier Name Parent List For Autocomplete
  GetCourierParentNameList() {
    this._MastersServiceService.GetParentCourierList_Service(this.BranchId,AppCode.IsActiveString).subscribe((data: any) => {
      this.CourierList = data;
      this.CourierList = this.CourierList.sort((a: any, b: any) => a.ParentCourierName.localeCompare(b.ParentCourierName));
      this.CourierNameArray = this.f.ParentCourName.valueChanges
        .pipe(
          startWith<string | CourierParentModel>(''),
          map(value => typeof value === 'string' ? value : value !== null ? value.ParentCourierName : null),
          map(ParentCourierName => ParentCourierName ? this.filterCourierName(ParentCourierName) : this.CourierList.slice())
        );
      this.chef.detectChanges();
    },
      (error) => {
        console.error(error);
      }
    );
  }

  // Filter Courier Name For Autocomplete
  private filterCourierName(name: string): CourierParentModel[] {
    this.InvalidCourierName = false;
    const filterValue = name.toLowerCase();
    return this.CourierList.filter((option: any) => option.ParentCourierName.toLowerCase().includes(filterValue));
  }

  //Display Function For Autocomplete
  displayFnCouerierName(name: CourierParentModel): string {
    return name && name.ParentCourierName ? name.ParentCourierName : '';
  }

  // Couerier Validation for Autocomplete
  CourierValidation() {
    this.submitted = false;
    if ((this.f.ParentCourName.value === '' || this.f.ParentCourName.value === undefined || this.f.ParentCourName.value === null)) {
      this.InvalidCourierName = true;
      this.selectedrows = [];
      this.isLoading = false;
      return;
    }
    else {
      this.InvalidCourierName = false;
    }
  }

  //On Change Courier Display the below List
  OnchangeCorier() {
    let CpidValue: number;
    if ((this.f.ParentCourName.value != "" && this.f.ParentCourName.value != null)) {
      CpidValue = this.f.ParentCourName.value.Cpid;
    } else {
      CpidValue = 0;
    }
    if (CpidValue !== 0) {
      this._MastersServiceService.GetParentCourierMappedList_Service(CpidValue, AppCode.IsActiveString)
        .subscribe((data: any) => {
          this.ParentCourierList = data;
          this.selectedCourierList = [];
          this.DataSource.data = [];
          this.selectedrows = [];
          this.selectedrows = data.filter((row: any) => (row.Checked === 1));
          this.selectedCourierList = this.ParentCourierList;
          this.DataSource.paginator = this.paginator;
          this.DataSource.data = this.selectedCourierList;
          this.chef.detectChanges();
        }, (error: any) => {
          console.error(error);
          this.chef.detectChanges();
        });
    }
  }

  //Checkbox Code
  getCheckboxesData() {
    this.selectedrows = this.DataSource.data.filter((value, index) => {
      return value.Checked
    });
    this.chef.detectChanges();
  }

  // Save and Edit Courier
  SaveCourier() {
    this.isLoading = true;
    this.submitted = true;
    var arrRole = [];
    if (!this.courierParentMappingForm.valid) {
      this.isLoading = false;
      return;
    } else {
      if (this.InvalidCourierName === false) {
        this.courierModel = new CourierParentModel();
        this.courierModel.Cpid = this.f.ParentCourName.value.Cpid;
        arrRole.push(this.selectedrows);
        arrRole.forEach((element: any) => {
          for (var i = 0; i < element.length; i++) {
            this.courierModel.CourierId += element[i].CourierId + ",";
          }
        });
        if (this.pageState === AppCode.saveString) {
          this.courierModel.Action = AppCode.addString;
        }
        else {
          this.courierModel.Action = AppCode.editString;
        }
        this.courierModel.Addedby = String(this.UserId);
        this.courierModel.BranchId = this.BranchId;
        this._MastersServiceService.SaveCourierParentMapping_Service(this.courierModel)
          .subscribe((data: any) => {
            if (data > 0) {
              if (this.pageState === AppCode.saveString) {
                this.toaster.success(AppCode.msg_saveSuccess);
                this.courierParentMappingForm.reset();
              } else {
                this.toaster.success(AppCode.msg_updateSuccess);
              }
              this.ClearForm();
            } else if (data === AppCode.ExistsStatus) {
              this.toaster.success(AppCode.msg_exist);
            } else {
              this.toaster.error(AppCode.FailStatus);
              this.DataSource.data = [];
              this.courierParentMappingForm.reset();
            }
            this.isLoading = false;
            this.chef.detectChanges();
          }, (error: any) => {
            console.error(error);
            this.isLoading = false;
            this.chef.detectChanges();
          });
      } else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
        this.chef.detectChanges();
      }
    }
  }

  //Clear Form
  ClearForm() {
    this.isLoading = false;
    this.courierParentMappingForm.reset();
    this.DataSource.data = [];
    this.GetCourierParentNameList();
    this.chef.detectChanges();
  }

  //Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase();
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chef.detectChanges();
  }

}
