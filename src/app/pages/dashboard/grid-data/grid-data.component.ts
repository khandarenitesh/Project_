import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MastersServiceService } from '../../../modules/master-forms/Services/masters-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppCode } from '../../../app.code';
import { ChartData } from '../dashboard-model.model';

@Component({
  selector: 'app-grid-data',
  templateUrl: './grid-data.component.html',
  styleUrls: ['./grid-data.component.scss']
})
export class GridDataComponent implements OnInit {

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  UserId: number = 0;
  CompanyId: number = 0;
  RoleId: number = 0;
  BranchId: number = 0;
  isLoading: boolean = false;
  DATA: any[] = [];
  columns: Array<any>
  DynamicalydisplayedColumns: Array<any>
  dataSource: any
  constructor(private _MastersServiceService: MastersServiceService, private chRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    let obj = AppCode.getUser(); //getting data from session
    this.UserId = obj.UserId;
    this.CompanyId = obj.CompanyId;
    this.RoleId = obj.RoleId;
    this.BranchId = obj.BranchId;
    this.GetDataForDynamictableList(this.BranchId, this.CompanyId); //call getDataForDynamictableList method
  }


//using spread operator allows us to quickly copy all or part of an existing array or object into another array or object.
  GetColumnDataforDisplay(data: any[]) {
    // Get list of columns by gathering unique keys of objects found in DATA.
    this.DATA = data
    console.log('data geting for column', this.DATA);
    const columns = this.DATA
      .reduce((columns: any, row) => {
        return [...columns, ...Object.keys(row)]
      }, [])
      .reduce((columns: any, column: any) => {  //The reduce() method executes a reducer function for array element. The reduce() method returns a single value
        return columns.includes(column)  //The includes() method returns true if a string contains a specified string. Otherwise it returns false
          ? columns
          : [...columns, column]
      }, [])
    // Describe the columns for <mat-table>.
    this.columns = columns.map((column: any) => { //A Map holds key-value pairs where the keys can be any datatype
      return {
        columnDef: column,
        header: column,
        cell: (element: any) => `${element[column] ? element[column] : ``}`
      }
    })
    this.DynamicalydisplayedColumns = this.columns.map(c => c.columnDef);  //push column into array for dynamic display
    // Set the dataSource for <mat-table>.
    this.dataSource = this.DATA
    this.DataSource.paginator = this.paginator;
    this.DataSource.sort = this.Sort;
  }

  // Get Branch List
  GetDataForDynamictableList(BranchId: number, CompanyId: number) {
    this.isLoading = true;
    this._MastersServiceService.getStockistList_Service(BranchId, CompanyId, AppCode.allString).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
        this.GetColumnDataforDisplay(data);  //passing data through the function.
      } else {
        this.DataSource.data = [];
      }
      this.isLoading = false;
      this.chRef.detectChanges();
    });
  }

}
