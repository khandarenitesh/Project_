import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Angular Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Models
import { SendToModel, AddStockTransferModel } from '../Models/add-stock-transfer.model';

// Services
import { StockTransferService } from '../Services/stock-transfer.service';
import { ToastrService } from 'ngx-toastr';
import { AppCode } from '../../../app.code';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-stock-transfer',
  templateUrl: './add-stock-transfer.component.html',
  styleUrls: ['./add-stock-transfer.component.scss']
})
export class AddStockTransferComponent implements OnInit {
  importStockTransferDetails = ['SrNo', 'InvNo', 'InvCreatedDate', 'CNFName', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  public DataSource = new MatTableDataSource<any>();
  Title: string = 'Add Stock Transfer';
  isLoading: boolean = false;
  BranchId: number = 0;
  CompId: number = 0;
  ListTitle: string = "";
  searchModel: string = '';
  defaultform: any = {
    stockTransferInvNo: '',
    InvDate: '',
    SendTo: ''
  };
  pageState: string = "";
  btnCancelText: string = "";
  stockTransferForm: FormGroup;
  InvalidSendTo: boolean = false;
  submitted: boolean = false;
  SendToList: any[] = [];
  UserId: number = 0;
  // Autocomplete Code
  SendToArray: Observable<SendToModel[]>;
  maxDate = new Date();
  currentDate = new Date();
  addStockTransferModel: AddStockTransferModel;
  InvId: number = 0;

  constructor(private chRef: ChangeDetectorRef, private stockTransferService: StockTransferService, private toastr: ToastrService, private fb: FormBuilder, private commoncode: AppCode) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.ListTitle = "Stock Transfer List";
    this.pageState = AppCode.saveString;
    this.btnCancelText = AppCode.cancelString;
    this.initForm();
    var result = AppCode.getUser();
    this.BranchId = result.BranchId;
    this.CompId = result.CompanyId;
    this.f.InvDate.setValue(this.currentDate);
    this.GetSendToList(this.BranchId, this.CompId);
    this.GetStockTransferList(this.BranchId, this.CompId);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.stockTransferForm.controls;
  }

  initForm() {
    this.stockTransferForm = this.fb.group({
      stockTransferInvNo: [
        this.defaultform.stockTransferInvNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(15),
        ]),
      ],
      InvDate: [
        this.defaultform.InvDate,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
      SendTo: [
        this.defaultform.SendTo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ]
    });
  }

  // Get Send To Data List
  GetSendToList(BranchId: number, CompId: number) {
    this.isLoading = true;
    this.stockTransferService.GetSendToList(BranchId, CompId, AppCode.IsActiveString)
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.SendToList = data;
          this.SendToList = this.SendToList.sort((a: any, b: any) => a.CNFName.localeCompare(b.CNFName));
          this.SendToArray = this.f.SendTo.valueChanges
            .pipe(startWith<string | SendToModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.CNFName : null),
              map(CNFName => CNFName ? this.filterSendTo(CNFName) : this.SendToList.slice()));
        } else {
          this.SendToList = [];
        }
        this.isLoading = false;
        this.chRef.detectChanges();
      }, (error: any) => {
        console.log(error);
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  // Autocomplete Search Filter
  private filterSendTo(name: string): SendToModel[] {
    this.InvalidSendTo = false;
    const filterValue = name.toLowerCase();
    return this.SendToList.filter((option: any) => option.CNFName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnSendTo(name: SendToModel): string {
    return name && name.CNFName ? name.CNFName + "(" + name.CNFCode + ")" : '';
  }

  // on Stock Transfer InvNo
  onStockTransferInvNo() {
    if (this.f.stockTransferInvNo.value !== "" && this.f.stockTransferInvNo.value !== undefined && this.f.stockTransferInvNo.value !== null) {
      this.isLoading = true;
      this.stockTransferService.CheckStockTransferInvNo_Service(this.BranchId, this.CompId, this.f.stockTransferInvNo.value)
        .subscribe((data: any) => {
          if (data !== null) {
            if (data.Flag === -1) {
              Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'This Stock Transfer Invoice Number already exists with ' + data.InvNo,
              });
            }
          }
          this.isLoading = false;
          this.chRef.detectChanges();
        }, (error: any) => {
          console.error(error);
          this.isLoading = false;
          this.chRef.detectChanges();
        });
    } else {
      this.isLoading = false;
      this.chRef.detectChanges();
    }
  }

  // Get Stock Transfer List
  GetStockTransferList(BranchId: number, CompId: number) {
    this.isLoading = true;
    this.stockTransferService.GetStockTransferList(BranchId, CompId)
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.DataSource.data = data;
          this.DataSource.paginator = this.paginator;
          this.DataSource.sort = this.Sort;
        } else {
          this.DataSource.data = [];
        }
        this.isLoading = false;
        this.chRef.detectChanges();
      }, (error: any) => {
        console.error(error);
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  // Send To
  SendToValidation() {
    this.submitted = false;
    if ((this.f.SendTo.value === '' || this.f.SendTo.value === undefined || this.f.SendTo.value === null)) {
      this.InvalidSendTo = true;
      this.isLoading = false;
      return;
    }
    else {
      this.InvalidSendTo = false;
    }
  }

  // Save Stock Transfer
  SaveStockTransfer() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.stockTransferForm.valid) {
      this.isLoading = false;
      this.InvalidSendTo = false;
      return;
    } else {
      if (this.InvalidSendTo === false) {
        this.addStockTransferModel = new AddStockTransferModel();
        this.addStockTransferModel.BranchId = this.BranchId;
        this.addStockTransferModel.CompId = this.CompId;
        this.addStockTransferModel.StkTransInvNo = this.f.stockTransferInvNo.value;
        // this.addStockTransferModel.InvDate = AppCode.createDateAsUTC(this.f.InvDate.value);
        this.addStockTransferModel.InvDate = AppCode.createDateAsUTC(new Date(this.f.InvDate.value));
        this.addStockTransferModel.SendToCNFId = this.f.SendTo.value.CNFId;
        this.addStockTransferModel.IsStockTransfer = 1;
        this.addStockTransferModel.Addedby = String(this.UserId);
        // this.addStockTransferModel.Action = AppCode.addString;
        if (this.pageState == AppCode.saveString) {
          this.addStockTransferModel.InvId = 0;
          this.addStockTransferModel.Action = AppCode.addString;
        }
        else {
          this.addStockTransferModel.InvId = this.InvId;
          this.addStockTransferModel.Action = AppCode.editString;
        }
        if (this.f.SendTo.value.CNFId !== undefined) {
          this.stockTransferService.AddStockTransfer(this.addStockTransferModel)
            .subscribe((res: any) => {
              if (res === 1) {
                this.toastr.success(AppCode.msg_AddStockTransfer);
                this.onCancel();
                this.GetStockTransferList(this.BranchId, this.CompId);
              } else {
                this.toastr.warning(AppCode.msg_exist);
                this.isLoading = false;
                this.chRef.detectChanges();
              }
            }, (error: any) => {
              console.error(error);
              this.isLoading = false;
              this.chRef.detectChanges();
            });
        } else {
          this.toastr.error(AppCode.FailStatus);
          this.isLoading = false;
          this.InvalidSendTo = true;
          this.chRef.detectChanges();
        }
      } else {
        this.toastr.error(AppCode.FailStatus);
        this.isLoading = false;
        this.chRef.detectChanges();
      }
    }
  }

  // Navigate or direct
  onCancel() {
    this.pageState = AppCode.saveString;
    this.Title = this.Title = "Add Stock Transfer";
    this.f.stockTransferInvNo.enable();
    this.stockTransferForm.reset();
    this.f.InvDate.setValue(this.currentDate);
    this.isLoading = false;
    this.submitted = false;
    this.chRef.detectChanges();
  }

  numberValidation(event: any) {
    this.commoncode.PanCradSplChNotAllow(event);
  }

  EditData(row: AddStockTransferModel) {
    this.isLoading = true;
    this.pageState = AppCode.updateString;
    this.Title = this.Title = "Update Stock Transfer";
    this.InvId = row.InvId;
    this.f.stockTransferInvNo.setValue(row.InvNo);
    this.f.stockTransferInvNo.disable();
    this.f.InvDate.setValue(row.InvCreatedDate);
    let obj: any = {
      'CNFId': row.SendToCNFId,
      'CNFCode': row.CNFCode,
      'CNFName': row.CNFName
    }
    this.f.SendTo.setValue(obj);
    this.isLoading = false;
  }

  DeleteRecord(row: AddStockTransferModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Sure!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.addStockTransferModel = new AddStockTransferModel();
        this.addStockTransferModel.Action = AppCode.deleteString;
        this.addStockTransferModel.Addedby = String(this.UserId);
        this.addStockTransferModel.InvId = row.InvId;
        this.stockTransferService.AddStockTransfer(this.addStockTransferModel)
          .subscribe((data: any) => {
            if (data === 1) {
              this.toastr.success(AppCode.msg_deleteSuccess);
              this.GetStockTransferList(this.BranchId, this.CompId);
              this.chRef.detectChanges();
              this.isLoading = false;
            }
            this.isLoading = false;
          }, (error) => {
            console.error(error);
            this.isLoading = false;
          });
      }
    });
  }
}