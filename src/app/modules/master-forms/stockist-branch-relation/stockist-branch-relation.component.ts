import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { AppCode } from '../../../app.code';

import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { ToastrService } from 'ngx-toastr';
import { StockistBranchModel } from '../Models/Stockist-Branch-Model';

import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AppConfigurationComponent } from '../../configuration/app-configuration/app-configuration.component';

export class matrowselected {
  BranchId: number = 0;
  Checked: number = 0;
}

@Component({
  selector: 'app-stockist-branch-relation',
  templateUrl: './stockist-branch-relation.component.html',
  styleUrls: ['./stockist-branch-relation.component.scss']
})
export class StockistBranchRelationComponent implements OnInit {
  StockistBranch = ['Select', 'StockistName', 'StockistNo', 'CityName'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  selectedrows: matrowselected[] = [];
  IsFlag: boolean = true;
  stockistbranchForm: FormGroup;
  stockistbranchModel: StockistBranchModel
  BranchList: any[] = [];
  StockistList: any[] = [];
  UserId: number = 0;
  defaultform: any = {
    Branch: '',
  };
  BranchId: number = 0;
  pageState: string = "";
  btnCancelText: string = "";
  isLoading: boolean = false
  InvalidBranch: boolean = false;
  stockistbranch: string = "";
  selectedBranchList: any[] = [];
  submitted: boolean = false;
  BranchName: string = "";
  CompanyId: number = 0;
  searchModel: string = '';
  // Autocomplete Code
  BranchNameArray: Observable<StockistBranchModel[]>;
  savIsFlag: boolean = true;

  constructor(private fb: FormBuilder, private _service: MastersServiceService, private chRef: ChangeDetectorRef, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.stockistbranch = "Add Stockist Branch Relation";
    this.pageState = AppCode.saveString;
    this.btnCancelText = AppCode.cancelString;
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.initForm();
    this.GetBranchList();
    //this.OnChangeBranchSelectStockist();
    // this.IsFlag = false;

    if (this.UserId !== 1) {
      this.f.Branch.disable();
      let objbranch = {
        'BranchId': obj.BranchId,
        'BranchName': obj.BranchName,
      }
      this.f.Branch.setValue(objbranch);
      this.OnChangeBranchSelectStockist();

    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.stockistbranchForm.controls;
  }

  //form control
  initForm() {
    this.stockistbranchForm = this.fb.group({
      Branch: [
        this.defaultform.Branch,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
    });
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

  // Save Stockist Branch Relation
  SaveStockistBranch() {
    this.isLoading = true;
    this.submitted = true;
    var arrStockist = [];
    if (this.stockistbranchForm.invalid) {
      this.isLoading = false;
      this.InvalidBranch = false;
      return;
    } else {
      this.stockistbranchModel = new StockistBranchModel();
      this.stockistbranchModel.BranchId = this.f.Branch.value.BranchId;
      if (this.UserId !== 1) {
        this.stockistbranchModel.BranchId = this.BranchId;
      }
      // multiple Stockist
      arrStockist.push(this.selectedrows);
      arrStockist.forEach((element: any) => {
        for (var i = 0; i < element.length; i++) {
          this.stockistbranchModel.Stockieststr += element[i].StockistId + ",";
        }
      });
      // if (this.pageState == AppCode.saveString) {
      //   if (this.selectedrows.length === 0 || this.selectedrows === null || this.selectedrows === undefined) {
      //     this.toaster.warning('Please select stockist!');
      //     this.isLoading = false;
      //     return;
      //   }
      // }
      if (this.pageState == AppCode.saveString || this.pageState == AppCode.updateString) {
        this.stockistbranchModel.Action = AppCode.addString;
      }
      else {
        this.stockistbranchModel.Action = AppCode.deleteString;
      }
      if (this.pageState === 'Save' && this.selectedrows.length <= 0) {
        this.toaster.warning('Please select stockist!');
        this.isLoading = false;
        return;
      }
      else {
        this.savIsFlag = true;
      }
      if (this.pageState === 'update' && this.selectedrows.length > 0) {
        this.savIsFlag = true;
      }
      if (this.savIsFlag === true) {
        this.stockistbranchModel.Addedby = String(this.UserId);
        this._service.StockistBranchAdd_Service(this.stockistbranchModel)
          .subscribe((data: any) => {
            if (this.pageState == AppCode.saveString || this.pageState == AppCode.updateString) {
              this.toaster.success(AppCode.msg_saveSuccess);
              if(this.UserId != 1)
              {
                this.OnChangeBranchSelectStockist();
              }
              else
              {
                this.ClearForm();
                this.OnChangeBranchSelectStockist();
              }
              this.submitted = false;
              this.selectedrows = [];
              this.DataSource.data = [];
              this.selectedBranchList = [];
              this.IsFlag = false;
              this.isLoading = false;
              this.chRef.detectChanges();
            }
            else {
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
      }
    }
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  OnChangeBranchSelectStockist() {
    this.isLoading = true;
    let BranchIdValue: number;
    this.pageState='';
    if (this.UserId !== 1) {
      BranchIdValue = this.BranchId;
    }
    if ((this.f.Branch.value != "" && this.f.Branch.value != null && this.f.Branch.value != undefined)) {
      BranchIdValue = this.f.Branch.value.BranchId;
    } else {
      BranchIdValue = 0;
      this.pageState ='Save';
    }

    this.StockistList = [];
    this.selectedBranchList = [];
    if (BranchIdValue > 0) {
      this._service.getStockistListByBranch_Service(BranchIdValue, AppCode.IsActiveString)
        .subscribe((data: any) => {

          var indexValue = data.findIndex((x:any) => x.Checked === 1 );
          if(indexValue>=0) {
            this.pageState ='Update';
          }
          else {
            this.pageState ='Save';
          }
          this.StockistList = data;
          this.IsFlag = true;
          this.selectedrows = [];
          this.selectedrows = data.filter((row: any) => (row.BranchId === BranchIdValue) && (row.Checked === 1));
          this.selectedBranchList = this.StockistList;
          this.DataSource.data = this.selectedBranchList;
          this.DataSource.paginator = this.paginator;
          this.isLoading = false;
          this.chRef.detectChanges();
        },
          (error: any) => {
            console.error(error);
            this.isLoading = false;
            this.chRef.detectChanges();
          })
    } else {
      this.DataSource.data = [];
      this.IsFlag = false;
      this.GetBranchList();
    }
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  //Multiple and Single Checkbox
  getCheckboxesData() {
    this.selectedrows = this.DataSource.data.filter((value, index) => {
      return value.Checked
    });
    this.chRef.detectChanges();
  }

  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  //reset form value
  ClearForm() {
    this.stockistbranchForm.reset();
    this.submitted = false;
    this.isLoading = false;
    this.InvalidBranch = false;
    this.DataSource.data = [];
    this.chRef.detectChanges();
  }

}
