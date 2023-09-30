import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppCode } from 'src/app/app.code';
import { InventoryInwardService } from '../Services/inventory-inward.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VehiclchlList, VehicleChecklistModel } from '../models/vehiclchl-list.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vehicle-checklist-img',
  templateUrl: './vehicle-checklist-img.component.html',
  styleUrls: ['./vehicle-checklist-img.component.scss']
})

export class VehicleChecklistImgComponent implements OnInit {

  VechicleCheckListColums = ['SrNo', 'LRNo', 'LRDate', 'VehicleNo', 'DriverName', 'ActualNoOfCasesQty', 'TransporterNo', 'TransporterName', 'IsClaim', 'IsSAN', 'Actions']

  public DataSource = new MatTableDataSource<any>()
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  veclchkModel: VehicleChecklistModel;
  vclChkForm: FormGroup;
  maxDate = new Date();
  FromDate = new FormControl(new Date());
  ToDate = new FormControl(new Date());
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  isLoading: boolean = false;
  searchModel: string = "";
  showImagesModel: any;

  Title: string = "";
  default: any = {
    FromDate: '',
    ToDate: ''
  }
  constructor(private fb: FormBuilder, private chRef: ChangeDetectorRef, private inventoryService: InventoryInwardService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.Title = "Vehicle Checklist List"
    this.FromDate = new FormControl(new Date());
    this.ToDate = new FormControl(new Date());
    let obj = AppCode.getUser()
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.intForm();
    this.GetVehicleChkListReport(this.BranchId, this.CompanyId);
  }


  get f(): { [key: string]: AbstractControl } {
    return this.vclChkForm.controls;
  }

  intForm() {
    this.vclChkForm = this.fb.group({
      FromDate: [
        this.default.FromDate
      ],
      ToDate: [
        this.default.ToDate
      ]
    })
  }

  GetVehicleChkListReport(BranchIdValue: number, CompanyIdValue: number) {
    this.isLoading = true;
    let VehicleChkListBody = {
      "BranchId": BranchIdValue,
      "CompId": CompanyIdValue,
      "FromDate": AppCode.createDateAsUTC(this.FromDate.value),
      "ToDate": AppCode.createDateAsUTC(this.ToDate.value)
    }
    this.inventoryService.getVehicleChkList_Service(VehicleChkListBody).subscribe((data: any) => {
      if (data.length > 0) {
        this.DataSource.data = [];
        this.DataSource.data = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
      } else {
        this.DataSource.data = [];
      }
      this.isLoading = false;
      this.chRef.detectChanges();
      (error: any) => {
        console.log(error);
        this.isLoading = false;
        this.chRef.detectChanges();
      }
    });
  }

  SaveVehicleChecklistReport() {
    this.GetVehicleChkListReport(this.BranchId, this.CompanyId);
  }

  ClearForm() {
    this.FromDate.reset();
    this.ToDate.reset();
    this.chRef.detectChanges();
  }

  ClearImages() {
    this.veclchkModel.Img1 = "";
    this.veclchkModel.Img2 = "";
    this.veclchkModel.Img3 = "";
    this.veclchkModel.Img4 = "";
  }

  //show checklist images
  OpenModelForShowimages(content: any, row: any) {
    this.veclchkModel = new VehicleChecklistModel();
    if (row.Img1 !== "" || row.Img2 !== "" || row.Img3 !== "" || row.Img4 !== "" || row.Img1 !== undefined || row.Img2 !== undefined
      || row.Img3 !== undefined || row.Img4 !== undefined || row.Img1 !== null || row.Img2 !== null
      || row.Img3 !== null || row.Img4 !== null) {
      this.veclchkModel.PkId = row.PkId
      this.veclchkModel.Img1 = row.Img1
      this.veclchkModel.Img2 = row.Img2
      this.veclchkModel.Img3 = row.Img3
      this.veclchkModel.Img4 = row.Img4
    }
    this.showImagesModel = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }



  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

}
