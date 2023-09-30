import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OrderReturnService } from '../Services/order-return.service';
import { AppCode } from '../../../app.code';
import { ClaimSrsMappingModel } from '../models/ClaimSrsMappingModel';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-claim-srs-mapping',
  templateUrl: './claim-srs-mapping.component.html',
  styleUrls: ['./claim-srs-mapping.component.scss']
})
export class ClaimSrsMappingComponent implements OnInit {

  displayedColumnsForApi = ['Select', 'SalesDocNo', 'DocDate', 'StockistNo', 'StockistName',];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();

  constructor(private fb: FormBuilder, private _Service: OrderReturnService,
    private chRef: ChangeDetectorRef, private toastr: ToastrService, private router: Router) { }

  claimsrsMappingForm: FormGroup;
  pageState: string = '';
  claimsrsMappingTitle: string = '';
  claimsrsMappingModel: ClaimSrsMappingModel;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  isLoading: boolean = false;
  searchModel: string = '';
  submitted = false;
  ClaimNoInvalid: boolean = false;
  ClaimNoList: any[] = [];
  selectedrows: matrowselected[] = [];
  filteredOptionsClaimNo: Observable<ClaimSrsMappingModel[]>;
  selection = new SelectionModel<any>(true, []);

  defaultform: any = {
    ClaimNo: '',
    ReturnCatId: '',
    LRNo: ''
  }

  LRIdGPId: number = 0;
  ClaimNo: string = '';
  LrNo: string = '';
  ReturnCatId: string = '';
  claim: any;
  ClaimRes: string = '';
  SRSId: number = 0;
  minDate = new Date();

  ngOnInit(): void {
    this.pageState = AppCode.saveString;
    this.claimsrsMappingTitle = "Add Claim - LR-SRS Mapping";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.GetClaimSrsMappingList(0);
    this.initForm();

    //get LR no list
    this.GetLRNoList();

  }

  // Get LR List
  GetLRNoList() {
    this._Service.GetClaimNoList_Service(this.BranchId, this.CompanyId)
      .subscribe(
        (data: any) => {
          this.ClaimNoList = data;
          this.filteredOptionsClaimNo = this.f.LRNo.valueChanges
            .pipe(
              startWith<string | ClaimSrsMappingModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.LRNo : null),
              map( LRNo => LRNo ? this.filterLRNo(LRNo) : this.ClaimNoList.slice())
            );
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }
   // Autocomplete Search Filter
   private filterLRNo(name: string): ClaimSrsMappingModel[] {
    this.ClaimNoInvalid = false;
    const filterValue = name.toLowerCase();
    return this.ClaimNoList.filter((option: any) =>
      option.LRNo.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnLRNo(lrno: ClaimSrsMappingModel): string {
    return lrno && lrno.LRNo ? lrno.LRNo : '';
  }

  get f(): { [key: string]: AbstractControl } {
    return this.claimsrsMappingForm.controls;
  }

  //Form initialized
  initForm() {
    this.claimsrsMappingForm = this.fb.group({
      ClaimNo: [
        this.defaultform.ClaimNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ]),
      ],
      LRDate: [
        this.defaultform.LRDate,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ]),
      ],
      LRNo: [
        this.defaultform.LRNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  getCheckboxesData(row: any, i: string) {
    if ((<HTMLInputElement>document.getElementById('check' + i)).checked === true) {
      if (this.selectedrows.length === 0) {
        var item = new matrowselected();
        item.SRSId = row.SRSId;
        this.selectedrows.push(item);
      } else if (this.selectedrows.length === 0 || this.selectedrows.findIndex(t => t.SRSId === row.SRSId))  {
        var item = new matrowselected();
        item.SRSId = row.SRSId;
        this.selectedrows.push(item);
      }
    } else {
      var indexValue = this.selectedrows.findIndex(t => t.SRSId === row.SRSId);
      this.selectedrows.splice(indexValue, 1);
    }
    this.chRef.detectChanges();
  }

  //Save LR-SRS Mapping Data
  saveclaimsrsMapping() {
    this.isLoading = true;
    this.submitted = true;
    let arr: any = [], arr1: any = [];
    if (!this.claimsrsMappingForm.valid) {
      this.isLoading = false;
      return;
    }
    else {
      if (this.ClaimNoInvalid === false) {
        this.claimsrsMappingModel = new ClaimSrsMappingModel();

        // multiple check box save with comma separated
        if (this.selectedrows.length > 0) {
          arr.push(this.selectedrows);
          arr.forEach((element: any) => {
            for (var i = 0; i < element.length; i++) {
              this.claimsrsMappingModel.SRSId += element[i].SRSId + ",";
            }
          });
        }

        if (this.claimsrsMappingModel.SRSId !== "") {
          this.claimsrsMappingModel.BranchId = this.BranchId;
          this.claimsrsMappingModel.CompId = this.CompanyId;
          this.claimsrsMappingModel.LRIdGPId = this.f.LRNo.value.LREntryId;
          this.claimsrsMappingModel.AddedBy = this.UserId;

          if (this.pageState == AppCode.saveString) {
            this.claimsrsMappingModel.Action = AppCode.addString;
          }
          else {
            this.claimsrsMappingModel.Action = AppCode.editString;
          }
          this._Service.saveclaimsrsMapping_Service(this.claimsrsMappingModel)
            .subscribe((data: any) => {
              if (data > 0) {
                if (this.pageState == AppCode.saveString) {
                  this.toastr.success(AppCode.msg_saveSuccess);
                } else {
                  this.toastr.success(AppCode.msg_updateSuccess);
                }
                arr1 = this.claimsrsMappingModel.SRSId;
                this.selectedrows.push(arr1);
                console.log("After Saved this.selectedrows:   "  + JSON.stringify(this.selectedrows));
                this.ClearForm();
              } else if (data === -1) {
                this.toastr.warning(AppCode.msg_exist);
                this.isLoading = false;
                this.chRef.detectChanges();
              } else {
                this.toastr.error(AppCode.msg_AllotFail);
                this.ClearForm();
              }
            }, (error: any) => {
              console.error(error);
              this.isLoading = false;
              this.chRef.detectChanges();
            });
        }

        else {
          this.toastr.warning(AppCode.msg_SrsSelect);
          this.isLoading = false;
          this.chRef.detectChanges();
        }
      }
      else {
        this.toastr.error(AppCode.FailStatus);
        this.isLoading = false;
        this.ClaimNoInvalid = true;
        this.chRef.detectChanges();
      }
    }
  }

  //LRNo Validation
  LRNoValidation() {
    if ((typeof this.f.LRNo.value === 'string' && this.f.LRNo.value !== '')) {
      this.ClaimNoInvalid = true;
      return;
    } else {
      this.ClaimNoInvalid = false;
    }
    this.chRef.detectChanges();
  }

  GetClaimSrsMappingList(LRIdGPId: any) {
    if (LRIdGPId !== null && LRIdGPId !== undefined && LRIdGPId !== 0) {
      // this.claim = this.ClaimNoList.filter(x => x.PhyChkId == PhyChkId);
      // this.f.ReturnCatId.setValue(this.claim[0].ReturnCatId);
      // this.f.ReturnCatId.disable();
      // this.f.LRNo.setValue(this.claim[0].LRNo);
      // this.f.LRNo.disable();

      this.ClaimNoList.forEach((element) => {
        if (element.LREntryId === LRIdGPId.LREntryId) {
          this.f.LRDate.setValue(element.LRDate);
          this.f.LRDate.disable();
          this.f.ClaimNo.setValue(element.ClaimNo);
          this.f.ClaimNo.disable();
        }
      });

    } else {
      this.f.LRDate.setValue('');
      this.f.LRDate.enable();
      this.f.ClaimNo.setValue('');
      this.f.ClaimNo.enable();
    }

    if (LRIdGPId === 0 || LRIdGPId === undefined || LRIdGPId === null) {
      LRIdGPId = 0;
    } else {
      LRIdGPId = LRIdGPId.LREntryId;
    }
    this._Service.GetClaimNoById_Service(this.BranchId, this.CompanyId, LRIdGPId)
      .subscribe(
        (data: any) => {
          // get api through respons
          if (data.length > 0) {
            this.DataSource.data = data;
            this.ClaimRes = data;
            this.DataSource.paginator = this.paginator;
            this.DataSource.sort = this.Sort;
          }
          else {
            this.DataSource.data = [];
          }
        },
        (error) => {
          console.error(error);
          this.chRef.detectChanges();
        });
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // clear form on click cancel button
  ClearForm() {
    this.submitted = false;
    this.f.ClaimNo.setValue('');
    this.f.LRDate.setValue('');
    this.f.LRNo.setValue('');
    this.GetClaimSrsMappingList(0);
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    // this.searchModel = this.searchModel.trim(); // Remove whitespace
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }
}

export class matrowselected {
  SRSId: number;
}

