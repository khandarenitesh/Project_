import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeMasterModel, AddEmployeeModel, EmployeeActiveModel } from '../Models/EmployeeModel';

// Services
import { MastersServiceService } from '../Services/masters-service.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss']
})
export class UserMasterComponent implements OnInit {
  UserForm: FormGroup;
  isLoading: boolean = false;
  displayedColumnsForApi = ['SrNo', 'UserName', 'EmpNo', 'EmpName', 'EmpMobNo', 'BranchName', 'BloodGroupName', 'AadharNo', 'UserStatus', 'Actions'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  public DataSource = new MatTableDataSource<any>();
  addEmployeeModel: AddEmployeeModel;
  UserId: number = 0;
  BranchId: number = 0;
  UserBranchId: number = 0;
  RoleId: number = 0;
  searchModel: string = '';
  UserTitle: string = "";
  UserModal: any;
  EmpId: number = 0;
  resultEncryptPwd: any;
  selectedRolesList: any = [];
  RoleList: any[] = [];
  submitted: boolean = false;
  IsFlag: boolean = false;
  IsHide: boolean = false;
  PageState: string = "";
  EmployeeActiveModel: EmployeeActiveModel;
  defaultform: any = {
    Role: '',
    UserName: '',
    Password: ''
  };

  constructor(
    private _MastersServiceService: MastersServiceService,
    private chRef: ChangeDetectorRef,
    private _ToastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _service: MastersServiceService,
    private chef: ChangeDetectorRef,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserTitle = "Create User";
    this.UserId = obj.UserId;
    this.UserBranchId = obj.BranchId;
    this.RoleId = obj.RoleId;
    this.initForm();
    this.GetRoleList();
    this.GetEmployeeList(this.UserBranchId);
  }
  get f(): { [key: string]: AbstractControl } {
    return this.UserForm.controls;
  }
  // Get Role List
  GetRoleList() {
    this._service.getRoleList_Service()
      .subscribe((data: any) => {
        this.RoleList = data;
        this.RoleList = this.RoleList.filter(item => item.RoleId !== 1); // In Role DropDown Superadmin Is not Visible
        this.chef.detectChanges();
      },
        (error) => {
          console.error(error);
        })
  }
  initForm() {
    this.UserForm = this.fb.group({
      Role: [
        this.defaultform.Role,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      UserName: [
        this.defaultform.UserName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
        ]),
      ],
      Password: [
        this.defaultform.Password,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
        ]),
      ],
    });
  }
  // Get Employee List
  GetEmployeeList(BranchId: number) {
    this.isLoading = true;
    this._MastersServiceService.getEmployeeMasterList_Service(BranchId, AppCode.allString).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
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
  // Username is available
  onUserNameChange() {
    this._service.getCheckUsernameAvailable_Service(this.f.UserName.value)
      .subscribe((data: any) => {
        if (data !== null) {
          if (data.UserName.toLowerCase() === this.f.UserName.value.toLowerCase()) {
            Swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: 'This User Name already exists with ' + data.DisplayName,
            });
          }
          this.chef.detectChanges();
        }
      }, (error) => {
        console.error(error);
      });
  }

  AddEditUser(content: any, row: any, flag: any) {
    this.UserModal = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    if (flag == "Save") {
      this.PageState = AppCode.saveString;
      this.UserTitle = "Create User";
      this.IsHide = true;
      this.EmpId = row.EmpId;
      this.BranchId = row.BranchId
      this.f.UserName.enable();
      this.f.Password.enable();
      this.chRef.detectChanges();
    }
    else {
      this.PageState = AppCode.updateString;
      this.UserTitle = "Update User";
      this.IsHide = false;
      this.GetData(row);
      this.EmpId = row.EmpId;
      this.f.Password.disable();
      this.chRef.detectChanges();
    }
  }

  GetData(row: EmployeeMasterModel) {
    this.addEmployeeModel = new AddEmployeeModel();
    if (this.addEmployeeModel !== undefined) {
      this.BranchId = row.BranchId;
      this.EmpId = row.EmpId;
      this._service.getRolesDtls_Service(this.EmpId)
        .subscribe((data: any) => {
          for (var i = 0; i < data.length; i++) {
            this.selectedRolesList.push(this.RoleList.filter(r => r.RoleId === data[i].RoleId));
          }
          this.bindData1(this.selectedRolesList);
          this.chef.detectChanges();
        }, (error: any) => {
          console.log("Error:  " + JSON.stringify(error));
        });
      this.f.UserName.setValue(row.UserName);
      this.f.UserName.disable();
    }
    this.chef.detectChanges();
  }

  bindData1(selectedRolesList: any) {
    let arr: any = [];
    selectedRolesList.forEach((element: any) => {
      for (var i = 0; i < element.length; i++) {
        arr.push(element[i]);
      }
    });
    this.f.Role.setValue(arr);
    this.chef.detectChanges();
  }

  // Save Employee
  SaveUser() {
    this.submitted = true;
    if (!this.UserForm.valid) {
      return;
    } else if (this.PageState === AppCode.saveString) {
      var arrRole = [];
      this.addEmployeeModel = new AddEmployeeModel();
      this.addEmployeeModel.BranchId = this.BranchId;
      this.addEmployeeModel.EmpId = this.EmpId;
      arrRole.push(this.f.Role.value);
      arrRole.forEach((element: any) => {
        for (var i = 0; i < element.length; i++) {
          this.addEmployeeModel.RoleIdStr += element[i].RoleId + ",";
        }
      });
      this.resultEncryptPwd = this.authService.encryptData(this.f.Password.value);
      this.addEmployeeModel.EncryptPassword = this.resultEncryptPwd;
      this.addEmployeeModel.UserName = this.f.UserName.value;
      this.addEmployeeModel.Password = this.f.Password.value;
      this.addEmployeeModel.Addedby = String(this.UserId);
      this._service.CreateUser_Service(this.addEmployeeModel)
        .subscribe((data: any) => {
          if (data === AppCode.SuccessStatus) {
            this._ToastrService.success(AppCode.msg_usercreate);
            this.GetEmployeeList(this.UserBranchId);
            this.UserForm.reset();
            this.modalService.dismissAll();
            this.chef.detectChanges();
          } else if (data === AppCode.ExistsStatus) {
            this._ToastrService.warning(AppCode.msg_userexist);
            this.chef.detectChanges();
          } else {
            this._ToastrService.error(data);
          }
        }, (error) => {
          console.error(error);
        });
    }
    else {
      var arrRole = [];
      this.addEmployeeModel = new AddEmployeeModel();
      this.addEmployeeModel.BranchId = this.BranchId;
      this.addEmployeeModel.EmpId = this.EmpId;
      arrRole.push(this.f.Role.value);
      arrRole.forEach((element: any) => {
        for (var i = 0; i < element.length; i++) {
          this.addEmployeeModel.RoleIdStr += element[i].RoleId + ",";
        }
      });
      this.resultEncryptPwd = this.authService.encryptData(this.f.Password.value);
      this.addEmployeeModel.UserName = this.f.UserName.value;
      this.addEmployeeModel.Password = this.f.Password.value;
      this.addEmployeeModel.Addedby = String(this.UserId);
      this._service.CreateUser_Service(this.addEmployeeModel)
        .subscribe((data: any) => {
          if (data === AppCode.SuccessStatus) {
            this._ToastrService.success(AppCode.msg_updateSuccess);
            this.GetEmployeeList(this.UserBranchId);
            this.GetRoleList();
            this.modalService.dismissAll();
            this.chef.detectChanges();
          } else if (data === AppCode.ExistsStatus) {
            this._ToastrService.warning(AppCode.msg_empexist);
            this.chef.detectChanges();
          } else {
            this._ToastrService.error(data);
          }
        }, (error) => {
          console.error(error);
        });
    }
  }
  // Clear Form
  ClearForm() {
    this.isLoading = true;
    this.modalService.dismissAll();
    this.UserForm.reset();
    this.GetRoleList();
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase();
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // Change User - Employee Active and Deactive
  ChangeUser(row: EmployeeActiveModel, Status: string) {
    this.isLoading = true;
    this.EmployeeActiveModel = new EmployeeActiveModel();
    this.EmployeeActiveModel.EmpId = row.EmpId;
    this.EmployeeActiveModel.IsActive = (Status === AppCode.IsActiveString ? AppCode.IsInActiveString : AppCode.IsActiveString);
    this.EmployeeActiveModel.Addedby = String(this.UserId);
    this._MastersServiceService.UserActiveDeactive_Service(this.EmployeeActiveModel)
      .subscribe((data: any) => {
        if (data === AppCode.SuccessStatus) {
          this._ToastrService.success(AppCode.msg_stsChange);
          if (this.BranchId > 0) { // Other Login
            this.GetEmployeeList(this.UserBranchId);
          } else {  // Super Admin
            this.GetEmployeeList(this.UserBranchId);
          }
        }
      }, (error) => {
        console.error(error);
      });
  }
}
