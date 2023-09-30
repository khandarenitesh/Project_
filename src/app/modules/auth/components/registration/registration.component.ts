import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AddEmployeeModel } from '../../../master-forms/Models/EmployeeModel';
import { AppCode } from '../../../../app.code';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {

  registrationForm: FormGroup;
  submitted: boolean = false;
  pageState: string = "";
  addRegistrationModel: AddEmployeeModel;
  encpwd: any;
  UserId: number = 0;
  BranchId: number = 0;
  EmpNo: number = 0
  hasError: boolean;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _ToastrService: ToastrService,
    private chef: ChangeDetectorRef,
    private _service: AuthService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.pageState = AppCode.saveString;
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.registrationForm = this.fb.group(
      {
        Name: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(40), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          ]),
        ],
        mobile: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        UserName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
      },
    );
  }

  // Save User Registration Details
  SaveEmployee() {
    this.submitted = true;
    let pwd = this.f.password.value;
    this.encpwd = this.authService.encryptData(pwd);
    if (!this.registrationForm.valid) {
      return;
    } else if (this.pageState === AppCode.saveString) {
      this.addRegistrationModel = new AddEmployeeModel();
      this.addRegistrationModel.EmpName = this.f.Name.value;
      this.addRegistrationModel.EmpEmail = this.f.email.value;
      this.addRegistrationModel.EmpMobNo = this.f.mobile.value;
      this.addRegistrationModel.UserName = this.f.UserName.value;
      this.addRegistrationModel.Password = this.f.password.value;
      this.addRegistrationModel.EncryptPassword = this.encpwd;
      this.addRegistrationModel.Addedby = '0';
      this.addRegistrationModel.EmpNo = '0';
      this.addRegistrationModel.IsUser = 'Y';
      this.addRegistrationModel.BranchId = 0;
      this.addRegistrationModel.companyStr = '0,'
      this.addRegistrationModel.RoleIdStr = '1,';

      this._service.UserRegistration_Service(this.addRegistrationModel)
        .subscribe((data: any) => {
          if (data === AppCode.SuccessStatus) {
            this._ToastrService.success(AppCode.msg_RegistrationSuccess);
            this.redirect();
            this.chef.detectChanges();
          } else if (data === AppCode.ExistsStatus) {
            this._ToastrService.warning(AppCode.msg_userexist);
            this.chef.detectChanges();
          } else {
            this._ToastrService.error(data);
          }
        }, (error: any) => {
          console.error(error);
        });
    }
  }

  // Username is available
  onUserNameChange() {
    this._service.getCheckUsernameAvailable_Service(this.f.UserName.value)
      .subscribe((data: any) => {
        if (data !== null) {
          if (data.UserName.toLowerCase() === this.f.UserName.value.toLowerCase()) {
            this._ToastrService.warning(AppCode.msg_unexist);
          }
          this.chef.detectChanges();
        }
      }, (error) => {
        console.error(error);
      });
  }

  //direct to login page
  redirect() {
    this.registrationForm.reset();
    this.router.navigate(['/auth/login']);
    this.chef.detectChanges();
  }

  submit() {
    this.hasError = false;
    const result: {
      [key: string]: string;
    } = {};
    Object.keys(this.f).forEach((key) => {
      result[key] = this.f[key].value;
    });
    const newUser = new UserModel();
    newUser.setUser(result);
    const registrationSubscr = this.authService
      .registration(newUser)
      .pipe(first())
      .subscribe((user: UserModel) => {
        if (user) {
          this.router.navigate(['/']);
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(registrationSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
