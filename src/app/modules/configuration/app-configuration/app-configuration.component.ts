import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AppCode } from '../../../app.code';

import { AppConfiguration } from '../models/app-configuration.model';

import { ConfigurationService } from '../Services/configuration.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-app-configuration',
  templateUrl: './app-configuration.component.html',
  styleUrls: ['./app-configuration.component.scss'],
})
export class AppConfigurationComponent implements OnInit {
  appConfiguration: AppConfiguration;
  AppConfigForm: FormGroup;
  submitted = false;
  pageState: string = '';
  isLoading: boolean = false;
  Id: number = 0;
  defaultform: any = {
    Key: '',
    Value: '',
    Info: '',
  };
  appConfTitle: string = '';
  searchModel: string = '';
  displayedColumnsForApi = ['SrNo', 'Key', 'Value', 'Info', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();

  constructor(
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private _service: ConfigurationService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.appConfTitle = 'Add App Configuration';
    this.pageState = AppCode.saveString;
    this.initForm();
    this.GetAppConfigurationList(); //SHOW CONFIGURATION LIST ON PAGE (TABLE)
  }

  get f(): { [key: string]: AbstractControl } {
    return this.AppConfigForm.controls;
  }

  // VALIDATIONS
  initForm() {
    this.AppConfigForm = this.fb.group({
      Key: [
        this.defaultform.Key,
        Validators.compose([
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(50),
        ]),
      ],
      Value: [
        this.defaultform.Value,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      Info: [this.defaultform.Info],
    });
  }

  //GET APP CONFIGURATION LIST
  GetAppConfigurationList() {
    this.isLoading = true;
    this._service.GetAppConfigurationList_Service().subscribe((data: any) => {
      if (data != null && data != [] && data != '' && data != undefined) {
        this.DataSource.data = data.AppConfiParameter;
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

  // OPERATION ADD / EDIT
  SaveConfiguration() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.AppConfigForm.valid) {
      this.isLoading = false;
      return;
    } else {
      this.appConfiguration = new AppConfiguration();
      this.appConfiguration.Key = this.f.Key.value;
      this.appConfiguration.Value = this.f.Value.value;
      this.appConfiguration.Info = this.f.Info.value;
      if (this.pageState == AppCode.saveString) {
        this.appConfiguration.Id = 0;
        this.appConfiguration.Action = AppCode.addString;
      } else {
        this.appConfiguration.Id = this.Id;
        this.appConfiguration.Action = AppCode.editString;
      }
      this._service
        .SaveAppConfiguration_Service(this.appConfiguration)
        .subscribe(
          (data: any) => {
            if (data === AppCode.SuccessStatus) {
              if (this.pageState === AppCode.saveString) {
                this.toaster.success(AppCode.msg_saveSuccess);
              } else {
                this.toaster.success(AppCode.msg_updateSuccess);
              }
              this.ClearForm();
              this.GetAppConfigurationList();
            } else if (data === AppCode.ExistsStatus) {
              this.toaster.warning(AppCode.msg_exist);
            } else {
              this.toaster.error(data);
            }
            this.isLoading = false;
            this.chRef.detectChanges();
          },
          (error) => {
            console.error(error);
            this.isLoading = false;
            this.chRef.detectChanges();
          }
        );
    }
  }
  // EDIT DATA ROW WISE (UPDATE)
  EditData(row: AppConfiguration) {
    this.isLoading = true;
    this.pageState = AppCode.updateString;
    this.appConfTitle = 'Update App Configuration';
    this.f.Key.disable();
    this.Id = row.Id;
    this.f.Key.setValue(row.Key); // values set and assign fields
    this.f.Value.setValue(row.Value);
    this.f.Info.setValue(row.Info);
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // CLEAR
  ClearForm() {
    this.appConfiguration = new AppConfiguration();
    this.appConfiguration.Key = '';
    this.appConfiguration.Value = '';
    this.appConfiguration.Info = '';
    this.AppConfigForm.reset();
    this.pageState = AppCode.saveString;
    this.appConfTitle = 'Add App Configuration';
    this.f.Key.enable();
    this.chRef.detectChanges();
  }

  // SEARCH
  applyFilter() {
    this.isLoading = true;
    // this.searchModel = this.searchModel.trim();
    this.searchModel = this.searchModel.toLowerCase();
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges();
  }
}
