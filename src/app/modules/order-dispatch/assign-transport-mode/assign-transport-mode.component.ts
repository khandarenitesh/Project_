import { AfterViewChecked, ChangeDetectorRef, Component, OnChanges, OnInit, QueryList, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
// Sorting and Paginator
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// Material table
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
// Toaster
import { ToastrService } from 'ngx-toastr';
import { AppCode } from '../../../app.code';
// Services
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { OrderDispatchService } from '../Services/order-dispatch.service';
// Models
import { AssignTransportModel } from '../Models/assign-transport-model';
import { InvoiceModel } from '../Models/invoice-model';

@Component({
  selector: 'app-assign-transport-mode',
  templateUrl: './assign-transport-mode.component.html',
  styleUrls: ['./assign-transport-mode.component.scss']
})
export class AssignTransportModeComponent implements OnInit {

  DisplayInvoiceData = ['Select', 'InvNo', 'InvCreatedDate', 'IsColdStorage', 'StockistNo', 'StockistName', 'CityName', 'InvAmount'];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  assigntransportmodeForm: FormGroup;
  isLoading: boolean = false;
  TransportModel: AssignTransportModel;
  submitted = false;
  UserId: number = 0;
  pageState: string = '';
  BranchId: number = 0;
  CompId: number = 0;
  BranchCity: string = '';
  invoicemodel: InvoiceModel;
  TransportModeList: any[] = [];
  AssignTransportList: any[] = [];
  AssignCartingAgentList: any[] = [];
  AssignTransportLst: any[] = [];
  AssignCourierList: any[] = [];
  selectedrows: matrowselected[] = [];
  DataModel: any;
  Title: string = "";
  searchModel: string = '';
  InvoiceId: string = '';
  isFlag: string = '';
  InvoiceIdStr: string = '';
  selectedInvId: number = 0;
  CityName: string = '';
  check: boolean = false;
  isCourier: boolean = true;

  defaultform: any = {
    TransportModeId: '',
    PersonName: '',
    PersonAddress: '',
    PersonMobileNo: '',
    OtherDetails: '',
    AssignTransport: '',
    AssignedTransport: '',
    DeliveryRemark: '',
    AssignCartingAgent: '',
    AssignCourier: '',
  };

  constructor(
    private chRef: ChangeDetectorRef, private _ToastrService: ToastrService,
    private _orderDispatchService: OrderDispatchService, private fb: FormBuilder,
    private _MastersServiceService: MastersServiceService,private commonCode:AppCode) {
  }

  // ngAfterViewChecked(){
  //   this.chRef.detectChanges();
  // }
  ngOnInit(): void {
    this.pageState = AppCode.saveString;
    this.Title = "List View";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.BranchCity = obj.BranchCity;
    this.initForm();
    this.f.TransportModeId.setValue(1);

    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompId,
    };
    this.GetInvoiceList(this.DataModel);
    this.GetAssignTransportList();
    this.GetCourierList(this.BranchId);
    this.GetCartingAgent(this.BranchId);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.assigntransportmodeForm.controls;
  }

  initForm() {
    this.assigntransportmodeForm = this.fb.group({
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
      AssignCartingAgent: [
        this.defaultform.AssignCartingAgent,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      AssignCourier: [
        this.defaultform.AssignCourier,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
    });
  }

  // Get Invoice List
  GetInvoiceList(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getInvoiceList_Service(DataModel).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != [] && data != "" && data != undefined) {
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
      (error: any) => {
        console.log(error);
      }
    });
  }

  // Get Transport List
  GetAssignTransportList() {
    this._MastersServiceService.getGetTransporterList_Service(AppCode.allString, AppCode.allString,this.BranchId)
      .subscribe((data: any) => {
        this.AssignTransportList = data;
        this.AssignTransportLst = data;
        this.chRef.detectChanges();
      },
        (error: any) => {
          console.error("Error:" + JSON.stringify(error));
        });
  }

  // Get Courier List
  GetCourierList(BranchId: number) {
    this._MastersServiceService.getGetCourierList_Service(BranchId, AppCode.allString, AppCode.allString)
      .subscribe((data: any) => {
        this.AssignCourierList = data;
        this.chRef.detectChanges();
      },
        (error: any) => {
          console.error("Error:" + JSON.stringify(error));
        });
  }

 // Get Carting Agent List
  GetCartingAgent(BranchId: number) {
    this._MastersServiceService.getCartingAgenList_Service(AppCode.allString, BranchId)
      .subscribe((data: any) => {
        this.AssignCartingAgentList = data;
        this.chRef.detectChanges();
      },
        (error: any) => {
          console.error("Error:" + JSON.stringify(error));
        });
  }


  getCheckboxesData(row: any, i: string) {
    if (row.checked === true) {
      if (row.CityName !== this.BranchCity && (this.selectedrows.length === 0 || this.selectedrows.find(x => x.city === row.CityName))) {
        var item = new matrowselected();
        item.id = row.InvId;
        item.city = row.CityName;
        this.selectedrows.push(item);
        this.isFlag = AppCode.othercitystring;
        this.isCourier = row.IsCourier;
        this.f.AssignCartingAgent.enable();
        this.f.AssignedTransport.enable();
        this.f.AssignCourier.enable();
        this.f.TransportModeId.setValue(2);
        this.f.OtherDetails.enable();
        this.f.AssignCartingAgent.setValue('0');
        if (this.isCourier == true) {
          this.f.AssignCourier.setValue(this.AssignCourierList[0].CourierId);
          this.f.AssignedTransport.disable();
          this.f.AssignedTransport.setValue('');
        }
        else {
          this.f.AssignedTransport.setValue(this.AssignTransportLst[0].TransporterId);
          this.f.AssignCourier.disable();
        }
        this.f.PersonName.disable();
        this.f.PersonAddress.disable();
        this.f.PersonMobileNo.disable();
        this.f.AssignTransport.disable();
        this.f.DeliveryRemark.disable();
      }
      else if ((this.selectedrows.length === 0 || this.selectedrows.find(x => x.city === this.BranchCity)) && row.CityName === this.BranchCity) {
        var item = new matrowselected();
        item.id = row.InvId;
        item.city = row.CityName;
        this.selectedrows.push(item);
        this.isFlag = AppCode.localstring;
        this.f.TransportModeId.enable();
        this.f.AssignTransport.enable();
        this.f.TransportModeId.setValue(1);
        this.f.AssignTransport.setValue(this.AssignTransportList[0].TransporterId);
        this.f.DeliveryRemark.enable();
        this.f.PersonName.disable();
        this.f.PersonAddress.disable();
        this.f.PersonMobileNo.disable();
        this.f.OtherDetails.disable();
        this.f.AssignedTransport.disable();
        this.f.AssignCartingAgent.disable();
        this.f.AssignCourier.disable();
      }
      else {
        if ((<HTMLInputElement>document.getElementById('check' + i)).checked == true) {
          (<HTMLInputElement>document.getElementById('check' + i)).checked = false;
        }
        this.selection.deselect(row);
        this._ToastrService.warning("Please select same city!");
      }
    }
    else {
      var indexValue = this.selectedrows.findIndex(t => t.id === row.InvId); // delete
      this.selectedrows.splice(indexValue, 1);
    }
  }
  // Save assigned transport
  SaveAssignTransport() {
    this.InvoiceIdStr = '';
    let arr = [];
    if (!this.assigntransportmodeForm.valid) {
      return;
    } else {
      this.submitted = true;
      // arr.push(this.selection.selected);
      arr.push(this.selectedrows);
      arr.forEach((element: any) => {
        for (var i = 0; i < element.length; i++) {
          this.InvoiceIdStr += element[i].id + ",";
        }
      });
      if (this.InvoiceIdStr !== "") {
        this.TransportModel = new AssignTransportModel();
        this.TransportModel.TransportModeId = this.f.TransportModeId.value;
        if (this.isFlag == AppCode.byhandstring) {
          this.TransportModel.PersonName = this.f.PersonName.value;
          this.f.AssignedTransport.setValue('');
          this.f.AssignedTransport.setValue('');
        }
        this.TransportModel.PersonAddress = this.f.PersonAddress.value;
        this.TransportModel.PersonMobileNo = this.f.PersonMobileNo.value;
        this.TransportModel.OtherDetails = this.f.OtherDetails.value;
        if (this.isFlag == AppCode.localstring) {
          this.TransportModel.TransporterId = this.f.AssignTransport.value;
          this.f.AssignCartingAgent.setValue('0');
          this.f.AssignCourier.setValue('0');
        } else {
          this.TransportModel.TransporterId = this.f.AssignedTransport.value;
        }
        this.TransportModel.Delivery_Remark = this.f.DeliveryRemark.value;
        if (this.isFlag == AppCode.othercitystring) {
         // this.TransportModel.CAId = this.f.AssignCartingAgent.value;
          this.f.AssignCartingAgent.setValue('0');
          this.TransportModel.CourierId = this.f.AssignCourier.value;
        } else {
          this.f.AssignCartingAgent.setValue('0');
        }
        this.TransportModel.isActive = AppCode.IsActiveString;
        this.TransportModel.Addedby = String(this.UserId);
        this.TransportModel.AttachedInvId = 0;
        if (this.pageState == AppCode.saveString) {
          this.TransportModel.InvoiceId = this.InvoiceIdStr;
          this.TransportModel.Action = AppCode.addString;
        }
        else {
          this.TransportModel.InvoiceId = this.InvoiceId;
          this.TransportModel.Action = AppCode.editString;
        }
        this._orderDispatchService.SaveAssignedTransportMode_Service(this.TransportModel)
          .subscribe((data: any) => {
            if (data === AppCode.SuccessStatus) {
              if (this.pageState == AppCode.saveString) {
                this._ToastrService.success(AppCode.msg_saveSuccess);
              } else {
                this._ToastrService.success(AppCode.msg_updateSuccess);
              }
              this.ClearForm();
              this.GetInvoiceList(this.DataModel);
            } else if (data === AppCode.ExistsStatus) {
              this._ToastrService.warning(AppCode.msg_exist);
              this.ClearForm();
              this.GetInvoiceList(this.DataModel);
            } else {
              this._ToastrService.error(data);
              this.ClearForm();
              this.GetInvoiceList(this.DataModel);
            }
          },
            (error: any) => {
              console.error("Error:" + JSON.stringify(error));
            });
      } else {
        this.ClearForm();
        this._ToastrService.warning("Please select invoice");
      }
    }
  }

  // Clear Form
  ClearForm() {
    this.f.TransportModeId.setValue(1);
    this.f.PersonName.setValue('');
    this.f.PersonAddress.setValue('');
    this.f.PersonMobileNo.setValue('');
    this.f.OtherDetails.setValue('');
    this.f.AssignTransport.setValue('');
    this.f.AssignedTransport.setValue('');
    this.f.DeliveryRemark.setValue('');
    this.f.AssignCartingAgent.setValue('');
    this.f.AssignCourier.setValue('');
    this.isLoading = false;
    this.selection.clear();
    this.selectedrows = [];
    this.GetInvoiceList(this.DataModel);
    this.chRef.detectChanges();
  }

  // Selection Change events Transport Mode
  onTransportMode(event: any) {
    this.isLoading = true;
    if (event.value === 1) {
      this.isFlag = AppCode.localstring;
      this.f.AssignTransport.enable();
      this.f.AssignTransport.setValue(this.AssignTransportLst[0].TransporterId)
      this.f.DeliveryRemark.enable();
      this.f.PersonName.disable();
      this.f.PersonAddress.disable();
      this.f.PersonMobileNo.disable();
      this.f.OtherDetails.disable();
      this.f.AssignedTransport.disable();
      this.f.AssignCartingAgent.disable();
      this.f.AssignCourier.disable();
    } else if (event.value === 2) {
      this.isFlag = AppCode.othercitystring;
      this.f.AssignCartingAgent.enable();
      this.f.OtherDetails.enable();
      this.f.AssignedTransport.enable();
      this.f.AssignCourier.enable();
      this.f.AssignCartingAgent.setValue(this.AssignCartingAgentList[0].CAId)
      if (this.isCourier == true) {
        this.f.AssignCourier.setValue(this.AssignCourierList[0].CourierId);
        this.f.AssignedTransport.disable();
      }
      else {
        this.f.AssignedTransport.setValue(this.AssignTransportLst[0].TransporterId);
        this.f.AssignCourier.disable();
      }
      this.f.AssignTransport.disable();
      this.f.DeliveryRemark.disable();
      this.f.PersonName.disable();
      this.f.PersonAddress.disable();
      this.f.PersonMobileNo.disable();
    } else {
      this.isFlag = AppCode.byhandstring;
      this.f.PersonName.enable();
      this.f.PersonAddress.enable();
      this.f.PersonMobileNo.enable();
      this.f.OtherDetails.enable();
      this.f.AssignCartingAgent.disable();
      this.f.AssignCourier.disable();
      this.f.AssignTransport.disable();
      this.f.DeliveryRemark.disable();
      this.f.AssignedTransport.disable();
    }
    this.isLoading = false;
    this.chRef.detectChanges();
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

  // Save & Print
  onSavePrint() {
    if (this.selection.selected.length > 0) {
      this.SaveAssignTransport();
      let chkBoxSelectedValue = this.selection.selected;
      for (var i = 0; i < chkBoxSelectedValue.length; i++) {
        this.DataModel = {
          BranchId: this.BranchId,
          CompId: this.CompId,
          InvId: chkBoxSelectedValue[i].InvId,
          Type: AppCode.printStickerTitle,
          AddedBy: String(this.UserId)
        }
        this.isLoading = true;
        this._orderDispatchService.printSticker_Service(this.DataModel)
          .subscribe((data: any) => {
            if (data === AppCode.SuccessStatus) {
              this._ToastrService.success(AppCode.msg_printSticker);
            } else {
              this._ToastrService.error(AppCode.FailStatus);
            }
            this.isLoading = false;
            this.chRef.detectChanges();
            (error: any) => {
              console.error("Error:" + JSON.stringify(error));
            }
          });
      }
    } else {
      this._ToastrService.warning("Please select invoice");
      this.chRef.detectChanges();
    }

  }
  ValidationMobile(event:any){
    this.commonCode.numberOnly(event)
}
}

export class matrowselected {
  id: number;
  city: string;
}
