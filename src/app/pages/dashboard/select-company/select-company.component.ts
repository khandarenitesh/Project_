import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/modules/auth';
import { CompanyList } from 'src/app/modules/master-forms/Models/CompanyList';
import { MastersServiceService } from 'src/app/modules/master-forms/Services/masters-service.service';
import { SharedService } from 'src/app/SharedServices/shared.service';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.scss']
})
export class SelectCompanyComponent implements OnInit {

  isLoading: boolean = false;
  displayedColumnsForApi = ['SrNo', 'CompanyCode', 'CompanyName', 'Email', 'ContactNo', 'PAN', 'GST', 'City', 'PinCode'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  authLocalStorageToken: any;
  companyModel: CompanyList;
  UserId: Number = 0;
  UserInfo: UserModel;



  constructor(
    private _MastersServiceService: MastersServiceService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private _SharedService: SharedService
  ) { }


  ngOnInit(): void {
    this.GetCompanyList();
    this.getUser();
  }

  GetCompanyList() {
    this.isLoading = true;
    this._MastersServiceService.getCompanyList_Service("ALL").subscribe((data: any) => {
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
    });
  }

  redirect() {
    this.router.navigate(['/modules/masters/company-add']);
  }

  getUser() {
    const user: any = localStorage.getItem(this.authLocalStorageToken);
    this.UserInfo = JSON.parse(user);
    this.UserId = this.UserInfo.UserInfo.UserId;
  }

  GetData(row: CompanyList) {
    this._SharedService.setData(row);
    this.router.navigate(['/modules/masters/company-add'], { queryParams: { state: 'Update' } });
  }

}
