import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OrderReturnService } from '../Services/order-return.service';
import { AppCode } from '../../../app.code';
import { PhysicalCheckModel } from '../models/PhysicalCheckModel';

@Component({
  selector: 'app-first-physical-check',
  templateUrl: './first-physical-check.component.html',
  styleUrls: ['./first-physical-check.component.scss']
})
export class FirstPhysicalCheckComponent implements OnInit {

  constructor(private fb: FormBuilder, private _Service: OrderReturnService,
    private chRef: ChangeDetectorRef, private toastr: ToastrService) { }

  PhysicalCheckorm: FormGroup;
  pageState: string = '';
  PhysicalTitle: string = '';
  physicalCheck: PhysicalCheckModel;
  UserId: number = 0;
  BranchId: number = 0;
  CompId: number = 0;
  isLoading: boolean = false;
  searchModel: string = '';
  submitted = false;

  defaultform: any = {
    GatePassNo: '',
    StockistName: '',
    LRNo: '',
    ReturnCategory: '',
    ClaimNo: '',
    ClaimDate: '',
  }


  ngOnInit(): void {
    this.pageState = AppCode.saveString;
    this.PhysicalTitle = "Add First Physical Check";
    this.initForm();
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompId;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.PhysicalCheckorm.controls;
  }


  initForm() {
    this.PhysicalCheckorm = this.fb.group({
      GatePassNo: [
        this.defaultform.GatePassNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      StockistName: [
        this.defaultform.StockistName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ]),
      ],
      LRNo: [
        this.defaultform.LRNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ]),
      ],
      ReturnCategory: [
        this.defaultform.ReturnCategory,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ]),
      ],
      ClaimNo: [
        this.defaultform.ClaimNo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ]),
      ],
      ClaimDate: [
        this.defaultform.ClaimDate,
        Validators.compose([
          Validators.required
        ]),
      ],
    });
  }

  SavePhysicalCheck() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.PhysicalCheckorm.valid) {
      this.isLoading = false;
      return;
    }
    else {
      // this.physicalCheck = new PhysicalCheckModel();
      // this.physicalCheck.GatePassNo = this.f.GatePassNo.value;
      // this.physicalCheck.StockistName = this.f.StockistName.value;
      // this.physicalCheck.LRNo = this.f.LRNo.value;
      // this.physicalCheck.ReturnCategory = this.f.ReturnCategory.value;
      // this.physicalCheck.ClaimNo = this.f.ClaimNo.value;
      // this.physicalCheck.ClaimDate = this.f.ClaimDate.value;
      // this.physicalCheck.isActive = AppCode.IsActiveString;
      // if (this.pageState == AppCode.saveString) {
      //   this.physicalCheck.CompId = 0;
      //   this.physicalCheck.Action = AppCode.addString;
      // }
      // else {
      //   this.physicalCheck.CompId = this.CompId;
      //   this.physicalCheck.Action = AppCode.editString;
      }
    //   this._service.SaveGeneral_Service(this.physicalCheck)
    //     .subscribe((data: any) => {
    //       if (data === AppCode.SuccessStatus) {
    //         if (this.pageState == AppCode.saveString) {
    //           this.toastr.success(AppCode.msg_saveSuccess);
    //         } else {
    //           this.toastr.success(AppCode.msg_updateSuccess);
    //         }
    //         // this.ClearForm();
    //         this.chRef.detectChanges();
    //       } else if (data === AppCode.ExistsStatus) {
    //         this.toastr.warning(AppCode.msg_exist);
    //         this.isLoading = false;
    //         this.chRef.detectChanges();
    //       } else {
    //         this.toastr.error(data);
    //         // this.ClearForm();
    //       }
    //     },
    //       (error: any) => {
    //         console.error(error);
    //       })
    }

  //  clear form on click cancel button
    ClearForm() {
      this.f.GatePassNo.setValue('');
      this.f.StockistName.setValue('');
      this.f.LRNo.setValue('');
      this.f.ReturnCategory.setValue('');
      this.f.ClaimNo.setValue('');
      this.f.ClaimDate.setValue('');
      this.chRef.detectChanges();
    }
}

