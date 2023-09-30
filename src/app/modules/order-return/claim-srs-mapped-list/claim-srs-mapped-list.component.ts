import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { OrderReturnService } from '../Services/order-return.service';
import { AppCode } from '../../../app.code';

@Component({
  selector: 'app-claim-srs-mapped-list',

  templateUrl: './claim-srs-mapped-list.component.html',
  styleUrls: ['./claim-srs-mapped-list.component.scss']
})
export class ClaimSrsMappedListComponent implements OnInit {

  displayedColumnsForApi = ['SrNo','ClaimNo','ClaimDate', 'SalesDocNo', 'DocDate','SalesDocType', 'StockistNo', 'StockistName', 'Action'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();

  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  isLoading: boolean = false;
  searchModel: string = '';

  constructor(private _Service: OrderReturnService,
    private chRef: ChangeDetectorRef, private toastr: ToastrService) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.GetClaimSrsMappedList();
  }

   //Get Clai SRS Mapped List
   GetClaimSrsMappedList() {
    this.isLoading = true;
    this._Service.GetClaimSrsMappedList(this.BranchId, this.CompanyId).subscribe((data: any) => {
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
  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.trim(); // Remove whitespace
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

}
