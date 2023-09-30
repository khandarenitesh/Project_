import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr'
import { AppCode } from '../../../../app.code';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;

  constructor(private fb: FormBuilder, private authService:
    AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(8),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
  }

  SaveforgotPass() {
    let model = {
      "Email": this.f.email.value
    }
    this.authService.ForgotPassword(model).subscribe((data: any) => {
      if (data ===AppCode.SuccessStatus) {
        this.toastr.success(AppCode.msg_EmailSuccess);
      }
      else{
        this.toastr.warning(AppCode.msg_EmsgWarning);
      }
    },
      (error: any) => {
        this.toastr.error('something is wrong!')
      }
    );
  }
}
