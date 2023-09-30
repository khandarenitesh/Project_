import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OrderReturnService } from '../Services/order-return.service';
import { ToastrService } from 'ngx-toastr';
import { AppCode } from '../../../app.code';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralModel } from '../../master-forms/Models/general-model';
import { Observable } from 'rxjs';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { startWith, map } from 'rxjs/operators';
import { cleanData } from 'jquery';
import { DelayReasonModel } from '../models/DelayReasonModel';
import { SRSCNMappingCountsmodel } from '../models/SRSCNMappingCountsmodel';

@Component({
  selector: 'app-srs-list-pending-cn',
  templateUrl: './srs-list-pending-cn.component.html',
  styleUrls: ['./srs-list-pending-cn.component.scss']
})

export class SrsListPendingCnComponent implements OnInit {

  displayedColumnsForApi = ['SrNo', 'StockistNo', 'StockistName', 'SalesDocNo', 'LRNo', 'DelayReason', 'Action',];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  DelayRForm: FormGroup;

  constructor(private _Service: OrderReturnService, private chRef: ChangeDetectorRef, private toastr: ToastrService,
    private modalService: NgbModal, private _service: MastersServiceService, private fb: FormBuilder) { }

  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  isLoading: boolean = false;
  searchModel: string = '';
  PhyChkId: any = 0;
  RelayRemarkModal: any;
  pageState: string = "";
  dReasonmodel: DelayReasonModel;
  Generalmodal: GeneralModel;
  submitted = false;
  CategoryList: any = [];
  InvalidCategory: boolean = false;
  Status: string = "Y";
  CompId: number = 0;
  SRSId: number = 0;
  CNDelayReasonId: number = 0;
  DelayReasonRemark: string = '';
  AddedBy: number = 0;
  Title: string = 'SRS List of Pending CN ';

  SRSCNMappingCounts: SRSCNMappingCountsmodel;
  LREntryId: number = 0;
  SRSCnt: number = 0;
  CNCnt: number = 0;
  PendingForCNCnt: number = 0;
  PendingAtExpSCnt: number = 0;
  PendingDestrCertCnt: number = 0;

  DataModel: any;

  defaultform: any = {
    DelayReason: '',
    DelayReasonRemark: ''
  }

  CategoryNameArray: Observable<GeneralModel[]>;
  formControlCompanyName = new FormControl('');
  DelayReasonListArray: Observable<DelayReasonModel[]>;

  ngOnInit(): void {
    this.pageState = "Submit"
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.initForm();
    this.GetSrsPendingCnList();
    this.GetMasterNameList();

    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompanyId,
    };
    this.GetSRSCNMappingCounts(this.DataModel);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.DelayRForm.controls;
  }

  //form initialized
  initForm() {
    this.DelayRForm = this.fb.group({
      DelayReason: [
        this.defaultform.DelayReason,
        Validators.compose([
          Validators.required
        ]),
      ],
      DelayReasonRemark: [
        this.defaultform.DelayReasonRemark,
      ],
    });
  }

  // Get Master Name
  GetMasterNameList() {
    this._service.getMastersList_Service(AppCode.cnDelayReason, AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.CategoryList = data.GeneralMasterParameter;
          this.CategoryList = this.CategoryList.sort((a: any, b: any) => a.MasterName.localeCompare(b.MasterName));
          this.CategoryNameArray = this.f.DelayReason.valueChanges
            .pipe(
              startWith<string | GeneralModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.MasterName : null),
              map(MasterName => MasterName ? this.filterCategoryName(MasterName) : this.CategoryList.slice())
            );
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }


  //Get SRS CN Mapping Counts
  GetSRSCNMappingCounts(DataModel: any) {
    this.isLoading = true;
    this._Service.GetSRSCNMappingCounts(DataModel)
      .subscribe((data: any) => {
        if (data != null) {
          this.afterCount(data);
        }
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  afterCount(data: SRSCNMappingCountsmodel) {
    this.SRSCNMappingCounts = new SRSCNMappingCountsmodel();
    this.SRSCNMappingCounts = data;
    this.SRSCnt = this.SRSCNMappingCounts.TodaysSRSCnt
    this.CNCnt = this.SRSCNMappingCounts.TodayCNCnt;
    this.PendingForCNCnt = this.SRSCNMappingCounts.PendingForCNCnt;
    this.PendingDestrCertCnt = this.SRSCNMappingCounts.PendingDestrCertCnt;
    this.chRef.detectChanges();
  }

  // Autocomplete Search Filter
  private filterCategoryName(name: string): GeneralModel[] {
    this.InvalidCategory = false;
    const filterValue = name.toLowerCase();
    return this.CategoryList.filter((option: any) =>
      option.MasterName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnCategoryName(name: GeneralModel): string {
    return name && name.MasterName ? name.MasterName : '';
  }

  //popup model
  DelayReasonPopup(row: any, content: any) {
    this.SRSId = row.SRSId,
      this.DelayReasonRemark = "",
      this.RelayRemarkModal = this.modalService.open(content, {
        centered: true,
        size: 'md',
        backdrop: 'static'
      });
    (<HTMLInputElement>document.getElementById('cancel')).focus();
  }

  //save delay reason data
  AddDelayReasonSave() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.DelayRForm.valid) {
      this.isLoading = false;
      return;
    }
    else {
      if (this.InvalidCategory === false) {
        this.dReasonmodel = new DelayReasonModel();
        this.dReasonmodel.BranchId = this.BranchId;
        this.dReasonmodel.CompId = this.CompanyId;
        this.dReasonmodel.SRSId = this.SRSId;
        this.dReasonmodel.CNDelayReasonId = this.f.DelayReason.value.pkId;
        this.dReasonmodel.CNDelayRemark = this.f.DelayReasonRemark.value;
        this.dReasonmodel.AddedBy = this.UserId;
        this._Service.AddDelayReasonSave_Service(this.dReasonmodel)
          .subscribe((data: any) => {
            if (data > 0) {
              this.toastr.success(AppCode.msg_AddDelayReasonSuccess);
              this.modalService.dismissAll();
              this.ClearData();
              this.GetSrsPendingCnList();
              this.GetSRSCNMappingCounts(this.DataModel);
              this.isLoading = false;
              this.chRef.detectChanges();
            }
            else {
              this.toastr.error(AppCode.msg_AddDelayReasonFail);
              this.isLoading = false;
            }
          }, (error: any) => {
            console.error("Error:  " + JSON.stringify(error));
          });
      }
    }
  }

  //Get Clai SRS pending cn List
  GetSrsPendingCnList() {
    this.isLoading = true;
    this._Service.GetSrsPendingCnList_Service(this.BranchId, this.CompanyId, this.SRSId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
        this.GetSRSCNMappingCounts(this.DataModel);
      } else {
        this.DataSource.data = [];
      }
      this.isLoading = false;
      this.chRef.detectChanges();
      (error: any) => {
        console.log(error);
        this.isLoading = false;
        this.chRef.detectChanges();
      }
    });
  }

  //DelayReason Validation
  DelayReasonValidation() {
    if ((typeof this.f.DelayReason.value === 'string' && this.f.DelayReason.value !== '')) {
      this.InvalidCategory = true;
      return;
    } else {
      this.InvalidCategory = false;
    }
    this.chRef.detectChanges();
  }

  ClearData() {
    this.f.DelayReason.setValue('');
    this.f.DelayReasonRemark.setValue('');
    this.initForm();
    this.GetSrsPendingCnList();
    this.chRef.detectChanges();
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
