import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class AppCode {
  // Common Messages
  public static saveString: string = "Save";
  public static updateString: string = "Update";
  public static addString: string = "ADD";
  public static editString: string = "EDIT";
  public static deleteString: string = "DELETE";
  public static statusString: string = "STATUS";
  public static IsActiveString: string = "Y";
  public static IsInActiveString: string = "N";
  public static allString: string = "ALL";
  public static CityActiveString: string = "Y";
  public static ststString: string = "ALL";
  public static splstring: string = "SupplyType";
  public static cancelString: string = "Cancel";
  public static locationString: string = "Location";
  public static designationString: string = "Designation";
  public static headType: string = "Head Type";
  public static ChqRetReason: string = "Cheque Return Reason";
  public static bloodGroupString: string = "Blood Group";
  public static bankString: string = "Bank";
  public static defaultPasswordString: string = "cnf@1234";
  public static verifyString: string = "Verify";
  public static rejectString: string = "Reject";
  public static verifiedString: string = "Verified";
  public static createdString: string = "Created";
  public static rejectedString: string = "Rejected";
  public static itemCategorString: string = "Item Category";
  public static billingTypeString: string = "Billing Type";
  public static raiseConcernString: string = "Raise Concern";
  public static transportMethodString: string = "Transport Method";
  public static byhandstring: string = "By Hand";
  public static localstring: string = "Local";
  public static othercitystring: string = "Other City";
  public static CheckIsCourier: string = "Is Courier";
  public static raiseClaimstring: string = "RaiseClaim";
  public static updateClaimstring: string = "UpdateClaim";
  public static raiseSANstring: string = "RaiseSAN";
  public static updateSANstring: string = "UpdateSAN";
  public static claimtypes: string = "Claim Types";
  public static claimtypesstatus: string = "Y";
  public static otherCNF: string = "Other CNF";
  public static PaymentMode: string = "Payment Mode";
  public static HeadType: string = "Head Type";
  public static InvTypestring: string = "Comm Inv Type";
  public static PayModestring: string = "Payment Mode";


  // Display API response Messages
  public static SuccessStatus: string = "Success";
  public static ExistsStatus: string = "Exists";
  public static StatusChangedStatus: string = "Status Changed";
  public static msg_exist: string = "Record Already Exists!";
  public static msg_saveSuccess: string = "Data Saved Successfully";
  public static msg_verifySuccess: string = "Verified Successfully";
  public static msg_rejectSuccess: string = "Rejected Successfully";
  public static msg_stsChange: string = "Status Changed Successfully";
  public static msg_stsDeactivate: string = "Deactivate Successfully";
  public static FailStatus: string = "Failed";
  public static msg_deleteSuccess: string = "Data Deleted Successfully";
  public static msg_unexist: string = "Username already exists!";
  public static msg_empexist: string = "Employee already exists!";
  public static msg_updateSuccess: string = "Data Updated Successfully";
  public static msg_msg_stsActivate: string = "Activate Successfully";
  public static msg_AllotSuccess: string = "Alloted Successfully!";
  public static msg_AlreadyRealloted: string = "Picklist already realloted!";
  public static msg_AllotFail: string = "Something went wrong!";
  public static msg_selectPicker: string = "Atleast Select one picker!";
  public static msg_cancelled: string = "Invoice cancelled successfully";
  public static printStickerTitle: string = "Sticker";
  public static printGatepassTitle: string = "Gatepass";
  public static msg_printSticker: string = "Re-Print Sticker Request Sent Successfully";
  public static msg_alredyexist: string = "Picklist already used in transaction";
  public static msg_ChqBlockSts: string = "Cheque Blocked Successfully!";
  public static msg_ChqReleaseSts: string = "Cheque Released Successfully!";
  public static msg_ChqPrepareSts: string = "Cheque Prepared Successfully!";
  public static msg_ChqDiscardSts: string = "Cheque Discarded Successfully!";
  public static msg_ChqReturnSts: string = "Cheque Returned Successfully!";
  public static msg_ChqSettleSts: string = "Cheque Settled Successfully!";
  public static msg_FirstNoticeSts: string = "Cheque First Notice Successfully!";
  public static msg_LegalNoticeSts: string = "Cheque Legal Notice Successfully!";
  public static msg_EmailSuccess: string = "Password sent on your email!";
  public static msg_RegistrationSuccess: string = "Registration Saved Successfully";
  public static msg_EmsgWarning: string = "Please enter currect email!";
  public static msg_userexist: string = "User already exists!";
  public static msg_usercreate: string = "User Created Successfully";
  public static msg_ApproveSuccess: string = "Approved Successfully";
  public static msg_ResolveSuccess: string = "Resolved Successfully";
  public static DateFormat: string = "yyyy-MM-dd hh:mm:ss";
  public static DateOnlyFormatT: string = "yyyy-MM-dd";
  public static msg_UpdateLRMismatch: string = "LR Updated Successfully";
  public static msg_ReimbInvDelete: string = "Record not deleted because Reimbursment Payment Added";
  public static msg_PaymentAlredy: string = "Payment already exist in commission invoice";
  public static msg_ReadyForPayment: string = "Ready For Payment Successfully";

  // Resolve Concern
  public static msg_ResolveConernSuccess: string = "Resolve Concern Successfully!";
  public static msg_ResolveConernFail: string = "Something went wrong!";
  public static msg_StockistNoexist: string = "Stockist already exists!";
  public static RESOLVECONCERN: string = "RESOLVECONCERN";

  public static cnDelayReason: string = "Cn Delay Reason";
  public static msg_SrsSelect: string = "Please Select SRS!";
  public static msg_AddDelayReasonSuccess: string = "Delay Reason Successfully!";
  public static msg_AddDelayReasonFail: string = "Something went wrong!";
  public static msg_SelectGatepass: string = "Please Select Atleast One!";
  public static msg_OcrsaveSuccess: string = "Batch No. Saved Successfully";
  public static msg_RGBsaveSuccess: string = "RGB Data Saved Successfully";

  // Invoice - Status
  public static createdStatusForINV: number = 0;
  public static acceptedStatusForINV: number = 1;
  public static invoiceDrawnStatusForINV: number = 2;
  public static packedStatusForINV: number = 3;
  public static packingConcernStatusForINV: number = 4;
  public static readyToDispatchStatusForINV: number = 5;
  public static dispatchConcernStatusForINV: number = 6;
  public static getpassGeneratedStatusForINV: number = 7;
  public static dispatchedStatusForINV: number = 8;
  public static lRUpdatedStatusForINV: number = 9;
  public static cancelStatusForINV: number = 20;

  // Cheque - Status
  public static ChqBlank: number = 0;
  public static ChqBlok: number = 1;
  public static ChqPrepare: number = 2;
  public static chqDiscard: number = 3;
  public static ChqDeposited: number = 4;
  public static ChqReturn: number = 5;
  public static ChqFirstNotice: number = 6;
  public static ChqLegalNotice: number = 7;
  public static ChqSettle: number = 8;
  public static ChqMapInvoice: number = 9;

  // Stock Transfer
  public static CNFType: string = "Stock Transfer";
  public static msg_AddStockTransfer: string = "Stock Transfer Added Successfully";

  constructor() { }

  // get user from local storage
  public static getUser() {
    const user: any = sessionStorage.getItem('SessionLoginData');
    let UserInfo = JSON.parse(user);
    let User = UserInfo.UserInfo;
    return User;
  }

  // Only Mobile Number Allowed
  public numberOnly(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  // Only Mobile Number Allowed
  public numberonlyandcomma(event: any) {
    const pattern = /[0-9\+\-\,\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  public OnlyNumbersAllow(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Email Address
  public emailAddressOnly(emailAddress: any): boolean {
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (pattern.test(emailAddress)) {
      return true;
    } else {
      return false;
    }
  }


  // For Copy Paste avoid Mobile Number
  public Copynumberonlyandcomma(MobileNo: any): boolean {
    // const pattern = /^[0-9]+((?:[,-][0-9]{0,20})?)$/g;
    const pattern = /(0-9 .&'-,]+)/;
    if (pattern.test(MobileNo)) {
      return true;
    }
    else {
      return false;
    }
  }

  //Copy Paste avoid for Pan Card
  PanCradSplChNotAllow(PANNo: any): boolean {
    // const pattern = /^[a-z0-9]+$/i
    const pattern = /^[a-z0-9]+$/i;
    if (!pattern.test(PANNo)) {
      return true;
    }
    else {
      return false;
    }
  }

  //Copy Paste avoid for aadhar card
  CopyAvoidForAadhar(AadharCardNo: any): boolean {
    const pattern = /^[0-9]+$/;
    if (!pattern.test(AadharCardNo)) {
      return true;
    }
    else {
      return false;
    }
  }

  //Copy Paste avoid for GST No
  GSTSplChNotAllow(GSTNo: any): boolean {
    // const pattern = /^[a-z0-9]+$/i
    const pattern = /^[a-z0-9]+$/i;
    if (pattern.test(GSTNo)) {
      return true;
    }
    else {
      return false;
    }
  }


  // UTC - Create Date
  public static createDateAsUTC(date: Date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
  }

  // For Cheque Accounting Only Required Date
  public static createDateAsUTC1(date: Date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  }

  //Pan Alpha Number only
  keyPressAlphanumeric(event: any) {
    const pattern = /[a-zA-Z0-9]/;
    var inp = String.fromCharCode(event.keyCode);
    if (pattern.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  // export To Excel File
  public static exportToExcelFile(fileName: string, table: any) {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All Data Export');
    XLSX.writeFile(wb, fileName + '.xlsx');
  }

}

