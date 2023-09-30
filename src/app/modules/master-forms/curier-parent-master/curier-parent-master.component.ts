import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppCode } from '../../../app.code';
import { MatTableDataSource } from '@angular/material/table';
import { CourierParentModel } from '../Models/curier-add';
import { MastersServiceService } from '../Services/masters-service.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-curier-parent-master',
  templateUrl: './curier-parent-master.component.html',
  styleUrls: ['./curier-parent-master.component.scss']
})
export class CurierParentMasterComponent implements OnInit {

  //DataSource
  public DataSource = new MatTableDataSource<any>();
  displayedColumnsForApi = ['SrNo', 'ParentCourName', 'ParentCourEmail', 'ParentCourMobNo','TDSPer', 'GSTNumber', 'IsActive', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;

  // Declaration
  Title: string = "";
  GST: string = '';
  TDS: string = '';
  searchModel: string = '';
  pageState: string = '';
  UserId: number = 0;
  BranchId: number = 0;
  Tid: number = 0;
  Cpid: number = 0;
  CourierParentForm: FormGroup;
  submitted = false;
  isLoading = false;
  IsEmailFlag: boolean = true;
  IsFlag: boolean = true;
  InvalidGSTNumber: boolean = false;
  Courierparentmodel: CourierParentModel;
  rowWisedata: any;
  ISTDSCheckboxClick: boolean = false;
  ISGstCheckboxClick: boolean = false;
  IsGSTChecked: boolean = false;
  IsTDSChecked: boolean = true;

  // Default Form
  defaultform: any = {
    ParentCourName: '',
    ParentCourEmail: '',
    ParentCourMobNo: '',
    IsTDS: '',
    TDSPer: '',
    IsGST: '',
    GSTNumber: ''
  };

  IsInvalidMobile: boolean = false;
  IsFlagGst: boolean = true;
  IsInvalidGSTNo: boolean = true;

  constructor(private _appCode: AppCode, private fb: FormBuilder, private chef: ChangeDetectorRef, private commoncode: AppCode,
    private _MastersServiceService: MastersServiceService, private toaster: ToastrService) { }

  //Page Load
  ngOnInit(): void {
    this.Title = 'Courier Parent Master'
    this.pageState = 'Save';
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.initForm();
    this.GetCourierParentList();
    this.ISGstCheckboxClick = true;
    this.ISTDSCheckboxClick = true;

  }
  get f(): { [key: string]: AbstractControl } {
    return this.CourierParentForm.controls;
  }

  //Init For For All Controllers
  initForm() {
    this.CourierParentForm = this.fb.group({
      ParentCourName: [
        this.defaultform.ParentCourName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      ParentCourEmail: [
        this.defaultform.ParentCourEmail,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]),
      ],
      ParentCourMobNo: [
        this.defaultform.ParentCourMobNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(22),
        ]),
      ],
      IsTDS: [
        this.defaultform.IsTDS,
      ],
      TDSPer: [
        this.defaultform.TDSPer,
        Validators.compose([
          Validators.maxLength(50),
        ]),
      ],
      IsGST: [
        this.defaultform.IsGST,
      ],
      GSTNumber: [
        this.defaultform.GSTNumber,
      ],
    });
  }

  // Validation Email
  emailValidation() {
    this.submitted = true;
    let flag: boolean = false;
    if (this.f.ParentCourEmail.value === "") {
      this.IsFlag = false;
      this.IsEmailFlag = true;
      this.submitted = false;
      this.chef.detectChanges();
    } else {
      flag = this._appCode.emailAddressOnly(this.f.ParentCourEmail.value.toLowerCase());
      if (flag === true) {
        this.IsEmailFlag = true;
        this.IsFlag = true;
        this.submitted = false;
        this.chef.detectChanges();
      } else {
        this.IsEmailFlag = false;
        this.IsFlag = true;
        this.submitted = false;
        this.chef.detectChanges();
      }
    }
  }

  // To Avoid Copy Paste For Mobile
  public CopyPasteMblNotSpelcharAllow() {
    let NewFlag: boolean = false;
    if (this.f.ParentCourMobNo.value === "") {
      this.IsInvalidMobile = false;
    }
    else {
      NewFlag = this._appCode.Copynumberonlyandcomma(this.f.ParentCourMobNo.value);
      if (NewFlag === true) {
        this.IsInvalidMobile = true;
      }
      else {
        this.IsInvalidMobile = false;
      }
      this.submitted = false;
      this.chef.detectChanges();
    }
  }

  //Copy Paste GST
  copyPastGSTNoNumbeAllow() {
    let NewFlag: boolean = false;
    if (this.f.GSTNumber.value === "") {
      this.IsFlagGst = false;
      this.IsInvalidGSTNo = true;
    }
    else {
      NewFlag = this._appCode.GSTSplChNotAllow(this.f.GSTNumber.value);
      if (NewFlag === true) {
        this.IsInvalidGSTNo = true
        this.IsFlagGst = true;
      }
      else {
        this.IsInvalidGSTNo = false;
        this.IsFlagGst = true;
      }
      this.submitted = false;
      this.chef.detectChanges();
    }
  }

  // Number validation
  numberValidation(event: any) {
    this.commoncode.numberOnly(event);
  }

  // Validation Mobile No
  mobileNoValidation(event: any) {
    this.commoncode.numberonlyandcomma(event);
  }

  // Alpha Number
  GstValidation(event: any) {
    this.commoncode.keyPressAlphanumeric(event);
  }

  //On click IsGst checkbox
  onchangeIsGstCheckBox(event: any) {
    if (this.pageState === "Save" && event === true) {
      this.IsGSTChecked = true
      this.ISGstCheckboxClick = true;
      this.f.GSTNumber.setValue('');
    }
    else if (this.pageState === 'Save' && event === false) {
      this.IsGSTChecked = false;
      this.ISGstCheckboxClick = true;
      this.f.GSTNumber.setValue('');
    }
    if (this.pageState === 'Update' && event === false) {
      this.IsGSTChecked = false;
      this.ISGstCheckboxClick = false;
      this.GST = "";
    }
    else if (this.pageState === 'Update' && event === true) {
      this.f.IsGST.setValue(this.rowWisedata.IsGST);
      this.f.GSTNumber.setValue(this.rowWisedata.GSTNumber);
      this.IsGSTChecked = true;
      this.ISGstCheckboxClick = true;
    }
    this.chef.detectChanges();
  }

  onchangeTDS(event: any) {
    if (this.pageState === 'Save' && event === true) {
      this.IsTDSChecked = true;
      this.ISTDSCheckboxClick = true;
      this.f.TDSPer.setValue('');
    }
    else if (this.pageState === 'Save' && event === false) {
      this.IsTDSChecked = false;
      this.ISTDSCheckboxClick = false;
      this.f.TDSPer.setValue('');
    }
    if (this.pageState === 'Update' && event === false) {
      this.IsTDSChecked = false;
      this.ISTDSCheckboxClick = false;
      this.TDS = "";
    } else if (this.pageState === 'Update' && event === true) {
      this.f.IsTDS.setValue(this.rowWisedata.IsTDS);
      this.f.TDSPer.setValue(this.rowWisedata.TDSPer);
      this.IsTDSChecked = true;
      this.ISTDSCheckboxClick = true;
    }
    this.chef.detectChanges();
  }

  //Get Courier Parent List
  GetCourierParentList() {
    this.isLoading = true;
    this._MastersServiceService.GetParentCourierList_Service(this.BranchId, AppCode.allString).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.DataSource.data = data;
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

  // Save Corier Parent Master
  SaveCourier() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.CourierParentForm.valid) {
      this.isLoading = false;
      return;
    }
    else {
      if (this.IsInvalidGSTNo === true && this.IsInvalidMobile === false) {
        this.InvalidGSTNumber = false;
        this.Courierparentmodel = new CourierParentModel();
        this.Courierparentmodel.ParentCourierName = this.f.ParentCourName.value;
        this.Courierparentmodel.ParentCourierEmail = this.f.ParentCourEmail.value;
        this.Courierparentmodel.ParentCourierMobNo = this.f.ParentCourMobNo.value;
        this.Courierparentmodel.TDSPer = this.f.TDSPer.value;
        // GST 
        if (this.IsGSTChecked === true) {
          this.Courierparentmodel.IsGST = 'Y';
          this.Courierparentmodel.GSTNumber = this.f.GSTNumber.value;
          if (this.f.GSTNumber.value === "" || this.f.GSTNumber.value === null || this.f.GSTNumber.value === undefined || this.f.GSTNumber.value === " ") {
            this.toaster.warning('Please enter a GST number');
            this.isLoading = false;
            return;
          }
        } else {
          this.Courierparentmodel.IsGST = 'N';
          this.Courierparentmodel.GSTNumber = '';
        }
        // TDS
        if (this.IsTDSChecked === true) {
          this.Courierparentmodel.IsTDS = 'Y';
          this.Courierparentmodel.TDSPer = this.f.TDSPer.value;
          if (this.f.TDSPer.value === "" || this.f.TDSPer.value === undefined || this.f.TDSPer.value === null || this.f.TDSPer.value === " ") {
            this.toaster.warning('Please enter a TDS Per ');
            this.isLoading = false;
            return;
          }
        } else {
          this.Courierparentmodel.IsTDS = 'N';
          this.Courierparentmodel.TDSPer = 0;
        }

        if (this.pageState == AppCode.saveString) {
          this.Courierparentmodel.Action = AppCode.addString;
          this.Courierparentmodel.Cpid = 0;
        } else {
          this.Courierparentmodel.Action = AppCode.editString;
          this.Courierparentmodel.Cpid = this.Cpid
        }
        this.Courierparentmodel.BranchId = this.BranchId;
        this.Courierparentmodel.Addedby = String(this.UserId);
        this._MastersServiceService.SaveCourierParent_Service(this.Courierparentmodel)
          .subscribe((data: any) => {
            if (data === 1) {
              if (this.pageState == AppCode.saveString) {
                this.toaster.success(AppCode.msg_saveSuccess);
                this.submitted = false;
                this.isLoading = false; //
                this.GetCourierParentList();
                this.ClearForm();
                this.ISGstCheckboxClick = true;
                this.ISTDSCheckboxClick = true;
              } else {
                this.toaster.success(AppCode.msg_updateSuccess);
                this.isLoading = false; //
                this.GetCourierParentList();
                this.ClearForm();
                this.ISGstCheckboxClick = true;
                this.ISTDSCheckboxClick = true;
              }
            } else if (data === -1) {
              this.toaster.warning(AppCode.msg_exist);
              this.isLoading = false;
              this.chef.detectChanges();
            } else {
              this.toaster.error(AppCode.FailStatus);
            }
          }, (error) => {
            console.error(error);
            this.chef.detectChanges();
          });
      }
      else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
      }
    }
  }

  // Edit The Data Row Wise
  EditData(row: CourierParentModel) {
    this.rowWisedata = row;
    this.isLoading = true;
    this.IsGSTChecked = false;
    this.IsTDSChecked = false;
    this.ISGstCheckboxClick = false;
    this.ISTDSCheckboxClick = false;
    this.pageState = AppCode.updateString;
    this.Title = 'Update Parent Courier';
    this.pageState = 'Update';
    this.Cpid = row.Cpid;
    this.f.ParentCourName.setValue(row.ParentCourierName);
    this.f.ParentCourEmail.setValue(row.ParentCourierEmail);
    this.f.ParentCourMobNo.setValue(row.ParentCourierMobNo);
    //this.f.TDSPer.setValue(row.TDSPer);
    if (row.IsGST === 'Y') {
      this.IsGSTChecked = true;
      this.ISGstCheckboxClick = true;
      this.ISTDSCheckboxClick = true;
      this.f.IsGST.setValue(row.IsGST);
      this.f.GSTNumber.setValue(row.GSTNumber);
      this.f.GSTNumber.enable();
      this.GST = (row.IsGST);
    } else {
      this.IsGSTChecked = false;
      this.ISGstCheckboxClick = false;
      this.ISTDSCheckboxClick = false;
      this.f.GSTNumber.enable();
      this.f.IsGST.setValue('');
      this.GST = (row.IsGST);
    }
    if (row.IsTDS === 'Y') {
      this.IsTDSChecked = true;
      this.f.IsTDS.setValue(row.IsTDS);
      this.f.TDSPer.setValue(row.TDSPer);
      this.f.TDSPer.enable();
      this.TDS = (row.IsTDS);
    } else {
      this.IsTDSChecked = false;
      this.f.IsTDS.setValue('');
      this.TDS = (row.IsTDS);
    }

    this.isLoading = false;
    this.chef.detectChanges();
  }


  //Change Status Row Wise
  ChangeStatus(row: CourierParentModel) {
    Swal.fire({
      title: 'Are you Sure?',
      text: "Do you want to change status?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.Courierparentmodel = new CourierParentModel();
        this.Courierparentmodel.Addedby = String(this.UserId);
        this.Courierparentmodel.BranchId = row.BranchId;
        this.Courierparentmodel.Cpid = row.Cpid;
        if (row.IsActive === AppCode.IsActiveString) {
          this.Courierparentmodel.IsActive = AppCode.IsInActiveString;
        }
        else {
          this.Courierparentmodel.IsActive = AppCode.IsActiveString;
        }
        this.Courierparentmodel.Action = AppCode.statusString;
        this._MastersServiceService.SaveCourierParent_Service(this.Courierparentmodel)
          .subscribe((data: any) => {
            if (data === 1) {
              this.toaster.success(AppCode.msg_stsChange);
              this.GetCourierParentList();
            }
          }, (error) => {
            console.error(error);
          });
      }
    });
  }

  //Clear Form
  ClearForm() {
    this.f.TDSPer.setValue('');
    this.pageState = 'Save';
    this.Title = 'Courier Parent Master';
    this.submitted = false;
    this.isLoading = false;
    this.ISTDSCheckboxClick = true;
    this.ISGstCheckboxClick = true;
    this.IsGSTChecked = true;
    this.IsTDSChecked = true;
    this.CourierParentForm.reset();
    this.chef.detectChanges();
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

}
