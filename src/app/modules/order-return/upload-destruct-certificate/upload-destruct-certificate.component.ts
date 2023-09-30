import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

// Angular Mat Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

//Service
import Swal from 'sweetalert2';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import { OrderReturnService } from '../Services/order-return.service';
import { UploadDesCertiModel } from '../models/ClaimSrsMappingModel';

@Component({
  selector: 'app-upload-destruct-certificate',
  templateUrl: './upload-destruct-certificate.component.html',
  styleUrls: ['./upload-destruct-certificate.component.scss']
})
export class UploadDestructCertificateComponent implements OnInit {

  uploadimg = ['Action', 'CrDrNoteNo', 'CRDRCreationDate', 'CrDrAmt', 'StockistNo', 'StockistName', 'CityName', 'SalesOrderNo', 'SalesOrderDate'];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  public DataSource = new MatTableDataSource<any>();

  Title: string = "Upload Destruction Certificate"
  @ViewChild('fileInput') fileInput: ElementRef;
  isLoading: boolean = false;
  selectedFile: any;
  UserId: number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  ListTitle: string = "";
  searchModel: string = '';
  selectedrows: matrowselected[] = [];
  uploadDesCertiModel: UploadDesCertiModel;
  selection = new SelectionModel<any>(true, []);
  rowWisedata: any;
  newData: any;
  masterSelected: any;
  Allcheck: any;
  ChecValueFlag: boolean = false;
  check: any

  constructor(private chRef: ChangeDetectorRef, private toastr: ToastrService, private _OrderReturnService: OrderReturnService) { }


  ngOnInit(): void {
    this.ListTitle = "Credit Note List";
    var result = AppCode.getUser();
    this.UserId = result.UserId;
    this.BranchId = result.BranchId;
    this.CompanyId = result.CompanyId;
    this.GetcnUploadDestructionCertiList(this.BranchId, this.CompanyId);

  }

  //Select File on change event occurs
  onChange() {
    let file = this.fileInput.nativeElement.files[0];
    if (file.name.split('.').pop() !== "jpg" || file.name.split('.').pop() !== "pdf") { } else {
      this.toastr.error("Accepts only jpeg or .pdf");
      this.fileInput.nativeElement.value = null;
    }
  }

  //Check Box Code
  getCheckboxesData(row: any, i: string) {
    this.rowWisedata = row;
    this.check = document.getElementById('check' + i)
    var check = this.check.checked
    console.log('id', this.check);
    if (check === true) {
      if (this.selectedrows.length === 0) {
        var item = new matrowselected();
        item.CNId = row.CNId;
        this.selectedrows.push(item);
      }
      else if (this.selectedrows.length > 0 || this.selectedrows.find(x => x.CNId === row.CNId)) {
        var item = new matrowselected();
        item.CNId = row.CNId;
        this.selectedrows.push(item);     
      }
    }
    else {
      var indexValue = this.selectedrows.findIndex(t => t.CNId === row.CNId); // delete
      this.selectedrows.splice(indexValue, 1);
      this.ChecValueFlag = false;
    }
    this.chRef.detectChanges();
    console.log(this.selectedrows);
  }

  AllselectndUnselectCheckBox(event: any) {
    this.ChecValueFlag = true;
    if (this.DataSource.data.length > 0) {
      for (var i = 0; i < this.DataSource.data.length; i++) {
        this.Allcheck = event.target.checked;
        if (event.target.checked === true) {
          var item = new matrowselected();
          item.CNId = this.DataSource.data[i].CNId;
          this.selectedrows.push(item);
          (<HTMLInputElement>document.getElementById('check' + item.CNId)).checked = true;
        }
        else {
          var indexValue = this.selectedrows.findIndex(t => t.CNId === this.DataSource.data[i].CNId); // Delete
          this.selectedrows.splice(indexValue, 1);
          (<HTMLInputElement>document.getElementById('check' + this.DataSource.data[i].CNId)).checked = false;
        }
      }
    }
  }

  SaveUploadCertificate() {
    this.isLoading = true;
    let formData = new FormData;
    let file = this.fileInput.nativeElement.files[0];
    this.uploadDesCertiModel = new UploadDesCertiModel();
    let arr: any[] = [];
    arr.push(this.selectedrows);
    arr.forEach((element: any) => {
      for (var i = 0; i < element.length; i++) {
        this.uploadDesCertiModel.CNIdStr += element[i].CNId + ",";
      }
    });
    this.Allcheck = false;
    this.isLoading = false;
    this.ChecValueFlag = false;
    if (file === undefined) {
      this.toastr.error('Please Select File');
      this.isLoading = false;
      this.chRef.detectChanges();
    } else if (file != undefined && (file.name.split('.').pop() === "jpg" || file.name.split('.').pop() === "pdf" || file.name.split('.').pop() === "jpeg" || file.name.split('.').pop() === "png")) {
      formData.append('upload', file);
      this._OrderReturnService.UploadImage(this.uploadDesCertiModel.CNIdStr, this.BranchId, this.CompanyId, file.name, String(this.UserId), formData).subscribe((data: any) => {
        if (data == '-1') {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        } else if (data === "Certificate Not Found") {
          Swal.fire({
            icon: 'error',
            text: data
          })
        } else if (data === "Certificate Not Found") {
          Swal.fire({
            icon: 'error',
            text: data
          })
        } else if (data === "Invalid Certificate") {
          Swal.fire({
            icon: 'error',
            text: data
          })
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Certificate Uploaded SuccessFully!',
            text: data
          })
        }
        this.GetcnUploadDestructionCertiList(this.BranchId, this.CompanyId);
        this.chRef.detectChanges();
        this.isLoading = false;
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Certificate is Invalid (Accepts only jpg or .jpeg and .png)',
      })
      this.isLoading = false;
      this.chRef.detectChanges();
    }
    this.GetcnUploadDestructionCertiList(this.BranchId, this.CompanyId);
    this.chRef.detectChanges();
    this.selectedrows = [];
  }

  // Clear File
  clearFile() {
    this.fileInput.nativeElement.value = null;
    this.isLoading = false;
    this.GetcnUploadDestructionCertiList(this.BranchId, this.CompanyId);
    this.selectedrows = [];
    this.chRef.detectChanges();
  }

  //Get Destruction Certificate List
  GetcnUploadDestructionCertiList(BranchId: number, CompId: number) {
    this.isLoading = true;
    this._OrderReturnService.GetCNUPLDestructionCerList(BranchId, CompId).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.DataSource.data = data;
        this.newData = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
      } else {
        this.DataSource.data = [];
      }
      this.isLoading = false;
      this.fileInput.nativeElement.value = null;
      this.chRef.detectChanges();
      (error: any) => {
        console.log(error);
        this.isLoading = false;
        this.fileInput.nativeElement.value = null;
        this.chRef.detectChanges();
      }
    });
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    // this.searchModel = this.searchModel.trim(); // Remove whitespace
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }
}

export class matrowselected {
  CNId: number;
}
