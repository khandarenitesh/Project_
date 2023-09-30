import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppCode } from 'src/app/app.code';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AccountModuleService } from '../Services/account-module.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CheckInvModel, CheckInvModelSave, CompanyModel, TransporterModel } from '../models/gatepas-bill-list';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/SharedServices/shared.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { trigger, state, transition, style, animate } from '@angular/animations';
import * as $ from "jquery";

@Component({
  selector: 'app-gatepass-bill-list',
  templateUrl: './gatepass-bill-list.component.html',
  styleUrls: ['./gatepass-bill-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class GatepassBillListComponent implements OnInit {

  Title: string = "Gatepass Bill Summary";
  pageState: string = '';
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  submitted: boolean = false;
  InvalidCompany: boolean = false;
  GatepassBillSummaryForm: FormGroup;
  CompanyList: any[] = [];
  CompanyNameArray: Observable<CompanyModel[]>;
  TransporterList: any[] = [];
  TransportNameArray: Observable<TransporterModel[]>;
  InvalidTransporterName: boolean = false;
  FromDate = new FormControl(new Date());
  ToDate = new FormControl(new Date());
  displayedColumnsForApi = ['SrNo', 'GPDate', 'GPNoOfInv', 'GPNoOfBox', 'RatePerBox', 'CityName', 'Amount', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  searchModel: string = '';
  @ViewChild('TABLE') table: ElementRef;
  DataModel: any;
  Flag: string = '';
  State: any = {
    state: ''
  };
  CheckInvList: CheckInvModel;
  modalReference: NgbModalRef;
  ResRemark: string = '';
  ExpInvNoOfBox: number = 0;
  ExpInvNoList: any[] = [];
  InvalidExpInvNo: boolean = false;
  ExpInvNoNameArray: Observable<CheckInvModel[]>;
  CheckinvList: CheckInvModelSave[] = [];
  selection = new SelectionModel<any>(true, []);
  Checkinvmodel: CheckInvModelSave;
  expandedElement: any;
  expInvId: number = 0;
  IsTranspNoOfBox: boolean = false;
  ExpInvNoOfBoxValue: number = 0;
  TranspNoOfBox: number = 0;
  IsRaiseConcern: boolean = false;
  disabled: boolean = false;
  isChecked: boolean = false;
  ResolvePopup: any;
  ExpInvDtlsId: number;
  VerifyButtonId: boolean = false;
  GatepassIdByValue: number = 0;

  constructor(
    private fb: FormBuilder,
    private _AccountService: AccountModuleService,
    private chRef: ChangeDetectorRef,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private _SharedService: SharedService,
    private modalService: NgbModal,
    private router: Router,
  ) { }
  defaultform: any = {
    Company: '',
    Transporter: '',
    FromDate: '',
    ToDate: ''
  };

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.initForm();
    this.GetCompanyList();
    this.GetTransporterList();
    this.GetExpInvNoList();
    this.route.queryParams.subscribe(params => {
      this.State = params;
    })
    if (this.State.state == 'Verify') {
      this.Setdata();
    }
    if (this.State.state == 'Concern') {
      this.Flag = 'Concern';
      this.SetResData();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.GatepassBillSummaryForm.controls;
  }

  initForm() {
    this.GatepassBillSummaryForm = this.fb.group({
      Transporter: [
        this.defaultform.Transporter,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
      Company: [
        this.defaultform.Company,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
      ExpInvNo: [
        this.defaultform.Transporter,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ]
    });
  }

  Setdata() {
    this.pageState = this.State.state;
    this.CheckInvList = new CheckInvModel();
    this.CheckInvList = this._SharedService.getData();
    if (this.CheckInvList !== undefined) {
      this.expInvId = this.CheckInvList.ExpInvId;
      this.f.Transporter.setValue(this.CheckInvList.BillFromName);
      this.f.Transporter.disable();
      let Comp = {
        'CompanyId': this.CheckInvList.CompId,
        'CompanyName': this.CheckInvList.CompanyName
      }
      this.f.Company.setValue(Comp);
      this.f.Company.disable();
      let ExpInv = {
        'ExpInvId': this.CheckInvList.ExpInvId,
        'ExpInvNo': this.CheckInvList.ExpInvNo
      }
      this.f.ExpInvNo.setValue(ExpInv);
      this.f.ExpInvNo.disable();
      this.FromDate.setValue(this.CheckInvList.InvFromDt);
      this.FromDate.disable();
      this.ToDate.setValue(this.CheckInvList.InvToDt);
      this.ToDate.disable()
      this.GetGatepassBillSummaryList();
      this.chRef.detectChanges();
    }
  }

  // Get Gatepass Bill Summary List
  GetGatepassBillSummaryList() {
    this.isLoading = true;
    this._AccountService.GetGatepassBillSummaryList_Service(this.expInvId).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
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

  // Expandable & Collapsible List
  expandCollapse(element: any) {
    $('.example-element-row').removeClass('is-blue');
    if (this.expandedElement !== null && this.expandedElement !== undefined) {
      $('#' + this.expandedElement.dtctID).css('display', 'none');
    }
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandedElement !== null && this.expandedElement !== undefined) {
      $('#' + this.expandedElement.dtctID).css('display', 'block');
      let prevrow = $('#Expand' + this.expandedElement.dtctID).prev()[0];
      $(prevrow).addClass('is-blue');
    } else {
      $('#' + element.dtctID).css('display', 'none');
    }
  }

  // Check UnCheck Data
  getCheckboxesData(gatepass: any) {
    if (gatepass.Checked === true) {
      let ele = document.getElementById('checked' + gatepass.gpctId);
      ele?.classList.add('disabled')
      var indexValue = this.CheckinvList.findIndex((x: any) => x.gpctId === gatepass.gpctId); // delete
      if (indexValue > -1) {
        this.CheckinvList.splice(indexValue, 1);
      }
      this.Checkinvmodel = new CheckInvModelSave();
      if (this.IsTranspNoOfBox === true) {
        this.Checkinvmodel.TransBillBox = gatepass.TranspNoOfBox;
        this.Checkinvmodel.DtlsStatus = 1;
        this.IsTranspNoOfBox = false;
      } else {
        this.Checkinvmodel.TransBillBox = gatepass.GPNoOfBox;
        this.Checkinvmodel.DtlsStatus = 2;
      }
      this.Checkinvmodel.gpctId = gatepass.gpctId;
      this.Checkinvmodel.GatepassId = gatepass.GatepassId;
      this.CheckinvList.push(this.Checkinvmodel);
      gatepass.IsRaiseConcern = false;
    } else {
      var indexValue = this.CheckinvList.findIndex((x: any) => x.gpctId === gatepass.gpctId); // delete
      this.CheckinvList.splice(indexValue, 1);
      let ele = document.getElementById('checked' + gatepass.gpctId);
      ele?.classList.remove('disabled')
    }
    if (this.CheckinvList.length > 0) {
      this.VerifyButtonId = true;
    } else {
      this.VerifyButtonId = false;
    }
    this.chRef.detectChanges();
  }

  checkUncheckAll(event: any, index: any) {
    let GPId: number = 0;
    let NoOfBox: number = 0;
    let UniqId: number = 0;
    if (index.GpSummaryById.length > 0) {
      for (let i = 0; i < index.GpSummaryById.length; i++) {
        UniqId = index.GpSummaryById[i].gpctId;
        GPId = index.GpSummaryById[i].GatepassId;
        NoOfBox = index.GpSummaryById[i].TranspNoOfBox;
        this.GatepassIdByValue = UniqId;
        var indexValue = this.CheckinvList.findIndex((x: any) => x.gpctId === UniqId);
        if (indexValue > -1 && event.target.checked === true) { // If Alredy exist in list delete that one and push new
          this.CheckinvList.splice(indexValue, 1);
        }
        if (event.target.checked === true) {
          this.Checkinvmodel = new CheckInvModelSave();
          this.Checkinvmodel.GatepassId = GPId
          this.Checkinvmodel.TransBillBox = NoOfBox;
          this.Checkinvmodel.DtlsStatus = 2;
          this.Checkinvmodel.gpctId = UniqId;
          this.CheckinvList.push(this.Checkinvmodel)
          let ele = document.getElementById('checked' + UniqId);
          ele?.classList.add('disabled');
          (<HTMLInputElement>document.getElementById('chkBoxById' + UniqId)).checked = true;
        }
        else {
          this.isChecked = false;
          var indexValue = this.CheckinvList.findIndex((x: any) => x.gpctId === UniqId);
          if (indexValue > -1){
            this.CheckinvList.splice(indexValue, 1);
          }
          (<HTMLInputElement>document.getElementById('chkBoxById' + UniqId)).checked = false;
          let ele = document.getElementById('checked' + UniqId);
          ele?.classList.remove('disabled')
        }
      }
      if (this.CheckinvList.length > 0) {
        this.VerifyButtonId = true;
      }
      else {
        this.VerifyButtonId = false;
      }
      // console.log("Data:" + JSON.stringify(this.CheckinvList))
      this.chRef.detectChanges();
    }
  }

  // Verify Data
  VerifyData() {
    this.isLoading = true;
    let DataModel = {
      'ExpInvId': this.expInvId,
      'AddedBy': this.UserId,
      'VerifyData': this.CheckinvList,
    }
    if (DataModel.VerifyData.length !== 0) {
      this._AccountService.SaveGPVerifiedDate_Service(DataModel)
        .subscribe((data: any) => {
          if (data > 0) {
            this.toaster.success(AppCode.msg_saveSuccess);
            this.isLoading = false;
            this.redirect();
          } else {
            this.toaster.error(AppCode.FailStatus);
            this.isLoading = false;
          }
        },
          (error: any) => {
            console.error("Error:" + JSON.stringify(error));
          });
    }
    else {
      this.toaster.warning(AppCode.msg_SelectGatepass);
      this.isLoading = false;
    }
    this.chRef.detectChanges();
  }

  PushConcernData(gatepass: any) {
    this.Checkinvmodel = new CheckInvModelSave();
    if (this.IsTranspNoOfBox === true) {
      this.Checkinvmodel.TransBillBox = gatepass.TranspNoOfBox;
      this.Checkinvmodel.DtlsStatus = 1;
      this.IsTranspNoOfBox = false;
    } else {
      this.Checkinvmodel.TransBillBox = gatepass.GPNoOfBox;
      this.Checkinvmodel.DtlsStatus = 2;
    }
    this.Checkinvmodel.gpctId = gatepass.gpctId;
    this.Checkinvmodel.GatepassId = gatepass.GatepassId;
    this.CheckinvList.push(this.Checkinvmodel);
    if (this.CheckinvList.length > 0) {
      this.VerifyButtonId = true;
    } else {
      this.VerifyButtonId = false;
    }
  }
  // Raise Concern Code
  RaiseConcernSave(gatepass: any) {
    gatepass.IsRaiseConcern = true;
    this.IsTranspNoOfBox = true;
    this.chRef.detectChanges();
  }

  // Company Auto Complete DropDown Code --> Start
  GetCompanyList() {
    this._AccountService.GetCompanyList_Service(AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.CompanyList = data;
          this.CompanyList = this.CompanyList.sort((a: any, b: any) => a.CompanyName.localeCompare(b.CompanyName));
          this.CompanyNameArray = this.f.Company.valueChanges
            .pipe(
              startWith<string | CompanyModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.CompanyName : null),
              map(CompanyName => CompanyName ? this.filterCompanyName(CompanyName) : this.CompanyList.slice())
            );
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  private filterCompanyName(name: string): CompanyModel[] {
    this.InvalidCompany = false;
    const filterValue = name.toLowerCase();
    return this.CompanyList.filter((option: any) =>
      option.CompanyName.toLowerCase().includes(filterValue));
  }

  displayFnCompanyName(name: CompanyModel): string {
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
  // Company Auto Complete DropDown Code --> End

  // Transporter Auto Complete DropDown Code --> Start
  GetTransporterList() {
    this._AccountService.GetTransporterList_Service(AppCode.allString, AppCode.allString,this.BranchId)
      .subscribe(
        (data: any) => {
          this.TransporterList = data;
          this.TransporterList = this.TransporterList.sort((a: any, b: any) => a.TransporterName.localeCompare(b.TransporterName));
          this.TransportNameArray = this.f.Transporter.valueChanges
            .pipe(
              startWith<string | TransporterModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.TransporterName : null),
              map(TransporterName => TransporterName ? this.filterTransporterName(TransporterName) : this.TransporterList.slice())
            );
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  private filterTransporterName(name: string): TransporterModel[] {
    this.InvalidTransporterName = false;
    const filterValue = name.toLowerCase();
    return this.TransporterList.filter((option: any) =>
      option.TransporterName.toLowerCase().includes(filterValue));
  }

  displayFnTransporterName(name: TransporterModel): string {
    return name && name.TransporterName ? name.TransporterName : '';
  }

  TransporterValidation() {
    this.submitted = false;
    if ((this.f.Transporter.value === '' || typeof this.f.Transporter.value === 'string' || this.f.Transporter.value === undefined || this.f.Transporter.value === null)) {
      this.InvalidTransporterName = true;
      this.isLoading = false;
      return;
    }
    else {
      this.InvalidTransporterName = false;
    }
  }
  // Transporter Auto Complete DropDown Code --> End

  // ExpInvNo Auto Complete DropDown Code --> Start
  GetExpInvNoList() {
    this._AccountService.GetExpenseRegisterList_Service(this.BranchId)
      .subscribe(
        (data: any) => {
          this.ExpInvNoList = data;
          this.ExpInvNoList = this.ExpInvNoList.sort((a: any, b: any) => a.ExpInvNo.localeCompare(b.ExpInvNo));
          this.ExpInvNoNameArray = this.f.ExpInvNo.valueChanges
            .pipe(
              startWith<string | CheckInvModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.ExpInvNo : null),
              map(ExpInvNo => ExpInvNo ? this.filterExpInvNoName(ExpInvNo) : this.ExpInvNoList.slice())
            );
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  private filterExpInvNoName(name: string): CheckInvModel[] {
    this.InvalidExpInvNo = false;
    const filterValue = name.toLowerCase();
    return this.ExpInvNoList.filter((option: any) =>
      option.ExpInvNo.toLowerCase().includes(filterValue));
  }

  displayFnExpInvNo(name: CheckInvModel): string {
    return name && name.ExpInvNo ? name.ExpInvNo : '';
  }

  ExpInvNoValidation() {
    this.submitted = false;
    if ((this.f.ExpInvNo.value === '' || typeof this.f.ExpInvNo.value === 'string' || this.f.ExpInvNo.value === undefined || this.f.ExpInvNo.value === null)) {
      this.InvalidExpInvNo = true;
      this.isLoading = false;
      return;
    }
    else {
      this.InvalidExpInvNo = false;
    }
  }

  // ExpInvNo Auto Complete DropDown Code --> End
  SetResData() {
    this.CheckInvList = new CheckInvModel();
    this.CheckInvList = this._SharedService.getData();
    if (this.CheckInvList !== undefined) {
      this.expInvId = this.CheckInvList.ExpInvId;
    }
    this.GetGatepassBillSummaryList();
  }

  ViewPopup(Row: any, content: any) {
    this.ResolvePopup = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    this.Checkinvmodel = new CheckInvModelSave();
    this.ExpInvDtlsId = Row.ExpInvDtlsId;
  }

  ExpInvResolveConcern() {
    this.Checkinvmodel = new CheckInvModelSave();
    this.Checkinvmodel.ExpInvDtlsId = this.ExpInvDtlsId;
    this.Checkinvmodel.DtlsStatus = 2;
    this.Checkinvmodel.ResolveRemark = this.ResRemark;
    this._AccountService.ResolveConcern_Service(this.Checkinvmodel)
      .subscribe((data: any) => {
        if (data > 0) {
          this.toaster.success(AppCode.msg_saveSuccess);
          this.isLoading = false;
          this.modalService.dismissAll();
          this.GetGatepassBillSummaryList();
        } else {
          this.toaster.error(AppCode.FailStatus);
          this.isLoading = false;
        }
      },
        (error: any) => {
          console.error("Error:" + JSON.stringify(error));
        });
    this.chRef.detectChanges();
  }

  ClearPopup() {
    this.modalService.dismissAll();
    this.ResRemark = "";
  }

  redirect() {
    this.Clear();
    if (this.Flag !== 'Concern') {
      this.router.navigate(['/modules/account-module/check-invoice-list']);
    } else {
      this.router.navigate(['/modules/account-module/expence-register']);
    }
  }

  Clear() {
    this.FromDate = new FormControl(new Date());
    this.ToDate = new FormControl(new Date());
    this.f.ExpInvNo.setValue('');
    this.f.Transporter.setValue('');
    this.f.Company.setValue('');
    this.isLoading = false;
    this.submitted = false;
    this.chRef.detectChanges();
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase();
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges();
  }
}
