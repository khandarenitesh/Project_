import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TransporterParentModel } from '../Models/TransporterModel';
import { MastersServiceService } from '../Services/masters-service.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { matrowselected } from '../branch-company-relation/branch-company-relation.component';

@Component({
  selector: 'app-transport-parent-mapping',
  templateUrl: './transport-parent-mapping.component.html',
  styleUrls: ['./transport-parent-mapping.component.scss']
})
export class TransportParentMappingComponent implements OnInit {
  Title: string = "";
  UserId: number = 0;
  BranchId: number = 0;
  transporterParentMappingForm: FormGroup;
  submitted = false;
  IsEmailFlag: boolean = true;
  isLoading = false;
  pageState: string = '';
  displayedColumnsForApi = ['Select', 'TransporterNo', 'TransporterName', 'TransporterMobNo', 'TransporterEmail', 'CityName'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  public DataSources = new MatTableDataSource<any>()
  Transporterparentmodel: TransporterParentModel;
  searchModel: string = '';
  Tid: number = 0;
  TransporterList: any[] = [];
  TransportNameArray: Observable<TransporterParentModel[]>;
  InvalidTransporterName: boolean = false;
  selectedrows: matrowselected[] = [];
  TransportorNameList: any[] = [];
  selectedTransporterList: any[] = [];
  ParentTransporterList: any[] = [];
  defaultform: any = {
    ParentTransporterName: '',
  };

  constructor(private fb: FormBuilder, private chef: ChangeDetectorRef, private toaster: ToastrService, private _MastersServiceService: MastersServiceService) { }

  ngOnInit(): void {
    this.Title = 'Transporter Parent Mapping';
    this.pageState = 'Save';
    this.initForm();
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.GetTransporterNameList();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.transporterParentMappingForm.controls;
  }

  initForm() {
    this.transporterParentMappingForm = this.fb.group({
      ParentTransporterName: [
        this.defaultform.ParentTransporterName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
    });
  }

  GetTransporterList() {
    this.isLoading = true;
    this._MastersServiceService.getGetTransporterList_Service(AppCode.allString, AppCode.allString,this.BranchId).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.DataSources.data = data;
        this.DataSources.paginator = this.paginator;
        this.DataSources.sort = this.Sort;
      } else {
        this.DataSources.data = [];
      }
      this.isLoading = false;
      this.chef.detectChanges();
    });
  }

  SaveTransporter() {
    this.isLoading = true;
    this.submitted = true;
    var arrRole = [];
    if (!this.transporterParentMappingForm.valid) {
      this.isLoading = false;
      return;
    } else {
      if (this.InvalidTransporterName === false) {
        this.Transporterparentmodel = new TransporterParentModel();
        this.Transporterparentmodel.Tid = this.f.ParentTransporterName.value.Tid;
        arrRole.push(this.selectedrows);
        arrRole.forEach((element: any) => {
          for (var i = 0; i < element.length; i++) {
            this.Transporterparentmodel.TransporterId += element[i].TransporterId + ",";
          }
        });
        if (this.pageState == AppCode.saveString) {
          this.Transporterparentmodel.Action = AppCode.addString;
        }
        else {
          this.Transporterparentmodel.Action = AppCode.editString;
        }
        this.Transporterparentmodel.Addedby = String(this.UserId);
        this.Transporterparentmodel.BranchId = this.BranchId;
        this._MastersServiceService.SaveTransportParentMapping_Service(this.Transporterparentmodel)
          .subscribe((data: any) => {
            if (data > 0) {
              if (this.pageState === AppCode.saveString) {
                this.toaster.success(AppCode.msg_saveSuccess);
                this.transporterParentMappingForm.reset();
              } else {
                this.toaster.success(AppCode.msg_updateSuccess);
              }
              this.ClearForm();
            } else if (data === AppCode.ExistsStatus) {
              this.toaster.warning(AppCode.msg_exist);
            } else {
              this.toaster.error(AppCode.FailStatus);
              this.DataSource.data = [];
              this.transporterParentMappingForm.reset();
            }
            this.isLoading = false;
            this.chef.detectChanges();
          }, (error: any) => {
            console.error(error);
            this.isLoading = false;
            this.chef.detectChanges();
          }
          )
      }
      else {
        this.toaster.error(AppCode.FailStatus);
        this.isLoading = false;
        this.chef.detectChanges();
      }
    }
  }

  getCheckboxesData() {
    this.selectedrows = this.DataSource.data.filter((value, index) => {
      return value.Checked
    });
    this.chef.detectChanges();
  }

  OnChangeTransport() {
    let TpidValue: number;
    if ((this.f.ParentTransporterName.value != "" && this.f.ParentTransporterName.value != null)) {
      TpidValue = this.f.ParentTransporterName.value.Tid;
    }
    else {
      TpidValue = 0
    }
    if (TpidValue !== 0) {
      this._MastersServiceService.GetParentTransportMappedList_Service(TpidValue, AppCode.IsActiveString)
        .subscribe((data: any) => {
          this.ParentTransporterList = data;
          this.selectedTransporterList = [];
          this.DataSource.data = [];
          this.selectedrows = [];
          this.selectedrows = data.filter((row: any) => (row.Checked === 1));
          this.selectedTransporterList = this.ParentTransporterList;
          this.DataSource.paginator = this.paginator;
          this.DataSource.data = this.selectedTransporterList;
          this.chef.detectChanges();
        }, (error: any) => {
          console.error(error);
          this.chef.detectChanges();
        });
    }
  }

  GetTransporterNameList() {
    this._MastersServiceService.GetTransporterParentList_Service(this.BranchId, AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.TransporterList = data;
          this.TransporterList = this.TransporterList.sort((a: any, b: any) => a.ParentTranspName.localeCompare(b.ParentTranspName));
          this.TransportNameArray = this.f.ParentTransporterName.valueChanges
            .pipe(
              startWith<string | TransporterParentModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.ParentTranspName : null),
              map(ParentTranspName => ParentTranspName ? this.filterTransporterName(ParentTranspName) : this.TransporterList.slice())
            );
          this.chef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  private filterTransporterName(name: string): TransporterParentModel[] {
    this.InvalidTransporterName = false;
    const filterValue = name.toLowerCase();
    return this.TransporterList.filter((option: any) => option.ParentTranspName.toLowerCase().includes(filterValue));
  }

  displayFnTransporterName(name: TransporterParentModel): string {
    return name && name.ParentTranspName ? name.ParentTranspName : '';
  }

  TransporterValidation() {
    this.submitted = false;
    if ((this.f.ParentTransporterName.value === '' || typeof this.f.ParentTransporterName.value === 'string' || this.f.ParentTransporterName.value === undefined || this.f.ParentTransporterName.value === null)) {
      this.InvalidTransporterName = true;
      this.selectedrows = [];
      this.isLoading = false;
      return;
    } else {
      this.InvalidTransporterName = false;
    }
  }

  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase();
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chef.detectChanges();
  }

  ClearForm() {
    this.transporterParentMappingForm.reset();
    this.DataSource.data = [];
    this.GetTransporterNameList();
    this.chef.detectChanges();
  }

}
