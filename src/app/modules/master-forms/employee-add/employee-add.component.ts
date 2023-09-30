import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

// Models
import { AddEmployeeModel } from '../Models/EmployeeModel';

// Services
import { AuthService } from '../../../modules/auth/services/auth.service';
import { MastersServiceService } from '../Services/masters-service.service';
import { SharedService } from '../../../SharedServices/shared.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss'],
})
export class EmployeeAddComponent implements OnInit {
  employeeForm: FormGroup;
  addEmployeeModel: AddEmployeeModel;
  DesignationList: any = [];
  RoleList: any[] = [];
  BranchList: any = [];
  CityList: any = [];
  CompanyList: any[] = [];
  CompanyListById: any[] = [];
  BloodGroupList: any = [];
  UserId: number = 0;
  BranchId: number = 0;
  defaultform: any = {
    EmployeeNumber: '',
    Name: '',
    PANNo: '',
    EmailAddress: '',
    MobileNo: '',
    Designation: '',
    Role: '',
    Branch: '',
    City: '',
    Company: '',
    Address: '',
    BloodGroup: '',
    AadharCardNo: '',
    UserName: '',
    Password: '',
  };
  IsFlag: boolean = false;
  IsHide: boolean = false;
  pageState: string = '';
  btnCancelText: string = '';
  defaultPassword: string = '';
  @ViewChild('select') select: MatSelect;
  allSelected = false;
  State: any = {
    state: '',
  };
  EmpId: number = 0;
  resultEncryptPwd: any;
  employeeMsg: string = '';
  selectedCompanyList: any[] = [];
  selectedRolesList: any = [];
  CompanyMasterObj = new FormControl();
  submitted: boolean = false;
  IsEmailFlag: boolean = true;
  IsEmailRequiredFlag: boolean = true;
  InvalidCity: boolean = false;
  InvalidBloodGroup: boolean = false;
  InvalidBranch: boolean = false;
  InvalidDesignation: boolean = false;

  // Autocomplete Code
  filteredOptionsCity: Observable<AddEmployeeModel[]>;
  // filteredOptCompany: Observable<AddEmployeeModel[]>;
  filteredOptDesignation: Observable<AddEmployeeModel[]>;
  filteredOptBloodGroup: Observable<AddEmployeeModel[]>;
  filteredOptBranch: Observable<AddEmployeeModel[]>;
  isLoading: boolean = false;
  IsInvalidAdhar: boolean = false;
  IsInvalidMobile: boolean = false;
  IsInvalidPan: boolean = false;
  IsInvAdhar: boolean = false;
  RowId: number = 0;
  BranchIdValue: number;


  constructor(
    private fb: FormBuilder,
    private _service: MastersServiceService,
    private _SharedService: SharedService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private chef: ChangeDetectorRef,
    private commoncode: AppCode,
    private _ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.employeeMsg = 'Add Employee';
    this.pageState = AppCode.saveString;
    this.btnCancelText = AppCode.cancelString;
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.initForm();
    this.GetBranchList();
    // this.GetCompanyList();
    this.GetRoleList();
    this.GetCityList();
    this.GetGeneralMasterList();
    this.f.Role.disable();
    this.f.UserName.disable();
    this.f.Password.disable();
    this.route.queryParams.subscribe((params) => {
      this.State = params;
    });
    if (this.State.state !== undefined && this.State.state !== null) {
      this.Setdata();
    }
  }

  // Edit/Update Employee
  Setdata() {
    this.isLoading = true;
    this.addEmployeeModel = new AddEmployeeModel();
    this.selectedCompanyList = [];
    this.selectedRolesList = [];
    this.addEmployeeModel = this._SharedService.getData();
    if (this.addEmployeeModel === undefined) {
      this.isLoading = false;
      return
    }
    this.RowId = this.addEmployeeModel.BranchId;
    if (this.addEmployeeModel !== undefined) {
      this.employeeMsg = 'Update Employee';
      this.pageState = this.State.state;
      this.BranchId = this.addEmployeeModel.BranchId;
      this.EmpId = this.addEmployeeModel.EmpId;
      this.GetCompanyListByBranch(this.RowId);
      this._service.getEmployeeDtls_Service(this.EmpId).subscribe(
        (data: any) => {
          for (var i = 0; i < data.length; i++) {
            this.CompanyListById = this.CompanyList
            let companyById = this.CompanyListById.filter((a) => a.CompanyId === data[i].CompanyId);
            this.selectedCompanyList.push(companyById);
          }
          this.bindCompanyData(this.selectedCompanyList);
        },
        (error: any) => {
          console.log('Error:  ' + JSON.stringify(error));
          this.chef.detectChanges();
        }
      );

      // multiple Roles select
      this._service.getRolesDtls_Service(this.EmpId).subscribe(
        (data: any) => {
          for (var i = 0; i < data.length; i++) {
            let roleById = this.RoleList.filter((r) => r.RoleId === data[i].RoleId);
            this.selectedRolesList.push(roleById);
          }
          this.bindRoleData(this.selectedRolesList);
          this.chef.detectChanges();
        },
        (error: any) => {
          console.log('Error:  ' + JSON.stringify(error));
          this.chef.detectChanges();
        }
      );

      this.f.Branch.setValue(this.BranchId);
      this.f.EmployeeNumber.setValue(this.addEmployeeModel.EmpNo);
      this.employeeForm.controls['EmployeeNumber'].disable();
      this.f.Name.setValue(this.addEmployeeModel.EmpName);
      this.f.PANNo.setValue(this.addEmployeeModel.EmpPAN);
      this.f.EmailAddress.setValue(this.addEmployeeModel.EmpEmail);
      this.f.MobileNo.setValue(this.addEmployeeModel.EmpMobNo);
      // this.f.Designation.setValue(this.addEmployeeModel.DesignationId);
      // this.f.Role.setValue(this.addEmployeeModel.RoleId);
      // this.employeeForm.controls['Role'].disable();
      // this.f.City.setValue(this.addEmployeeModel.CityCode);
      let city: any = {
        'CityCode': this.addEmployeeModel.CityCode,
        'CityName': this.addEmployeeModel.CityName
      }
      this.f.City.setValue(city);

      // let company: any = {
      //   'CompanyName': this.addEmployeeModel.CompanyName
      // }
      // this.f.Company.setValue(company);

      let designation: any = {
        'pkId': this.addEmployeeModel.DesignationId,
        'MasterName': this.addEmployeeModel.DesignationName
      }
      this.f.Designation.setValue(designation);

      let bloodgroup: any = {
        'pkId': this.addEmployeeModel.pkId,
        'MasterName': this.addEmployeeModel.BloodGroupName
      }
      this.f.BloodGroup.setValue(bloodgroup);

      let branch: any = {
        'BranchId': this.addEmployeeModel.BranchId,
        'BranchName': this.addEmployeeModel.BranchName
      }
      this.f.Branch.setValue(branch);

      this.f.Address.setValue(this.addEmployeeModel.EmpAddress);
      // this.f.BloodGroup.setValue(this.addEmployeeModel.pkId);
      this.f.AadharCardNo.setValue(this.addEmployeeModel.AadharNo);
      this.f.IsUser.setValue(this.addEmployeeModel.IsUser);
      if (this.addEmployeeModel.IsUser === 'Y') {
        this.IsFlag = true;
        this.IsHide = false;
        this.f.Password.setValue(this.addEmployeeModel.Password);
        // this.f.Role.setValue(this.addEmployeeModel.RoleId);
        this.f.UserName.setValue(this.addEmployeeModel.UserName);
        // this.employeeForm.controls['UserName'].disable();
        // this.employeeForm.controls['IsUser'].disable();
      }
      this.isLoading = false;
      this.chef.detectChanges();
    } else {
      this.employeeMsg = 'Employee List';
      this.redirect();
    }
  }

  bindCompanyData(selectedCompanyList: any) {
    let arrCompany: any = [];
    arrCompany = [];
    selectedCompanyList.forEach((element: any) => {
      for (var i = 0; i < element.length; i++) {
        arrCompany.push(element[i]);
      }
    });
    // this.CompanyMasterObj.setValue(arrCompany);
    this.f.Company.setValue(arrCompany);
    this.isLoading = false;
    this.chef.detectChanges();
  }

  bindRoleData(selectedRolesList: any) {
    let arrRole: any = [];
    arrRole = [];
    selectedRolesList.forEach((element: any) => {
      for (var i = 0; i < element.length; i++) {
        arrRole.push(element[i]);
      }
    });
    this.f.Role.setValue(arrRole);
    this.isLoading = false;
    this.chef.detectChanges();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.employeeForm.controls;
  }

  initForm() {
    this.employeeForm = this.fb.group({
      EmployeeNumber: [
        this.defaultform.EmployeeNumber,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      Name: [
        this.defaultform.Name,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      PANNo: [
        this.defaultform.PANNo,
        Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      ],
      EmailAddress: [
        this.defaultform.EmailAddress,
        Validators.compose([Validators.email, Validators.required]),
      ],
      MobileNo: [
        this.defaultform.MobileNo,
        Validators.compose([Validators.required, Validators.maxLength(22)]),
      ],
      Designation: [this.defaultform.Designation],
      Role: [
        this.defaultform.Role,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      Branch: [
        this.defaultform.Branch,
        Validators.compose([Validators.required, Validators.maxLength(250)]),
      ],
      City: [this.defaultform.City],
      Company: [
        this.defaultform.Company,
        Validators.compose([Validators.required, Validators.maxLength(250)]),
      ],
      Address: [this.defaultform.Address],
      BloodGroup: [this.defaultform.BloodGroup],
      AadharCardNo: [this.defaultform.AadharCardNo],
      UserName: [
        this.defaultform.UserName,
        Validators.compose([Validators.required, Validators.maxLength(20)]),
      ],
      Password: [
        this.defaultform.Password,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      IsUser: false,
    });
  }

  Aadharvalidation(): void {
    if (this.f.AadharCardNo.value.length === 12) {
      this.IsInvalidAdhar = false;
    }
    else if (this.f.AadharCardNo.value === "") {
      this.IsInvalidAdhar = false
    }
    else {
      this.IsInvalidAdhar = true;
    }
    this.chef.detectChanges();
  }

  // Get Branch List
  GetBranchList() {
    this._service.getBranchList_Service(AppCode.IsActiveString).subscribe(
      (data: any) => {
        this.BranchList = data;
        this.BranchList = this.BranchList.sort((a: any, b: any) => a.BranchName.localeCompare(b.BranchName));
        this.filteredOptBranch = this.f.Branch.valueChanges
          .pipe(
            startWith<string | AddEmployeeModel>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.BranchName : null),
            map(BranchName => BranchName ? this.filterBranch(BranchName) : this.BranchList.slice())
          );
        this.chef.detectChanges();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Autocomplete Search Filter
  private filterBranch(name: string): AddEmployeeModel[] {
    this.InvalidBranch = false;
    const filterValue = name.toLowerCase();
    return this.BranchList.filter((option: any) =>
      option.BranchName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnBranch(branch: AddEmployeeModel): string {
    return branch && branch.BranchName ? branch.BranchName : '';
  }

  // Get Company List
  // GetCompanyList() {
  //   this._service.getCompanyList_Service(AppCode.IsActiveString).subscribe(
  //     (data: any) => {
  //       this.CompanyList = [];
  //       this.CompanyList = data;
  //       this.chef.detectChanges();
  //     },
  //     (error) => {
  //       console.error(error);
  //       this.chef.detectChanges();
  //     }
  //   );
  // }

  
  GetCompanyListByBranch(RowId: number) {
    this.isLoading = true;
    if ((this.f.Branch.value != "" && this.f.Branch.value != null && this.f.Branch.value != undefined)) {
      if (RowId === 0) {
        this.BranchIdValue = this.f.Branch.value.BranchId;
      }
    }
    else {
      this.BranchIdValue = RowId;
    }
    this._service.getCompanyListByBranchEmp_Service(this.BranchIdValue, AppCode.IsActiveString).subscribe(
      (data: any) => {
        this.CompanyList = [];
        this.CompanyList = data;
        this.isLoading = false;
        this.chef.detectChanges();
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.chef.detectChanges();
      });
  }

  // Get Role List
  GetRoleList() {
    this._service.getRoleList_Service().subscribe(
      (data: any) => {
        this.RoleList = data;
        this.chef.detectChanges();
      },
      (error) => {
        console.error(error);
        this.chef.detectChanges();
      }
    );
  }

  // Get City List
  GetCityList() {
    this._service
      .getCityList_Service(AppCode.allString, AppCode.allString, AppCode.CityActiveString).subscribe(
        (data: any) => {
          this.CityList = data.GetCityParameter;
          this.CityList = this.CityList.sort((a: any, b: any) => a.CityName.localeCompare(b.CityName));
          this.filteredOptionsCity = this.f.City.valueChanges
            .pipe(
              startWith<string | AddEmployeeModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.CityName : null),
              map(CityName => CityName ? this.filterCity(CityName) : this.CityList.slice())
            );
          this.chef.detectChanges();
        },
        (error) => {
          console.error(error);
          this.chef.detectChanges();
        }
      );
  }

  // Autocomplete Search Filter
  private filterCity(name: string): AddEmployeeModel[] {
    this.InvalidCity = false;
    const filterValue = name.toLowerCase();
    return this.CityList.filter((option: any) =>
      option.CityName.toLowerCase().includes(filterValue) ||
      option.CityCode.toLocaleLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnCity(city: AddEmployeeModel): string {
    return city && city.CityName ? city.CityName : '';
  }

  // Get Designation and Blood Group List
  GetGeneralMasterList() {
    this._service
      .GetGeneralMasterList_Service(
        AppCode.designationString,
        AppCode.IsActiveString
      )
      .subscribe(
        (data: any) => {
          this.DesignationList = data.GeneralMasterParameter;
          this.DesignationList = this.DesignationList.sort((a: any, b: any) => a.MasterName.localeCompare(b.MasterName));
          this.filteredOptDesignation = this.f.Designation.valueChanges
            .pipe(
              startWith<string | AddEmployeeModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.MasterName : null),
              map(MasterName => MasterName ? this.filterDesignation(MasterName) : this.DesignationList.slice())
            );
          this.chef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );

    this._service
      .GetGeneralMasterList_Service(AppCode.bloodGroupString, AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.BloodGroupList = data.GeneralMasterParameter;
          this.BloodGroupList = this.BloodGroupList.sort((a: any, b: any) => a.MasterName.localeCompare(b.MasterName));
          this.filteredOptBloodGroup = this.f.BloodGroup.valueChanges //formgroup
            .pipe(
              startWith<string | AddEmployeeModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.MasterName : null),
              map(MasterName => MasterName ? this.filterBloodGroup(MasterName) : this.BloodGroupList.slice()
              )
            );
          this.chef.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
  }
  // Autocomplete Search Filter
  private filterDesignation(name: string): AddEmployeeModel[] {
    this.InvalidDesignation = false
    const filterValue = name.toLowerCase();
    return this.DesignationList.filter((option: any) =>
      option.MasterName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnDesignation(designation: AddEmployeeModel): string {
    return designation && designation.MasterName ? designation.MasterName : '';
  }

  // Autocomplete Search Filter Blood Group
  private filterBloodGroup(name: string): AddEmployeeModel[] {
    this.InvalidBloodGroup = false;
    const filterValue = name.toLowerCase();
    return this.BloodGroupList.filter((option: any) =>
      option.MasterName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnBloodGroup(bloodGroup: AddEmployeeModel): string {
    return bloodGroup && bloodGroup.MasterName ? bloodGroup.MasterName : '';
  }

  // Is User change that visible only User Name and Password
  OnChangeIsUser(event: MatCheckboxChange) {
    if (event.checked === true) {
      // this.defaultPassword = AppCode.defaultPasswordString;
      // this.employeeForm.controls['Password'].setValue(this.defaultPassword);
      this.f.Role.enable();
      this.f.UserName.enable();
      this.f.Password.enable();
      this.IsFlag = true;
      this.IsHide = true;
      this.chef.detectChanges();
    } else {
      this.IsFlag = false;
      this.IsHide = false;
      this.f.Role.disable();
      this.f.UserName.disable();
      this.f.Password.disable();
      this.chef.detectChanges();
    }
  }

  // Company - Checkbox check event action
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

  // Validation Email
  emailValidation() {
    let flag: boolean = false;
    if (this.f.EmailAddress.value === '') {
      this.IsEmailRequiredFlag = false; // Email Address if Empty
      this.IsEmailFlag = true; // valid email
      this.submitted = false;
      this.chef.detectChanges();
    } else {
      flag = this.commoncode.emailAddressOnly(this.f.EmailAddress.value.toLowerCase());
      if (flag === true) {
        this.IsEmailFlag = true; // valid email
        this.IsEmailRequiredFlag = true; // Email Address filled
        this.submitted = false;
        this.chef.detectChanges();
      } else {
        this.IsEmailFlag = false; // invalid email
        this.IsEmailRequiredFlag = true; // Email Address if Empty
        this.submitted = true;
        this.chef.detectChanges();
      }
    }
  }

  // Validation Mobile No.
  mobileNoValidation(event: any) {
    this.commoncode.numberonlyandcomma(event);
  }

  // Validation Mobile No.
  numberValidation(event: any) {
    this.commoncode.numberOnly(event);
  }

  // Username is available
  onUserNameChange() {
    this._service
      .getCheckUsernameAvailable_Service(this.f.UserName.value)
      .subscribe(
        (data: any) => {
          if (data !== null) {
            if (
              data.UserName.toLowerCase() ===
              this.f.UserName.value.toLowerCase()
            ) {
              this._ToastrService.warning(AppCode.msg_unexist);
            }
            this.chef.detectChanges();
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  //Employee Number is Available
  onEmpNumChange() {
    let model = null;
    if (this.pageState === AppCode.saveString) {
      model = {
        EmpId: 0, //only for add
        EmpNo: this.f.EmployeeNumber.value,
        EmpEmail: this.f.EmailAddress.value,
        EmpMobNo: this.f.MobileNo.value,
      };
    } else {
      model = {
        EmpId: this.EmpId, // assign values in edit mode
        EmpNo: this.f.EmployeeNumber.value,
        EmpEmail: this.f.EmailAddress.value,
        EmpMobNo: this.f.MobileNo.value,
      };
    }
    this._service.getCheckEmpNumAvl_Service(model).subscribe(
      (data: any) => {
        if (data !== null) {
          if (data.flag == -1) {
            Swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: 'This Employee number already exists with ' + data.EmpName,
            });
          }
          if (data.flag == -2) {
            Swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: 'This Email Address already exists with ' + data.EmpName,
            });
          }
          if (data.flag == -3) {
            Swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: 'This Mobile number already exists with ' + data.EmpName,
            });
          }
          this.chef.detectChanges();
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  // Save Employee
  SaveEmployee() {
    this.submitted = true;
    if (!this.employeeForm.valid) {
      this.InvalidCity = false;
      this.InvalidBloodGroup = false;
      this.InvalidBranch = false;
      return;
    } else if (this.pageState === AppCode.saveString) {
      if (this.f.AadharCardNo.value === "") {
        this.IsInvalidAdhar = false;
      }
      else if (this.f.AadharCardNo.value.length > 0 && this.f.AadharCardNo.value.length < 12) {
        this.IsInvalidAdhar = true;
        return;
      }
      else if (this.f.AadharCardNo.value.length === 12) {
        this.IsInvalidAdhar = false;
      }
      else {
        this.IsInvalidAdhar = true;
      }
      if (this.InvalidCity === false && this.InvalidBloodGroup === false && this.InvalidDesignation === false && this.InvalidBranch === false
        && this.IsInvalidMobile === false && this.IsInvalidPan === false && this.IsInvAdhar === false && this.IsInvalidAdhar === false && this.IsEmailFlag === true
      ) {
        // Add Employee
        var arrCompany = [];
        var arrRole = [];
        this.addEmployeeModel = new AddEmployeeModel();
        this.addEmployeeModel.BranchId = this.BranchId;
        this.addEmployeeModel.EmpNo = this.f.EmployeeNumber.value;
        this.addEmployeeModel.EmpName = this.f.Name.value;
        this.addEmployeeModel.EmpPAN = this.f.PANNo.value;
        this.addEmployeeModel.EmpEmail = this.f.EmailAddress.value;
        this.addEmployeeModel.EmpMobNo = this.f.MobileNo.value;
        this.addEmployeeModel.DesignationId = this.f.Designation.value.pkId;
        // this.addEmployeeModel.RoleId = this.f.Role.value;
        //multiple role
        arrRole.push(this.f.Role.value);
        arrRole.forEach((element: any) => {
          for (var i = 0; i < element.length; i++) {
            this.addEmployeeModel.RoleIdStr += element[i].RoleId + ',';
          }
        });
        this.addEmployeeModel.BranchId = this.f.Branch.value.BranchId;
        this.addEmployeeModel.CityCode = this.f.City.value.CityCode;
        // Multiple Company
        // arrCompany.push(this.CompanyMasterObj.value);
        arrCompany.push(this.f.Company.value);
        arrCompany.forEach((element: any) => {
          for (var i = 0; i < element.length; i++) {
            this.addEmployeeModel.companyStr += element[i].CompanyId + ',';
          }
        });
        this.addEmployeeModel.EmpAddress = this.f.Address.value;
        this.addEmployeeModel.BloodGroup = this.f.BloodGroup.value.pkId;
        this.addEmployeeModel.AadharNo = this.f.AadharCardNo.value;
        // this.addEmployeeModel.UserName = this.f.UserName.value;
        // this.addEmployeeModel.Password = this.f.Password.value;
        // Encrypt Password
        this.resultEncryptPwd = this.authService.encryptData(
          this.addEmployeeModel.Password
        );
        this.addEmployeeModel.EncryptPassword = this.resultEncryptPwd;
        this.addEmployeeModel.IsUser =
          this.f.IsUser.value === true
            ? AppCode.IsActiveString
            : AppCode.IsInActiveString;
        this.addEmployeeModel.Addedby = String(this.UserId);
        this._service.SaveEmployee_Service(this.addEmployeeModel).subscribe(
          (data: any) => {
            if (data > 0) {
              this._ToastrService.success(AppCode.msg_saveSuccess);
              this.GetCompanyListByBranch(this.RowId);
              this.redirect();
            } else if (data === -1) {
              this._ToastrService.warning('Employee no already exists!');
              this.chef.detectChanges();
            } else if (data === -2) {
              this._ToastrService.warning('Email already exists!');
              this.chef.detectChanges();
            } else if (data === -3) {
              this._ToastrService.warning('Mobile no already exists!');
              this.chef.detectChanges();
            } else {
              this._ToastrService.error(data);
              this.redirect();
            }
          },
          (error) => {
            console.error(error);
          });
      }
      else {
        this._ToastrService.error(AppCode.FailStatus);
      }
    } else {
      if (this.f.AadharCardNo.value === "") {
        this.IsInvalidAdhar = false;
      }
      else if (this.f.AadharCardNo.value.length > 0 && this.f.AadharCardNo.value.length < 12) {
        this.IsInvalidAdhar = true;
        return;
      }
      else if (this.f.AadharCardNo.value.length === 12) {
        this.IsInvalidAdhar = false;
      }
      else {
        this.IsInvalidAdhar = true;
      }
      if (this.InvalidCity === false && this.InvalidBloodGroup === false && this.InvalidDesignation === false && this.InvalidBranch === false
        && this.IsInvalidMobile === false && this.IsInvalidPan === false && this.IsInvAdhar === false && this.IsInvalidAdhar === false && this.IsEmailFlag === true) {
        // Update Employee
        var arrCompany = [];
        var arrRole = [];
        this.addEmployeeModel = new AddEmployeeModel();
        this.addEmployeeModel.BranchId = this.f.Branch.value.BranchId;
        this.addEmployeeModel.EmpId = this.EmpId;
        this.addEmployeeModel.EmpNo = this.f.EmployeeNumber.value;
        this.addEmployeeModel.EmpName = this.f.Name.value;
        this.addEmployeeModel.EmpPAN = this.f.PANNo.value;
        this.addEmployeeModel.EmpEmail = this.f.EmailAddress.value;
        this.addEmployeeModel.EmpMobNo = this.f.MobileNo.value;
        this.addEmployeeModel.DesignationId = this.f.Designation.value.pkId;
        // this.addEmployeeModel.RoleId = this.f.Role.value;
        this.addEmployeeModel.CityCode = this.f.City.value.CityCode;
        // Multiple Company
        // arrCompany.push(this.CompanyMasterObj.value);
        arrCompany.push(this.f.Company.value);
        arrCompany.forEach((element: any) => {
          for (var i = 0; i < element.length; i++) {
            this.addEmployeeModel.companyStr += element[i].CompanyId + ',';
          }
        });
        // multiple role
        arrRole.push(this.f.Role.value);
        arrRole.forEach((element: any) => {
          for (var i = 0; i < element.length; i++) {
            this.addEmployeeModel.RoleIdStr += element[i].RoleId + ',';
          }
        });
        this.addEmployeeModel.EmpAddress = this.f.Address.value;
        this.addEmployeeModel.BloodGroup = this.f.BloodGroup.value.pkId;
        this.addEmployeeModel.AadharNo = this.f.AadharCardNo.value;
        this.addEmployeeModel.UserName = this.f.UserName.value;
        // this.addEmployeeModel.Password = this.f.Password.value;
        // Encrypt Password
        this.resultEncryptPwd = this.authService.encryptData(
          this.addEmployeeModel.Password
        );
        // this.addEmployeeModel.EncryptPassword = this.resultEncryptPwd;
        // this.addEmployeeModel.IsUser = (this.f.IsUser.value === true ? AppCode.IsActiveString : AppCode.IsInActiveString);
        this.addEmployeeModel.Addedby = String(this.UserId);
        this._service.UpdateEmployee_Service(this.addEmployeeModel).subscribe(
          (data: any) => {
            if (data > 0) {
              this._ToastrService.success(AppCode.msg_updateSuccess);
              this.GetCompanyListByBranch(this.RowId);
              this.redirect();
            } else if (data === -2) {
              this._ToastrService.warning('Email already exists!');
              this.chef.detectChanges();
            } else if (data === -3) {
              this._ToastrService.warning('Mobile no already exists!');
              this.chef.detectChanges();
            } else {
              this._ToastrService.error(data);
              this.redirect();
            }
          },
          (error) => {
            console.error(error);
          });
      }
      else {
        this._ToastrService.error(AppCode.FailStatus);
      }
    }
  }

  //Branch Validation
  BranchValidation() {
    this.submitted = false;
    if ((this.f.Branch.value.BranchId === '' || this.f.Branch.value.BranchId === undefined || this.f.Branch.value.BranchId === null)) {
      this.InvalidBranch = true;
      this.isLoading = false;
      return;
    } else {
      this.InvalidBranch = false;
    }
    this.chef.detectChanges();
  }

  //City Validation
  CityValidation() {
    if ((typeof this.f.City.value === 'string' && this.f.City.value !== '')) {
      this.InvalidCity = true;
      return;
    } else {
      this.InvalidCity = false;
    }
    this.chef.detectChanges();
  }

  //Blood Group Validation
  BloodGroupValidation() {
    if ((typeof this.f.BloodGroup.value === 'string' && this.f.BloodGroup.value !== '')) {
      this.InvalidBloodGroup = true;
      return;
    } else {
      this.InvalidBloodGroup = false;
    }
    this.chef.detectChanges();
  }

  //Designation Validation
  DesignationValidation() {
    if ((typeof this.f.Designation.value === 'string' && this.f.Designation.value !== '')) {
      this.InvalidDesignation = true;
      return;
    } else {
      this.InvalidBloodGroup = false;
    }
    this.chef.detectChanges();
  }

  // validation Pan No
  PANNoValidation(event: any) {
    this.commoncode.keyPressAlphanumeric(event);
  }


  // Redirect to Employee List
  redirect() {
    this.router.navigate(['/modules/masters/employee-list']);
    // this.GetCompanyList();
    this.GetCompanyListByBranch(this.RowId);
    this.chef.detectChanges();
  }

  // To Avoid Copy Paste Text In Textbox In Mobile No
  public CopyPasteMblNotSpelcharAllow() {
    let NewFlag: boolean = false;
    if (this.f.MobileNo.value === "") {
      this.IsInvalidMobile = false;
    }
    else {
      NewFlag = this.commoncode.Copynumberonlyandcomma(this.f.MobileNo.value);
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

  //To Avoid Copy Paste Text In Textbox In Pan Card
  copyPastNumbeAllow() {
    let NewFlag: boolean = false;
    if (this.f.PANNo.value === "") {
      this.IsInvalidPan = false;
    }
    else {
      NewFlag = this.commoncode.PanCradSplChNotAllow(this.f.PANNo.value);
      if (NewFlag === true) {
        this.IsInvalidPan = true
      }
      else {
        this.IsInvalidPan = false;
      }
      this.submitted = false;
      this.chef.detectChanges();
    }
  }

  // To Avoid Copy Paste Text In Textbox In Aadhar Card No
  public CopyPasteAadharSpelcharnotAllow() {
    let NewFlag: boolean = false;
    if (this.f.AadharCardNo.value === "") {
      this.IsInvAdhar = false;
      this.IsInvalidAdhar = false;
    }
    else {
      NewFlag = this.commoncode.CopyAvoidForAadhar(this.f.AadharCardNo.value);
      if (NewFlag === true) {
        this.IsInvAdhar = true;
      }
      else {
        this.IsInvAdhar = false;
      }
      this.submitted = false;
      this.chef.detectChanges();
    }
  }

}
