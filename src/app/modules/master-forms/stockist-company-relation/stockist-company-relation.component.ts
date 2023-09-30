import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AppCode } from '../../../app.code';

import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { ToastrService } from 'ngx-toastr';
import { StockistBranchModel } from '../Models/Stockist-Branch-Model';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export class matrowselected {
  CompanyId: number = 0;
  Checked: number = 0;
}

export class StockistCompanyModel {
  CompanyId: number = 0;
  CompanyName: string = "";
  CompanyCode: number = 0;
}

@Component({
  selector: 'app-stockist-company-relation',
  templateUrl: './stockist-company-relation.component.html',
  styleUrls: ['./stockist-company-relation.component.scss']
})
export class StockistCompanyRelationComponent implements OnInit {
  StockistCompany = ['Select', 'StockistName', 'StockistNo', 'CityName'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  selectedrows: matrowselected[] = [];
  IsFlag: boolean = true;
  stockistCompanyForm: FormGroup;
  stockistbranchModel: StockistBranchModel
  StockistList: any[] = [];
  CompanyList: any[] = [];
  UserId: number = 0;
  defaultform: any = {
    Stockist: '',
    Company: '',
  };
  InvId: number = 0;
  StockistId: number = 0;
  CompId: number = 0;
  pageState: string = "";
  btnCancelText: string = "";
  isLoading: boolean = false;
  BranchId: number = 0;
  CompanyId: number = 0;
  stockistcompanyList: any[] = [];
  BranchList: any[] = [];
  InvalidCompany: boolean = false;
  CompanyNameArray: Observable<StockistCompanyModel[]>;
  stockistbranch: string = "";
  selectedCompanyList: any[] = [];
  CompanyMasterObj = new FormControl();
  submitted: boolean = false;
  stockistcompnayList: any[] = [];
  searchModel: string = '';
  savIsFlag: boolean = true;

  constructor(private fb: FormBuilder, private _service: MastersServiceService, private chRef: ChangeDetectorRef, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.stockistbranch = "Add Stockist Company Relation";
    this.pageState = AppCode.saveString;
    this.btnCancelText = AppCode.cancelString;
    this.initForm();
    let obj = AppCode.getUser();
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.UserId = obj.UserId;
    this.GetCompanyList();

    if (this.UserId !== 1) {
      this.f.Company.disable();
      let ObjCompany = {
        "CompanyId": obj.CompanyId,
        "CompanyName": obj.CompanyName
      }
      this.f.Company.setValue(ObjCompany);
      this.OnChangeCompanySelectStockist();
      this.savIsFlag = true;
    }

  }

  get f(): { [key: string]: AbstractControl } {
    return this.stockistCompanyForm.controls;
  }

  initForm() {
    this.stockistCompanyForm = this.fb.group({
      Company: [
        this.defaultform.Company,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
    });
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

  // Save Stockist Company Relation
  SaveStockistCompany() {
    this.submitted = true;
    var arrStockist = [];
    // !this.stockistCompanyForm.valid
    if (this.stockistCompanyForm.invalid) {
      this.isLoading = false;
      this.InvalidCompany = false;
      return;
    } else {
      this.stockistbranchModel = new StockistBranchModel();
      this.stockistbranchModel.CompId = this.f.Company.value.CompanyId;
      if (this.UserId !== 1) {
        this.stockistbranchModel.CompId = this.CompanyId;
      }
      // multiple Stockist
      arrStockist.push(this.selectedrows);
      arrStockist.forEach((element: any) => {
        for (var i = 0; i < element.length; i++) {
          this.stockistbranchModel.Stockieststr += element[i].StockistId + ",";
        }
      });
      if (this.pageState == AppCode.saveString || this.pageState == AppCode.updateString) {
        this.stockistbranchModel.Action = AppCode.addString;
      } else {
        this.stockistbranchModel.Action = AppCode.deleteString;
      }
      if (this.pageState === 'Save' && this.selectedrows.length <= 0) {
        this.toaster.warning('Please select stockist!');
        this.isLoading = false;
        return;
      } else {
        this.savIsFlag = true;
      }
      if (this.pageState === 'update' && this.selectedrows.length > 0) {
        this.savIsFlag = true;
      }
      if (this.savIsFlag === true) {
        this.stockistbranchModel.Addedby = String(this.UserId);
        this._service.StockistCompanyAdd_Service(this.stockistbranchModel)
          .subscribe((data: any) => {
            if (this.pageState == AppCode.saveString || this.pageState == AppCode.updateString) { //
              this.toaster.success(AppCode.msg_saveSuccess);
              if (this.UserId != 1) {
                this.OnChangeCompanySelectStockist();
              } else {
                this.ClearForm();
                this.OnChangeCompanySelectStockist();
              }
              this.selectedrows = [];
              this.DataSource.data = [];
              this.selectedCompanyList = [];
              this.IsFlag = false;
              this.isLoading = false;
              this.submitted = false;
              this.chRef.detectChanges();
            } else {
              this.toaster.error(data);
            }
          }, (error: any) => {
            console.error(error);
            this.isLoading = false;
          });
      } else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
      }
    }
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  getCheckBoxesData() {
    this.selectedrows = this.DataSource.data.filter((value, index) => {
      return value.Checked;
    });
    this.chRef.detectChanges();
  }

  OnChangeCompanySelectStockist() {
    this.isLoading = true;
    let CompanyIdValue: number;
    this.pageState = '';
    if (this.UserId !== 1) {
      CompanyIdValue = this.CompanyId;
    }
    if ((this.f.Company.value != "" && this.f.Company.value != null && this.f.Company.value != undefined)) {
      CompanyIdValue = this.f.Company.value.CompanyId;
    } else {
      CompanyIdValue = 0;
      this.pageState = 'Save';
    }
    this.StockistList = [];  // stockistlist new instance
    this.selectedCompanyList = []; // selected company list new instance
    if (CompanyIdValue > 0) {
      this._service.getStockistListByCompany_Service(CompanyIdValue, AppCode.IsActiveString)
        .subscribe((data: any) => {

          var indexValue = data.findIndex((x: any) => x.Checked === 1); // delete
          if (indexValue >= 0) {
            this.pageState = 'Update';
          }
          else {
            this.pageState = 'Save';
          }
          this.IsFlag = true;
          this.selectedrows = [];
          this.StockistList = data;
          this.selectedrows = data.filter((row: any) => (row.CompanyId === CompanyIdValue) && (row.Checked === 1));
          this.selectedCompanyList = this.StockistList;
          this.DataSource.data = this.selectedCompanyList
          this.DataSource.paginator = this.paginator;
          this.isLoading = false;
          this.chRef.detectChanges();
        }, (error) => {
          console.error(error);
          this.isLoading = false;
          this.chRef.detectChanges();
        });
    } else {
      this.DataSource.data = [];
      this.IsFlag = false;
      this.GetCompanyList();
    }
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  ClearForm() {
    this.stockistCompanyForm.reset();
    this.f.Company.setValue('');
    this.DataSource.data = [];
    this.isLoading = false;
    this.submitted = false;
    this.chRef.detectChanges();
  }

}
