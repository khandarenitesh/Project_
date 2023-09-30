import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// Model
import { InvoiceModel } from './../Models/invoice-model';

// Services
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import { OrderDispatchService } from '../Services/order-dispatch.service';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { InvCntsModel } from '../Models/InvCntsModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ready-to-dispatch',
  templateUrl: './ready-to-dispatch.component.html',
  styleUrls: ['./ready-to-dispatch.component.scss']
})
export class ReadyToDispatchComponent implements OnInit {
  displayedColumnsForApi = ['InvNo', 'InvCreatedDate',
  'StockistNo', 'StockistName', 'CityName', 'InvAmount', 'StatusText', 'Actions'];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompId: number = 0;
  invoicemodel: InvoiceModel;
  currentDate: Date;
  DataModel: any;
  Title: string = '';
  raiseConernList: any = [];
  RaiseConcern: string = '';
  description: string = '';
  modalReference: NgbModalRef;
  InvId: number = 0;
  InvCnts : InvCntsModel;
  TotalInv : number = 0;
  PendingForAcceptInv: number = 0;
  AcceptedInv: number = 0;
  PackedInv: number = 0;
  Concern: number = 0;
  ReadyToDispatchInv: number = 0;
  Dispatched: number = 0;
  GetpassGenerated: number = 0;
  CanceledInv: number = 0;
  searchModel:any;
  InvoiceList: any;
  InvoiceListData: any[] = [];

  constructor(
    private _orderDispatchService: OrderDispatchService,
    private chRef: ChangeDetectorRef,
    private toaster:ToastrService,
    private _MastersServiceService: MastersServiceService,
    private modalService: NgbModal
  ) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.Title = "Ready To Dispatch List";
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompId,
      FromDate: null,
      ToDate: null,
      BillDrawerId: 0
    };
    this.GetInvoiceList(this.DataModel);
    this.GetInvCnts();
  }

  GetInvCnts() {
    let DataModel = {
      'BranchId': this.BranchId,
      'CompId': this.CompId,
      'InvDate': new Date()
    }
    this.isLoading = true;
    this._orderDispatchService.getInvCnts_Service(DataModel).subscribe((data: any) => {
      console.log("data:  " + JSON.stringify(data));
      this.afterCnts(data);
      this.isLoading = false;
      this.chRef.detectChanges();
      (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
      }
    });
    console.log("GetInvCnts END:  " + JSON.stringify(this.DataModel));
  }

  afterCnts(data: InvCntsModel){
    this.InvCnts = new InvCntsModel();
    this.InvCnts = data;
    this.TotalInv = this.InvCnts.TotalInv;
    this.PendingForAcceptInv = this.InvCnts.PendingForAcceptInv;
    this.AcceptedInv = this.InvCnts.AcceptedInv;
    this.PackedInv = this.InvCnts.Packed;
    this.Concern = this.InvCnts.Concern;
    this.ReadyToDispatchInv = this.InvCnts.ReadyToDispatch;
    this.GetpassGenerated = this.InvCnts.GetpassGenerated;
    this.Dispatched = this.InvCnts.Dispatched;
    this.CanceledInv = this.InvCnts.CancelInv;
  }

  GetInvoiceList(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getInvoice_Service(DataModel).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != [] && data != "" && data != undefined) {
        this.DataSource.data = data;
        this.InvoiceListData = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
      } else {
        this.DataSource.data = [];
      }
      this.isLoading = false;
      this.chRef.detectChanges();
      (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
      }
    });
  }

  // Raise Concern
  GetRaiseConcern() {
    this._MastersServiceService.GetGeneralMasterList_Service(AppCode.raiseConcernString, AppCode.allString)
        .subscribe((data: any) => {
          this.raiseConernList = data.GeneralMasterParameter;
          this.chRef.detectChanges();
        }, (error: any)=> {
          console.error("Error:  " + JSON.stringify(error));
        });
  }

  // Ready To Dispatch
  onClickReadyToDispatch(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to do Ready To Dispatch?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!'
    }).then((result) =>{
      if (result.isConfirmed) {
        this.isLoading = true;
        let invoiceHeaderStatusUpdateBody = {
          InvId: row.InvId,
          BranchId: this.BranchId,
          CompId: this.CompId,
          InvStatus: AppCode.readyToDispatchStatusForINV,	// 5	Ready To Dispatch
          NoOfBox: 0,
          InvWeight: 0,
          IsColdStorage: false,
          IsCourier: 0,
          ConcernId: 0,
          Remark: '',
          Addedby: String(this.UserId),
          UpdateDate: this.currentDate
        }
        this._orderDispatchService.InvoiceHeaderStatusUpdate_Service(invoiceHeaderStatusUpdateBody)
            .subscribe((data: any) => {
              if (data === AppCode.SuccessStatus) {
                this.toaster.success(AppCode.msg_updateSuccess);
                this.GetInvCnts();
              }
              this.GetInvoiceList(this.DataModel);
            }, (error: any)=> {
              console.error("Error:  " + JSON.stringify(error));
            });
      }
    });
  }
  // Raise Concern
  onClickRaiseConernModel(content: any, row: any) {
    this.onClickCancel();
    this.InvId = row.InvId;
    this.modalReference = this.modalService.open(content, {
      centered: true,
      size: 'sm',
      backdrop: 'static'
    });
    this.GetRaiseConcern();
  }

  // Assign Raise Concern Value
  onClickRaiseConern() {
    if (this.RaiseConcern !== "" && this.RaiseConcern !== undefined && this.RaiseConcern !== null) {
      let raiseConcernBody = {
        InvId: this.InvId,
        BranchId: this.BranchId,
        CompId: this.CompId,
        InvStatus: AppCode.dispatchConcernStatusForINV,	// 6	Dispatch Concern
        NoOfBox: 0,
        InvWeight: 0,
        IsColdStorage: false,
        IsCourier: 0,
        ConcernId: this.RaiseConcern,
        Remark: this.description,
        Addedby: String(this.UserId),
        UpdateDate: this.currentDate
      }
      this._orderDispatchService.InvoiceHeaderStatusUpdate_Service(raiseConcernBody)
          .subscribe((data: any) => {
            if (data === AppCode.SuccessStatus) {
              this.toaster.success(AppCode.msg_updateSuccess);
              this.modalReference.close();
            }
            this.GetInvoiceList(this.DataModel);
            this.GetInvCnts();
          }, (error: any)=> {
            console.error("Error:  " + JSON.stringify(error));
          });
    } else {
      this.toaster.warning("Please select raise concern");
      this.chRef.detectChanges();
    }
  }

  // Cancel
  onClickCancel() {
    this.RaiseConcern = '';
    this.description = '';
    this.chRef.detectChanges();
  }

  ShowInvList(Flag?: any) {
    this.InvoiceList = [];
    if (this.InvoiceListData != null && this.InvoiceListData !== undefined) {

      if (Flag === 'All') {
        this.InvoiceList = this.InvoiceListData;
      }
      else if (Flag === 'PendingForAcceptInv') {
        this.InvoiceList = this.InvoiceListData.filter(x => x.InvStatus === 0);

      } else if (Flag === 'AcceptedInv') {
        this.InvoiceList = this.InvoiceListData.filter(x => x.InvStatus === 1);

      } else if (Flag === 'PackedInv') {
        this.InvoiceList = this.InvoiceListData.filter(x => x.InvStatus === 3);

      } else if (Flag === 'Concern') {
        this.InvoiceList = this.InvoiceListData.filter(x => x.InvStatus === 4 || x.InvStatus === 6);

      } else if (Flag === 'ReadyToDispatchInv') {
        this.InvoiceList = this.InvoiceListData.filter(x => x.InvStatus === 5);

      } else if (Flag === 'GetpassGenerated') {
        this.InvoiceList = this.InvoiceListData.filter(x => x.InvStatus === 7);

      } else if (Flag === 'CanceledInv') {
        this.InvoiceList = this.InvoiceListData.filter(x => x.InvStatus === 20);
      }
      this.DataSource = new MatTableDataSource(this.InvoiceList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
      this.chRef.detectChanges();
    }
  }


  applyFilter() {
    this.isLoading = true;
    // this.searchModel = this.searchModel.trim(); // Remove whitespace
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

}
