import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { AppCode } from '../../../app.code';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AccountModuleService } from '../Services/account-module.service';

export class headTypeModal {
  pkId: number = 0;
  BranchId: number = 0;
  HeadName: string = '';
  HeadTypeId: number = 0;
  HeadType: string = '';
  MasterName: string = '';
  Action: string = '';
  IsActiveStatus: string = '';
  Addedby: string = '';
  AddedOn: Date = new Date();
  LastUpdatedOn: Date = new Date();
}

@Component({
  selector: 'app-head-master',
  templateUrl: './head-master.component.html',
  styleUrls: ['./head-master.component.scss']
})
export class HeadMasterComponent implements OnInit {

  headmasterForm: FormGroup;
  pageState: string = ' ';
  isLoading: boolean = false;
  InvalidHeadTypeName: boolean = false;
  HeadTypeList: any = [];
  HeadTypeListArray: Observable<headTypeModal[]>;
  headTypeModal: headTypeModal = new headTypeModal();
  searchModel: any;
  HeadMasterList: any = [];
  BranchId: number = 0;
  UserId: number = 0;
  HeadTititle: any;
  pkId: number = 0;
  HeadName: string = "";
  HeadType: string = "";
  submitted = false;

  displayedColumnsForHeadMasterAPI = ['SrNo', 'HeadName', 'HeadType', 'IsActiveStatus', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();

  constructor(private fb: FormBuilder, private _service: MastersServiceService, private chef: ChangeDetectorRef,
    private tostr: ToastrService, private accountService: AccountModuleService) {
  }

  ngOnInit(): void {
    this.pageState = 'Save';
    this.HeadTititle = 'Add Head Master Form '
    this.FormInitilization();
    this.GetHeadTypeList();
    let obj = AppCode.getUser();
    this.BranchId = obj.BranchId;
    this.UserId = obj.RoleId;
    this.GetHeadMasterList();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.headmasterForm.controls;
  }

  FormInitilization() {
    this.headmasterForm = this.fb.group({
      HeadName: ['',
        Validators.required
      ],
      HeadType: ['',
        Validators.required
      ],
    });
  }

  //save head master data
  SaveheadmasterData() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.headmasterForm.valid) {
      this.isLoading = false;
      this.InvalidHeadTypeName = false;
      return;
    }
    else {
      if (this.InvalidHeadTypeName === false) {
        this.headTypeModal = new headTypeModal();
        this.headTypeModal.BranchId = this.BranchId;
        this.headTypeModal.HeadName = this.f.HeadName.value;
        this.headTypeModal.HeadTypeId = this.f.HeadType.value.pkId;
        this.headTypeModal.IsActiveStatus = AppCode.IsActiveString;
        this.headTypeModal.Addedby = String(this.UserId)
        if (this.pageState == AppCode.saveString) {
          this.headTypeModal.pkId = 0;
          this.headTypeModal.Action = AppCode.addString;
        }
        else {
          this.headTypeModal.pkId = this.pkId;
          this.headTypeModal.Action = AppCode.editString;
        }
        this.accountService.SaveHeadMaster_Service(this.headTypeModal)
          .subscribe((data: any) => {
            if (data > 0) {
              if (this.pageState == AppCode.saveString) {
                this.tostr.success(AppCode.msg_saveSuccess);
              } else {
                this.tostr.success(AppCode.msg_updateSuccess);
              }
              this.ClearForm();
              this.GetHeadMasterList();
              this.InvalidHeadTypeName = false;
              this.isLoading = false;
              this.submitted = false;
              this.chef.detectChanges();
            } else if (data === -1) {
              this.tostr.warning(AppCode.msg_exist);
              this.isLoading = false;
              this.chef.detectChanges();
            } else {
              this.tostr.error(AppCode.FailStatus, data);
              this.ClearForm();
              this.GetHeadMasterList();
            }
          },
            (error) => {
              console.error(error);
            })
      }
      else {
        this.tostr.warning(AppCode.msg_AllotFail);
        this.isLoading = false;
        this.InvalidHeadTypeName = true;
      }
    }
  }

  //clear input field data on cancel button or after save and update
  ClearForm() {
    this.HeadTititle = 'Add Head Master Form';
    this.headTypeModal.Action = AppCode.addString;
    this.pageState = AppCode.saveString;
    this.InvalidHeadTypeName = false;
    this.headmasterForm.reset();
    this.GetHeadMasterList();
    this.GetHeadTypeList();
    this.submitted = false;
  }

  // Get Head Type List from (General master)
  GetHeadTypeList() {
    this._service.GetGeneralMasterList_Service(AppCode.headType, AppCode.allString)
      .subscribe(
        (data: any) => {
          this.HeadTypeList = data.GeneralMasterParameter;
          this.HeadTypeList = this.HeadTypeList.sort((a: any, b: any) => a.MasterName.localeCompare(b.MasterName));
          this.HeadTypeListArray = this.f.HeadType.valueChanges
            .pipe(
              startWith<string | headTypeModal>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.MasterName : null),
              map(MasterName => MasterName ? this.filterheadType(MasterName) : this.HeadTypeList.slice()
              ));
          this.chef.detectChanges();
        },
        (error) => {
          console.error(error);
        });
  }

  // Autocomplete Search Filter
  private filterheadType(name: any): headTypeModal[] {
    this.InvalidHeadTypeName = false;
    const filterValue = name.toLowerCase();
    return this.HeadTypeList.filter((option: any) =>
      option.MasterName.toLowerCase().includes(filterValue));
  }

  // Select or Choose dropdown values
  displayFnHeadType(ht: headTypeModal): string {
    return ht && ht.MasterName ? ht.MasterName : '';
  }

  //if enter invalid data in dropdown field
  HeadTypeValidation() {
    this.submitted = false;
    if ((this.f.HeadType.value.pkId === '' || this.f.HeadType.value.pkId === null || this.f.HeadType.value.pkId === undefined)) {
      this.InvalidHeadTypeName = true;
      this.submitted = false;
      return;
    } else {
      this.InvalidHeadTypeName = false;
    }
  }

  // EDIT DATA ROW WISE (UPDATE)
  EditData(row: headTypeModal) {
    this.isLoading = true;
    this.pageState = AppCode.updateString;
    this.HeadTititle = 'Update Head Master';
    this.pkId = row.pkId;
    let obj: any = {
      'pkId': row.HeadTypeId,
      'MasterName': row.HeadType
    }
    this.f.HeadType.setValue(obj);
    this.f.HeadName.setValue(row.HeadName);
    this.isLoading = false;
    this.chef.detectChanges();
  }

  // ACTIVE AND DEACTIVE STATUS
  ChangeStatus(row: headTypeModal) {
    this.isLoading = true;
    this.headTypeModal = new headTypeModal();
    this.headTypeModal.Action = AppCode.statusString;
    this.headTypeModal.pkId = row.pkId;
    this.headTypeModal.Addedby = String(this.UserId);
    if (row.IsActiveStatus == AppCode.IsActiveString) {
      this.headTypeModal.IsActiveStatus = AppCode.IsInActiveString;
    }
    else {
      this.headTypeModal.IsActiveStatus = AppCode.IsActiveString;
    }
    this.accountService.SaveHeadMaster_Service(this.headTypeModal).subscribe((data: any) => {
      if (data > 0) {
        this.GetHeadMasterList();
        this.GetHeadTypeList();
        this.ClearForm();
        this.tostr.success(AppCode.msg_stsChange);
        this.isLoading = false;
        this.chef.detectChanges();
      }
    },
      (error) => {
        console.error(error);
        this.isLoading = false;
      })
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chef.detectChanges();
  }

  // Get Head Master List
  GetHeadMasterList() {
    this.isLoading = true;
    this.accountService.GetHeadMasterList_Service(this.BranchId).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
        this.HeadMasterList = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
        this.isLoading = false;
        this.chef.detectChanges();
      } else {
        this.DataSource.data = [];
        this.isLoading = false;
        this.chef.detectChanges();
      }
    });
  }

}
