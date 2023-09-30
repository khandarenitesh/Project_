import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from '../../../../_metronic/layout';
import { MastersServiceService } from '../../../master-forms/Services/masters-service.service';
import { AppCode } from 'src/app/app.code';
import { PermissionsModel } from '../../models/permissions.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { changePassword } from '../../../profile/model/ChangePassword';
import { ChangepasswordService } from '../../../profile/service/changepassword.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: '',
    password: '',
    Company: '',
    Branch: ''
  };
  loginForm: FormGroup;
  changepassForm: FormGroup;
  hasError: boolean;
  isDeactivate: boolean;
  returnUrl: string;
  isLoading: boolean = false;
  @ViewChild('changepassword', { static: true }) changepassword: ElementRef;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  asideDisplay: boolean;
  toolbarDisplay = true;
  contentContainerClasses = '';
  asideCSSClasses: string;
  headerCSSClasses: string;
  headerHTMLAttributes: any = {};
  CompanyList: any[] = [];
  RoleList: any[] = [];
  FilteredRoleList: any[] = [];
  BranchList: any[] = [];
  @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;
  permissions: any;
  Title: string = 'Change Password';
  ChangePasswordModel: any;
  EncPassword: any;
  changePasswordModel: changePassword;
  public showPassword: boolean;
  public showPasswordOnPress: boolean;
  IsAccountant: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private chef: ChangeDetectorRef,
    private modalService: NgbModal,
    private _ToastrService: ToastrService,
    private _authservice: AuthService,
    private _ChangePasswordservice: ChangepasswordService
  ) {
    // this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.GetCompanyList();
    this.GetRoleList();
    this.GetBranchList();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  get cpf() {
    return this.changepassForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          // Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(100),
        ]),
      ],
      Company: [
        this.defaultAuth.Company,
        Validators.compose([
          Validators.required,
        ]),
      ],
      Branch: [
        this.defaultAuth.Branch,
        Validators.compose([
          Validators.required,
        ]),
      ],
      Role: [
        this.defaultAuth.Role,
        Validators.compose([
          Validators.required,
        ]),
      ],
    });

    this.changepassForm = this.fb.group({
      NewPassword: [
        this.defaultAuth.NewPassword,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(100),
        ]),
      ],
      ConfmPassword: [
        this.defaultAuth.ConfmPassword,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(100),
        ]),
      ]
    })
  }

  // Get Company List
  GetCompanyList() {
    this.authService.getCompanyList_Service(AppCode.IsActiveString)
      .subscribe((data: any) => {
        this.CompanyList = data.sort((a:any,b:any) => a.CompanyName.localeCompare(b.CompanyName));
        this.chef.detectChanges();
      }, (error) => {
        console.error(error);
      });
  }

  // Get Role List
  GetRoleList() {
    this.authService.getRoleList_Service()
      .subscribe((data: any) => {
        this.RoleList = data;
        this.FilteredRoleList = this.RoleList.filter(x => x.RoleId < 5 || x.RoleId === 10 || x.RoleId === 7  || x.RoleId === 11);
        // || x.RoleId === 2 || x.RoleId === 3 || x.RoleId===4 );
        this.chef.detectChanges();
      },
        (error) => {
          console.error(error);
        })
  }

  // Get Branch List
  GetBranchList() {
    this.authService.getBranchList_Service(AppCode.IsActiveString)
      .subscribe((data: any) => {
        this.BranchList = data;
        this.chef.detectChanges();
      },
        (error) => {
          console.error(error);
        })
  }

  onchangeRole() {
    if (this.loginForm.controls.Role.value === 1 || this.loginForm.controls.Role.value === 11) {
      this.loginForm.controls.Company.disable();
      this.loginForm.controls.Company.reset();// Clear The Value Of Company DropDown
      this.loginForm.controls.Branch.disable();
      this.loginForm.controls.Branch.clearValidators();
      this.loginForm.controls.Branch.updateValueAndValidity();
      this.loginForm.controls.Company.clearValidators();
      this.loginForm.controls.Company.updateValueAndValidity();
    }
    else if (this.loginForm.controls.Role.value == 10) {
      this.IsAccountant = true;
      this.loginForm.controls.Branch.enable();
      this.loginForm.controls.Company.clearValidators();
      this.loginForm.controls.Company.updateValueAndValidity();
      this.loginForm.controls.Branch.setValidators([Validators.required]);
      this.loginForm.controls.Branch.updateValueAndValidity();
    }
    else {
      this.loginForm.controls.Company.enable();
      this.loginForm.controls.Company.setValidators([Validators.required])
      this.loginForm.controls.Branch.clearValidators();
      this.loginForm.controls.Branch.updateValueAndValidity();
      this.IsAccountant = false;
    }
  }

  submit() {
    this.hasError = false;
    this.isLoading = true;
    this.isDeactivate = false;
    const loginSubscr = this.authService
      .PostSignIn(this.f.email.value, this.f.password.value, this.f.Role.value, this.f.Company.value, this.f.Branch.value)
      // .pipe()
      .subscribe((user: UserModel | undefined) => {
        if (user) {
          this.afterLogin(user);
        } else {
          this.hasError = true;
          this.isLoading = false;
          this.chef.detectChanges();
        }
      });
    this.unsubscribe.push(loginSubscr);
  }

  afterLogin(user: UserModel) {
    if (user.UserInfo.IsActive === "Y") {
      if (user.UserInfo.Password === 'cnf@1234' && user.UserInfo.RoleId === 1) {
        this.OpenPopUp();
      }
      else {
        this.isLoading = false;
        this.router.navigate([this.returnUrl]);
      }
    }
    else {
      this.isLoading = false;
      this.isDeactivate = true;
      this.authService.logout();
      this.chef.detectChanges();
    }
  }

  OpenPopUp() {
    this.ChangePasswordModel = this.modalService.open(this.changepassword, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  changePassword() {
    if (this.cpf.NewPassword.value !== this.cpf.ConfmPassword.value) {
      this._ToastrService.warning("Password and Confirm Password doesn't match!");
      return;
    }
    this.EncPassword = this._authservice.encryptData(this.cpf.NewPassword.value);
    this.changePasswordModel = new changePassword();
    this.changePasswordModel.upwd = this.cpf.NewPassword.value;
    this.changePasswordModel.unm = this.f.email.value;
    this.changePasswordModel.Encryptpwd = this.EncPassword;
    this.changePasswordModel.IsActive = 'Y';
    this.changePasswordModel.AddedBy = '1';
    this.changePasswordModel.EmpId = 1;
    this._ChangePasswordservice.ChangePassword_Service(this.changePasswordModel)
      .subscribe((data: any) => {
        if (data > 0) {
          this._ToastrService.success("Password Changed Successfully!");
          this.modalService.dismissAll();
          this.isLoading = false;
          this.router.navigate([this.returnUrl]);
        }
      },
        (error: any) => {
          console.error(error);
          this._ToastrService.error('Something went wrong!')
        })
  }

  // submit() {
  //   debugger;
  //   this.hasError = false;
  //   const loginSubscr = this.authService
  //     .login(this.f.email.value, this.f.password.value)
  //     .pipe(first())
  //     .subscribe((user: UserModel | undefined) => {
  //       if (user) {
  //         this.router.navigate([this.returnUrl]);
  //       } else {
  //         this.hasError = true;
  //       }
  //     });
  //   this.unsubscribe.push(loginSubscr);
  // }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
