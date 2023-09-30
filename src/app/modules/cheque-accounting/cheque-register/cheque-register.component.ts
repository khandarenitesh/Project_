import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { ChequeRegister } from '../models/cheque-register';
import { Chequecounts } from '../models/chequecount-model';
import { ChequeAccountingService } from '../Services/cheque-accounting.service';
import { AppCode } from '../../../app.code';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-cheque-register',
  templateUrl: './cheque-register.component.html',
  styleUrls: ['./cheque-register.component.scss']
})
export class ChequeRegisterComponent implements OnInit {

  displayedColumns = ['SrNo', 'StockistName', 'Date', 'BankName', 'City', 'BankAccountNo', 'IFSCCode', 'ChequeNo', 'ChequeSts', 'DateDiff', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();

  displayedColumnsForInv = ['Action', 'InvNo', 'InvCreatedDate', 'IsColdStorage', 'StockistName', 'CityName', 'InvAmount'];
  // @ViewChild('Invpaginatornew') Invpaginatornew: MatPaginator;
  @ViewChild('InvSortNew') InvSortNew: MatSort;
  @ViewChild(MatPaginator) paginator1: MatPaginator;
  public InvDataSource = new MatTableDataSource<any>();

  ChequeRegisterForm: FormGroup;
  ChequeRegisterFormControl: FormGroup;
  submitted = false;
  chequeregister: ChequeRegister;
  StockistNameList: any[] = [];
  StockistNoList: any[] = [];
  CityList: any = [];
  BankList: any[] = [];
  UserId: Number = 0;
  pageState: string = '';
  CompanyId: number = 0;
  BranchId: number = 0;
  InvData: string = '';
  ChqNo: string = '';
  StockistId: number = 0;
  isLoading: boolean = false;
  Title: string = "";
  currentDate = new Date();
  BlockDate = new Date();
  maxDate = new Date();
  AddEditModel: any;
  ChqStsModel: any;
  Stockist: number = 0;
  ChqRegId: number = 0;
  chequecounts: Chequecounts;
  Blank: number = 0;
  Utilised: number = 0;
  Prepare: number = 0;
  Deposited: number = 0;
  Discarded: number = 0;
  Returned: number = 0;
  Settled: number = 0;
  Total: number = 0;
  ChequeList: any;
  ChequeData: any[] = [];
  ModalTitle: string = '';
  flag: string = '';
  Invoices: string = '';
  Remark: string = '';
  ReasonList: any = [];
  RetReason: number = 0;
  inputTitle: string = '';
  StockistNo: boolean = false;
  StockistName: boolean = false
  IsChequeNoCheckFlag: boolean = false;
  minDate = new Date(this.BlockDate.setDate(this.BlockDate.getDate() - 4)); // Only Visible 4 Date

  defaultform: any = {
    StockistName: '',
    Date: '',
    BankName: '',
    City: '',
    BankAccountNo: '',
    IFSCCode: '',
    FromChequeNo: '',
    ToChequeNo: '',
    StockistNo: '',
  };

  State: any = {
    state: ''
  };

  MapForm: FormGroup;
  default: any = {
    FromDate: '',
    ToDate: ''
  }
  FromDate = new FormControl(new Date());
  ToDate = new FormControl(new Date());

  searchModel: string = '';
  StockistNameArray: Observable<ChequeRegister[]>;
  StockistNoArray: Observable<ChequeRegister[]>
  StockistNameforListArray: Observable<ChequeRegister[]>
  StockistNameArrayList: Observable<ChequeRegister[]>;
  formControlStockistNameList = new FormControl('');
  pageIndex = 0; // Current page index
  pageSize = 10; // Number of items per page
  pageSizeOptions: number[] = [20, 50, 100, 150, 200];
  totalItems = 0;
  FromDate1: any;
  ToDate1: any;
  constructor(
    private fb: FormBuilder,
    private _service: MastersServiceService,
    private chequeService: ChequeAccountingService,
    private chef: ChangeDetectorRef,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private _appCode: AppCode
  ) {
    this.currentDate = new Date();
    this.BlockDate = new Date();
    this.FromDate = new FormControl(new Date());
    this.ToDate = new FormControl(new Date());
  }

  ngOnInit(): void {
    this.Title = "Add Cheque Details";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.pageState = AppCode.saveString;
    this.inputTitle = 'From Cheque Number';
    this.initForm();
    this.ListForm();
    this.GetChequeList();
    this.GetCityList();
    this.getReason();
    this.GetStockistNOList();
    this.GetChequeCounts();
    this.MapInvoiceForm();
  }

  AddEdit(content: any, row: any) {
    this.AddEditModel = this.modalService.open(content, {
      centered: true,
      size: 'xl',
      backdrop: 'static'
    });
    if (row == 'row') {
      (<HTMLInputElement>document.getElementById('cancel')).focus();
      this.f.Date.setValue(this.currentDate);
      this.pageState = 'Save';
      this.inputTitle = 'From Cheque No.';
      this.Title = "Add Cheque Details";
      this.f.StockistName.enable();
      this.f.StockistNo.enable();
    }
    else {
      this.Setdata(row);
      this.f.StockistName.disable();
      this.f.StockistNo.disable();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.ChequeRegisterForm.controls;
  }

  get f1(): { [key: string]: AbstractControl } {
    return this.ChequeRegisterFormControl.controls;
  }

  ListForm() {
    this.ChequeRegisterFormControl = this.fb.group({
      StockistNameforList: [
        this.defaultform.StockistNameforList,
      ],
    });
  }

  MapInvoiceForm() {
    this.MapForm = this.fb.group({
      FromDate: [this.default.FromDate],
      ToDate: [this.default.ToDate]
    })
  }

  initForm() {
    this.ChequeRegisterForm = this.fb.group({
      StockistName: [
        this.defaultform.StockistName,
        Validators.compose([
          Validators.required
        ]),
      ],
      StockistNo: [
        this.defaultform.StockistNo,
        Validators.compose([
          Validators.required
        ]),
      ],
      Date: [
        this.defaultform.Date,
        Validators.compose([
          Validators.required
        ]),
      ],
      BankName: [
        this.defaultform.BankName,
        Validators.compose([
          Validators.required
        ]),
      ],
      City: [
        { value: '', disabled: true },
        this.defaultform.City,
        Validators.compose([
          Validators.required
        ]),
      ],
      BankAccountNo: [
        { value: '', disabled: true },
        this.defaultform.BankAccountNo,
        Validators.compose([
          Validators.required
        ]),
      ],
      IFSCCode: [
        { value: '', disabled: true },
        this.defaultform.IFSCCode,
        Validators.compose([
          Validators.required
        ]),
      ],
      FromChequeNo: [
        this.defaultform.FromChequeNo,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6)
        ]),
      ],
      ToChequeNo: [
        this.defaultform.ToChequeNo,
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(6)
        ]),
      ],
    });
  }

  NumValidation(event: any) {
    this._appCode.numberOnly(event);
  }

  //Get city list
  GetCityList() {
    this._service.getCityList_Service(AppCode.ststString, AppCode.allString, AppCode.allString)
      .subscribe((data: any) => {
        this.CityList = data.GetCityParameter;
        this.chef.detectChanges();
      }, (error) => {
        console.error(error);
        this.chef.detectChanges();
      });
  }

  GetStockistNOList() {
    this._service.getStockistList_Service(this.BranchId, this.CompanyId, AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.StockistNoList = data;
          this.StockistNameList = data;
          this.StockistNameList = this.StockistNameList.sort((a: any, b: any) => a.StockistName.localeCompare(b.StockistName));
          this.StockistNameArray = this.f.StockistName.valueChanges
            .pipe(
              startWith<string | ChequeRegister>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.StockistName : null),
              map(StockistName => StockistName ? this.filterStockistName(StockistName) : this.StockistNameList.slice())
            );

          this.StockistNoList = data;
          this.StockistNameList = data;
          this.StockistNoList = this.StockistNoList.sort((a: any, b: any) => a.StockistNo.localeCompare(b.StockistNo));
          this.StockistNoArray = this.f.StockistNo.valueChanges
            .pipe(
              startWith<string | ChequeRegister>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.StockistNo : null),
              map(StockistNo => StockistNo ? this.filterStockistName(StockistNo) : this.StockistNameList.slice())
            );

          this.StockistNoList = data;
          this.StockistNameList = data;
          this.StockistNameList = this.StockistNameList.sort((a: any, b: any) => a.StockistName.localeCompare(b.StockistName));
          this.StockistNameforListArray = this.f1.StockistNameforList.valueChanges
            .pipe(
              startWith<string | ChequeRegister>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.StockistName : null),
              map(StockistName => StockistName ? this.filterStockistName(StockistName) : this.StockistNameList.slice())
            );
          this.chef.detectChanges();
        },
        (error) => {
          console.error(error);
          this.chef.detectChanges();
        }
      );
  }

  // Autocomplete Search Filter
  private filterStockistName(name: string): ChequeRegister[] {
    this.StockistNo = false;
    this.StockistName = false;
    const filterValue = name.toLowerCase();
    return this.StockistNameList.filter((option: any) =>
      option.StockistNo.toLowerCase().includes(filterValue) ||
      option.StockistName.toLocaleLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnStockistName(name: ChequeRegister): string {
    return name && name.StockistName ? name.StockistName : '';
  }

  // Select or Choose dropdown values
  displayFnStockistNo(stockiNo: ChequeRegister): string {
    return stockiNo && stockiNo.StockistNo ? stockiNo.StockistNo : '';
  }

  // Get Bank List
  getBankList(StockistId: number) {
    this._service.GetStockistBankList_Service(StockistId)
      .subscribe((data: any) => {
        this.afterbank(data);
        this.isLoading = false;
        this.chef.detectChanges();
      }, (error) => {
        console.error(error);
        this.chef.detectChanges();
      });
  }

  afterbank(data: any) {
    if ((data.length === 0) || (data[0].AccountNo === 0 || data[0].AccountNo === "0" || data[0].AccountNo === "" || data[0].AccountNo === undefined) ||
      (data[0].BankId === 0 || data[0].BankId === "0" || data[0].BankId === "" || data[0].BankId === undefined)) {
      this.toaster.warning('Please add bank details!');
      return;
    }
    this.BankList = data;
    if (this.BankList.length == 1) {
      this.f.BankName.setValue(this.BankList[0].BankId);
      this.f.BankName.disable();
      this.f.BankAccountNo.setValue(this.BankList[0].AccountNo);
      this.f.IFSCCode.setValue(this.BankList[0].IFSCCode);
    }
    else {
      this.f.BankName.enable();
    }
  }

  // Bind data to disabled controls
  onChangeStockistName() {
    this.isLoading = true;
    if (this.f.StockistName.value !== null) {
      let data = this.StockistNameList.filter(x => x.StockistId === this.f.StockistName.value.StockistId);
      let obj = {
        "StockistId": data[0].StockistName,
        "StockistNo": data[0].StockistNo
      }
      this.f.StockistNo.setValue(obj);
      if (data[0].CityCode === null || data[0].CityCode === "" || data[0].CityCode === undefined) {
        this.toaster.warning("Please add a city");
        return;
      } else {
        this.f.City.setValue(data[0].CityCode);
      }
      this.getBankList(data[0].StockistId);
      this.chef.detectChanges();
    }
  }

  // Bind data to disabled controls
  onChangeStockistNo() {
    this.isLoading = true;
    if (this.f.StockistNo.value !== null) {
      let data = this.StockistNoList.filter(x => x.StockistId === this.f.StockistNo.value.StockistId);
      let obj = {
        "StockistId": data[0].StokistId,
        "StockistName": data[0].StockistName
      }
      this.f.StockistName.setValue(obj);
      if (data[0].CityCode === null || data[0].CityCode === "" || data[0].CityCode === undefined) {
        this.toaster.warning("Please add a city");
        return;
      } else {
        this.f.City.setValue(data[0].CityCode);
      }
      this.getBankList(data[0].StockistId);
      this.chef.detectChanges();
    }
  }

  onBankChange() {
    let bank = this.BankList.filter(b => b.BankId == this.f.BankName.value);
    this.f.BankAccountNo.setValue(bank[0].AccountNo);
    this.f.IFSCCode.setValue(bank[0].IFSCCode);
    this.chef.detectChanges();
  }

  stockistnameValidation() {
    this.submitted = false;
    if ((this.f.StockistName.value.StockistName === "" || this.f.StockistName.value.StockistName === null || this.f.StockistName.value.StockistName === undefined)) {
      this.StockistName = true;
      return;
    } else {
      this.StockistName = false;
    }
  }

  stockistnoValidation() {
    this.submitted = false;
    if ((this.f.StockistNo.value.StockistNo === "" || this.f.StockistNo.value.StockistNo === null || this.f.StockistNo.value.StockistNo === undefined)) {
      this.StockistNo = true;
      return;
    } else {
      this.StockistNo = false;
    }
  }
  // save Cheques details
  SaveCheque() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.ChequeRegisterForm.valid) {
      this.submitted = false;
      this.StockistName = false;
      this.StockistNo = false;
      return;
    }
    else {
      if (this.StockistName === false && this.StockistNo === false) {
        this.chequeregister = new ChequeRegister();
        if (this.f.StockistName.value.StockistId !== undefined) {
          this.chequeregister.StokistId = this.f.StockistName.value.StockistId;
        } else {
          this.chequeregister.StokistId = this.f.StockistNo.value.StockistId;
        }
        this.chequeregister.ChqReceivedDate = AppCode.createDateAsUTC(new Date(this.f.Date.value));
        this.chequeregister.City = this.f.City.value;
        this.chequeregister.BankId = this.f.BankName.value;
        this.chequeregister.AccountNo = this.f.BankAccountNo.value;
        this.chequeregister.IFSCCode = this.f.IFSCCode.value;
        this.chequeregister.ToChqNo = this.f.ToChequeNo.value;
        this.chequeregister.IsActive = AppCode.IsActiveString;
        this.chequeregister.CompId = this.CompanyId;
        this.chequeregister.BranchId = this.BranchId;
        if (this.pageState == AppCode.saveString) {
          if (this.f.ToChequeNo.value !== '' && this.f.ToChequeNo.value !== null) {
            if (this.f.FromChequeNo.value > this.f.ToChequeNo.value) {
              this.toaster.warning('To cheque number must be greater than from cheque number!');
              return;
            }
          }
          if (this.f.FromChequeNo.value !== "" && (this.f.ToChequeNo.value === "" || this.f.ToChequeNo.value === null)) {
            this.IsChequeNoCheckFlag = true;
          } else {
            this.CheckChequeNo(this.f.FromChequeNo.value, this.f.ToChequeNo.value);
            if (this.IsChequeNoCheckFlag === false) {
              return
            }
          }
          this.chequeregister.Action = AppCode.addString;
          this.chequeregister.Addedby = String(this.UserId);
          this.chequeregister.FromChqNo = this.f.FromChequeNo.value;
          this.chequeService.SaveCheque_Service(this.chequeregister)
            .subscribe((data: any) => {
              if (data === AppCode.SuccessStatus) {
                if (this.pageState == AppCode.saveString) {
                  this.toaster.success(AppCode.msg_saveSuccess);
                  this.ChequeRegisterForm.reset();
                  this.f.Date.setValue(this.currentDate);
                  this.GetChequeList();
                  this.GetChequeCounts();
                }               
              } 
              else if (data === AppCode.ExistsStatus) {
                this.toaster.warning(AppCode.msg_exist);
              }
              else {
                this.toaster.error(data);
              }
              this.isLoading = false;
              this.chef.detectChanges();
            }, (error: any) => {
              console.error(error);
              this.isLoading = false;
              this.chef.detectChanges();
            });
        }
        else {
          this.chequeregister.Action = AppCode.editString;
          this.chequeregister.ChqRegId = this.ChqRegId;
          this.chequeregister.Updatedby = String(this.UserId);
          this.chequeregister.ChqNo = this.f.FromChequeNo.value;
          this.chequeService.UpdateCheque_Service(this.chequeregister).subscribe(
            (data: any) => {
              if (data === AppCode.SuccessStatus) {
                this.toaster.success(AppCode.msg_updateSuccess);
                this.ChequeRegisterForm.reset();
                this.f.Date.setValue(this.currentDate);
                this.GetChequeList();
                this.GetChequeCounts();
                this.modalService.dismissAll();
              } else if (data === AppCode.ExistsStatus) {
                this.toaster.warning(AppCode.msg_exist);
                this.modalService.dismissAll();
              } else {
                this.toaster.error(data);
                this.modalService.dismissAll();
              }
              this.isLoading = false;
              this.chef.detectChanges();
            }, (error: any) => {
              console.error(error);
              this.isLoading = false;
              this.chef.detectChanges();
            });
        }
      }
    }
  }

  //find between of two numbers
  CheckChequeNo(FromChequeNo: any, ToChequeNo: any) {
    if (FromChequeNo !== "" && ToChequeNo !== "") {
      var result = Math.abs(FromChequeNo - ToChequeNo);
      if (result <= 100) {
        this.IsChequeNoCheckFlag = true;
      } else {
        this.toaster.warning("You can add max 100 cheques at a time. Difference between From-To Cheque should not be more than 100.");
        this.IsChequeNoCheckFlag = false;
      }
    }
  }

  // clear form on click cancel button
  ClearForm() {
    this.submitted = false;
    this.ChequeRegisterForm.reset();
    this.MapForm.reset();
    this.isLoading = false;
    this.chef.detectChanges();
    this.clearMapInvoice();
  }

  //Get Cheques List
  GetChequeList() {
    this.isLoading = true;
    if (this.f1.StockistNameforList.value === "" || this.f1.StockistNameforList.value === null || this.f1.StockistNameforList.value === undefined) {
      this.Stockist = 0;
    } else {
      this.Stockist = this.f1.StockistNameforList.value.StockistId;
    }
    this.chequeService.getChequeList_Service(this.BranchId, this.CompanyId, this.Stockist).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.DataSource.data = data;
        this.ChequeData = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
      } else {
        this.DataSource.data = [];
        this.ChequeData = [];
      }
      this.isLoading = false;
      this.chef.detectChanges();
    });
  }

  //Get Cheques List
  GetChequeCounts() {
    this.isLoading = true;
    if (this.f1.StockistNameforList.value === "" || this.f1.StockistNameforList.value === null || this.f1.StockistNameforList.value === undefined) {
      this.Stockist = 0;
    } else {
      this.Stockist = this.f1.StockistNameforList.value.StockistId;
    }
    this.chequeService.getChequeCount_Service(this.BranchId, this.CompanyId, this.Stockist).subscribe((data: any) => {
      this.aftercount(data);
    });
  }

  aftercount(data: any) {
    this.chequecounts = new Chequecounts();
    this.chequecounts = data;
    if (this.chequecounts !== null) {
      this.Total = this.chequecounts.Total;
      this.Blank = this.chequecounts.Blank;
      this.Utilised = this.chequecounts.Utilised;
      this.Prepare = this.chequecounts.Prepare;
      this.Deposited = this.chequecounts.Deposited;
      this.Discarded = this.chequecounts.Discarded;
      this.Returned = this.chequecounts.Returned;
      this.Settled = this.chequecounts.Settled;
    }
    else {
      this.Total = 0;
      this.Blank = 0;
      this.Utilised = 0;
      this.Prepare = 0;
      this.Deposited = 0
      this.Discarded = 0;
      this.Returned = 0;
      this.Settled = 0;
    }
    this.isLoading = false;
    this.chef.detectChanges();
  }

  ShowChqList(Flag?: any) {
    if (this.ChequeData != null && this.ChequeData !== undefined) {
      if (Flag === 'All') {
        this.ChequeList = this.ChequeData;
      }
      else if (Flag === 'Blank') {
        this.ChequeList = this.ChequeData.filter(x => x.ChqStatus === 0);

      } else if (Flag === 'Utilised') {
        this.ChequeList = this.ChequeData.filter(x => x.ChqStatus === 1);

      } else if (Flag === 'Deposited') {
        this.ChequeList = this.ChequeData.filter(x => x.ChqStatus === 4);

      } else if (Flag === 'Return') {
        this.ChequeList = this.ChequeData.filter(x => x.ChqStatus === 5);

      } else if (Flag === 'Settled') {
        this.ChequeList = this.ChequeData.filter(x => x.ChqStatus === 8);
      }
      this.DataSource = new MatTableDataSource(this.ChequeList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
      this.chef.detectChanges();
    }
  }

  // Set data on click edit button
  Setdata(row: any) {
    this.Title = "Update Cheques Details";
    this.pageState = "Update";
    this.inputTitle = 'Cheque Number';
    this.chequeregister = new ChequeRegister();
    this.chequeregister = row;
    if (this.chequeregister !== undefined) {
      this.chequeregister.Action = 'EDIT';
      this.ChqRegId = this.chequeregister.ChqRegId;
      let s: any = {
        'StokistId': row.StokistId,
        'StockistName': row.StockistName,
      }
      this.f.StockistName.setValue(s);
      let sn: any = {
        'StokistId': row.StokistId,
        'StockistNo': row.StockistNo
      }
      this.f.StockistNo.setValue(sn);
      this.f.Date.setValue(this.chequeregister.ChqReceivedDate);
      this.f.City.setValue(this.chequeregister.StockistCity);
      this.getBankList(this.chequeregister.StokistId);
      this.f.BankName.setValue(this.chequeregister.BankId);
      this.f.BankAccountNo.setValue(this.chequeregister.AccountNo);
      this.f.IFSCCode.setValue(this.chequeregister.IFSCCode);
      this.f.FromChequeNo.setValue(this.chequeregister.ChqNo);
      this.chef.detectChanges();
    } else {
      this.chef.detectChanges();
    }
  }

  // Delete function of cheque register
  DeleteCheque(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Sure!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.chequeregister = new ChequeRegister();
        this.chequeregister = row;
        if (this.chequeregister !== undefined) {
          this.chequeregister.Updatedby = String(this.UserId);
          this.chequeregister.Action = 'DELETE';
          this.chequeService.UpdateCheque_Service(this.chequeregister).subscribe(
            (data: any) => {
              if (data === AppCode.SuccessStatus) {
                this.toaster.success(AppCode.msg_deleteSuccess);
                this.GetChequeCounts();
                this.GetChequeList();
              } else {
                this.toaster.error(AppCode.msg_AllotFail);
              }
              this.chef.detectChanges();
            }, (error: any) => {
              console.error(error);
              this.chef.detectChanges();
            });
        }
        else {
          this.chef.detectChanges();
        }
      }
    });
  }
  // Open Model for cheque status update
  OpenModelChqSts(content: any, Flag: string, row: any) {
    this.ChqRegId = row.ChqRegId;
    this.ChqNo = row.ChqNo;
    this.StockistId = row.StokistId;
    this.flag = Flag;
    this.ChqStsModel = this.modalService.open(content, {
      centered: true,
      size: this.flag === 'MapInvoice' ? 'xl' : 'lg', // Changes
      backdrop: 'static'
    });
    if (Flag == 'Block') {
      this.ModalTitle = "Block Cheque"; // Block First Step
    }
    if (Flag == 'MapInvoice') {
      this.ModalTitle = "Block Cheque   - " + this.ChqNo;
      this.GetInvList(row.StokistId, this.CompanyId);   // Block When Invoice Map
    }
    if (Flag == 'Release') {
      this.ModalTitle = "Release Cheque";
    }
    if (Flag == 'Discard') {
      this.ModalTitle = "Discard Cheque";
    }
    if (Flag == 'Return') {
      this.ModalTitle = "Return Cheque";
      this.getReason();
    }
    if (Flag == 'Settle') {
      this.ModalTitle = "Settle Cheque";
    }
    if (Flag == 'FirstNotice') {
      this.ModalTitle = 'First Notice';
    }
    if (Flag == 'LegalNotice') {
      this.ModalTitle = 'Legal Notice';
    }
    this.GetChequeList();
  }

  // Invoice list for cheque block
  GetInvList(StockistId: number, CompId: number) {
    this.FromDate1 = AppCode.createDateAsUTC(this.FromDate.value);
    this.ToDate1 = AppCode.createDateAsUTC(this.ToDate.value);
    this.FromDate1 = formatDate(this.FromDate.value, 'yyyy-MM-dd', 'en-US');
    this.ToDate1 = formatDate(this.ToDate.value, 'yyyy-MM-dd', 'en-US');
    this.chequeService.getInvList_Service(StockistId, CompId, this.FromDate1, this.ToDate1).subscribe(
      (data: any) => {
        this.afterInvList(data);
      }, (error: any) => {
        console.error(error);
        this.chef.detectChanges();
      })
  }

  afterInvList(data: any) {
    this.Invoices = '';
    this.InvDataSource = new MatTableDataSource(); // new array
    this.InvDataSource.data = data;
    for (let i = 0; i < this.InvDataSource.data.length; i++) {
      this.Invoices = this.Invoices + this.InvDataSource.data[i].InvId + ',';
    }
    this.InvDataSource.sort = this.InvSortNew;
    this.InvDataSource.paginator = this.paginator1;
    this.chef.detectChanges();
  }

  onPageChange(event: PageEvent, paginator1: MatPaginator) {
    paginator1.pageIndex = event.pageIndex;
    paginator1.pageSize = event.pageSize;
    this.InvDataSource.paginator = paginator1;
    this.GetChequeList();
    this.chef.detectChanges();
  }

  FecthMapInvoiceData() {
    this.GetChequeList();
    this.GetInvList(this.StockistId, this.CompanyId);
    this.chef.detectChanges();
  }


  AddString(row: any) {
    let newpickers;
    if (this.Invoices.includes(row.InvId)) {
      newpickers = this.Invoices.replace(row.InvId + ',', '');
      this.Invoices = newpickers;
    }
    else {
      this.Invoices = this.Invoices + row.InvId + ',';
    }
  }

  //cheque status update
  UpdateChqSts() {
    if (this.flag === 'Block') {
      this.BlockStatusDate();  // First Step  of When Click on Block (Select Date)
    }
    if (this.flag === 'MapInvoice') {
      this.BolckStatusMapInvoice();   // Map Invoice when click on Block
    }
    if (this.flag === 'Release') {
      this.ReleaseStatus();
    }
    if (this.flag === 'Discard') {
      this.DiscardStatus();
    }
    if (this.flag === 'Return') {
      this.ReturnStatus();
    }
    if (this.flag === 'FirstNotice') {
      this.FirstNotice();
    }
    if (this.flag === 'LegalNotice') {
      this.LegalNotice();
    }
    if (this.flag === 'Settle') {
      this.SettleStatus();
    }
  }

  // Block Status First Step
  BlockStatusDate() {
    if (this.BlockDate !== null) {
      let model = {
        'ChqRegId': this.ChqRegId,
        'BranchId': this.BranchId,
        'CompId': this.CompanyId,
        'ChqN': this.ChqNo,
        'StockistId': this.StockistId,
        'ChqStatus': AppCode.ChqBlok,
        'BlockedDate': AppCode.createDateAsUTC(this.BlockDate),
        'Addedby': this.UserId
      }
      this.chequeService.UpdateChequeSts_Service(model).subscribe(
        (data: any) => {
          if (data === AppCode.SuccessStatus) {
            this.toaster.success(AppCode.msg_ChqBlockSts);
            this.modalService.dismissAll();
            this.GetChequeList();
            this.GetChequeCounts();
            this.BlockDate = new Date(); // Set New Date Old Date clear and set new date
          } else {
            this.toaster.error(AppCode.msg_AllotFail);
            this.BlockDate = new Date(); // Set New Date Old Date clear and set new date
          }
          this.chef.detectChanges();
        }, (error: any) => {
          console.error(error);
          this.chef.detectChanges();
        });
    }
    else {
      this.toaster.warning('Please Select Date!');
      this.chef.detectChanges();
    }
  }

  // Block status of cheque
  BolckStatusMapInvoice() {
    if (this.Invoices !== "") {
      let model = {
        'ChqRegId': this.ChqRegId,
        'BranchId': this.BranchId,
        'CompId': this.CompanyId,
        'ChqN': this.ChqNo,
        'StockistId': this.StockistId,
        // 'ChqStatus': AppCode.ChqBlok,
        'ChqStatus': AppCode.ChqMapInvoice, // Changes
        'InvData': this.Invoices,
        'Addedby': this.UserId
      }
      this.chequeService.UpdateChequeSts_Service(model).subscribe(
        (data: any) => {
          if (data === AppCode.SuccessStatus) {
            this.toaster.success(AppCode.msg_ChqBlockSts);
            this.modalService.dismissAll();
            this.GetChequeList();
            this.GetChequeCounts();
          } else {
            this.toaster.error(AppCode.msg_AllotFail);
          }
          this.chef.detectChanges();
        }, (error: any) => {
          console.error(error);
          this.chef.detectChanges();
        });
    }
    else {
      this.toaster.warning('Please Select Invoice!');
      this.chef.detectChanges();
    }
  }

  // Release Status of cheque
  ReleaseStatus() {
    if (this.Remark !== "") {
      let model = {
        'ChqRegId': this.ChqRegId,
        'BranchId': this.BranchId,
        'CompId': this.CompanyId,
        'ChqStatus': AppCode.ChqBlank,
        'Remark': this.Remark,
        'Addedby': this.UserId
      }
      this.chequeService.UpdateChequeSts_Service(model).subscribe(
        (data: any) => {
          if (data === AppCode.SuccessStatus) {
            this.toaster.success(AppCode.msg_ChqReleaseSts);
            this.Remark = "";
            this.modalService.dismissAll();
            this.GetChequeList();
            this.GetChequeCounts();
          } else {
            this.toaster.error(AppCode.msg_AllotFail);
          }
          this.chef.detectChanges();
        }, (error: any) => {
          console.error(error);
          this.chef.detectChanges();
        });
    }
    else {
      this.toaster.warning('Please give some Remark!');
    }
  }

  //Prepare status of cheque
  PrepareStatus(row: any) {
    this.ChqRegId = row.ChqRegId;
    let model = {
      'ChqRegId': this.ChqRegId,
      'BranchId': this.BranchId,
      'CompId': this.CompanyId,
      'ChqStatus': AppCode.ChqPrepare,
      'Addedby': this.UserId
    }
    this.chequeService.UpdateChequeSts_Service(model).subscribe(
      (data: any) => {
        if (data === AppCode.SuccessStatus) {
          this.toaster.success(AppCode.msg_ChqPrepareSts);
          this.modalService.dismissAll();
          this.GetChequeList();
          this.GetChequeCounts();
        } else {
          this.toaster.error(AppCode.msg_AllotFail);
        }
        this.chef.detectChanges();
      }, (error: any) => {
        console.error(error);
        this.chef.detectChanges();
      });
  }

  // Discard Status of cheque
  DiscardStatus() {
    if (this.Remark !== "") {
      let model = {
        'ChqRegId': this.ChqRegId,
        'BranchId': this.BranchId,
        'CompId': this.CompanyId,
        'ChqStatus': AppCode.chqDiscard,
        'Remark': this.Remark,
        'Addedby': this.UserId
      }
      this.chequeService.UpdateChequeSts_Service(model).subscribe(
        (data: any) => {
          if (data === AppCode.SuccessStatus) {
            this.toaster.success(AppCode.msg_ChqDiscardSts);
            this.Remark = "";
            this.modalService.dismissAll();
            this.GetChequeList();
            this.GetChequeCounts();
            this.chef.detectChanges();
          } else {
            this.toaster.error(AppCode.msg_AllotFail);
          }
          this.chef.detectChanges();
        }, (error: any) => {
          console.error(error);
          this.chef.detectChanges();
        });
    }
    else {
      this.toaster.warning('Please give some Remark!');
      this.chef.detectChanges();
    }
  }

  // Get Reason list for chq retuen
  getReason() {
    this._service.GetGeneralMasterList_Service(AppCode.ChqRetReason, AppCode.allString)
      .subscribe((data: any) => {
        this.ReasonList = data.GeneralMasterParameter;
        this.chef.detectChanges();
      }, (error) => {
        console.error(error);
        this.chef.detectChanges();
      });
  }

  // Return Status of cheque
  ReturnStatus() {
    if (this.RetReason !== 0) {
      // if (this.Remark !== "") {
      let model = {
        'ChqRegId': this.ChqRegId,
        'BranchId': this.BranchId,
        'CompId': this.CompanyId,
        'ChqStatus': AppCode.ChqReturn,
        'ReturnReasonId': this.RetReason,
        'Remark': this.Remark,
        'Addedby': this.UserId,
        'ReturnDate': AppCode.createDateAsUTC1(this.currentDate)

      }
      this.chequeService.UpdateChequeSts_Service(model).subscribe(
        (data: any) => {
          if (data === AppCode.SuccessStatus) {
            this.toaster.success(AppCode.msg_ChqReturnSts);
            this.RetReason = 0;
            this.Remark = "";
            this.currentDate;
            this.modalService.dismissAll();
            this.GetChequeList();
            this.GetChequeCounts();
            this.currentDate = new Date(); // Set Current Date
          } else {
            this.toaster.error(AppCode.msg_AllotFail);
            this.currentDate = new Date(); // Set Current Date
          }
          this.chef.detectChanges();
        }, (error: any) => {
          console.error(error);
          this.chef.detectChanges();
        });
    }
    // else {
    //   this.toaster.warning('Please give some Remark!');
    //   this.chef.detectChanges();
    // }
    // }
    else {
      this.toaster.warning('Please Select Reason!');
      this.chef.detectChanges();
    }
  }

  //First Notice
  FirstNotice() {
    if (this.Remark !== "") {
      let model = {
        'ChqRegId': this.ChqRegId,
        'BranchId': this.BranchId,
        'CompId': this.CompanyId,
        'ChqStatus': AppCode.ChqFirstNotice,
        'Remark': this.Remark,
        'Addedby': this.UserId
      }
      this.chequeService.UpdateChequeSts_Service(model).subscribe(
        (data: any) => {
          if (data === AppCode.SuccessStatus) {
            this.toaster.success(AppCode.msg_FirstNoticeSts);
            this.Remark = "";
            this.modalService.dismissAll();
            this.GetChequeList();
            this.GetChequeCounts();
          } else {
            this.toaster.error(AppCode.msg_AllotFail);
          }
          this.chef.detectChanges();
        }, (error: any) => {
          console.error(error);
          this.chef.detectChanges();
        });
    }
    else {
      this.toaster.warning('Please give some Remark!');
      this.chef.detectChanges();
    }
  }

  //Legal Notice
  LegalNotice() {
    if (this.Remark !== "") {
      let model = {
        'ChqRegId': this.ChqRegId,
        'BranchId': this.BranchId,
        'CompId': this.CompanyId,
        'ChqStatus': AppCode.ChqLegalNotice,
        'Remark': this.Remark,
        'Addedby': this.UserId
      }
      this.chequeService.UpdateChequeSts_Service(model).subscribe(
        (data: any) => {
          if (data === AppCode.SuccessStatus) {
            this.toaster.success(AppCode.msg_LegalNoticeSts);
            this.Remark = "";
            this.modalService.dismissAll();
            this.GetChequeList();
            this.GetChequeCounts();
          } else {
            this.toaster.error(AppCode.msg_AllotFail);
          }
          this.chef.detectChanges();
        }, (error: any) => {
          console.error(error);
          this.chef.detectChanges();
        });
    }
    else {
      this.toaster.warning('Please give some Remark!');
      this.chef.detectChanges();
    }
  }

  // Settle Status of cheque
  SettleStatus() {
    if (this.Remark !== "") {
      let model = {
        'ChqRegId': this.ChqRegId,
        'BranchId': this.BranchId,
        'CompId': this.CompanyId,
        'ChqStatus': AppCode.ChqSettle,
        'Remark': this.Remark,
        'Addedby': this.UserId
      }
      this.chequeService.UpdateChequeSts_Service(model).subscribe(
        (data: any) => {
          if (data === AppCode.SuccessStatus) {
            this.toaster.success(AppCode.msg_ChqSettleSts);
            this.Remark = "";
            this.modalService.dismissAll();
            this.GetChequeList();
            this.GetChequeCounts();
          } else {
            this.toaster.error(AppCode.msg_AllotFail);
          }
          this.chef.detectChanges();
        }, (error: any) => {
          console.error(error);
          this.chef.detectChanges();
        });
    }
    else {
      this.toaster.warning('Please give some Remark!');
      this.chef.detectChanges();
    }
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    // this.searchModel = this.searchModel.trim(); // Remove whitespace
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  clear() {
    this.Remark = "";
    this.BlockDate = new Date();
    this.currentDate = new Date();
    this.clearMapInvoice();
    this.chef.detectChanges();
  }

  clearMapInvoice() {
    this.FromDate = new FormControl(new Date());
    this.ToDate = new FormControl(new Date());
    this.InvDataSource.data = [];
    this.DataSource.paginator = this.paginator;
    this.chef.detectChanges();
  }

}
