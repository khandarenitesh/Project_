import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { AssignTransportModel } from '../Models/assign-transport-model';
import { OrderDispatchService } from '../Services/order-dispatch.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AllInvCnt } from '../Models/all-inv-cnt.model';
import { CustomErrorStateMatcher } from '../../master-forms/CustomErrorStateMatcher';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-assign-transport-edit',
  templateUrl: './assign-transport-edit.component.html',
  styleUrls: ['./assign-transport-edit.component.scss']
})
export class AssignTransportEditComponent implements OnInit {

  DisplayAssignTransportData = ['SrNo', 'InvNo', 'InvCreatedDate', 'StockistNo', 'StockistName', 'SoldTo_City', 'TransporterName', 'PersonName', 'TransportModeId', 'IsStockTransfer', 'Actions'];//'InvoiceId',

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompId: number = 0;
  DataModel: any;
  Title: string = "";
  searchModel: string = '';
  TitleState: string = "";
  isCourier: string = "";
  isFlag: string = '';
  isCourFlag: string = '';
  Flag: string = '';
  AssignTransportForm: FormGroup;
  TransportModel: AssignTransportModel;
  EditAssignTransportModel: AssignTransportModel
  submitted = false;
  TransportModeList: any[] = [];
  AssignTransportList: any[] = [];
  AssignTransportLst: any[] = [];
  AssignCourierList: any[] = [];
  UserModal: any;
  assigntransportMid: number = 0;
  invoiveId: string = "";
  defaultform: any = {
    TransportModeId: '',
    PersonName: '',
    PersonAddress: '',
    PersonMobileNo: '',
    OtherDetails: '',
    AssignTransport: '',
    AssignedTransport: '',
    DeliveryRemark: '',
    AssignCourier: '',
    CNFCity: '',
    NoOfBox: '',
    InvWeight: '',
    IsCourier: ''
  };
  InvalidCity: boolean = false;
  filteredOptCity: Observable<AssignTransportModel[]>;
  CityList: any = [];
  CNFType: string = "";
  allinvCount: AllInvCnt;
  TotalInvoices: number = 0;
  TodaysWithOldOpen: number = 0;
  CancelInvCtn: number = 0;
  PendingInvCtn: number = 0;
  OnPriorityCtn: number = 0;
  PackerConcern: number = 0;
  GatpassGenCtn: number = 0;
  PendingLR: number = 0;
  IsStockTransferCtn: number = 0;
  StkPrint: number = 0;
  LocalMode: number = 0;
  OtherCity: number = 0;
  ByHand: number = 0;
  InvoicList: any;
  InvDataList: any[] = [];
  DataModelCount: any;
  IsId: any;
  IscurierFlagNew: any;
  events: boolean = true;
  uncheck: boolean = false;

  IsCourierChecked: number = 0;
  TransporterId: number = 0;
  TransportModeId: number = 0;
  CourierId: number = 0;
  IsTransportValid: boolean = false;
  IsCourierValid: boolean = false;
  customErrorStateMatcherType: CustomErrorStateMatcher = new CustomErrorStateMatcher();
  IsInvalidMobile: boolean = false;
  IsInvalidPan: boolean = false;
  IsFlagGst: boolean = true;
  IsInvalidGSTNo: boolean = true;
  id: any;

  constructor(private _orderDispatchService: OrderDispatchService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private _ToastrService: ToastrService,
    private _MastersServiceService: MastersServiceService,
    private modalService: NgbModal,
    private commonCode: AppCode,
    private _service: MastersServiceService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    debugger
    this.Title = "List View";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.initForm();
    this.f.TransportModeId.setValue(1);
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompId,
    };
    this.GetAssignedTransportList(this.DataModel);
    this.GetAssignTransportList();
    this.GetCourierList(this.BranchId);
    this.GetCityList();

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id === "1" ) {
      this.id = this.id;
      this.GetInvStkcnt(this.DataModel);
    } else if (this.id == null || this.id == undefined) {
      this.id = this.id = 0;
      this.GetInvoiceCounts(this.DataModel);
    }
  }

  // form validation
  initForm() {
    this.AssignTransportForm = this.fb.group({
      TransportModeId: [
        this.defaultform.TransportModeId,
        Validators.compose([
          Validators.required
        ]),
      ],
      PersonName: [
        this.defaultform.PersonName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      PersonAddress: [
        this.defaultform.PersonAddress,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      PersonMobileNo: [
        this.defaultform.PersonMobileNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      OtherDetails: [
        this.defaultform.OtherDetails
      ],
      AssignTransport: [
        this.defaultform.AssignTransport,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      AssignedTransport: [
        this.defaultform.AssignedTransport,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      DeliveryRemark: [
        this.defaultform.DeliveryRemark
      ],
      AssignCourier: [
        this.defaultform.AssignCourier,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      CNFCity: [
        this.defaultform.CNFCity,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      NoOfBox: [
        this.defaultform.NoOfBox,
        Validators.compose([
          Validators.pattern("^[1-9][0-9]*$"),
        ]),
      ],
      InvWeight: [
        this.defaultform.InvWeight
      ],
      IsCourier: [
        this.defaultform.isCourier
      ]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.AssignTransportForm.controls;
  }

  // To Avoid Copy Paste For Mobile
  public CopyPasteMblNotSpelcharAllow() {
    let NewFlag: boolean = false;
    if (this.f.PersonMobileNo.value === "") {
      this.IsInvalidMobile = false;
    }
    else {
      NewFlag = this.commonCode.Copynumberonlyandcomma(this.f.PersonMobileNo.value);
      if (NewFlag === true) {
        this.IsInvalidMobile = true;
      }
      else {
        this.IsInvalidMobile = false;
      }
      this.submitted = false;
      this.chRef.detectChanges();
    }
  }

  //Copy Paste Pan CARD
  copyPastPanNumbeAllow() {
    let NewFlag: boolean = false;
    if (this.f.PANNo.value === "") {
      this.IsInvalidPan = false;
    }
    else {
      NewFlag = this.commonCode.PanCradSplChNotAllow(this.f.PANNo.value);
      if (NewFlag === true) {
        this.IsInvalidPan = true
      }
      else {
        this.IsInvalidPan = false;
      }
      this.submitted = false;
      this.chRef.detectChanges();
    }
  }

  //Copy Paste GST
  copyPastGSTNoNumbeAllow() {
    let NewFlag: boolean = false;
    if (this.f.GSTNo.value === "") {
      this.IsFlagGst = false;
      this.IsInvalidGSTNo = true;
    }
    else {
      NewFlag = this.commonCode.GSTSplChNotAllow(this.f.GSTNo.value);
      if (NewFlag === true) {
        this.IsInvalidGSTNo = true
        this.IsFlagGst = true;
      }
      else {
        this.IsInvalidGSTNo = false;
        this.IsFlagGst = true;
      }
      this.submitted = false;
      this.chRef.detectChanges();
    }
  }

  // get city list
  GetCityList() {
    this._service.getCityList_Service(AppCode.allString, AppCode.allString, AppCode.CityActiveString)
      .subscribe((data: any) => {
        this.CityList = data.GetCityParameter;
        this.CityList = this.CityList.sort((a: any, b: any) => a.CityName.localeCompare(b.CityName));
        this.filteredOptCity = this.f.CNFCity.valueChanges
          .pipe(
            startWith<string | AssignTransportModel>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.CityName : null),
            map(CityName => CityName ? this.filterCity(CityName) : this.CityList.slice())
          );
        this.chRef.detectChanges();
      }, (error) => {
        console.error(error);
        this.chRef.detectChanges();
      });
  }

  // Autocomplete Search Filter
  private filterCity(name: string): AssignTransportModel[] {
    this.InvalidCity = false;
    const filterValue = name.toLowerCase();
    return this.CityList.filter((option: any) =>
      option.CityName.toLowerCase().includes(filterValue) ||
      option.CityCode.toLocaleLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values for city
  displayFnCity(city: AssignTransportModel): string {
    return city && city.CityName ? city.CityName : '';
  }

  // City Validation
  CityValidation() {
    if ((this.f.CNFCity.value.CityCode === '' || this.f.CNFCity.value.CityCode === null || this.f.CNFCity.value.CityCode === undefined)) {
      this.InvalidCity = true;
      return;
    } else {
      this.InvalidCity = false;
    }
    this.chRef.detectChanges();
  }

  // Get Invoice List
  GetAssignedTransportList(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getAssignTransportList_Service(DataModel)
      .subscribe((data: any) => {
        if (data.length > 0) {
          if (this.id === "1") {
            var stockTrandata = data.filter((x: any) => x.IsStockTransfer === 1)
            this.DataSource.data = stockTrandata;
            this.InvDataList = stockTrandata;
            this.DataSource.paginator = this.paginator;
            this.DataSource.sort = this.Sort;
          }
          else {
            var OrderDisdata = data.filter((x: any) => x.IsStockTransfer === 0)
            this.DataSource.data = OrderDisdata;
            this.InvDataList = OrderDisdata;
            this.DataSource.paginator = this.paginator;
            this.DataSource.sort = this.Sort;
          }
        } else {
          this.DataSource.data = [];
        }
        if (this.id === "1") {
          this.GetInvStkcnt(this.DataModel);
        } else {
          this.GetInvoiceCounts(DataModel);
        }
        this.isLoading = false;
        this.chRef.detectChanges();
      }, (error: any) => {
        console.error("Error:" + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  // Get Transport List
  GetAssignTransportList() {
    this._MastersServiceService.getGetTransporterList_Service(AppCode.allString, AppCode.IsActiveString,this.BranchId)
      .subscribe((data: any) => {
        this.AssignTransportList = data;
        this.AssignTransportLst = data;
        this.chRef.detectChanges();
      }, (error: any) => {
        console.error("Error:" + JSON.stringify(error));
        this.chRef.detectChanges();
      });
  }

  // Get Courier List
  GetCourierList(BranchId: number) {
    this._MastersServiceService.getGetCourierList_Service(BranchId, AppCode.allString, AppCode.IsActiveString)
      .subscribe((data: any) => {
        this.AssignCourierList = data;
        this.chRef.detectChanges();
      }, (error: any) => {
        console.error("Error:" + JSON.stringify(error));
        this.chRef.detectChanges();
      });
  }

  EditAssignedTransport(content: any, row: any) {
    this.isCourier = row.CourierName;
    this.assigntransportMid = row.AssignTransMId;
    this.invoiveId = row.InvoiceId;
    this.UserModal = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    this.TitleState = "Update Assigned Transport";
    this.SetData(row);
  }

  SetData(row: AssignTransportModel) {
    this.isLoading = true;
    this.EditAssignTransportModel = new AssignTransportModel();
    this.TransporterId = parseInt(row.TransporterId);
    this.TransportModeId = row.TransportModeId;
    this.f.TransportModeId.setValue(this.TransportModeId); // Transport Mode DDL
    this.f.PersonName.disable();
    this.f.PersonAddress.disable();
    this.f.PersonMobileNo.disable();
    this.f.OtherDetails.setValue(row.OtherDetails);
    this.f.AssignTransport.setValue(row.TransporterId);
    this.f.AssignedTransport.setValue(row.TransporterId);
    this.f.DeliveryRemark.setValue(row.Delivery_Remark);
    this.CourierId = parseInt(row.CourierId);
    this.f.AssignCourier.setValue(this.CourierId);
    let city: any = {
      'CityCode': row.CityCode,
      'CityName': row.CityName
    }
    this.f.CNFCity.setValue(city);
    this.f.NoOfBox.setValue(row.NoOfBox); // No of Box new Changes
    this.f.InvWeight.setValue(row.InvWeight); // InvWeight new Changes
    this.IsCourierChecked = row.IsCourier; // checkbox
    this.f.IsCourier.setValue(row.IsCourier);
    let TransportModeLocalValue = (row.TransportModeId === 1 ? AppCode.localstring : "");
    let TransportModeOtherCityValue = (row.TransportModeId === 2 ? AppCode.othercitystring : "");
    let TransportModeByHandValue = (row.TransportModeId === 3 ? AppCode.byhandstring : "");
    let IsCourierCheckedValue = (this.IsCourierChecked === 1 ? 1 : 0);
    let isCourFlagValue = (row.IsCourier === 1 ? AppCode.CheckIsCourier : "");
    // Local
    if (TransportModeLocalValue && isCourFlagValue === AppCode.CheckIsCourier && IsCourierCheckedValue === 1) {
      this.isFlag = AppCode.localstring; // Local
      this.isCourFlag = AppCode.CheckIsCourier; // Is Courier
      this.AssignCourierDDL(parseInt(row.CourierId));
      this.f.DeliveryRemark.enable();
    } else if (TransportModeLocalValue && isCourFlagValue !== AppCode.CheckIsCourier && IsCourierCheckedValue === 0) {
      this.isFlag = AppCode.localstring; // Local
      this.isCourFlag = ""; // reset value
      this.f.AssignTransport.enable();
      this.f.AssignTransport.setValue(row.TransporterId);
      this.f.DeliveryRemark.enable();
    }
    // Other City
    if (TransportModeOtherCityValue && isCourFlagValue === AppCode.CheckIsCourier && IsCourierCheckedValue === 1) {
      this.isFlag = AppCode.othercitystring; // Other City
      this.isCourFlag = AppCode.CheckIsCourier; // Is Courier
      this.AssignCourierDDL(parseInt(row.CourierId));
    } else if (TransportModeOtherCityValue && isCourFlagValue !== AppCode.CheckIsCourier && IsCourierCheckedValue === 0) {
      this.isFlag = AppCode.othercitystring; // Other City
      this.isCourFlag = ""; // reset value
      this.f.AssignedTransport.enable();
      this.f.AssignedTransport.setValue(row.TransporterId);
      this.f.OtherDetails.enable();
    }
    // By Hand
    if (TransportModeByHandValue) {
      this.isFlag = AppCode.byhandstring; // By Hand
      this.f.PersonName.enable();
      this.f.PersonAddress.enable();
      this.f.PersonMobileNo.enable();
      this.f.OtherDetails.enable();
    }
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  onchangeIsCourier(event: any) {
    this.isLoading = true;
    // Case : Local
    if (event === true && (this.TransportModeId === 1 || this.TransportModeId === 2 || this.TransportModeId === 3) && this.isFlag === AppCode.localstring) {
      this.isFlag = AppCode.localstring; // Local
      this.isCourFlag = AppCode.CheckIsCourier; // Is Courier Checkbox value get
      this.AssignCourierDDL(this.CourierId);
      this.f.PersonName.disable();
      this.f.PersonAddress.disable();
      this.f.PersonMobileNo.disable();
    } else if (event === false && (this.TransportModeId === 1 || this.TransportModeId === 2 || this.TransportModeId === 3) && this.isFlag === AppCode.localstring) {
      this.isFlag = AppCode.localstring; // Local
      this.isCourFlag = ""; // reset value
      this.IsCourierChecked = 0; // reset value checkbox uncheck
      this.AssignTransportDDL(this.TransporterId);
      this.f.PersonName.disable();
      this.f.PersonAddress.disable();
      this.f.PersonMobileNo.disable();
    }
    // Case : Other City
    if (event === true && (this.TransportModeId === 1 || this.TransportModeId === 2 || this.TransportModeId === 3) && this.isFlag === AppCode.othercitystring) {
      this.isFlag = AppCode.othercitystring; // Other City
      this.isCourFlag = AppCode.CheckIsCourier; // Is Courier Checkbox value get
      this.AssignCourierDDL(this.CourierId);
      this.f.PersonName.disable();
      this.f.PersonAddress.disable();
      this.f.PersonMobileNo.disable();
    } else if (event === false && (this.TransportModeId === 1 || this.TransportModeId === 2 || this.TransportModeId === 3) && this.isFlag === AppCode.othercitystring) {
      this.isFlag = AppCode.othercitystring; // Other City
      this.isCourFlag = ""; // reset value
      this.IsCourierChecked = 0; // reset value checkbox uncheck
      this.AssignTransportDDL(this.TransporterId);
      this.f.PersonName.disable();
      this.f.PersonAddress.disable();
      this.f.PersonMobileNo.disable();
    }
    // Case : By Hand
    if (event === true && (this.TransportModeId === 1 || this.TransportModeId === 2 || this.TransportModeId === 3) && this.isFlag === AppCode.byhandstring) {
      this.isFlag = AppCode.byhandstring; // By Hand
      this.isCourFlag = AppCode.CheckIsCourier; // Is Courier Checkbox value get
      this.AssignCourierDDL(this.CourierId);
    } else if (event === false && (this.TransportModeId === 1 || this.TransportModeId === 2 || this.TransportModeId === 3) && this.isFlag === AppCode.byhandstring) {
      this.isFlag = AppCode.byhandstring; // By Hand
      this.AssignTransportDDL(this.TransporterId);
    }
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // Assign Courier DDL
  AssignCourierDDL(courierId: number) {
    this.f.AssignCourier.enable();
    this.f.AssignCourier.setValue(courierId);
  }

  // Assign Transport DDL
  AssignTransportDDL(transporterId: number) {
    this.f.AssignTransport.enable();
    this.f.AssignTransport.setValue(transporterId);
    this.f.AssignedTransport.enable();
    this.f.AssignedTransport.setValue(transporterId);
  }

  // Selection Change events Transport Mode row avoid because SetData function method assigned value courier & transporter DDL
  onTransportMode(event: any) {
    this.isLoading = true;
    let TransportModeLocalValue = (event.value === 1 ? AppCode.localstring : "");
    let TransportModeOtherCityValue = (event.value === 2 ? AppCode.othercitystring : "");
    let TransportModeByHandValue = (event.value === 3 ? AppCode.byhandstring : "");
    // Local
    if (TransportModeLocalValue && this.isCourFlag === AppCode.CheckIsCourier && this.IsCourierChecked === 1) {
      this.isFlag = AppCode.localstring; // Local
      this.isCourFlag = AppCode.CheckIsCourier; // Is Courier
      this.AssignCourierDDL(this.CourierId);
      this.f.DeliveryRemark.enable();
      this.f.PersonName.disable();
      this.f.PersonAddress.disable();
      this.f.PersonMobileNo.disable();
    } else if (TransportModeLocalValue && this.isCourFlag === AppCode.CheckIsCourier && this.IsCourierChecked === 0) {
      this.isFlag = AppCode.localstring; // Local
      this.isCourFlag = AppCode.CheckIsCourier; // Is Courier
      this.AssignCourierDDL(this.CourierId);
      this.f.DeliveryRemark.enable();
      this.f.PersonName.disable();
      this.f.PersonAddress.disable();
      this.f.PersonMobileNo.disable();
    } else if (TransportModeLocalValue && this.isCourFlag === "" && this.IsCourierChecked === 0) {
      this.isFlag = AppCode.localstring;
      this.isCourFlag = "";
      this.AssignTransportDDL(this.TransporterId);
      this.f.DeliveryRemark.enable();
      this.f.PersonName.disable();
      this.f.PersonAddress.disable();
      this.f.PersonMobileNo.disable();
    } else if (TransportModeLocalValue && this.isCourFlag === "" && this.IsCourierChecked === 1) {
      this.isFlag = AppCode.localstring; // Local
      this.isCourFlag = AppCode.CheckIsCourier; // Is Courier
      this.AssignCourierDDL(this.CourierId);
      this.f.DeliveryRemark.enable();
      this.f.PersonName.disable();
      this.f.PersonAddress.disable();
      this.f.PersonMobileNo.disable();
    }
    // Other City
    if (TransportModeOtherCityValue && this.isCourFlag === AppCode.CheckIsCourier && this.IsCourierChecked === 1) {
      this.isFlag = AppCode.othercitystring; // Other City
      this.isCourFlag = AppCode.CheckIsCourier; // Is Courier
      this.AssignCourierDDL(this.CourierId);
      this.f.OtherDetails.enable();
      this.f.PersonName.disable();
      this.f.PersonAddress.disable();
      this.f.PersonMobileNo.disable();
    } else if (TransportModeOtherCityValue && this.isCourFlag === AppCode.CheckIsCourier && this.IsCourierChecked === 0) {
      this.isFlag = AppCode.othercitystring; // Other City
      this.isCourFlag = AppCode.CheckIsCourier; // Is Courier
      this.AssignCourierDDL(this.CourierId);
      this.f.OtherDetails.enable();
      this.f.PersonName.disable();
      this.f.PersonAddress.disable();
      this.f.PersonMobileNo.disable();
    } else if (TransportModeOtherCityValue && this.isCourFlag === "" && this.IsCourierChecked === 0) {
      this.isFlag = AppCode.othercitystring;
      this.isCourFlag = "";
      this.AssignTransportDDL(this.TransporterId);
      this.f.OtherDetails.enable();
      this.f.PersonName.disable();
      this.f.PersonAddress.disable();
      this.f.PersonMobileNo.disable();
    } else if (TransportModeOtherCityValue && this.isCourFlag === "" && this.IsCourierChecked === 1) {
      this.isFlag = AppCode.othercitystring; // Other City
      this.isCourFlag = AppCode.CheckIsCourier; // Is Courier
      this.AssignCourierDDL(this.CourierId);
      this.f.OtherDetails.enable();
      this.f.PersonName.disable();
      this.f.PersonAddress.disable();
      this.f.PersonMobileNo.disable();
    }
    // By Hand
    if (TransportModeByHandValue) {
      this.isFlag = AppCode.byhandstring; // By Hand
      this.f.PersonName.enable();
      this.f.PersonAddress.enable();
      this.f.PersonMobileNo.enable();
      this.f.OtherDetails.enable();
    }
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // Transport Validation
  onChangeAssignTransport() {
    this.IsTransportValid = false;
    this.f.DeliveryRemark.setValue('');
    this.f.OtherDetails.setValue('');
    this.chRef.detectChanges();
  }

  // Courier Validation
  onChangeAssignCourier() {
    this.IsCourierValid = false;
    this.f.DeliveryRemark.setValue('');
    this.f.OtherDetails.setValue('');
    this.chRef.detectChanges();
  }

  // Update Assigned Transport Mode
  UpdateAssignTransport() {
    this.submitted = true;
    this.isLoading = true;
    if (!this.AssignTransportForm.valid) {
      return;
    }
    // Validation Code - Courier & Transport DDL
    // Local - Assign Courier not selected & Is Courier Checkbox checked
    if (this.isFlag === AppCode.localstring && this.isCourFlag === AppCode.CheckIsCourier && this.f.AssignCourier.value === 0) {
      this.isFlag = AppCode.localstring;
      this.isCourFlag = AppCode.CheckIsCourier;
      this.IsCourierValid = true;
      this.isLoading = false;
      this.IsInvalidMobile = false;
    }
    // Local - Assign Transport not selected & Is Courier Checkbox not checked
    else if (this.isFlag === AppCode.localstring && this.isCourFlag !== AppCode.CheckIsCourier && this.f.AssignTransport.value === 0) {
      this.isFlag = AppCode.localstring;
      this.isCourFlag = "";
      this.IsTransportValid = true;
      this.isLoading = false;
      this.IsInvalidMobile = false;
    }
    // Other City - Assign Courier not selected & Is Courier Checkbox checked
    else if (this.isFlag === AppCode.othercitystring && this.isCourFlag === AppCode.CheckIsCourier && this.f.AssignCourier.value === 0) {
      this.isFlag = AppCode.othercitystring;
      this.isCourFlag = AppCode.CheckIsCourier;
      this.IsCourierValid = true;
      this.isLoading = false;
      this.IsInvalidMobile = false;
    }
    // Other City - Assign Transport not selected & Is Courier Checkbox not checked
    else if (this.isFlag === AppCode.othercitystring && this.isCourFlag !== AppCode.CheckIsCourier && this.f.AssignedTransport.value === 0) {
      this.isFlag = AppCode.othercitystring;
      this.isCourFlag = "";
      this.IsTransportValid = true;
      this.isLoading = false;
      this.IsInvalidMobile = false;
    } else {
      this.TransportModel = new AssignTransportModel();
      this.TransportModel.TransportModeId = (this.f.TransportModeId.value !== "" ? this.f.TransportModeId.value : 0);
      this.TransportModel.AssignTransMId = this.assigntransportMid;
      this.TransportModel.InvoiceId = this.invoiveId;
      this.TransportModel.IsCourier = ((this.f.IsCourier.value === true || this.f.IsCourier.value === 1) ? 1 : 0);
      this.TransportModel.Delivery_Remark = (this.f.DeliveryRemark.value !== "" ? this.f.DeliveryRemark.value : "");
      this.TransportModel.OtherDetails = (this.f.OtherDetails.value !== "" ? this.f.OtherDetails.value : "");
      // Case 1: Local & Is Courier
      if (this.isFlag === AppCode.localstring && this.isCourFlag === AppCode.CheckIsCourier) {
        this.TransportModel.CourierId = this.f.AssignCourier.value;
        this.TransportModel.TransporterId = '0';
        this.IsInvalidMobile = false;
      } else if (this.isFlag === AppCode.localstring && this.isCourFlag !== AppCode.CheckIsCourier) {
        this.TransportModel.TransporterId = this.f.AssignTransport.value;
        this.TransportModel.CourierId = '0';
        this.IsInvalidMobile = false;
         
      }
      // Case 2: Other City & Is Courier
      if (this.isFlag === AppCode.othercitystring && this.isCourFlag === AppCode.CheckIsCourier) {
        this.TransportModel.CourierId = this.f.AssignCourier.value;
        this.TransportModel.TransporterId = '0';
        this.IsInvalidMobile = false;
      } else if (this.isFlag === AppCode.othercitystring && this.isCourFlag !== AppCode.CheckIsCourier) {
        this.TransportModel.CourierId = '0';
        this.TransportModel.TransporterId = this.f.AssignedTransport.value;
        this.IsInvalidMobile = false;
      }
      // Case 3: By Hand
      if (this.isFlag === AppCode.byhandstring && this.IsInvalidMobile === false) {
        this.TransportModel.PersonName = this.f.PersonName.value;
        this.TransportModel.PersonAddress = this.f.PersonAddress.value;
        this.TransportModel.PersonMobileNo = this.f.PersonMobileNo.value;
        this.TransportModel.CourierId = '0';
        this.TransportModel.TransporterId = '0';
      }
      // To validation mobile number - By Hand
      if (this.IsInvalidMobile === true) {
        this.isLoading = false;
        return
      }
      // Other CNF
      if (this.isFlag === AppCode.otherCNF) {
        this.TransportModel.OCnfCity = this.f.CNFCity.value.CityCode;
      }
      this.TransportModel.Addedby = String(this.UserId);
      this.TransportModel.NoOfBox = this.f.NoOfBox.value; // New Change For No of Box
      this.TransportModel.InvWeight = this.f.InvWeight.value;

      this._orderDispatchService.UpdateAssignedTransportMode_Service(this.TransportModel)
        .subscribe((data: any) => {
          if (data === AppCode.SuccessStatus) {
            this._ToastrService.success(AppCode.msg_updateSuccess)
            this.ClearForm();
          } else if (data === AppCode.ExistsStatus) {
            this._ToastrService.warning(AppCode.msg_exist);
          } else {
            this._ToastrService.error(data);
            this.ClearForm();
          }
        }, (error: any) => {
          console.error("Error:" + JSON.stringify(error));
          this.ClearForm();
        });
    }
  }

  // Clear Form
  ClearForm() {
    this.isCourFlag = "";
    this.events = true;
    this.isCourier = '';
    this.isFlag = "";
    this.modalService.dismissAll();
    this.f.TransportModeId.setValue(1);
    this.GetAssignedTransportList(this.DataModel);
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

  ValidationMobile(event: any) {
    this.commonCode.numberOnly(event)
  }

  GetInvoiceCounts(DataModelCount: any) {
    this.isLoading = true;
    this._orderDispatchService.GetInvoiceCounts_Service(DataModelCount)
      .subscribe((data: any) => {
        this.afterCount(data);
      }, (error: any) => {
        console.error("Error: " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  afterCount(data: AllInvCnt) {
    this.allinvCount = new AllInvCnt();
    this.allinvCount = data;
    this.TotalInvoices = this.allinvCount.TotalInvoices;
    this.TodaysWithOldOpen = this.allinvCount.TodaysWithOldOpen;
    this.PendingInvCtn = this.allinvCount.PendingInvCtn;
    this.PackerConcern = this.allinvCount.PackerConcern;
    this.CancelInvCtn = this.allinvCount.CancelInvCtn;
    this.OnPriorityCtn = this.allinvCount.OnPriorityCtn;
    this.GatpassGenCtn = this.allinvCount.GatpassGenCtn;
    this.PendingLR = this.allinvCount.PendingLR;
    this.IsStockTransferCtn = this.allinvCount.IsStockTransferCtn;
    this.StkPrint = this.allinvCount.StkPrint;
    this.LocalMode = this.allinvCount.LocalMode;
    this.OtherCity = this.allinvCount.OtherCity;
    this.ByHand = this.allinvCount.ByHand;
    this.chRef.detectChanges();
  }


  //Get Stock Transfer Count 
  GetInvStkcnt(DataModelCount: any) {
    this.isLoading = true;
    this._orderDispatchService.GetInvForStkCnt_Service(DataModelCount)
      .subscribe((data: any) => {
        this.afterInvStkcnt(data);
      }, (error: any) => {
        console.error("Error: " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  afterInvStkcnt(data: AllInvCnt) {
    this.allinvCount = new AllInvCnt();
    this.allinvCount = data;
    this.TotalInvoices = this.allinvCount.TotalInvoices;
    this.TodaysWithOldOpen = this.allinvCount.TodaysWithOldOpen;
    this.PendingInvCtn = this.allinvCount.PendingInvCtn;
    this.PackerConcern = this.allinvCount.PackerConcern;
    this.CancelInvCtn = this.allinvCount.CancelInvCtn;
    this.OnPriorityCtn = this.allinvCount.OnPriorityCtn;
    this.GatpassGenCtn = this.allinvCount.GatpassGenCtn;
    this.PendingLR = this.allinvCount.PendingLR;
    this.IsStockTransferCtn = this.allinvCount.IsStockTransferCtn;
    this.StkPrint = this.allinvCount.StkPrint;
    this.LocalMode = this.allinvCount.LocalMode;
    this.OtherCity = this.allinvCount.OtherCity;
    this.ByHand = this.allinvCount.ByHand;
    this.chRef.detectChanges();

  }

  // filter code
  ShowPickList(Flag?: any) {
    if (this.InvDataList != null && this.InvDataList != undefined) {

      if (Flag === 'OnPriorityCtn') {
        this.InvoicList = this.InvDataList.filter(x => x.OnPriority === 1);
      }
      else if (Flag === 'CancelInvCtn') {
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 20);
      }
      else if (Flag === 'PendingInvCtn') {
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 0);
      }
      else if (Flag === 'PendingLR') {
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 7 && x.InvStatus === 8);
      }
      else if (Flag === 'IsStockTransferCtn') {
        this.InvoicList = this.InvDataList.filter(x => x.IsStockTransfer === 1 && x.IsStockTransfer != 0);
      }
      else if (Flag === 'PackerConcern') {
        this.InvoicList = this.InvDataList.filter(x => x.InvStatus === 4);
      }
      else if (Flag === 'LocalMode') {
        this.Title = " List View - Local Mode" + ' (' + this.LocalMode + ')';
        this.InvoicList = this.InvDataList.filter(x => x.InvoiceId != null && x.TransportModeId === 1);
      }
      else if (Flag === 'OtherCity') {
        this.Title = " List View - Other City" + ' (' + this.OtherCity + ')';
        this.InvoicList = this.InvDataList.filter(x => x.InvoiceId != null && x.TransportModeId === 2);
      }
      else if (Flag === 'ByHand') {
        this.Title = " List View -By Hand" + ' (' + this.ByHand + ')';
        this.InvoicList = this.InvDataList.filter(x => x.InvoiceId != null && x.TransportModeId === 3);
      }

      this.DataSource = new MatTableDataSource(this.InvoicList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
      this.chRef.detectChanges();
    }
  }

  //return the form control instance based on the control name
  getFormControl(controlName: string): FormControl {
    return this.AssignTransportForm.get(controlName) as FormControl;
  }

  //return the error message based on the given control and error
  getErrorMessage(controlName: string, errorType: string): any {
    switch (controlName) {
      case "NoOfBox":
        {
          if (errorType === "pattern")
            return "No Of Box should not start with zero (0)";
          break;
        }
      default: return "";
    }
  }

}
