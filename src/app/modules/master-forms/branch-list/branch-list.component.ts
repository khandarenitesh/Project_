import { Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';

import { AppCode } from '../../../app.code';
import { SharedService } from '../../../SharedServices/shared.service';
import { BranchList } from '../Models/BranchModel';
import { ToastrService } from 'ngx-toastr';

// Services
import { MastersServiceService } from '../Services/masters-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {
  isLoading: boolean = false;
  displayedColumnsForApi = ['SrNo','BranchCode','BranchName','Email','ContactNo','Pan','GSTNo','CityName','Pin','StateName','IsActive','Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  Branchmodal: BranchList;
  UserId: number = 0;
  searchModel: string = '';

  constructor(
              private _MastersServiceService: MastersServiceService,
              private chRef: ChangeDetectorRef,
              private router: Router,
              private _SharedService: SharedService,
              private toaster: ToastrService
              ) { }

  ngOnInit(): void {
    let obj = AppCode.getUser()
    this.UserId = obj.UserId;
    this.GetBranchList();
  }

  // Get Branch List
  GetBranchList() {
    this.isLoading = true;
    this._MastersServiceService.getBranchList_Service(AppCode.allString).subscribe((data: any) => {
      if (data.length > 0 && data != null  && data != "" && data != undefined) {
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

// redirect on click cancel button
  redirect(){
    this.router.navigate(['/modules/masters/add-branch']);
  }

// set data on click edit button
  GetData(row: BranchList){
    this._SharedService.setData(row);
    this.router.navigate(['/modules/masters/add-branch'], { queryParams: { state: AppCode.updateString } });
  }

// active and deactive
  ChangeStatus(row: BranchList) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to change status?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!'
    }).then((result) =>{
      if (result.isConfirmed) {
    this.Branchmodal = new BranchList();
    this.Branchmodal.Action = AppCode.statusString;
    this.Branchmodal.Addedby = String(this.UserId);
    this.Branchmodal.BranchId = row.BranchId;
    if(row.IsActive == AppCode.IsActiveString){
      this.Branchmodal.IsActive = AppCode.IsInActiveString;
    }
    else{
      this.Branchmodal.IsActive =AppCode.IsActiveString;
    }
    this._MastersServiceService.SaveBranch_Service(this.Branchmodal)
    .subscribe((data: any) => {
      if(data === AppCode.StatusChangedStatus){
        this.toaster.success(AppCode.msg_stsChange);
        this.GetBranchList();
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
