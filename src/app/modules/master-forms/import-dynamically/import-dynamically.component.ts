import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MastersServiceService } from '../Services/masters-service.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppCode } from 'src/app/app.code';
import { CompanyList } from '../Models/CompanyList';
import { FieldNameList, ImportDynami, ImportDynamicSaveModel } from '../Models/import-dynami.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-import-dynamically',
  templateUrl: './import-dynamically.component.html',
  styleUrls: ['./import-dynamically.component.scss']
})
export class ImportDynamicallyComponent implements OnInit {

  ImportDynaDetails = ['SrNo', 'BranchName', 'CompanyName', 'ImpFor', 'FieldName', 'ColumnDatatype', 'ExcelColName', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();

  ImportDynamicallytitle: string = "";
  pageState: string = 'Save';
  ImportDynamicallyForm: FormGroup;
  defaultform: any = {
    Branch: '',
    Company: '',
    ImportType: '',
    FieldName: '',
    ColumnDatatype: '',
    ExcelName: ''
  };
  UserId: number = 0;
  isLoading: boolean = false
  InvalidBranch: boolean = false;
  InvalidCompany: boolean = false;
  InvalidImportType: boolean = false;
  InvalidColumnDatatype: boolean = false;
  BranchList: any[] = [];
  CompanyList: any[] = [];
  ImportTypeList: any[] = [];
  FiledList: any[] = [];
  BranchName: string = "";
  submitted: boolean = false;
  CompanyId: number = 0;
  BranchId: number = 0;
  maxDate = new Date();
  minDate = new Date();
  val: any;
  InvalidFieldName: boolean = false;
  ImportIDValue: number;
  importDynamicSaveModel: ImportDynamicSaveModel
  pkId: number = 0;

  //FOR AUTOCOMPLETE
  filteredOptionsCompany: Observable<CompanyList[]>;
  BranchNameArray: Observable<ImportDynami[]>;
  filteredOptionsImportType: Observable<ImportDynami[]>;
  ImportTypeArray: Observable<ImportDynami[]>;
  filteredOptionsFieldName: Observable<FieldNameList[]>;
  filteredautoColumnDatatype: Observable<FieldNameList[]>;
  router: any;
  ListTitle: string = '';
  searchModel: string = '';



  constructor(private fb: FormBuilder, private _service: MastersServiceService, private chRef: ChangeDetectorRef,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.ImportDynamicallytitle = "Import Dynamically Data";
    this.ListTitle = "Import Dynamically List"
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.initForm();
    this.GetBranchList();
    this.GetImportTypeList()
    this.GetImportDynaList();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.ImportDynamicallyForm.controls;
  }

  //form control
  initForm() {
    this.ImportDynamicallyForm = this.fb.group({
      Branch: [
        this.defaultform.Branch,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
      Company: [
        this.defaultform.Company,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
      ImportType: [
        this.defaultform.ImportType,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
      FieldName: [
        this.defaultform.FieldName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
      ColumnDatatype: [
        this.defaultform.ColumnDatatype,
        Validators.compose([
          Validators.required,
          Validators.maxLength(250),
        ]),
      ],
      ExcelName: [
        this.defaultform.ExcelName,
      ]
    });
  }

  // Get Branch List
  GetBranchList() {
    this._service.getBranchList_Service(AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.BranchList = data;
          this.BranchList = this.BranchList.sort((a: any, b: any) => a.BranchName.localeCompare(b.BranchName));
          this.BranchNameArray = this.f.Branch.valueChanges
            .pipe(
              startWith<string | ImportDynami>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.BranchName : null),
              map(BranchName => BranchName ? this.filterBranchName(BranchName) : this.BranchList.slice())
            );
          this.chRef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  // Autocomplete Search Filter
  private filterBranchName(name: string): ImportDynami[] {
    this.InvalidBranch = false;
    const filterValue = name.toLowerCase();
    return this.BranchList.filter((option: any) =>
      option.BranchName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnBranchName(name: ImportDynami): string {
    return name && name.BranchName ? name.BranchName : '';
  }

  branchValidation() {
    this.submitted = false;
    if ((this.f.Branch.value === null || this.f.Branch.value.BranchId === '' || this.f.Branch.value.BranchId === undefined || this.f.Branch.value.BranchId === null)) {
      this.InvalidBranch = true;
      this.isLoading = false;
      this.submitted = false;
      return;
    }
    else {
      this.InvalidBranch = false;
    }
    this.submitted = false;
  }

  // Get Company List
  GetComapanyList() {
    this.isLoading = true;
    let BranchIdValue: number;
    if (this.UserId !== 1) {
      BranchIdValue = this.BranchId; // Branchadmin
    }
    if ((this.f.Branch.value != "" && this.f.Branch.value != null && this.f.Branch.value != undefined)) {
      BranchIdValue = this.f.Branch.value.BranchId;
    } else {
      BranchIdValue = 0;
    }
    this.CompanyList = [];
    if (BranchIdValue > 0) {
      this._service.getCompanyBranch_Serive(BranchIdValue).subscribe((data: any) => {
        if (data != null && data != "" && data != undefined) {
          this.CompanyList = data;
          this.CompanyList = this.CompanyList.sort((a: any, b: any) => a.CompanyName.localeCompare(b.CompanyName));
          this.filteredOptionsCompany = this.f.Company.valueChanges
            .pipe(
              startWith<string | CompanyList>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.CompanyName : null),
              map(CompanyName => CompanyName ? this.filteredCompany(CompanyName) : this.CompanyList.slice())
            );
          this.isLoading = false;
          this.chRef.detectChanges();
        }
        else {
          this.isLoading = false;
          this.toaster.warning("Please Add Branch & Company Relation");
          this.chRef.detectChanges();
        }
      },
        (error) => {
          console.error(error);
        })
    }

  }

  // Autocomplete Search Filter
  private filteredCompany(name: string): CompanyList[] {
    this.InvalidCompany = false;
    const filterValue = name.toLowerCase();
    return this.CompanyList.filter((option: any) =>
      option.CompanyName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnCompany(company: CompanyList): string {
    return company && company.CompanyName ? company.CompanyName : '';
  }

  CompanyValidation() {
    this.submitted = false;
    if ((this.f.Company.value.CompanyId === '' || this.f.Company.value.CompanyId === null || this.f.Company.value.CompanyId === undefined)) {
      this.InvalidCompany = true;
      this.submitted = false;
      return;
    } else {
      this.InvalidCompany = false;
    }
    this.submitted = false;
    this.chRef.detectChanges();
  }

  //When Click On Import For then Give the List of Filed Name
  GetImporForOnChange() {
    this.isLoading = true;
    if (this.f.ImportType.value !== undefined && this.f.ImportType.value !== "" && this.f.ImportType.value !== null) {
      let ImportIDValue: number;
      ImportIDValue = this.f.ImportType.value.ImportId;
      this.FiledList = [];
      if (this.f.ImportType.value.ImportId !== "" && this.f.ImportType.value.ImportId !== null && this.f.ImportType.value.ImportId !== undefined) {
        this._service.GetImportFileandColumnRelList_Serive(this.BranchId, this.CompanyId, ImportIDValue).subscribe((data: any) => {
          if (data != null && data != "" && data != undefined) {
            this.FiledList = data;
            this.FiledList = this.FiledList.sort((a: any, b: any) => a.FieldName.localeCompare(b.FieldName));
            this.filteredOptionsFieldName = this.f.FieldName.valueChanges
              .pipe(
                startWith<string | FieldNameList>(''),
                map(value => typeof value === 'string' ? value : value !== null ? value.FieldName : null),
                map(FieldName => FieldName ? this.filteredFieldName(FieldName) : this.FiledList.slice())
              );
            this.isLoading = false;
            this.chRef.detectChanges();
          }
          else {
            this.isLoading = false;
            this.chRef.detectChanges();
          }
        },
          (error) => {
            console.error(error);
          })
      }
      else {
        this.isLoading = false;
        this.chRef.detectChanges();
      }
    }
  }


  // Select or Choose dropdown values
  displayFnImportType(name: ImportDynami): string {
    return name && name.ImportType ? name.ImportType : '';
  }

  ImportTypeValidation() {
    this.submitted = false;
    if ((this.f.ImportType.value === null || this.f.ImportType.value.ImportId === '' || this.f.ImportType.value.ImportId === undefined || this.f.ImportType.value.ImportId === null)) {
      this.InvalidImportType = true;
      this.isLoading = false;
      this.submitted = false;
      return;
    }
    else {
      this.InvalidImportType = false;
    }
    this.submitted = false;
    this.chRef.detectChanges();
  }

  // Get Import type List
  GetImportTypeList() {
    this._service.getImportTypeList_Service().subscribe(
      (data: any) => {
        this.ImportTypeList = data;
        this.ImportTypeList = this.ImportTypeList.sort((a: any, b: any) => a.ImportType.localeCompare(b.ImportType));
        this.ImportTypeArray = this.f.ImportType.valueChanges
          .pipe(
            startWith<string | ImportDynami>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.ImportType : null),
            map(ImportType => ImportType ? this.filterImportType(ImportType) : this.ImportTypeList.slice())
          );
        this.chRef.detectChanges();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Autocomplete Search Filter
  private filterImportType(name: string): ImportDynami[] {
    this.InvalidImportType = false;
    const filterValue = name.toLowerCase();
    return this.ImportTypeList.filter((option: any) =>
      option.ImportType.toLowerCase().includes(filterValue));
  }

  OnFiledNameChaneChange() {
    debugger
    this.isLoading = true;
    if (this.f.FieldName.value !== undefined && this.f.FieldName.value !== null && this.f.FieldName.value !== "") {
      let ImpIdValue: number;
      if (this.pageState === AppCode.saveString) {
        ImpIdValue = this.f.FieldName.value.ImpId;
      }
      else {
        ImpIdValue = this.f.FieldName.value.pkId;
      }
      this._service.OnChangeColFieldList_Serive(this.BranchId, this.CompanyId, ImpIdValue).subscribe((data: any) => {
        if (data != null && data != "" && data != undefined) {
          this.FiledList = data;
          this.FiledList = this.FiledList.sort((a: any, b: any) => a.ColumnDatatype.localeCompare(b.ColumnDatatype));
          this.filteredautoColumnDatatype = this.f.ColumnDatatype.valueChanges
            .pipe(
              startWith<string | FieldNameList>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.ColumnDatatype : null),
              map(ColumnDatatype => ColumnDatatype ? this.filteredColumnDatatype(ColumnDatatype) : this.FiledList.slice())
            );
          this.isLoading = false;
          this.chRef.detectChanges();
        }
        else {
          this.isLoading = false;
          this.chRef.detectChanges();
        }
      },
        (error) => {
          console.error(error);
        })
    }
  }

  // Autocomplete Search Filter
  private filteredFieldName(name: string): FieldNameList[] {
    this.InvalidFieldName = false;
    const filterValue = name.toLowerCase();
    return this.FiledList.filter((option: any) =>
      option.FieldName.toLowerCase().includes(filterValue))
  }

  // Autocomplete Search Filter
  private filteredColumnDatatype(name: string): FieldNameList[] {
    debugger
    this.InvalidColumnDatatype = false;
    const filterValue = name.toLowerCase();
    return this.FiledList.filter((option: any) =>
      option.ColumnDatatype.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnFieldName(fieldName: FieldNameList): string {
    return fieldName && fieldName.FieldName ? fieldName.FieldName : '';
  }

  // Select or Choose dropdown values
  displayFnColumnDatatype(columnDatatype: FieldNameList): string {
    return columnDatatype && columnDatatype.ColumnDatatype ? columnDatatype.ColumnDatatype : '';
  }

  FieldNameValidation() {
    this.submitted = false;
    if ((this.f.FieldName.value === '' || this.f.FieldName.value === null || this.f.FieldName.value === undefined)) {
      this.InvalidFieldName = true;
      this.submitted = false;
      return;
    } else {
      this.InvalidFieldName = false;
    }
    this.submitted = false;
    this.chRef.detectChanges();
  }


  ColumnDataValidation() {
    this.submitted = false;
    if ((this.f.ColumnDatatype.value === null || this.f.ColumnDatatype.value.ImportId === '' || this.f.ColumnDatatype.value.ImportId === undefined || this.f.ColumnDatatype.value.ImportId === null)) {
      this.InvalidColumnDatatype = true;
      this.isLoading = false;
      this.submitted = false;
      return;
    }
    else {
      this.InvalidColumnDatatype = false;
    }
    this.submitted = false;
    this.chRef.detectChanges();
  }

  // Get Threshold value List
  GetImportDynaList() {
    this.isLoading = true;
    this._service.GetImportDyna_Service(this.BranchId, this.CompanyId).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.DataSource.data = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
      } else {
        this.DataSource.data = [];
      }
      this.isLoading = false;
      this.chRef.detectChanges();
    });
  }

  ClearForm() {
    this.submitted = false;
    this.ImportDynamicallytitle = "Import Dynamically Data";
    this.pageState = AppCode.saveString;
    this.f.Branch.enable();
    this.f.Company.enable();
    this.f.ImportType.enable();
    this.f.FieldName.enable();
    this.f.ColumnDatatype.enable();
    this.ImportDynamicallyForm.reset();
    this.f.Branch.setValue('');
    this.f.Company.reset();
    this.f.ImportType.setValue('');
    this.f.FieldName.setValue('');
    this.f.ColumnDatatype.setValue('');
    this.f.ExcelName.setValue('');
    this.InvalidBranch = false;
    this.InvalidCompany = false;
    this.InvalidFieldName = false;
    this.InvalidColumnDatatype = false;
    this.InvalidFieldName = false;
    this.InvalidImportType = false;
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  SaveImportedData() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.ImportDynamicallyForm.valid) {
      this.InvalidCompany = false;
      this.InvalidBranch = false;
      this.InvalidFieldName = false;
      this.InvalidColumnDatatype = false;
      this.InvalidFieldName = false;
      this.InvalidImportType = false;
      this.isLoading = false;
    }
    else {
      if (this.InvalidCompany === false && this.InvalidBranch === false && this.InvalidFieldName === false && this.InvalidColumnDatatype === false &&
        this.InvalidFieldName === false && this.InvalidImportType === false) {
        this.importDynamicSaveModel = new ImportDynamicSaveModel();
        this.importDynamicSaveModel.BranchId = this.f.Branch.value.BranchId;
        this.importDynamicSaveModel.CompId = this.f.Company.value.CompanyId;
        this.importDynamicSaveModel.ImpFor = this.f.ImportType.value.ImportType;
        this.importDynamicSaveModel.FieldName = this.f.FieldName.value.FieldName;
        this.importDynamicSaveModel.ColumnDatatype = this.f.ColumnDatatype.value.ColumnDatatype;
        this.importDynamicSaveModel.ExcelColName = this.f.ExcelName.value;
        this.importDynamicSaveModel.Addedby = this.UserId;
        if (this.pageState == AppCode.saveString) { // add
          this.importDynamicSaveModel.pkId = 0;
          this.importDynamicSaveModel.Action = AppCode.addString;
        } else { // edit
          this.importDynamicSaveModel.pkId = this.pkId;
          this.importDynamicSaveModel.Action = AppCode.editString;
        }
        this._service.ImportDynaSave_Service(this.importDynamicSaveModel).subscribe((data: any) => {
          if (data > 0) {
            if (this.pageState === AppCode.saveString) {
              this.toaster.success(AppCode.msg_saveSuccess);
            } else {
              this.toaster.success(AppCode.msg_updateSuccess);
            }
            this.ClearForm();
            this.GetImportDynaList();
            this.InvalidBranch = false;
            this.InvalidCompany = false;
            this.InvalidFieldName = false;
            this.InvalidColumnDatatype = false;
            this.InvalidFieldName = false;
            this.InvalidImportType = false;
          }
          else {
            this.toaster.warning(AppCode.msg_exist);
            this.ClearForm();
            this.GetImportDynaList();
          }
        },
          (error) => {
            console.error(error)
            this.isLoading = false;
          })

      }
      this.isLoading = false;
      this.chRef.detectChanges();
    }
  }

  EditData(row: ImportDynamicSaveModel) {
    debugger
    this.isLoading = true;
    this.pageState = AppCode.updateString;
    this.ImportDynamicallytitle = 'Update Import Dynalically ';
    this.pkId = row.pkId;
    this.f.Company.disable();
    this.f.Branch.disable();
    let s: any = {
      'CompanyId': row.CompId,
      'CompanyName': row.CompanyName
    }
    this.f.Company.setValue(s);
    let b: any = {
      'BranchId': row.BranchId,
      'BranchName': row.BranchName
    }
    this.f.Company.setValue(s);
    this.f.Branch.setValue(b);
    this.f.ImportType.disable();
    let p: any = {
      'pkId': row.pkId,
      'ImportType': row.ImpFor,
    }
    this.f.ImportType.setValue(p);
    this.f.FieldName.disable();
    let f: any = {
      'pkId': row.pkId,
      'FieldName': row.FieldName,
    }
    this.f.FieldName.setValue(f);
    this.f.ColumnDatatype.disable();
    let c: any = {
      'pkId': row.pkId,
      'ColumnDatatype': row.ColumnDatatype,
    }
    this.f.ColumnDatatype.setValue(c);
    this.f.ExcelName.setValue(row.ExcelColName);
    this.InvalidCompany = false;
    this.InvalidBranch = false;
    this.InvalidFieldName = false;
    this.InvalidColumnDatatype = false;
    this.InvalidFieldName = false;
    this.InvalidImportType = false;
    this.isLoading = false;
    this.submitted = false;
    this.chRef.detectChanges();
  }

  DeleteData(row: ImportDynamicSaveModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Sure!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.importDynamicSaveModel = new ImportDynamicSaveModel();
        this.importDynamicSaveModel.pkId = row.pkId;
        this.importDynamicSaveModel.BranchId = row.BranchId;
        this.importDynamicSaveModel.CompId = row.CompId
        this.importDynamicSaveModel.ImpFor = row.ImpFor;
        this.importDynamicSaveModel.FieldName = row.FieldName;
        this.importDynamicSaveModel.ColumnDatatype = row.ColumnDatatype;
        this.importDynamicSaveModel.ExcelColName = row.ExcelColName;
        this.importDynamicSaveModel.Addedby = this.UserId;
        this.importDynamicSaveModel.Action = AppCode.deleteString;
        this._service.ImportDynaSave_Service(this.importDynamicSaveModel)
          .subscribe((data: any) => {
            if (data > 0) {
              this.toaster.success(AppCode.msg_deleteSuccess);
              this.GetImportDynaList();
              this.isLoading = false;
            }
            else {
              this.toaster.error(AppCode.FailStatus);
              this.isLoading = false;
              this.chRef.detectChanges();
            }
          }, (error) => {
            console.error(error);
            this.isLoading = false;
            this.submitted = false;
            this.chRef.detectChanges();
          });
      }
    });
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase();
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }


}
