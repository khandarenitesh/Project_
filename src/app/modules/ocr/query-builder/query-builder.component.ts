import { AppCode } from 'src/app/app.code';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OcrIntegrationService } from '../Services/ocr-integration.service';;
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

//Model
// export class QueryBuilderModel {
//   Query: string = '';
//   Status: string = '';
// }

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class QueryBuilderComponent implements OnInit {
//   QueryBuilderForm: FormGroup;
//   UserId: Number = 0;
//   BranchId: number = 0;
//   CompanyId: number = 0;
//   submitted: boolean = false;
//   isLoading: boolean = false;
//   rows: number = 4;
//   QueryBuilderModel: QueryBuilderModel = new QueryBuilderModel();
//   isValidSQLQuery: boolean = true;
//   ValidSQLQueryText: boolean = true;
//   queryResult: any[] = [];
//   tableTitle: string = "";
//   @ViewChild('TABLE') table: ElementRef;
//   defaultform: any = {
//     QueryBuilder: ''
//   }

//   data: any;
//   currentPage = 0;
//   itemsPerPage = 0; // Number of items to display per page
//   inpt: any;
//   searchModel: any;
//   numRowsAffected: any;
//   filteredQueryResult: any[] = [];

//   constructor(private fb: FormBuilder, private dataService: OcrIntegrationService,
//     private chef: ChangeDetectorRef, private toaster: ToastrService, private datePipe: DatePipe) { }

//   //ngOnInit hook
  ngOnInit() {
    // let obj = AppCode.getUser();
    // this.UserId = obj.UserId;
    // this.BranchId = obj.BranchId;
    // this.CompanyId = obj.CompanyId;
    // this.initForm();
  }

//   //valid sql query showing error message depend upon flag
//   InputChange() {
//     this.inpt = document.getElementById("inpt");
//     if (this.inpt.value.length > 0) {
//       this.ValidSQLQueryText = false;
//       this.submitted = false;
//     } else {
//       this.ValidSQLQueryText = true;
//     }
//   }

//   get f(): { [key: string]: AbstractControl } {
//     return this.QueryBuilderForm.controls;
//   }

//   //form initialize
//   initForm() {
//     this.QueryBuilderForm = this.fb.group({
//       QueryBuilder: [
//         this.defaultform.QueryBuilder,
//         Validators.compose([
//           Validators.required,
//         ]),
//       ]
//     });
//   }

//   //valid sql query
//   onSqlQueryValid(isValid: boolean) {
//     this.isValidSQLQuery = isValid;
//   }

//   //save or get data through user input query.
//   SaveQueryBuilder() {
//     this.isLoading = true;
//     this.ValidSQLQueryText = true;
//     this.isValidSQLQuery = true;
//     this.submitted = true;
//     if (!this.QueryBuilderForm.valid) {
//       this.isLoading = false;
//       this.toaster.warning('Please enter query!');
//       return;
//     }
//     this.QueryBuilderModel = new QueryBuilderModel();
//     this.QueryBuilderModel.Query = this.f.QueryBuilder.value;
//     const selectKeyword = this.QueryBuilderModel.Query.match(/\bselect\b/i);
//     if (selectKeyword) {
//       const selectKeywordSeparate = selectKeyword[0].toLowerCase();
//       if (selectKeywordSeparate === 'select' || selectKeywordSeparate === 'Select' || selectKeywordSeparate === 'SELECT') {
//         this.submitted = false;
//         this.dataService.GetDataUsingSelectList_Service(this.QueryBuilderModel).subscribe((response: any) => {
//           this.tableTitle = `Select Query Result (Total Record ${response.length})`;
//           this.queryResult = response;
//           this.data = response; //getting data for update datasource
//           this.handleSaveOrGet();
//         });
//       }
//     } else {
//       this.submitted = false;
//       this.dataService.Querydata_Service(this.QueryBuilderModel).subscribe((response: any) => {
//         if (response !== 'No Of Row Affected: 0') { //do not change in string
//           this.numRowsAffected = this.getNumRowsAffected(response);
//         }
//         if (this.numRowsAffected === 0) {
//           this.toaster.warning("No rows were affected");
//         } else {
//           const successMessage = this.numRowsAffected === 1 ? `${this.numRowsAffected} row was` : `${this.numRowsAffected} rows were`;
//           this.toaster.success(`${successMessage} affected. Updated Successfully!`);
//         }
//         this.handleSaveOrGet();
//       });
//     }
//   }

//   //handle save or get 
//   handleSaveOrGet() {
//     this.falseVariableAfterSaveOrGet();
//     this.chef.detectChanges();
//   }

//   //set false variables
//   falseVariableAfterSaveOrGet() {
//     this.isValidSQLQuery = false;
//     this.submitted = false;
//     this.isLoading = false;
//   }

//   onPageChange(event: any) {
//     this.currentPage = event.pageIndex;
//     console.log(this.queryResult); // Check if this is being updated correctly
//   }

//   //get column name
//   getColumnNames(): string[] {
//     return Object.keys(this.queryResult[0]);

//   }

//   //display column name
//   getDisplayedColumns(): string[] {
//     return ['serialNumber', ...this.getColumnNames()];
//   }

//   //extracting response
//   getNumRowsAffected(response: string): number {
//     try {
//       const parts = response.split(":");
//       if (parts.length > 1) {
//         return parseInt(parts[1].trim(), 10);
//       }
//     } catch (error) {
//       console.error("Error extracting rows affected:", error);
//     }
//     return 0;
//   }

//   //clear data 
//   ClearData() {
//     this.queryResult = [];
//     this.QueryBuilderForm.reset();
//     this.submitted = false;
//     this.isValidSQLQuery = true;
//     this.ValidSQLQueryText = true;
//     this.chef.detectChanges();
//   }

//   //display column date this dd/MM/yyyy format
//   formatDate(date: any): string {
//     if (typeof date === 'string') {
//       // Check if the value matches various date formats
//       const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?$/;
//       if (date.match(isoDateRegex)) {
//         return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
//       }
//     } else if (date instanceof Date) {
//       return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
//     }
//     return String(date);
//   }

//   //fitler data 
//   applyFilter() {
//     this.isLoading = true;
//     // Convert searchModel to lowercase for case-insensitive matching
//     const searchText = this.searchModel.toLowerCase().trim();
//     if (searchText !== "") {
//       // Filter the queryResult array based on the search text
//       this.filteredQueryResult = this.queryResult.filter(item =>
//         Object.values(item).some(value =>
//           typeof value === 'string' && value.toLowerCase().includes(searchText)
//         )
//       );
//       // Set the filtered data as the new data source for rendering
//       this.queryResult = this.filteredQueryResult;
//     } else {
//       this.queryResult = this.data;
//     }
//     this.isLoading = false;
//     this.chef.detectChanges();
//   }

}
