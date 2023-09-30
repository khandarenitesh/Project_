import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MastersServiceService } from '../Services/masters-service.service';
import { TaxModel } from '../../master-forms/Models/TaxModel';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AppCode } from '../../../app.code';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tax-master',
  templateUrl: './tax-master.component.html',
  styleUrls: ['./tax-master.component.scss']
})
export class TaxMasterComponent implements OnInit {

  displayedColumnsForApi = ['SrNo','GSTType','CGST','SGST', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();

  defaultform: any = {
    GSTType:'',
    CGSTPer: '',
    SGSTPer: ''
  };

  HeadTititle: string = '';
  pageState: string = '';
  TaxMasterForm: FormGroup;
  TaxList: any = [];
  Taxmodel: TaxModel;
  UserId: number = 0;
  isLoading: boolean = false;
  submitted = false;
  TaxId: number = 0;
  TaxName: string = '';
  TaxPer: number = 0;
  Addedby: string = "";
  searchModel: any;
  TaxNameArray: Observable<TaxModel[]>;

  constructor(
    private fb: FormBuilder,
    private _service: MastersServiceService,
    private chRef: ChangeDetectorRef,
    private toaster: ToastrService,
    private commoncode: AppCode,
  ) { }

  ngOnInit(): void {
    this.pageState = AppCode.saveString;
    this.HeadTititle = 'Add Tax Master';
    let obj = AppCode.getUser();
    this.UserId = obj.RoleId;
    this.initFormTaxMaster();
    this.GetTaxMasterList();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.TaxMasterForm.controls;
  }

  initFormTaxMaster() {
    this.TaxMasterForm = this.fb.group({
      GSTType: [
        this.defaultform.GSTType,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      CGSTPer: [
        this.defaultform.CGSTPer,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      SGSTPer: [
        this.defaultform.SGSTPer,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
    });
  }

  // Get Tax Master List
  GetTaxMasterList() {
    this.isLoading = true;
    this._service.getTaxList_Service().subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = data;
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

  numberValidation(event: any) {
    this.commoncode.numberOnly(event);
  }

  // Save Tax Master data
  SaveTaxMasterData() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.TaxMasterForm.valid) {
      this.isLoading = false;
      return;
    }
    else {
      this.Taxmodel = new TaxModel();
      this.Taxmodel.GSTType = this.f.GSTType.value;
      this.Taxmodel.CGST = this.f.CGSTPer.value;
      this.Taxmodel.SGST = this.f.SGSTPer.value;
      this.Taxmodel.Addedby = String(this.UserId);
      if (this.pageState == AppCode.saveString) {
        this.Taxmodel.TaxId = 0;
        this.Taxmodel.Action = AppCode.addString;
      }
      else {
        this.Taxmodel.TaxId = this.TaxId;
        this.Taxmodel.Action = AppCode.editString;
      }
      this._service.AddEditTax_Service(this.Taxmodel)
        .subscribe((data: any) => {
          if (data > 0 ) {
            if (this.pageState == AppCode.saveString) {
              this.toaster.success(AppCode.msg_saveSuccess);
            } else {
              this.toaster.success(AppCode.msg_updateSuccess);
              this.f.GSTType.enable();
            }
            this.ClearForm();
            this.GetTaxMasterList();
            this.chRef.detectChanges();
          } else if (data < 0) {
            this.toaster.warning(AppCode.msg_exist);
            this.isLoading = false;
            this.chRef.detectChanges();
          } else {
            this.toaster.error(data);
            this.ClearForm();
            this.GetTaxMasterList();
          }
        },
          (error: any) => {
            console.error(error);
          })
    }
  }

  // EDIT DATA ROW WISE (UPDATE)
  EditData(row: TaxModel) {
    this.isLoading = true;
    this.pageState = AppCode.updateString;
    this.HeadTititle = 'Update Tax Master';
    this.TaxId = row.TaxId;
    this.f.GSTType.setValue(row.GSTType);
    this.f.GSTType.disable();
    this.f.CGSTPer.setValue(row.CGST);
    this.f.SGSTPer.setValue(row.SGST);
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  //Delete data row wise.
  DeleteRecord(row: TaxModel) {
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
        this.Taxmodel = new TaxModel();
        this.Taxmodel.Action = AppCode.deleteString;
        this.Taxmodel.Addedby = String(this.UserId);
        this.Taxmodel.TaxId = row.TaxId;
        this._service.AddEditTax_Service(this.Taxmodel)
          .subscribe((data: any) => {
            if (data > 0) {
              this.toaster.success(AppCode.msg_deleteSuccess);
              this.GetTaxMasterList();
              this.chRef.detectChanges();
              this.isLoading = false;
            }
            this.isLoading = false;
          }, (error) => {
            console.error(error);
            this.isLoading = false;
          });
      }
    });
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // Clear form data
  ClearForm() {
    this.TaxName = "";
    this.TaxPer = 0;
    this.pageState = AppCode.saveString;
    this.HeadTititle = 'Add Tax Master';
    this.submitted = false;
    this.TaxMasterForm.reset();
    this.f.GSTType.enable();
    this.GetTaxMasterList();
    this.chRef.detectChanges();
  }

}
