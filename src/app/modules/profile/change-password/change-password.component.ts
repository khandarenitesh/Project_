import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ConfirmPasswordValidator } from './ConfirmPasswordValidator';
import { changePassword } from '../model/ChangePassword';
import { ChangepasswordService } from '../service/changepassword.service';
import { AuthService } from '../../auth/services/auth.service';
import { UserProfile } from '../model/userProfile';
import { ToastrService } from 'ngx-toastr';
import { AppCode } from '../../../app.code';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changepasswordForm: FormGroup;
  submitted = false;
  changePassword: changePassword;
  UserId: number = 0;
  message: string = 'dsdsdsd';
  IsSucess: boolean = false;
  pageState: string = "Save";
  EmpId: number = 0;
  EmployeeName: string = "";
  UserName: string = "";
  userdetails: UserProfile;
  oldPass: string = '';
  EncPassword: any;

  State: any = {
    state: 'Save'
  };

  defaultform: any = {
    EmployeeId: '',
    EmployeeName: '',
    oldPassword: '',
    npassword: '',
    cnfmPassword: '',
  };

  constructor(
    private fb: FormBuilder,
    private _service: ChangepasswordService,
    private _authservice: AuthService,
    private toaster: ToastrService,
    private chef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    let obj = AppCode.getUser()
    this.UserName = obj.UserName;
    this.UserId = obj.UserId;
    this.EmpId = obj.EmpId;
    this.f.EmployeeId.setValue(this.EmpId);
    this.changepasswordForm.controls['EmployeeId'].disable();
    this.EmployeeName = obj.EmpName;
    this.f.EmployeeName.setValue(this.EmployeeName);
    this.changepasswordForm.controls['EmployeeName'].disable();
    this.getUserProfile();
    this.pageState = "Save"
  }

  get f(): { [key: string]: AbstractControl } {
    return this.changepasswordForm.controls;
  }
  initForm() {
    this.changepasswordForm = this.fb.group(
      {
        EmployeeId: [
          this.defaultform.EmployeeId
        ],
        EmployeeName: [
          this.defaultform.EmployeeName
        ],
        oldPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(100),
          ]),
        ],
        npassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(100),
          ]),
        ],
        cnfmPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(100),
          ]),
        ],
        agree: [false, Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      },
    );
  }

  SavechangePass() {
    this.EncPassword = this._authservice.encryptData(this.f.npassword.value);
    if (this.oldPass !== this.f.oldPassword.value) {
      this.toaster.warning("Old password is not correct!");
    }
    else {
      this.submitted = true;
      if (!this.changepasswordForm.valid) {
        this.toaster.warning("Please Enter valid details!");
        return;
      }
      else {
        this.changePassword = new changePassword();
        this.changePassword.upwd = this.f.npassword.value;
        this.changePassword.unm = this.UserName;
        this.changePassword.Encryptpwd = this.EncPassword;
        this.changePassword.IsActive = 'Y';
        this.changePassword.AddedBy = String(this.UserId);
        this.changePassword.EmpId = this.EmpId;
        this._service.ChangePassword_Service(this.changePassword)
          .subscribe((data: any) => {
            if (data > 0) {
              this.toaster.success("Password Changed Successfully!");
              this.toaster.success("Please Login With New Password!")
              this.ClearForm();
              this._authservice.logout();
              document.location.reload();
            }
          },
            (error: any) => {
              console.error(error);
              this.toaster.error('Something went wrong!')
            })
      }
    }
  }

  ClearForm() {
    this.f.oldPassword.setValue('');
    this.f.npassword.setValue('');
    this.f.cnfmPassword.setValue('');
    this.router.navigate(['./dashboard']);

  }

  getUserProfile() {     //get user details
    this._service.getuserProfile(this.UserId).subscribe({
      next: (res: UserProfile) => {
        this.userdetails = res;
        this.oldPass = this.userdetails.Password;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

}
