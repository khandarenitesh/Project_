import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppCode } from 'src/app/app.code';
import { PickistModel } from '../Models/picklist-model';
import { PicklistCountModel } from '../Models/picklistcount-model';
import { OrderDispatchService } from '../Services/order-dispatch.service';

@Component({
  selector: 'app-re-allot-picker',
  templateUrl: './re-allot-picker.component.html',
  styleUrls: ['./re-allot-picker.component.scss']
})
export class ReAllotPickerComponent implements OnInit {

  displayedColumnsForApi = ['SrNo', 'PicklistNo', 'PicklistDate', 'FromInv', 'ToInv', 'PickerName', 'StatusText', 'IsStockTransfer', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  ColumnsForUser = ['Action', 'Name', 'ContactNumber'];
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('Sort2') Sort2: MatSort;
  public UserData = new MatTableDataSource<any>();
  pageState: string = "";
  BranchId: number = 0;
  CompId: number = 0;
  isLoading: boolean = false;
  defaultform: any = {
    PicklistNo: '',
    Date: '',
    FromInvoiceNo: '',
    ToInvoiceNo: ''
  };
  PicklistStatus: string = "";
  PickListMsg: string = "";
  RoleId: number = 0;
  UserModal: any;
  pickers: string = "";
  UserId: number = 0;
  PicklistId: number = 0;
  AllotmentId: number = 0;
  DataModel: any;
  currentDate = new Date();
  AllotFlag: boolean = true;
  pickistModel: PickistModel;
  picklistAddForm: FormGroup;
  RejectReason: string = "";
  modalReference: NgbModalRef;
  picklistcount: PicklistCountModel;
  AllPickList: number = 0;
  RejectbyOperator: number = 0;
  PendingForAllot: number = 0;
  AllotedPicklists: number = 0;
  AcceptedPickList: number = 0;
  ConcernRaised: number = 0;
  CompletedPicklists: number = 0;
  CompletedVerified: number = 0;
  searchModel: any;
  PickList: any;
  PicklistData: any[] = [];
  id: any;

  constructor(
    private chRef: ChangeDetectorRef,
    private _orderDispatchService: OrderDispatchService,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pageState = AppCode.verifyString;
    let obj = AppCode.getUser();
    this.RoleId = obj.RoleId;
    if (this.RoleId === 1 || this.RoleId === 3) { // Super Admin and Operator/Staff
      this.pageState = "Verify";
      this.PickListMsg = "Verify PickList";
    } else if (this.RoleId === 1 || this.RoleId === 4) { // Super Admin and Supervisor
      this.pageState = "Allot";
      this.PickListMsg = "Allot PickList";
    }
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
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
      this.GetPickListCounts(this.DataModel);
    } else if (this.id == null || this.id == undefined) {
      this.id = this.id = 0;
      this.GetPickListCounts(this.DataModel);
    }
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
    this.picklistcount = data;
    this.AllPickList = this.picklistcount.TotalPL;
    this.RejectbyOperator = this.picklistcount.OperatorRejected;
    this.PendingForAllot = this.picklistcount.Pending;
    this.AllotedPicklists = this.picklistcount.Alloted;
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
    this.AllotedPicklists = this.picklistcount.Alloted;
    this.AcceptedPickList = this.picklistcount.Accepted;
    this.ConcernRaised = this.picklistcount.Concern;
    this.CompletedPicklists = this.picklistcount.Completed;
    this.CompletedVerified = this.picklistcount.CompletedVerified;
    this.chRef.detectChanges();
  }

  // Get PickList
  GetPickList(DataModel: any) {
    debugger
    this.isLoading = true;
    this._orderDispatchService.getPickListReAllotment_Service(DataModel)
      .subscribe((data: any) => {
        if (data != null && data != "" && data != undefined) {
          if (this.id === "1") {
            var StockTransData = data.filter((x: any) => x.IsStockTransfer === 1)
            this.DataSource.data = StockTransData;
            this.PicklistData = StockTransData;
            this.DataSource.paginator = this.paginator;
            this.DataSource.sort = this.Sort;
            this.isLoading = false;
            this.chRef.detectChanges();
          } else {
            var OrderDisData = data.filter((x: any) => x.IsStockTransfer === 0)
            this.DataSource.data = OrderDisData;
            this.PicklistData = OrderDisData;
            this.DataSource.paginator = this.paginator;
            this.DataSource.sort = this.Sort;
            this.isLoading = false;
            this.chRef.detectChanges();
          }
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

  ShowPickList(Flag?: any) {
    if (this.PicklistData != null && this.PicklistData !== undefined) {

      if (Flag === 'All') {
        this.PickList = this.PicklistData;
      }
      else if (Flag === 'RejectbyOperator') {
        this.PickList = this.PicklistData.filter(x => x.PicklistStatus === 2);

      } else if (Flag === 'PendingForAllot') {
        this.PickList = this.PicklistData.filter(x => x.PicklistStatus === 1);

      } else if (Flag === 'AllotedPicklists') {
        this.PickList = this.PicklistData.filter(x => x.PicklistStatus === 3);

      } else if (Flag === 'AcceptedPickList') {
        this.PickList = this.PicklistData.filter(x => x.PicklistStatus === 4);

      } else if (Flag === 'ConcernRaised') {
        this.PickList = this.PicklistData.filter(x => x.PicklistStatus === 9);

      } else if (Flag === 'CompletedPicklists') {
        this.PickList = this.PicklistData.filter(x => x.PicklistStatus === 8);

      } else if (Flag === 'CompletedVerified') {
        this.PickList = this.PicklistData.filter(x => x.PicklistStatus === 10);
      }
      this.DataSource = new MatTableDataSource(this.PickList);
      this.DataSource.paginator = this.paginator;
      this.DataSource.sort = this.Sort;
      this.chRef.detectChanges();
    }
  }

  GetUserList(PickerId: number) {
    this.isLoading = true;
    this._orderDispatchService.getUserList_Service(this.BranchId, this.CompId, 5)
      .subscribe((data: any) => {
        if (data != null && data != "" && data != undefined) {
          let list: any[] = data;
          let list1 = list.filter(u => u.UserId != PickerId);
          this.UserData.data = list1;
          this.UserData.paginator = this.paginator;
          this.UserData.sort = this.Sort;
          this.isLoading = false;
          this.chRef.detectChanges();
        } else {
          this.UserData.data = [];
          this.isLoading = false;
          this.chRef.detectChanges();
        }
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  AllotPopup(row: any, content: any) {
    this.GetUserList(row.PickerId);
    this.PicklistId = row.Picklistid;
    this.AllotmentId = row.AllotmentId;
    this.pickers = "";
    this.UserModal = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  AddString(row: any) {
    let newpickers;
    if (this.pickers.includes(row.UserId)) {
      newpickers = this.pickers.replace(row.UserId + ',', '');
      this.pickers = newpickers;
    }
    else {
      this.pickers = this.pickers + row.UserId + ',';
    }
  }

  ReAllot() {
    if (this.pickers === "") {
      this.toaster.warning(AppCode.msg_selectPicker);
    }
    else {
      let model = {
        'BranchId': this.BranchId,
        'CompId': this.CompId,
        'Picklistid': this.PicklistId,
        'AllotmentId': this.AllotmentId,
        'PickerId': this.pickers,
        'AllottedBy': this.UserId
      }
      this._orderDispatchService.AddReAllotList_Service(model)
        .subscribe((data: any) => {
          if (data === AppCode.SuccessStatus) {
            this.toaster.success(AppCode.msg_AllotSuccess);
            this.modalService.dismissAll();
            this.GetPickList(this.DataModel);
            if (this.id === "1") {
              this.GetPickListCountsstk(this.DataModel);
            }
            else {
              this.GetPickListCounts(this.DataModel);
            }
          }
          else {
            this.toaster.warning(AppCode.msg_AlreadyRealloted);
            this.modalService.dismissAll();
          }
        }, (error: any) => {
          console.error("Error:  " + JSON.stringify(error));
        });
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
