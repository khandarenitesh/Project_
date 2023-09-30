import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { SharedService } from '../../../SharedServices/shared.service';

//Model call
import { CartingAgentModel } from '../Models/carting-agent-list';
// Services Call
import { MastersServiceService } from '../Services/masters-service.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carting-agent-list',
  templateUrl: './carting-agent-list.component.html',
  styleUrls: ['./carting-agent-list.component.scss']
})
export class CartingAgentListComponent implements OnInit {
  displayedColumnsForApi = ['SrNo', 'CAName', 'CAMobNo', 'CAPan', 'GSTNo', 'CAEmail', 'StateName', 'DistrictName', 'CityName', 'IsActive', 'Actions'];
  public DataSource = new MatTableDataSource<any>();
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  isLoading: boolean = false;
  UserId: number = 0;
  CompanyId: number = 0;
  BranchId: number = 0;
  CartingAgentModal: CartingAgentModel;
  searchModel: string = '';

  constructor(private _MastersServiceService: MastersServiceService, private chRef: ChangeDetectorRef, private router: Router,
    private _SharedService: SharedService, private toaster: ToastrService) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.CompanyId = obj.CompanyId;
    this.BranchId = obj.BranchId;
    this.GetCartingAgent(this.BranchId);
    // if (this.BranchId === 1) {
    //   this.GetCartingAgent(this.BranchId); // Branch Admin
    // } else {
    //   this.GetCartingAgent(0); // Super Admin
    // }
  }

  // Get Carting Agent List
  GetCartingAgent(BranchId: number) {
    this.isLoading = true;
    this._MastersServiceService.getCartingAgenList_Service(AppCode.allString, BranchId).subscribe((data: any) => {
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

  redirect() {
    this.router.navigate(['/modules/masters/carting-agent-add']);
  }

  GetData(row: CartingAgentModel) {
    this._SharedService.setData(row);
    this.router.navigate(['/modules/masters/carting-agent-add'], { queryParams: { state: AppCode.updateString } });
  }

  ChangeStatus(row: CartingAgentModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do You want to change status?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.CartingAgentModal = new CartingAgentModel();
        this.CartingAgentModal.Action = AppCode.statusString;
        this.CartingAgentModal.Addedby = String(this.UserId);
        this.CartingAgentModal.BranchId = row.BranchId;
        this.CartingAgentModal.CAId=row.CAId;
        if(row.IsActive == AppCode.IsActiveString){
          this.CartingAgentModal.IsActive = AppCode.IsInActiveString;
        }
        else{
          this.CartingAgentModal.IsActive = AppCode.IsActiveString;
        }
        this._MastersServiceService.SaveCartingAgent_Service(this.CartingAgentModal)
          .subscribe((data: any) => {
            if(data === AppCode.StatusChangedStatus){
              this.toaster.success(AppCode.msg_stsChange);
              this.GetCartingAgent(this.BranchId);
            }
          }, (error) => {
            console.error(error);
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
