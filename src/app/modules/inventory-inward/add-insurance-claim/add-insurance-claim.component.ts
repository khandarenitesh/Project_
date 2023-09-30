import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { InsuranceModel } from '../models/InsuranceModel';

import { SharedService } from '../../../SharedServices/shared.service';
import { InventoryInwardService } from '../Services/inventory-inward.service';
import { AppCode } from '../../../app.code';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';

@Component({
  selector: 'app-add-insurance-claim',
  templateUrl: './add-insurance-claim.component.html',
  styleUrls: ['./add-insurance-claim.component.scss']
})
export class AddInsuranceClaimComponent implements OnInit {
  ClaimForm: FormGroup
  defaultform: any = { LRNo: '', ClaimNo: '', ClaimDate: '', ClaimAmount: '', ClaimType: '', EmailSendDate: '', Remark: '', SANNo: '', SANDate: '', SANAmount: '' }
  AddInsuranceMsg: string = '';
  btnCancelText: string = '';
  pageState: string = '';
  minDate = new Date();
  maxDate = new Date();
  submitted: boolean = false;
  isLoading: boolean = false;
  insurancemodel: InsuranceModel;
  UserId: Number = 0;
  BranchId: number = 0;
  ClaimId: number = 0;
  CompanyId: number = 0;
  currentDate = new Date();
  InvoiceList: any = [];
  ClaimTypeLists: any = []
  InvalidLRNo: boolean = false;
  InvalidClaimType: boolean = false;
  MapInwardLRList: any = [];
  filteredOptionsLR: Observable<InsuranceModel[]>;
  filteredOptionsClaimType: Observable<InsuranceModel[]>;
  State: any = { state: '' };
  TransitId: number = 0;
  ThresholdData: any;
  CheckThresholdValueSan: boolean = false;
  CheckThresholdValueClaim: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private toaster: ToastrService,
    private chRef: ChangeDetectorRef, private _service: InventoryInwardService, private route: ActivatedRoute,
    private _SharedService: SharedService, private _masterservice: MastersServiceService, private _appCode: AppCode) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.GetClaimTypeList();
    this.AddInsuranceMsg = "Add Insurance Claim";
    this.btnCancelText = AppCode.cancelString;
    this.pageState = AppCode.saveString;
    this.initForm();
    this.f.ClaimDate.setValue(this.currentDate);
    this.f.SANDate.setValue(this.currentDate);

    this.route.queryParams.subscribe(params => {
      this.State = params;
    })
    if (this.State.state !== undefined && this.State.state !== null) {
      this.setData();  // Set Data
    }
    this.GetThresholdValueList();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.ClaimForm.controls;
  }

  initForm() {
    this.ClaimForm = this.fb.group({
      LRNo: [
        this.defaultform.LRNo,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      ClaimNo: [
        this.defaultform.ClaimNo,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      ClaimDate: [
        this.defaultform.ClaimDate,
        Validators.compose([
          Validators.required,
        ]),
      ],
      ClaimAmount: [
        this.defaultform.ClaimAmount,
        Validators.compose([
          Validators.required, Validators.maxLength(50)
        ]),
      ],
      ClaimType: [
        this.defaultform.ClaimType,
        Validators.compose([
          Validators.required, Validators.maxLength(50)
        ]),
      ],
      Remark: [
        this.defaultform.Remark,
        Validators.compose([
        ]),
      ],
      EmailSendDate: [
        this.defaultform.EmailSendDate,
      ],
      SANNo: [
        this.defaultform.SANNo,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      SANDate: [
        this.defaultform.SANDate,
        Validators.compose([
          Validators.required,
        ]),
      ],
      SANAmount: [
        this.defaultform.SANAmount,
        Validators.compose([
          Validators.required,
        ]),
      ]
    });
  }

  // if needed
  GetLRList() {
    this._service.GetMappedInwardLRList_Service(this.BranchId, this.CompanyId)
      .subscribe((data: any) => {
        this.MapInwardLRList = data;
        this.MapInwardLRList = this.MapInwardLRList.sort((a: any, b: any) => a.LRNo.localeCompare(b.LRNo));
        this.filteredOptionsLR = this.f.LRNo.valueChanges
          .pipe(
            startWith<string | InsuranceModel>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.LRNo : null),
            map(LRNo => LRNo ? this.filterLRNo(LRNo) : this.MapInwardLRList.slice())
          );
        this.chRef.detectChanges();
      }, (error) => {
        console.error(error);
        this.chRef.detectChanges();
      });
  }

  // Autocomplete Search Filter
  private filterLRNo(name: string): InsuranceModel[] {
    this.InvalidLRNo = false;
    const filterValue = name.toLowerCase();
    return this.InvoiceList.filter((option: any) =>
      option.LRNo.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnLRNo(pkId: InsuranceModel): string {
    return pkId && pkId.LRNo ? pkId.LRNo : '';
  }

  GetClaimTypeList() {
    this._masterservice.GetGeneralMasterList_Service(AppCode.claimtypes, AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.ClaimTypeLists = data.GeneralMasterParameter;
          this.ClaimTypeLists = this.ClaimTypeLists.sort((a: any, b: any) => a.MasterName.localeCompare(b.MasterName));
          this.filteredOptionsClaimType = this.f.ClaimType.valueChanges
            .pipe(
              startWith<string | InsuranceModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.MasterName : null),
              map(MasterName => MasterName ? this.filterClaimType(MasterName) : this.ClaimTypeLists.slice())
            );
          this.chRef.detectChanges();
        }, (error) => {
          console.error(error);
          this.chRef.detectChanges();
        });
  }

  // Autocomplete Search Filter
  private filterClaimType(name: string): InsuranceModel[] {
    this.InvalidClaimType = false;
    const filterValue = name.toLowerCase();
    return this.ClaimTypeLists.filter((option: any) =>
      option.MasterName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayFnautoClaimType(cType: InsuranceModel): string {
    return cType && cType.MasterName ? cType.MasterName : '';
  }

  // Get Threshold value List
  GetThresholdValueList() {
    this.isLoading = true;
    this._masterservice.getThresholdvalueMasterList_Service(this.BranchId, this.CompanyId).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.ThresholdData = data;
      } else {
        this.ThresholdData = [];
      }
      this.isLoading = false;
      this.chRef.detectChanges();
    });
  }

  CheckSanAndClaim() {
    this.isLoading = true;
    if (this.ThresholdData !== "" && this.ThresholdData !== null) {
      if (this.f.ClaimAmount.value !== "" && this.f.ClaimAmount.value !== null && this.f.ClaimAmount.value !== undefined) {
        if (parseInt(this.f.ClaimAmount.value) > this.ThresholdData[0].ThresholdValue) {
          this.CheckThresholdValueSan = true;
        }
      } else if (this.f.SANAmount.value !== "" && this.f.SANAmount.value !== null && this.f.SANAmount.value !== undefined) {
        if (parseInt(this.f.SANAmount.value) < this.ThresholdData[0].ThresholdValue) {
          this.CheckThresholdValueClaim = true;
        }
      }
      if (this.CheckThresholdValueSan === false && this.f.ClaimAmount.value !== "") {
        this.toaster.warning('Amount should be less than or equal threshold value - ' + this.ThresholdData[0].ThresholdValue + '', 'Applicable for Raise San!');
        return;
      } else if (this.CheckThresholdValueClaim === false && this.f.SANAmount.value !== "") {
        this.toaster.warning('Amount should be greater than or equal threshold value - ' + this.ThresholdData[0].ThresholdValue + '', 'Applicable for Raise Claim!');
        return;
      }
    }
    else {
      this.toaster.warning('something is wrong!');
    }
    this.isLoading = false;
    this.chRef.detectChanges();
  }

  // Save Insurance Claim Data (Claim and SAN)
  SaveInsuranceData() {
    this.submitted = true;
    if (!this.ClaimForm.valid) {
      this.InvalidLRNo = false;
      return;
    } else {
      if (this.State.state !== AppCode.raiseSANstring && this.State.state !== AppCode.updateSANstring) {
        if ((this.f.ClaimType.value.pkId === "" || this.f.ClaimType.value.pkId === null || this.f.ClaimType.value.pkId === undefined)) {
          this.InvalidClaimType = true;
          return;
        }
      }
      //check threshold value for raise san and raise claim.
      this.CheckSanAndClaim();
      if (this.CheckThresholdValueSan === false && this.CheckThresholdValueClaim === false) {
        return;
      }
      if (this.InvalidLRNo === false && this.InvalidClaimType === false) {
        this.insurancemodel = new InsuranceModel();
        this.insurancemodel.TransitId = this.TransitId;
        this.insurancemodel.BranchId = this.BranchId;
        this.insurancemodel.CompId = this.CompanyId;
        this.insurancemodel.LRNo = this.f.LRNo.value.LRNo;
        if (this.State.state !== AppCode.raiseSANstring && this.State.state !== AppCode.updateSANstring) {
          this.insurancemodel.ClaimNo = this.f.ClaimNo.value;
          this.insurancemodel.ClaimDate = AppCode.createDateAsUTC(new Date(this.f.ClaimDate.value));
          this.insurancemodel.ClaimAmount = this.f.ClaimAmount.value;
          this.insurancemodel.ClaimTypeId = this.f.ClaimType.value.pkId;
          if (this.f.EmailSendDate.value !== null) {
            this.insurancemodel.EmailSendDate = AppCode.createDateAsUTC(new Date(this.f.EmailSendDate.value));
          } else {
            this.insurancemodel.EmailSendDate = new Date(0);
          }
          this.insurancemodel.SANDate = new Date(0);
          if (this.insurancemodel.EmailSendDate !== null || this.insurancemodel.EmailSendDate !== undefined) {
            this.insurancemodel.IsEmailSend = 1;
          }
        } else {
          this.insurancemodel.SANNo = this.f.SANNo.value;
          this.insurancemodel.SANDate = AppCode.createDateAsUTC(new Date(this.f.SANDate.value));
          this.insurancemodel.SANAmount = this.f.SANAmount.value;
          this.insurancemodel.ClaimDate = new Date(0);
          this.insurancemodel.EmailSendDate = new Date(0);
        }
        this.insurancemodel.Remark = this.f.Remark.value;
        this.insurancemodel.Addedby = String(this.UserId);
        if (this.pageState == AppCode.saveString) {
          this.insurancemodel.ClaimId = 0; //insertions
          this.insurancemodel.Action = AppCode.addString;
        }
        else {
          this.insurancemodel.ClaimId = this.ClaimId;
          this.insurancemodel.Action = AppCode.editString;
        }
        this._service.SaveInsuranceData_Service(this.insurancemodel)
          .subscribe((data: any) => {
            if (data > 0) {
              if (this.pageState == AppCode.saveString) {
                this.toaster.success(AppCode.msg_saveSuccess);
              } else {
                this.toaster.success(AppCode.msg_updateSuccess);
              }
              this.redirect();
            } else if (data === -1) {
              this.toaster.warning(AppCode.msg_exist);
              this.isLoading = false;
              this.chRef.detectChanges();
            } else {
              this.toaster.error(data);
              this.redirect();
            }
          }, (error: any) => {
            console.error(error);
            this.isLoading = false;
            this.chRef.detectChanges();
          });
      }
    }
  }

  // Set data on click edit button
  setData() {
    this.insurancemodel = new InsuranceModel();
    this.insurancemodel = this._SharedService.getData();
    if (this.insurancemodel !== undefined) {
      // Raise Claim - Add/Update
      if (this.State.state === AppCode.raiseClaimstring) {
        this.AddInsuranceMsg = "Raise Insurance Claim";
        this.pageState = AppCode.saveString;
        this.f.SANNo.disable();
        this.f.SANDate.disable();
        this.f.SANAmount.disable();
      } else {
        this.AddInsuranceMsg = "Update Insurance Claim";
        this.pageState = AppCode.updateString;
        this.f.SANNo.disable();
        this.f.SANDate.disable();
        this.f.SANAmount.disable();
      }

      // Raise SAN (Only Add Operation)
      if (this.State.state === AppCode.raiseSANstring) {
        this.AddInsuranceMsg = "Raise SAN";
        this.pageState = AppCode.saveString;
        this.f.SANNo.enable();
        this.f.SANDate.enable();
        this.f.SANAmount.enable();
        this.f.ClaimNo.disable();
        this.f.ClaimAmount.disable();
        this.f.ClaimDate.disable();
        this.f.EmailSendDate.disable();
        this.f.ClaimType.disable();
      } else if (this.State.state === AppCode.updateSANstring) {
        this.AddInsuranceMsg = "Update SAN";
        this.pageState = AppCode.updateString;
        this.f.SANNo.disable();
        this.f.SANDate.enable();
        this.f.SANAmount.enable();
        this.f.ClaimNo.disable();
        this.f.ClaimAmount.disable();
        this.f.ClaimDate.disable();
        this.f.EmailSendDate.disable();
        this.f.ClaimType.disable();
      }
      this.ClaimId = this.insurancemodel.ClaimId;
      this.insurancemodel.CompId = this.CompanyId;
      this.BranchId = this.insurancemodel.BranchId;
      let s: any = {
        LRNo: this.insurancemodel.LRNo
      };
      this.f.LRNo.setValue(s);
      this.f.LRNo.disable();
      if (this.State.state === AppCode.updateClaimstring) {
        this.f.ClaimNo.setValue(this.insurancemodel.ClaimNo);
        this.f.ClaimNo.disable();
        this.f.ClaimDate.setValue(this.insurancemodel.ClaimDate);
        this.f.ClaimAmount.setValue(this.insurancemodel.ClaimAmount);
        let obj: any = {
          pkId: this.insurancemodel.ClaimTypeId,
          MasterName: this.insurancemodel.ClaimType
        }
        this.f.ClaimType.setValue(obj);
        this.f.EmailSendDate.setValue(this.insurancemodel.EmailDate);
      } else if (this.State.state === AppCode.updateSANstring) {
        this.f.SANNo.setValue(this.insurancemodel.SANNo);
        this.f.SANDate.setValue(this.insurancemodel.SANDate);
        this.f.SANAmount.setValue(this.insurancemodel.SANAmount);
      }
      this.f.Remark.setValue(this.insurancemodel.Remark);
      this.TransitId = this.insurancemodel.TransitId;
      this.chRef.detectChanges();
    } else {
      this.redirect();
    }
  }

  // LRNo Validation
  LRNoValidation() {
    if ((typeof this.f.LRNo.value === 'string' && this.f.LRNo.value !== '')) {
      this.InvalidLRNo = true;
      return;
    } else {
      this.InvalidLRNo = false;
    }
    this.chRef.detectChanges();
  }

  // ClaimType Validation
  ClaimTypeValidation() {
    if ((typeof this.f.ClaimType.value === 'string' && this.f.ClaimType.value !== '')) {
      this.InvalidClaimType = true;
      return;
    } else {
      this.InvalidClaimType = false;
    }
    this.chRef.detectChanges();
  }

  // Redirect to Insurance List (Claim & SAN)
  redirect() {
    if (this.State.state !== AppCode.updateClaimstring && this.State.state !== AppCode.updateSANstring) {
      this.router.navigate(['/modules/inventory-inward/approve-vehicle-issue']);
    } else {
      this.router.navigate(['/modules/inventory-inward/insurance-claim-list']);
    }
    this.ClearForm();
  }

  // clear form on click cancel button (Claim & SAN)
  ClearForm() {
    // this.f.LRNo.setValue('');
    // this.f.ClaimNo.setValue('');
    // this.f.ClaimDate.setValue('');
    // this.f.ClaimAmount.setValue('');
    // this.f.ClaimType.setValue('');
    // this.f.EmailSendDate.setValue('');
    this.ClaimForm.reset();
    this.chRef.detectChanges();
  }

  // Number validation
  numberValidation(event: any) {
    this._appCode.numberOnly(event);
  }


}
