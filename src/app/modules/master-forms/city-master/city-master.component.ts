import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CityMaster } from '../Models/city-master.model';
import { AppCode } from 'src/app/app.code';

//Services
import { ToastrService } from 'ngx-toastr';
import { MastersServiceService } from '../Services/masters-service.service';

// Angular Mat Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-city-master',
  templateUrl: './city-master.component.html',
  styleUrls: ['./city-master.component.scss']
})

export class CityMasterComponent implements OnInit {
  CityMasterDetails = ['SrNo', 'CityCode', 'CityName', 'StateName', 'Status', 'Actions'];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();



  //Autocomplete
  filteredOptRegion: Observable<CityMaster[]>;
  InvalidRegion: boolean = false;

  RegionList: any = [];
  form: FormGroup;
  citymasterForm: FormGroup;
  pageState: string = '';
  ListTitle: string = "";
  isLoading: boolean = false;
  submitted: boolean = false;
  CityMaster: CityMaster;
  StateCode: number = 0;
  CityName: string = "";
  CityList: any = [];
  UserId: number = 0;
  CityCode: number = 0;
  CityMasterTitle: string = '';
  searchModel: string = '';

  defaultform: any = {
    Region: '', //State Name
    CityName: '',
  }

  constructor(private fb: FormBuilder, private _service: MastersServiceService, private chRef: ChangeDetectorRef, private toaster: ToastrService,
    private _appCode: AppCode) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.ListTitle = "List View";
    this.pageState = AppCode.saveString;
    this.CityMasterTitle = 'Add City Master';
    this.initForm();
    this.GetStateList(); //ON PAGE LOAD BIND STATE LIST TO DROPDOWN
    this.GetCityList(); //SHOW MASTER LIST ON PAGE (TABLE)
  }

  get f(): { [key: string]: AbstractControl } {
    return this.citymasterForm.controls;
  }

  initForm() {
    this.citymasterForm = this.fb.group({
      //for State name
      Region: [
        this.defaultform.Region,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      CityName: [
        this.defaultform.CityName,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
    });
  }

  //Get State List
  GetStateList() {
    this.isLoading = true;
    this._service.getRegionList_Service(AppCode.allString).subscribe(
      (data: any) => {
        this.RegionList = data.GetStateParameter;
        this.RegionList = this.RegionList.sort((a:any, b:any) => a.StateName.localeCompare(b.StateName));
        this.filteredOptRegion = this.f.Region.valueChanges
          .pipe(
            startWith<string | CityMaster>(''),
            map(value => typeof value === 'string' ? value :
              value !== null ? value.StateName : null),
            map(StateName => StateName ? this.filterRegion(StateName) :
              this.RegionList.slice())
          );
        this.isLoading = false;
        this.chRef.detectChanges();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Autocomplete Search Filter for region
  private filterRegion(name: string): CityMaster[] {
    this.InvalidRegion = false;
    const filterValue = name.toLowerCase();
    return this.RegionList.filter((option: any) =>
      option.StateName.toLowerCase().includes(filterValue) ||
      option.StateCode.toLocaleLowerCase().includes(filterValue))
  }

  // select or choose dropdown for region
  displayFnRegion(Region: CityMaster): string {
    return Region && Region.StateName ? Region.StateName : '';
  }

  //Get city list
  GetCityList() {
    this._service.getCityList_Service(AppCode.allString, AppCode.allString, AppCode.allString)
      .subscribe((data: any) => {
        this.CityList = data.GetCityParameter;
        this.DataSource.data = this.CityList; //To Bind Table values
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
        this.chRef.detectChanges();
      }, (error) => {
        console.error(error);
        this.chRef.detectChanges();
      });
  }

  //Save City Master
  SaveCityMaster() {
    this.isLoading = true;
    this.submitted = true;
    this.InvalidRegion = false;
    if (!this.citymasterForm.valid) {
      this.isLoading = false;
      return;
    }
    else {
      this.CityMaster = new CityMaster();
      this.CityMaster.StateCode = this.f.Region.value.StateCode;
      // this.CityMaster.StateName = this.f.Region.value.StateName;
      this.CityMaster.CityName = this.f.CityName.value;
      this.CityMaster.ActiveFlag = AppCode.IsActiveString;
      if (this.pageState == AppCode.saveString) {
        this.CityMaster.CityCode = 0;
        this.CityMaster.Action = AppCode.addString;
      }
      else {
        this.CityMaster.CityCode = this.CityCode;
        this.CityMaster.Action = AppCode.editString;
      }
      this.CityMaster.Addedby = String(this.UserId);
      this._service.SaveCityMaster_Service(this.CityMaster).subscribe((data: any) => {
        if (data === AppCode.SuccessStatus) {
          if (this.pageState === AppCode.saveString) {
            this.toaster.success(AppCode.msg_saveSuccess);
          } else {
            this.toaster.success(AppCode.msg_updateSuccess);
          }
          this.ClearForm();
          this.GetCityList();
          this.chRef.detectChanges();
        }
        else if (data === AppCode.ExistsStatus) {
          // this.toaster.warning(AppCode.msg_exist);
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'This City  Name already exists with ' + this.f.CityName.value,
          });
          this.isLoading = false;
          this.chRef.detectChanges();
        } else {
          this.toaster.error(data);
          this.ClearForm();
          this.GetCityList();
        }
      },
        (error) => {
          console.error(error);
        })
    }
  }

  //Valid data For State
  statevalidation() {
    this.submitted = false;
    if ((this.f.Region.value.StateName === '' || this.f.Region.value.StateName === null || this.f.Region.value.StateName === undefined)) {
      this.InvalidRegion = true;
      return;
    } else {
      this.InvalidRegion = false;
    }
  }

  //EDIT DATA ROW WISE (UPDATE)
  EditData(row: CityMaster) {
    this.pageState = AppCode.updateString;
    this.CityMasterTitle = 'Update City Master';
    this.f.Region.disable();
    this.StateCode = row.StateCode;
    let s: any = {
      'StateCode': row.StateCode,
      'StateName': row.StateName
    }
    this.f.Region.setValue(s);
    this.CityCode = row.CityCode;
    this.f.CityName.setValue(row.CityName);
    this.chRef.detectChanges();
  }

  //CLEAR MODEL
  ClearForm() {
    this.f.Region.enable();
    this.pageState = AppCode.saveString;
    this.CityMasterTitle = 'Add City Master';
    this.citymasterForm.reset();
    this.isLoading = false;
    this.submitted = false;
    this.InvalidRegion = false;
    this.chRef.detectChanges();
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  //Change Status Active Deactive
  ChangeStatus(row: CityMaster) {
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
        this.CityMaster = new CityMaster();
        this.CityMaster.CityCode = row.CityCode;
        this.CityMaster.Action = AppCode.statusString;
        if (row.ActiveFlag == AppCode.IsActiveString) {
          this.CityMaster.ActiveFlag = AppCode.IsInActiveString;
        } else {
          this.CityMaster.ActiveFlag = AppCode.IsActiveString;
        }
        this._service.SaveCityMaster_Service(this.CityMaster)
          .subscribe((data: any) => {
            if (data === AppCode.StatusChangedStatus) {
              this.toaster.success(AppCode.msg_stsChange);
            }
            this.GetCityList();
          }, (error) => {
            console.error(error);
            this.chRef.detectChanges();
          });
      }
    })
  }
}
