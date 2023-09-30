import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransporterParentModel } from '../Models/TransporterModel';
import { MastersServiceService } from '../Services/masters-service.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-transport-parent-master',
  templateUrl: './transport-parent-master.component.html',
  styleUrls: ['./transport-parent-master.component.scss']
})
export class TransportParentMasterComponent implements OnInit {

  Title: string = "";
  UserId: number = 0;
  BranchId: number = 0;
  transporterParentForm: FormGroup;
  submitted = false;
  IsEmailFlag: boolean = true;
  IsFlag: boolean = true;
  isLoading = false;
  pageState: string = '';
  displayedColumnsForApi = ['SrNo', 'ParentTranspNo', 'ParentTranspName', 'ParentTranspEmail', 'ParentTranspMobNo', 'GSTNumber', 'TDSPer', 'IsActive', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  Transporterparentmodel: TransporterParentModel;
  searchModel: string = '';
  Tid: number = 0;
  GST: string = '';
  TDS: string = '';
  InvalidGSTNumber: boolean = false;
  IsInvalidMobile: boolean = false;
  RowWisedata: any;
  InputValue: any;
  IsGSTNumber: boolean = false;
  ISTDSCheckboxClick: boolean = false;
  ISGstCheckboxClick: boolean = false;
  IsGSTChecked: boolean = false;
  IsTDSChecked: boolean = true;


  constructor(
    private fb: FormBuilder,
    private commoncode: AppCode,
    private chef: ChangeDetectorRef,
    private toaster: ToastrService,
    private _appCode: AppCode,
    private _MastersServiceService: MastersServiceService,
  ) { }

  defaultform: any = {
    ParentTranspNo: '',
    ParentTranspName: '',
    ParentTranspEmail: '',
    ParentTranspMobNo: '',
    TDSPer: '',
    IsGST: '',
    GSTNumber: '',
    IsTDS: '',
  };

  ngOnInit(): void {
    this.Title = 'Transporter Parent Master';
    this.pageState = 'Save';
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.initForm();
    this.GetTransporterParentList();
    this.ISTDSCheckboxClick = true;
    this.ISGstCheckboxClick = true;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.transporterParentForm.controls;
  }

  initForm() {
    this.transporterParentForm = this.fb.group({
      ParentTranspNo: [
        this.defaultform.ParentTranspNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      ParentTranspName: [
        this.defaultform.ParentTranspName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      ParentTranspEmail: [
        this.defaultform.ParentTranspEmail,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]),
      ],
      ParentTranspMobNo: [
        this.defaultform.ParentTranspMobNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(22)
        ]),
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
      IsTDS: [
        this.defaultform.IsTDS,
      ]
    });
  }
  numberValidation(event: any) {
    this.commoncode.numberOnly(event);
  }
  // Alpha Number
  GstValidation(event: any) {
    this.commoncode.keyPressAlphanumeric(event);
  }
  // Validation Mobile No
  mobileNoValidation(event: any) {
    this.commoncode.numberonlyandcomma(event);
  }

  GetTransporterParentList() {
    this.isLoading = true;
    this._MastersServiceService.GetTransporterParentList_Service(this.BranchId, AppCode.allString).subscribe((data: any) => {
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

  SaveTransporter() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.transporterParentForm.valid) {
      this.isLoading = false;
      return;
    }
    else {
      if (this.IsInvalidMobile === false && this.IsGSTNumber === false && this.IsEmailFlag === true) {
        this.InvalidGSTNumber = false;
        this.Transporterparentmodel = new TransporterParentModel();
        this.Transporterparentmodel.ParentTranspNo = this.f.ParentTranspNo.value;
        this.Transporterparentmodel.ParentTranspName = this.f.ParentTranspName.value;
        this.Transporterparentmodel.ParentTranspEmail = this.f.ParentTranspEmail.value;
        this.Transporterparentmodel.ParentTranspMobNo = this.f.ParentTranspMobNo.value;
        // GST
        if (this.IsGSTChecked === true) {
          this.Transporterparentmodel.IsGST = 'Y';
          this.Transporterparentmodel.GSTNumber = this.f.GSTNumber.value;
          if (this.f.GSTNumber.value === "" || this.f.GSTNumber.value === undefined || this.f.GSTNumber.value === null || this.f.GSTNumber.value === " ") {
            this.toaster.warning('Please enter a GST number');
            this.isLoading = false;
            return;
          }
        } else {
          this.Transporterparentmodel.IsGST = 'N';
          this.Transporterparentmodel.GSTNumber = '';
        }
        // TDS
        if (this.IsTDSChecked === true) {
          this.Transporterparentmodel.IsTDS = 'Y';
          this.Transporterparentmodel.TDSPer = this.f.TDSPer.value;
          if (this.f.TDSPer.value === "" || this.f.TDSPer.value === undefined || this.f.TDSPer.value === null || this.f.TDSPer.value === " ") {
            this.toaster.warning('Please enter a TDS Per ');
            this.isLoading = false;
            return;
          }
        } else {
          this.Transporterparentmodel.IsTDS = 'N';
          this.Transporterparentmodel.TDSPer = 0;
        }


        if (this.pageState == AppCode.saveString) {
          this.Transporterparentmodel.Action = AppCode.addString;
          this.Transporterparentmodel.Tid = 0;
        }
        else {
          this.Transporterparentmodel.Action = AppCode.editString;
          this.Transporterparentmodel.Tid = this.Tid;
        }
        this.Transporterparentmodel.BranchId = this.BranchId;
        this.Transporterparentmodel.Addedby = String(this.UserId);
        this._MastersServiceService.SaveTransporterParent_Service(this.Transporterparentmodel)
          .subscribe((data: any) => {
            if (data === 1) {
              if (this.pageState == AppCode.saveString) {
                this.toaster.success(AppCode.msg_saveSuccess);
                this.GetTransporterParentList();
                this.ClearForm();
                this.ISGstCheckboxClick = true;
                this.ISTDSCheckboxClick = true;
              } else {
                this.toaster.success(AppCode.msg_updateSuccess);
                this.GetTransporterParentList();
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
  // EDIT DATA ROW WISE (UPDATE)
  EditData(row: TransporterParentModel) {
    this.RowWisedata = row;
    this.isLoading = true;
    this.IsGSTChecked = false;
    this.IsTDSChecked = false;
    this.ISGstCheckboxClick = false;
    this.ISTDSCheckboxClick = false;
    this.pageState = AppCode.updateString;
    this.Title = 'Update Transporter Parent';
    this.pageState = 'Update';
    this.Tid = row.Tid;
    this.f.ParentTranspNo.disable();
    this.f.ParentTranspNo.setValue(row.ParentTranspNo);
    this.f.ParentTranspName.setValue(row.ParentTranspName);
    this.f.ParentTranspEmail.setValue(row.ParentTranspEmail);
    this.f.ParentTranspMobNo.setValue(row.ParentTranspMobNo);
    // this.f.TDSPer.setValue(row.TDSPer);
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

  ChangeStatus(row: TransporterParentModel) {
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
        this.isLoading = true;
        this.Transporterparentmodel = new TransporterParentModel();
        this.Transporterparentmodel.Addedby = String(this.UserId);
        this.Transporterparentmodel.BranchId = row.BranchId;
        this.Transporterparentmodel.Tid = row.Tid;
        if (row.IsActive == AppCode.IsActiveString) {
          this.Transporterparentmodel.IsActive = AppCode.IsInActiveString;
        }
        else {
          this.Transporterparentmodel.IsActive = AppCode.IsActiveString;
        }
        this.Transporterparentmodel.Action = AppCode.statusString;
        this._MastersServiceService.ChangeTransportStatus_Service(this.Transporterparentmodel)
          .subscribe((data: any) => {
            if (data === 1) {
              this.toaster.success(AppCode.msg_stsChange);
              this.GetTransporterParentList();
            }
          }, (error) => {
            console.error(error);
          });
      }
    });
  }


  onchange(event: any) {
    if (this.pageState === 'Save' && event === true) {
      this.IsGSTChecked = true;
      this.ISGstCheckboxClick = true;
      this.f.GSTNumber.setValue('');
    }
    else if (this.pageState === 'Save' && event === false) {
      this.IsGSTChecked = false;
      this.ISGstCheckboxClick = false;
      this.f.GSTNumber.setValue('');
    }
    if (this.pageState === 'Update' && event === false) {
      this.IsGSTChecked = false;
      this.ISGstCheckboxClick = false;
      this.GST = "";
    } else if (this.pageState === 'Update' && event === true) {
      this.f.GSTNumber.setValue(this.RowWisedata.GSTNumber);
      this.f.IsGST.setValue(this.RowWisedata.IsGST);
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
      this.f.IsTDS.setValue(this.RowWisedata.IsTDS);
      this.f.TDSPer.setValue(this.RowWisedata.TDSPer);
      this.IsTDSChecked = true;
      this.ISTDSCheckboxClick = true;
    }
    this.chef.detectChanges();
  }

  GSTNumberValidation() {
    this.submitted = false;
    if ((this.f.GSTNumber.value === '' || this.f.GSTNumber.value === undefined || this.f.GSTNumber.value === null)) {
      this.InvalidGSTNumber = true;
      this.isLoading = false;
      return;
    }
    else {
      this.InvalidGSTNumber = false;
    }
  }

  // Validation Email
  emailValidation() {
    let flag: boolean = false;
    if (this.f.ParentTranspEmail.value === "") {
      this.IsFlag = false;
      this.IsEmailFlag = true;
      this.submitted = false;
      this.chef.detectChanges();
    } else {
      flag = this._appCode.emailAddressOnly(this.f.ParentTranspEmail.value.toLowerCase());
      if (flag === true) {
        this.IsEmailFlag = true;
        this.IsFlag = true;
        this.submitted = false;
        this.chef.detectChanges();
      } else {
        this.IsEmailFlag = false;
        this.IsFlag = true;
        this.submitted = true;
        this.chef.detectChanges();
      }
    }
  }

  ClearForm() {
    this.f.ParentTranspNo.enable();
    this.f.TDSPer.setValue('');
    this.pageState = 'Save';
    this.Title = 'Transporter Parent Master';
    this.submitted = false;
    this.isLoading = false;
    this.ISTDSCheckboxClick = true;
    this.ISGstCheckboxClick = true;
    this.IsGSTChecked = true;
    this.IsTDSChecked = true;
    this.transporterParentForm.reset();
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

  // To Avoid Copy Paste For Mobile
  public CopyPasteMblNotSpelcharAllow() {
    let NewFlag: boolean = false;
    if (this.f.ParentTranspMobNo.value === "") {
      this.IsInvalidMobile = false;
    }
    else {
      NewFlag = this._appCode.Copynumberonlyandcomma(this.f.ParentTranspMobNo.value);
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


  //To Avoid Copy Paste Text In Textbox In GST
  copyPastNumbeAllow() {
    let NewFlag: boolean = false;
    if (this.f.GSTNumber.value === "") {
      this.IsGSTNumber = false;
    }
    else {
      NewFlag = this.commoncode.PanCradSplChNotAllow(this.f.GSTNumber.value);
      if (NewFlag === true) {
        this.IsGSTNumber = true
      }
      else {
        this.IsGSTNumber = false;
      }
      this.submitted = false;
      this.chef.detectChanges();
    }
  }


}
