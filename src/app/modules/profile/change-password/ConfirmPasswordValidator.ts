import { AbstractControl } from '@angular/forms';

export class ConfirmPasswordValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static MatchPassword(control: AbstractControl): void {

    const password = control.get('npassword')?.value;
    const confirmPassword = control.get('cnfmPassword')?.value;

    if (password !== confirmPassword) {
      control.get('cnfmPassword')?.setErrors({ ConfirmPassword: true });
    }
  }
}
