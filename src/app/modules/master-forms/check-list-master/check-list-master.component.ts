import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppCode } from '../../../app.code';
import { ChecklistMasterModel } from '../Models/ChecklistMasterModel';
import { MastersServiceService } from '../Services/masters-service.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-check-list-master',
  templateUrl: './check-list-master.component.html',
  styleUrls: ['./check-list-master.component.scss']
})

export class CheckListMasterComponent implements OnInit {

  CheckListMasterDetails = ['SrNo', 'CompanyName', 'BranchName', 'Questions', 'ControlType', 'SequenceNo', 'Status', 'Actions'];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();

  checkListmasterForm: FormGroup;
  CompanyId: number = 0;
  BranchId: number = 0;
  UserId: number = 0;
  pageState: string = '';
  ListTitle: string = "";
  AddTitle: string = "";
  isLoading: boolean = false;
  submitted: boolean = false;
  Invalidcompany: boolean = false;
  InvalidControlType: boolean = false;
  Questions: string = "";
  ControlType: string = "";
  SequenceNo: number = 0;
  searchModel: any;
  CompanyList: any[] = [];
  ChecklistTypeId: number = 0;
  BranchList: any = [];
  InvalidBranch: boolean = false;

  filteredCompany: Observable<ChecklistMasterModel[]>;
  ControlTypeListArray: Observable<ControlTypeModel[]>;
  filteredOptBranch: Observable<ChecklistMasterModel[]>;

  ControlTypeList: ControlTypeModel[] = [];
  CheckListList: any = [];
  checklistModel: ChecklistMasterModel

  //default form
  defaultform: any = {
    CompanyName: '',
    Questions: '',
    ControlType: '',
    SequenceNo: '',
    Branch: '',
  }

  constructor(private fb: FormBuilder, private toastr: ToastrService, private chngref: ChangeDetectorRef,
    private _service: MastersServiceService, private commoncode: AppCode) {
    this.ControlTypeList = [
      { ControlTypeId: "Check Box", ControlTypeName: "Check Box" },
      { ControlTypeId: "Text Box", ControlTypeName: "Text Box" }
    ];
  }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.AddTitle = "Add Checklist Master";
    this.ListTitle = "List View";
    this.pageState = "Save";
    this.initForm();
    this.GetCompanyList();
    this.GetBranchList();

    if (this.UserId !== 1) {
      let objCompany = {
        'CompanyName': obj.CompanyName,
        'CompanyId': obj.CompanyId
      }
      this.f.CompanyName.setValue(objCompany);
      this.f.CompanyName.disable();

      let objBranch = {
        'BranchName': obj.BranchName,
        'BranchId': obj.BranchId
      }
      this.f.Branch.setValue(objBranch);
      this.f.Branch.disable();
    }
    this.GetCheckListMasterList();
    this.GetControlTypeList();
  }

  //controller return
  get f(): { [key: string]: AbstractControl } {
    return this.checkListmasterForm.controls;
  }

  //form control declaration
  initForm() {
    this.checkListmasterForm = this.fb.group({
      CompanyName: [
        this.defaultform.CompanyName,
        Validators.compose([
          Validators.required])
      ],
      Branch: [
        this.defaultform.Branch,
        Validators.compose([
          Validators.required])
      ],
      Questions: [
        this.defaultform.Questions,
        Validators.compose([
          Validators.required,
          Validators.maxLength(1000)])
      ],
      ControlType: [
        this.defaultform.ControlType,
        Validators.compose([
          Validators.required])
      ],
      SequenceNo: [
        this.defaultform.SequenceNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)])
      ],
    });
  }

  //Save Checklist Master Data
  SaveChecklistMaster() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.checkListmasterForm.valid) {
      this.Invalidcompany = false;
      this.InvalidControlType = false;
      this.InvalidBranch = false;
      this.isLoading = true;
    } else {
      if (this.Invalidcompany === false && this.InvalidBranch === false) {
        this.checklistModel = new ChecklistMasterModel();
        this.checklistModel.CompId = this.f.CompanyName.value.CompanyId;
        this.checklistModel.BranchId = this.f.Branch.value.BranchId;
        this.checklistModel.QuestionName = this.f.Questions.value;
        this.checklistModel.ControlType = this.f.ControlType.value.ControlTypeId;
        this.checklistModel.SeqNo = this.f.SequenceNo.value;
        this.checklistModel.IsActive = AppCode.IsActiveString;
        if (this.pageState == AppCode.saveString) { // add
          if (this.f.SequenceNo.value !== '' && this.f.SequenceNo.value !== null) {
            if (this.f.SequenceNo.value <= 0) {
              this.toastr.warning('Sequence No must be greater than 0!');
              return;
            }
          }
          this.checklistModel.ChecklistTypeId = 0;
          this.checklistModel.Action = AppCode.addString;
        } else { // edit
          this.checklistModel.CompId = this.CompanyId;
          this.checklistModel.ChecklistTypeId = this.ChecklistTypeId;
          this.checklistModel.Action = AppCode.editString;
        }
        this.checklistModel.Addedby = String(this.UserId);
        this._service.SaveChecklist_Service(this.checklistModel).subscribe((data: any) => {
          if (data > 0) {
            if (this.pageState === AppCode.saveString) {
              this.toastr.success(AppCode.msg_saveSuccess);
            } else {
              this.toastr.success(AppCode.msg_updateSuccess);
            }
            this.ClearForm();
            this.GetCheckListMasterList();
          }
          else {
            this.toastr.warning(AppCode.msg_AllotFail);
            this.ClearForm();
            this.GetCheckListMasterList();
          }
        },
          (error) => {
            console.error(error)
            this.isLoading = false;
          })
      }
      else {
        this.toastr.error(AppCode.FailStatus);
        this.isLoading = false;
      }
    }

  }

  // Validation Mobile No.
  numberValidation(event: any) {
    this.commoncode.numberOnly(event);
  }

  //Edit data row wise (Update)
  EditData(row: ChecklistMasterModel) {
    this.pageState = AppCode.updateString;
    this.AddTitle = "Update Checklist Master";
    this.ChecklistTypeId = row.ChecklistTypeId;
    let objCompany = {
      'CompanyName': row.CompanyName,
      'CompId': row.CompanyId
    }
    this.f.CompanyName.setValue(objCompany);
    this.f.CompanyName.disable();

    let objBranch = {
      'BranchName': row.BranchName,
      'BranchId': row.BranchId
    }
    this.f.Branch.setValue(objBranch);
    this.f.Branch.disable();

    this.f.Questions.setValue(row.QuestionName);
    let objControlType = {
      'ControlTypeName': row.ControlType,
      'ControlTypeId': row.ControlType
    }
    this.f.ControlType.setValue(objControlType);
    this.f.SequenceNo.setValue(row.SeqNo);
    this.chngref.detectChanges();
  }

  //clear form
  ClearForm() {
    this.AddTitle = "Add Checklist Master";
    if (this.UserId === 1) {
      this.checkListmasterForm.reset();
      this.f.CompanyName.enable();
      this.f.Branch.enable();
    } else {
      this.f.Questions.setValue('');
      this.f.ControlType.setValue('');
      this.f.SequenceNo.setValue('');
    }
    this.pageState = AppCode.saveString;
    this.isLoading = false;
    this.submitted = false;
    this.Invalidcompany = false;
    this.InvalidControlType = false;
    this.InvalidBranch = false;
    this.chngref.detectChanges();
  }

  //get checklist master list
  GetCheckListMasterList() {
    this.isLoading = true;
    this._service.GetCheckList_Service(this.BranchId, this.CompanyId, AppCode.allString).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
      } else {
        this.DataSource.data = [];
      }
      this.isLoading = false;
      this.chngref.detectChanges();
      (error: any) => {
        console.log(error);
        this.isLoading = false;
        this.chngref.detectChanges();
      }
    })
  }

  // check Sequence No is available
  onSequenceNoChange() {
    if (this.f.SequenceNo.value !== null && this.f.SequenceNo.value !== undefined && this.f.SequenceNo.value !== "") {
      this._service.getSequenceNoChange_Service(this.f.SequenceNo.value, this.BranchId, this.CompanyId)
        .subscribe((data: any) => {
          if (data !== null) {
            if (data.Flag == -1) {
              // Swal.fire({
              //   icon: 'warning',
              //   title: 'Oops...',
              //   text: 'This Sequence No  ' + data.SeqNo + '  is already exists with   ' + data.QuestionName + '  \n Do you want to update',
              // });
              Swal.fire({
                title: 'Are you sure?',
                text: 'This Sequence No  ' + data.SeqNo + '  is already exists with   ' + data.QuestionName + '  \n Do you want to continue',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes,Sure'
              }).then((result) => {
                if (result.isDismissed) {
                  this.f.SequenceNo.setValue('');
                }
              });
            }
            this.chngref.detectChanges();
          }
        }, (error) => {
          console.error(error);
          this.chngref.detectChanges();
        });
    }
  }

  // Get Company List
  GetCompanyList() {
    this._service.getCompanyList_Service(AppCode.IsActiveString).subscribe(
      (data: any) => {
        this.CompanyList = data;
        this.CompanyList = this.CompanyList.sort((a: any, b: any) => a.CompanyName.localeCompare(b.CompanyName));
        this.filteredCompany = this.f.CompanyName.valueChanges
          .pipe(
            startWith<string | ChecklistMasterModel>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.CompanyName : null),
            map(CompanyName => CompanyName ? this.filterCompany(CompanyName) : this.CompanyList.slice())
          );
        this.chngref.detectChanges();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Autocomplete Search Filter
  private filterCompany(name: string): ChecklistMasterModel[] {
    const filterValue = name.toLowerCase();
    return this.CompanyList.filter((option: any) =>
      option.CompanyName.toLowerCase().includes(filterValue))
  }

  //Select or Choose dropdown values
  displayFnCompany(company: ChecklistMasterModel): string {
    return company && company.CompanyName ? company.CompanyName : '';
  }

  //Company Name Validation
  CompanyNameValidation() {
    this.submitted = false;
    if ((this.f.CompanyName.value.CompanyId === '' || this.f.CompanyName.value.CompanyId === null || this.f.CompanyName.value.CompanyId === undefined)) {
      this.Invalidcompany = true;
      return;
    } else {
      this.Invalidcompany = false;
    }
    this.chngref.detectChanges();
  }

  // Get controlType List
  GetControlTypeList() {
    this.ControlTypeList = this.ControlTypeList.sort((a: any, b: any) => a.ControlTypeName.localeCompare(b.ControlTypeName));
    this.ControlTypeListArray = this.f.ControlType.valueChanges
      .pipe(
        startWith<string | ControlTypeModel>(''),
        map(value => typeof value === 'string' ? value : value !== null ? value.ControlTypeName : null),
        map(ControlTypeName => ControlTypeName ? this.filterControlType(ControlTypeName) : this.ControlTypeList.slice())
      );
    this.chngref.detectChanges();
  }

  // Autocomplete Search Filter
  private filterControlType(name: string): ControlTypeModel[] {
    const filterValue = name.toLowerCase();
    return this.ControlTypeList.filter((option: any) =>
      option.ControlTypeName.toLowerCase().includes(filterValue))
  }

  //Select or Choose dropdown values
  displayFnControlType(Controltype: ControlTypeModel): string {
    return Controltype && Controltype.ControlTypeName ? Controltype.ControlTypeName : '';
  }

  //Control Type Validation
  ControlTypeValidation() {
    if ((this.f.ControlType.value.ControlTypeId === "" || this.f.ControlType.value.ControlTypeId === null || this.f.ControlType.value.ControlTypeId === undefined)) {
      this.InvalidControlType = true;
      return;
    } else {
      this.InvalidControlType = false;
    }
    this.chngref.detectChanges();
  }

  // Get Branch List
  GetBranchList() {
    this._service.getBranchList_Service(AppCode.IsActiveString).subscribe(
      (data: any) => {
        this.BranchList = data;
        this.BranchList = this.BranchList.sort((a: any, b: any) => a.BranchName.localeCompare(b.BranchName));
        this.filteredOptBranch = this.f.Branch.valueChanges
          .pipe(
            startWith<string | ChecklistMasterModel>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.BranchName : null),
            map(BranchName => BranchName ? this.filterBranch(BranchName) : this.BranchList.slice())
          );
        this.chngref.detectChanges();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Autocomplete Search Filter
  private filterBranch(name: string): ChecklistMasterModel[] {
    this.InvalidBranch = false;
    const filterValue = name.toLowerCase();
    return this.BranchList.filter((option: any) =>
      option.BranchName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnBranch(brnc: ChecklistMasterModel): string {
    return brnc && brnc.BranchName ? brnc.BranchName : '';
  }

  //Branch Validation
  BranchValidation() {
    this.submitted = false;
    if ((this.f.Branch.value.BranchId === "" || this.f.Branch.value.BranchId === null || this.f.Branch.value.BranchId === undefined)) {
      this.InvalidBranch = true;
      return;
    } else {
      this.InvalidBranch = false;
    }
    this.chngref.detectChanges();
  }

  //chnage status active deactive
  ChangeStatus(row: ChecklistMasterModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to change status?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.checklistModel = new ChecklistMasterModel();
        this.checklistModel.ChecklistTypeId = row.ChecklistTypeId;
        this.checklistModel.Action = AppCode.statusString;
        if (row.IsActive == AppCode.IsActiveString) {
          this.checklistModel.IsActive = AppCode.IsInActiveString;
        } else {
          this.checklistModel.IsActive = AppCode.IsActiveString;
        }
        this._service.SaveChecklist_Service(this.checklistModel)
          .subscribe((data: any) => {
            if (data > 0) {
              this.toastr.success(AppCode.msg_stsChange);
            } else {
              this.toastr.warning(AppCode.msg_AllotFail);
            }
            this.GetCheckListMasterList();;
          }, (error) => {
            console.error(error);
            this.chngref.detectChanges();
          });
      }
    })
  }

  //delete data row wise
  DeleteStatus(row: ChecklistMasterModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.checklistModel = new ChecklistMasterModel();
        this.checklistModel.ChecklistTypeId = row.ChecklistTypeId;
        this.checklistModel.Action = AppCode.deleteString;
        this._service.SaveChecklist_Service(this.checklistModel)
          .subscribe((data: any) => {
            if (data > 0) {
              this.toastr.success(AppCode.msg_deleteSuccess);
            } else {
              this.toastr.warning(AppCode.msg_AllotFail);
            }
            this.GetCheckListMasterList();;
          }, (error) => {
            console.error(error);
            this.chngref.detectChanges();
          });
      }
    })
  }

  //Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chngref.detectChanges(); //IMMEDIATE ACTION FIRED
  }

}

// controlType model
export class ControlTypeModel {
  ControlTypeId: string = '';
  ControlTypeName: string = '';
}
