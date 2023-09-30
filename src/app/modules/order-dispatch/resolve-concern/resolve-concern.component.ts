import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppCode } from '../../../app.code';
import { OrderDispatchService } from '../Services/order-dispatch.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, NgForm } from '@angular/forms';
import { PicklistCountModel } from '../Models/picklistcount-model';

export class Rconcern {
  ResolveRemark: string;
}

@Component({
  selector: 'app-resolve-concern',
  templateUrl: './resolve-concern.component.html',
  styleUrls: ['./resolve-concern.component.scss']
})
export class ResolveConcernComponent implements OnInit {

  displayedColumnsForApi = ['SrNo', 'PickerName', 'PicklistNo', 'PicklistDate', 'PicklistStatus', 'ConcernReason', 'ConcernRemark', 'FromToInv', 'IsStockTransfer', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  @ViewChild('ConcernForm') ConcernForm: NgForm;

  rconcern: Rconcern;
  pageState: string = "";
  UserId: number = 0;
  BranchId: number = 0;
  CompId: number = 0;
  CurrentStatus: number = 0;
  ResolveRemark: string;
  StatusTime: Date = new Date();
  UpdatedBy: number = 0;
  AllotmentId: number = 0;
  isLoading: boolean = false;
  searchModel: any;
  PicklistData: any[] = [];
  DataModel: any;
  ResolveConernModal: any;
  currentDate = new Date();
  Picklistid: string = '';
  PickList: any;
  pickerId: number = 0;
  modalReference: NgbModalRef;
  picklistcount: PicklistCountModel;
  AllPickList: number = 0;
  RejectbyOperator: number = 0;
  PendingForAllot: number = 0;
  AllotedPicklist: number = 0;
  AcceptedPickList: number = 0;
  ConcernRaised: number = 0;
  CompletedPicklists: number = 0;
  CompletedVerified: number = 0;
  id: any;

  constructor(private chRef: ChangeDetectorRef,
    private _orderDispatchService: OrderDispatchService,
    private modalService: NgbModal,
    private _ToastrService: ToastrService, private route: ActivatedRoute,) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.pageState = "Submit"
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.rconcern = {
      ResolveRemark: "",
    };
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompId,
      PicklistDate: this.currentDate
    };
    this.GetPickList(this.DataModel);

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id == 1) {
      this.id = this.id;
      console.log('Id Received From Stock Transfer! =  ', this.id)
      this.GetPickListCountsstk(this.DataModel);
    } else if (this.id == null || this.id == undefined) {
      this.id = this.id = 0;
      this.GetPickListCounts(this.DataModel);
    }

  }

  // Get PickList
  GetPickList(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getResolveConvernList_Service(DataModel)
      .subscribe((data: any) => {
        if (data != null && data != "" && data != undefined) {
          if (this.id === "1") {
            var StockTransData = data.filter((x: any) => x.IsStockTransfer === 1)
            this.DataSource.data = StockTransData;
            this.PicklistData = StockTransData;
            this.DataSource.paginator = this.paginator;
            this.DataSource.sort = this.Sort;
          }
          else {
            var OrderDisData = data.filter((x: any) => x.IsStockTransfer === 0)
            this.DataSource.data = OrderDisData;
            this.PicklistData = OrderDisData;
            this.DataSource.paginator = this.paginator;
            this.DataSource.sort = this.Sort;
          }
          // this.GetPickListCounts(this.DataModel);
          this.isLoading = false;
          this.chRef.detectChanges();
        } else {
          this.DataSource.data = [];
          this.isLoading = false;
          this.chRef.detectChanges();
        }
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  // Get PickList Counts
  GetPickListCounts(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getPickListCounts_Service(DataModel)
      .subscribe((data: any) => {
        this.afterCount(data);
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  afterCount(data: PicklistCountModel) {
    this.picklistcount = new PicklistCountModel();
    this.picklistcount = data;;
    this.AllPickList = this.picklistcount.TotalPL;
    this.RejectbyOperator = this.picklistcount.OperatorRejected;
    this.PendingForAllot = this.picklistcount.Pending;
    this.AllotedPicklist = this.picklistcount.Alloted;
    this.AcceptedPickList = this.picklistcount.Accepted;
    this.ConcernRaised = this.picklistcount.Concern;
    this.CompletedPicklists = this.picklistcount.Completed;
    this.CompletedVerified = this.picklistcount.CompletedVerified;
    this.chRef.detectChanges();
  }

  // Get PickList Counts For Stock Transfere
  GetPickListCountsstk(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getPickListCountsstck_Service(DataModel)
      .subscribe((data: any) => {
        this.afterCountstk(data);
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  afterCountstk(data: PicklistCountModel) {
    this.picklistcount = new PicklistCountModel();
    this.picklistcount = data;
    this.AllPickList = this.picklistcount.TotalPL;
    this.RejectbyOperator = this.picklistcount.OperatorRejected;
    this.PendingForAllot = this.picklistcount.Pending;
    this.AllotedPicklist = this.picklistcount.Alloted;
    this.AcceptedPickList = this.picklistcount.Accepted;
    this.ConcernRaised = this.picklistcount.Concern;
    this.CompletedPicklists = this.picklistcount.Completed;
    this.CompletedVerified = this.picklistcount.CompletedVerified;
    this.chRef.detectChanges();
  }


  ResolveConernPopup(row: any, content: any) {
    if (row.PicklistStatus == 11) {
      this.pickerId = row.VerifiedBy;
    }
    else {
      this.pickerId = row.PickerId;
    }
    this.AllotmentId = row.AllotmentId;
    this.Picklistid = row.Picklistid;
    this.CurrentStatus = row.PicklistStatus;
    this.ResolveRemark = "";
    this.ResolveConernModal = this.modalService.open(content, {
      centered: true,
      size: 'md',
      backdrop: 'static'
    });
  }

  ResolveConernSave() {
    this.isLoading = true;
    let model = {
      "AllotmentId": this.AllotmentId,
      "Picklistid": this.Picklistid,
      "PickerId": this.pickerId,
      'BranchId': this.BranchId,
      "CurrentStatus": this.CurrentStatus,
      'ResolveRemark': this.ResolveRemark,
      "StatusTime": this.StatusTime,
      "UpdatedBy": this.UserId
    }
    this._orderDispatchService.ResolveConern_Service(model)
      .subscribe((data: any) => {
        if (data === AppCode.SuccessStatus) {
          this._ToastrService.success(AppCode.msg_ResolveConernSuccess);
          this.GetPickList(this.DataModel);
          if (this.id === "1") {
            this.GetPickListCountsstk(this.DataModel)
          }
          else {
            this.GetPickListCounts(this.DataModel);
          }
          this.modalService.dismissAll();
          this.isLoading = false;
          this.chRef.detectChanges();

        }
        else {
          this._ToastrService.error(AppCode.msg_ResolveConernFail);
          this.isLoading = false;
        }
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
      });
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
