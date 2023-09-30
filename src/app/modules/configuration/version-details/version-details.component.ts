import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Angular Material Imported Added
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

// Models
import { VersionDetailsModel } from '../models/version-details-model';

// Services
import { AppCode } from '../../../app.code';
import { ConfigurationService } from '../Services/configuration.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-version-details',
  templateUrl: './version-details.component.html',
  styleUrls: ['./version-details.component.scss']
})
export class VersionDetailsComponent implements OnInit {
  versionDetailsTitle: string = "";
  searchModel: string = "";
  displayedColumnsForApi = ['SrNo', 'VersionNo', 'VersionDate'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  versionDetailsForm: FormGroup;
  defaultform: any = {
    NewVersionNumber: '',
    VersionReleaseDate: ''
  };
  pageState: string = '';
  maxDate = new Date();
  isLoading: boolean = false;
  submitted = false;
  BranchId: number = 0;
  CompanyId: number = 0;
  UserId: number = 0;
  RoleId: number = 0;
  versionDetailsModel: VersionDetailsModel;
  versionCheckDataModel: any;

  constructor(private fb: FormBuilder, private _service: ConfigurationService,
              private toaster: ToastrService, private chef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.versionDetailsTitle = "Add Version Details";
    this.pageState = AppCode.saveString;
    this.initForm();
    let obj = AppCode.getUser();
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.UserId = obj.UserId;
    this.RoleId = obj.RoleId;
    this.getVersionDetailsList();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.versionDetailsForm.controls;
  }

  initForm() {
    this.versionDetailsForm = this.fb.group({
      NewVersionNumber: [
        this.defaultform.NewVersionNumber,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ],
      VersionReleaseDate: [
        this.defaultform.VersionReleaseDate,
        Validators.compose([
          Validators.required
        ])
      ]
    });
  }

  // Version Details List
  getVersionDetailsList() {
    this.isLoading = true;
    this._service.GetVersionDetails_Service()
        .subscribe((res: any) => {
          if (res.length > 0) {
            this.DataSource = new MatTableDataSource<any>();
            this.DataSource.data = res;
            this.DataSource.paginator = this.paginator;
            this.DataSource.sort = this.Sort;
          } else {
            this.DataSource.data = [];
          }
          this.isLoading = false;
          this.chef.detectChanges();
        }, (error: any) => {
          console.error("Error:  " + JSON.stringify(error));
          this.isLoading = false;
          this.chef.detectChanges();
        });
  }

  // To Check Version Number
  onCheckVersionNo() {
    // Version Number version string length 7 validation
    if (this.f.NewVersionNumber.value.length <= 7) {
      if (this.f.NewVersionNumber.value !== "" && this.f.NewVersionNumber.value !== undefined && this.f.NewVersionNumber.value !== null) {
        this.isLoading = true;
        this.versionCheckDataModel = {
          VersionNo: this.f.NewVersionNumber.value
        }
        this._service.CheckVersionNo_Service(this.versionCheckDataModel)
            .subscribe((data: any) => {
              if (data !== null) {
                if (data.Flag === -1) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'This Version Number already exists with ' + data.VersionNo,
                  });
                }
              }
              this.isLoading = false;
              this.chef.detectChanges();
            }, (error: any) => {
              console.error(error);
              this.isLoading = false;
              this.chef.detectChanges();
            });
      } else {
        this.isLoading = false;
        this.chef.detectChanges();
      }
    } else {
      this.toaster.warning("Version Number only 7 characters allow");
      this.chef.detectChanges();
    }
  }

  // Add/Edit Version Details
  SaveVersionDetails() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.versionDetailsForm.valid) {
      this.isLoading = false;
      return;
    } else {
      this.versionDetailsModel = new VersionDetailsModel();
      this.versionDetailsModel.VersionNo = this.f.NewVersionNumber.value;
      this.versionDetailsModel.VersionDateTime = AppCode.createDateAsUTC(new Date(this.f.VersionReleaseDate.value));
      if (this.pageState === AppCode.saveString) {
        this.versionDetailsModel.VersionId = 0;
      }
      this._service.SaveVersionDetails_Service(this.versionDetailsModel)
          .subscribe((res: any) => {
            if (res !== "") {
              if (this.pageState === AppCode.saveString) {
                this.toaster.success(AppCode.msg_saveSuccess);
              }
              this.onClearFields();
            } else {
              this.toaster.error(AppCode.FailStatus);
            }
            this.getVersionDetailsList();
          }, (error: any) => {
            console.error("Error:  " + JSON.stringify(error));
            this.isLoading = false;
            this.chef.detectChanges();
          });
    }
  }

  // Cancel button clicks that fields are cleared
  onClearFields() {
    this.versionDetailsTitle = "Add Version Details";
    this.pageState = AppCode.saveString;
    this.versionDetailsForm.reset();
    this.submitted = false;
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
