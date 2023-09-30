import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { InvoiceModel } from './../Models/invoice-model';

import { ToastrService } from 'ngx-toastr';
import { OrderDispatchService } from '../Services/order-dispatch.service';
import { AppCode } from '../../../app.code';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

export class BoxNoModel {
  BoxValue: number = 0;
}
@Component({
  selector: 'app-generate-sticker',
  templateUrl: './generate-sticker.component.html',
  styleUrls: ['./generate-sticker.component.scss']
})
export class GenerateStickerComponent implements OnInit {
  DisplayInvoiceData = ['SrNo', 'InvoiceNo', 'stockistNo', 'stockistName', 'City', 'InvAmount', 'NoOfBox', 'TransporterName', 'IsStockTransfer', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  isLoading: boolean = false;
  UserId: number = 0;
  BranchId: number = 0;
  CompId: number = 0;
  invoicemodel: InvoiceModel;
  searchModel: string = '';
  DataModel: any;
  modalReference: NgbModalRef;
  InvId: number = 0;
  BoxNoStr: string = "";
  BoxNo: string = "";
  AllBox: boolean = false;
  NoOfBox: number = 0;
  boxModel: BoxNoModel = new BoxNoModel();
  InvoiceNo: string = "";
  isBoxNo: boolean = false;
  id: any;

  constructor(private chRef: ChangeDetectorRef, private modalService: NgbModal, private _orderDispatchService: OrderDispatchService,
    private _ToastrService: ToastrService, private appCode: AppCode, private route: ActivatedRoute) { }

  ngOnInit() {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.GetInvoiceList(this.BranchId, this.CompId, 0);

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id === "1") {
      this.id = this.id;
    } else if (this.id == null || this.id == undefined) {
      this.id = this.id = 0;
    }
  }

  GetInvoiceList(BranchId: number, CompId: number, InvId: number) {
    this.isLoading = true;
    this._orderDispatchService.getInvoiceListForSticker_Service(BranchId, CompId, InvId)
      .subscribe((data: any) => {
        if (data.length > 0 && data != null && data != "" && data != undefined) {
          if (this.id === "1") {
            var StockTransData = data.filter((x: any) => x.IsStockTransfer === 1)
            this.DataSource.data = StockTransData;
            this.DataSource.paginator = this.paginator;
            this.DataSource.sort = this.Sort;
          }
          else {
            var OrderDisdata = data.filter((x: any) => x.IsStockTransfer === 0)
            this.DataSource.data = OrderDisdata;
            this.DataSource.paginator = this.paginator;
            this.DataSource.sort = this.Sort;
          }

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

  // Actions: Open Modal for Specific Box and All Boxes
  onClickPrintModel(content: any, row: any) {
    this.modalReference = this.modalService.open(content, {
      centered: true,
      size: 'md',
      backdrop: 'static'
    });
    this.InvId = 0;
    this.NoOfBox = 0;
    this.InvoiceNo = "";
    this.InvId = row.InvId;
    this.NoOfBox = row.NoOfBox;
    this.InvoiceNo = row.InvNo;
  }

  // On Click Print Sticker Invoice Id wise show
  onClickPrintSticker() {
    this.isLoading = true;
    if (this.BoxNoStr == "" && this.AllBox == false) {
      this._ToastrService.warning('Please Add Atleast one value!');
      return;
    }
    // Validation No.of Boxe to Box No.
    if (parseInt(this.BoxNoStr) > this.NoOfBox) {
      this._ToastrService.warning('Box No. are greater than No.of Box');
      return;
    }
    // Seperated Comma String Box No.
    const BoxNoMsg = this.BoxNoStr.split(",").map((text, index) => {
      return {
        position: index + 1,
        message: text.trim()
      }
    });
    for (var i = 0; i < BoxNoMsg.length; i++) {
      this.boxModel.BoxValue = parseInt(BoxNoMsg[i].message);
      if (this.boxModel.BoxValue > this.NoOfBox) {
        this._ToastrService.warning('Box No. are greater than No.of Box');
        return;
      }
    }
    // Dash String Box No.
    let msgStr: any = BoxNoMsg[0].message.split("-");
    if (msgStr.length > 0) {
      for (var i = 0; i < msgStr.length; i++) {
        this.boxModel.BoxValue = parseInt(msgStr[i]);
        if (this.boxModel.BoxValue > this.NoOfBox) {
          this._ToastrService.warning('Box No. are greater than No.of Box');
          return;
        }
      }
    }
    this.BoxNo = String((this.BoxNoStr === "") ? "0" : this.BoxNoStr);
    this.DataModel = {
      InvId: this.InvId,
      BranchId: this.BranchId,
      CompId: this.CompId,
      Type: AppCode.printStickerTitle,
      BoxNo: this.BoxNo,
      AddedBy: String(this.UserId)
    }
    this._orderDispatchService.printSticker_Service(this.DataModel)
      .subscribe((data: any) => {
        if (data === AppCode.SuccessStatus) {
          this.GetInvoiceList(this.BranchId, this.CompId, 0);
          this._ToastrService.success(AppCode.msg_printSticker);
          this.clear();
          this.modalService.dismissAll();
        } else if (data === AppCode.ExistsStatus) {
          this._ToastrService.warning(AppCode.ExistsStatus);
        } else {
          this._ToastrService.error(AppCode.FailStatus);
        }
        this.isLoading = false;
        this.chRef.detectChanges();
      }, (error: any) => {
        console.error(error);
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  onchk() {
    if (this.AllBox == true) {
      this.BoxNoStr = '';
      this.isBoxNo = true;
    } else {
      this.isBoxNo = false;
    }
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  clear() {
    this.BoxNoStr = '';
    this.AllBox = false;
    this.isBoxNo = false;
    this.isLoading = false;
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

  // Case : Only Allowed Comma & Dash
  numberonlyandcomma(event: any) {
    this.appCode.numberonlyandcomma(event);
    this.chRef.detectChanges();
  }

}
