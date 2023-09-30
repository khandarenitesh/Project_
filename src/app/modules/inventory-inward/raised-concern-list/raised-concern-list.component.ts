import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ResolveRaisedConcernModel } from '../models/ApproveVehicleModel';

import { InventoryInwardService } from '../Services/inventory-inward.service';
import { ToastrService } from 'ngx-toastr';
import { AppCode } from '../../../app.code';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-raised-concern-list',
  templateUrl: './raised-concern-list.component.html',
  styleUrls: ['./raised-concern-list.component.scss']
})
export class RaisedConcernListComponent implements OnInit {
  isLoading: boolean = false;
  RaisedConcernList = ['SrNo', 'LrNo', 'InvoiceNo', 'AddedOn', 'Remark', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  UserId: number = 0;
  searchModel: string = '';
  BranchId: number = 0;
  CompanyId: number = 0;
  ResolveConcernmodel: ResolveRaisedConcernModel;

  constructor(private chRef: ChangeDetectorRef, private _service: InventoryInwardService, private toaster: ToastrService) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.GetRaisedConcernList();
  }

  GetRaisedConcernList() {
    this.isLoading = true;
    this._service.GetRaisedConcernList_Service(this.BranchId, this.CompanyId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
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
  //Approve Function
  ResolveConcern(row: ResolveRaisedConcernModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to resolve?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, resolve it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ResolveConcernmodel = new ResolveRaisedConcernModel();
        this.ResolveConcernmodel.RaieseReqId = row.RaieseReqId;
        this.ResolveConcernmodel.BranchId = this.BranchId;
        this.ResolveConcernmodel.CompId = this.CompanyId;
        this.ResolveConcernmodel.AddedBy = this.UserId;
        this._service.ResolveRaisedConcern_Url_Service(this.ResolveConcernmodel)
          .subscribe((data: any) => {
            if (data > 0) {
              this.toaster.success(AppCode.msg_ResolveSuccess);
              this.GetRaisedConcernList();
            }
          }, (error: any) => {
            console.error(error);
            this.chRef.detectChanges();
          });
      }
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

}
