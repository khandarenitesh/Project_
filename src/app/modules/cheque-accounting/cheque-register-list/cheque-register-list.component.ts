import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChequeRegister } from '../models/cheque-register';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { AppCode } from 'src/app/app.code';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/SharedServices/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cheque-register-list',
  templateUrl: './cheque-register-list.component.html',
  styleUrls: ['./cheque-register-list.component.scss']
})
export class ChequeRegisterListComponent implements OnInit {

  isLoading: boolean = false;
  displayedColumnsForApi = ['SrNo', 'StockistName', 'Date', 'BankName', 'City', 'BankAccountNo', 'IFSCCode', 'ChequeNo', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  ChequeRegisterForm: FormGroup;
  UserId: number = 0;
  searchModel: string = '';
  CompanyId: number = 0;
  BranchId: number = 0;
  submitted = false;
  StockistNameList: any[] = [];

  defaultform: any = {
    StockistName: '',
  }

  constructor(private chRef: ChangeDetectorRef,
    private _MastersServiceService: MastersServiceService,
    private router: Router, private _SharedService: SharedService,
    private chef: ChangeDetectorRef, private fb: FormBuilder,) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId
    this.CompanyId = obj.CompanyId
    this.initForm();
    // this.GetChequeList();
    this.GetStockistList();
  }

  initForm() {
    this.ChequeRegisterForm = this.fb.group({
      StockistName: [
        this.defaultform.StockistName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],

    });
  }

  // Get Cheques List
  // GetChequeList(){
  //   this.isLoading = true;
  //   this._MastersServiceService.getCompanyList_Service(AppCode.allString).subscribe((data: any) => {
  //     if (data.length > 0 && data != null && data != [] && data != "" && data != undefined) {
  //       this.DataSource.data = data;
  //       this.DataSource.paginator = this.paginator;
  //       this.DataSource.sort = this.Sort;
  //       this.isLoading = false;
  //       this.chRef.detectChanges();
  //     } else {
  //       this.DataSource.data = [];
  //       this.isLoading = false;
  //       this.chRef.detectChanges();
  //     }
  //   });
  // }

  // Get Stockist Name List
  GetStockistList() {
    this._MastersServiceService.getStockistList_Service(this.CompanyId, this.BranchId, AppCode.allString)
      .subscribe((data: any) => {
        this.StockistNameList = data;
        this.chef.detectChanges();
      }, (error) => {
        console.error(error);
      });
  }

  // Redirect to list page
  redirect() {
    this.router.navigate(['/modules/cheque-accounting/cheque-register']);
  }

  GetData(row: ChequeRegister) {
    this._SharedService.setData(row);
    this.router.navigate(['/modules/cheque-accounting/cheque-register'], { queryParams: { state: AppCode.updateString } });
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

}
