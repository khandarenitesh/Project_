import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { InvCommisionModel } from '../models/inv-commision-model.model';
import { ExpInvModel, PaymentModel } from '../models/ExpInvModel';

// models
import { ReimbursementInvoiceAddEditModel, ReimbursementPaymentAddEditModel } from '../models/reimbursement-invoice';
import { CheckInvModelSave } from '../models/gatepas-bill-list';

@Injectable({
  providedIn: 'root'
})
export class AccountModuleService {
  // Reimbursement Invoice
  private ReimbursementInvoiceAddEdit_Url = `${environment.apiUrl}Accounts/ReimbursementInvoiceAddEdit`;
  private GetReimbursementInvoiceList_Url = `${environment.apiUrl}Accounts/ReimbursementInvoiceList/`;
  private GetReimInvNo_Url = `${environment.apiUrl}Accounts/GetReimInvNo/`;
  private GetReimbursementInvById_Url = `${environment.apiUrl}Accounts/GetReimbursementInvById/`;

  // Expence Invoice
  private SaveExpInv_Url = `${environment.apiUrl}Accounts/ExpenseRegisterAddEdit/`;
  private GetExpInvList_Url = `${environment.apiUrl}Accounts/ExpenseRegisterList/`;
  private SaveExpInvPay_Url = `${environment.apiUrl}Accounts/ExpPaymentAdd/`;
  private GetExpPayList_Url = `${environment.apiUrl}Accounts/ExpenseRegisterPaymentList/`;

  // Reimbursement - Payment Details
  private ReimbursementPaymentAddEdit_Url = `${environment.apiUrl}Accounts/ReimbursementPaymentAddEdit`;
  private GetReimbursementPaymentList_Url = `${environment.apiUrl}Accounts/ReimbursementPaymentList/`;

  private AddCommInvoiceAddEdit_Url = `${environment.apiUrl}Accounts/AddEditCommissionInv`;
  private CommInvGenerateNewNo = `${environment.apiUrl}Accounts/GetInvoiceGenerateNewNo/`;
  private GetCommisionInvoiceList_Url = `${environment.apiUrl}Accounts/GetCommissionInvList/`;
  private AddCommInvPayment_Url = `${environment.apiUrl}Accounts/AddCommissionInvPayment`;
  private GetPaymentInvCom_Url = `${environment.apiUrl}Accounts/GetCommissionInvPaymentList/`;


  private GetCompanyList_Url = `${environment.apiUrl}Masters/GetCompanyList`;
  private GetTransporterList_Url = `${environment.apiUrl}Masters/GetTransporterMasterList/`;
  private GetGatepassBillSummaryList_Url = `${environment.apiUrl}Accounts/GetGatepassBillSummaryList/`;
  private GetExpenseRegisterList_Url = `${environment.apiUrl}Accounts/GetExpRegisterListForCheckInv/`;
  private SaveGPVerifiedDate_Url = `${environment.apiUrl}Accounts/SaveCheckInvVerifyData`;
  private ResolveConcern_Url = `${environment.apiUrl}Accounts/ResolveConcern`;

  constructor(private _httpClient: HttpClient) { }

  // Save Expence Invoice
  SaveExpInv_Service(DataModel: ExpInvModel): Observable<ExpInvModel[] | null | undefined> {
    return this._httpClient.post<ExpInvModel[]>(this.SaveExpInv_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Expence Invoice List
  GetExpInvList_Service(BranchId: number): Observable<any> {
    return this._httpClient.get(this.GetExpInvList_Url + BranchId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
      );
  }

  // Expense Payment - Add,Delete
  SaveExpPay_service(DataModel: PaymentModel): Observable<any> {
    return this._httpClient.post<PaymentModel[]>(this.SaveExpInvPay_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Expence Invoice List
  GetExpPayList_Service(ExpInvId: number): Observable<any> {
    return this._httpClient.get(this.GetExpPayList_Url + ExpInvId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
      );
  }

  // Reimbursment Invoice - Add,Edit,Delete/Cancel
  ReimbursementInvoiceAddEdit(DataModel: ReimbursementInvoiceAddEditModel): Observable<any> {
    return this._httpClient.post(this.ReimbursementInvoiceAddEdit_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Reimbursement Invoice List
  GetReimbursementInvoiceList(BranchId: number): Observable<any> {
    return this._httpClient.get(this.GetReimbursementInvoiceList_Url + BranchId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Reimbursment Invoice Generate New Number
  GetReimInvNo(BranchId: number, InvDate: Date): Observable<any> {
    return this._httpClient.get(this.GetReimInvNo_Url + BranchId + '/' + InvDate, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Reimbursement Invoice By Id List
  GetReimbursementInvById(BranchId: number, CompId: number, ReimId: number): Observable<any> {
    return this._httpClient.get(this.GetReimbursementInvById_Url + BranchId + '/' + CompId + '/' + ReimId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Reimbursment Payment - Add,Edit,Delete/Cancel
  ReimbursementPaymentAddEdit(DataModel: ReimbursementPaymentAddEditModel): Observable<any> {
    return this._httpClient.post(this.ReimbursementPaymentAddEdit_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Reimbursement Payment List
  GetReimbursementPaymentList(ReimId: number): Observable<any> {
    return this._httpClient.get(this.GetReimbursementPaymentList_Url + ReimId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
  // Get Commision Invoice Add Edit
  CommInvoiceAddEdit(DataModel: InvCommisionModel): Observable<any> {
    return this._httpClient.post(this.AddCommInvoiceAddEdit_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Commision Invoice Generate New Number
  GetCommInvGenerateNewNo(BranchId: number, InvoiceDate: Date): Observable<any> {
    return this._httpClient.get(this.CommInvGenerateNewNo + BranchId + '/' + InvoiceDate, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Commision List
  getInvoiceComisionList_Service(BranchId: number): Observable<any> {
    return this._httpClient.get(this.GetCommisionInvoiceList_Url + BranchId , { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Add Commission Invoice Payment
  AddCommInvPaymentAddDelete(DataModel: InvCommisionModel): Observable<any> {
    return this._httpClient.post(this.AddCommInvPayment_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Payment Invoice Commisiom List
  getPaymentInvCom_Service(ComInvId: number): Observable<any> {
    return this._httpClient.get(this.GetPaymentInvCom_Url + ComInvId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
  // Get Company List
  GetCompanyList_Service(Status: string): Observable<any> {
    return this._httpClient.get(this.GetCompanyList_Url + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        return result.body;
      }));
  }

  GetGatepassBillSummaryList_Service(ExpInvId: number): Observable<any> {
    return this._httpClient.get(this.GetGatepassBillSummaryList_Url + '/' + ExpInvId, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  GetTransporterList_Service(DistrictCode: string, Status: string,BranchId:number): Observable<any> {
    return this._httpClient.get(this.GetTransporterList_Url + DistrictCode + '/' + Status +'/'+BranchId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        return result.body;
      }));
  }

  GetExpenseRegisterList_Service(BranchId: number): Observable<any> {
    return this._httpClient.get(this.GetExpenseRegisterList_Url + BranchId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
  // Add Commission Invoice Payment
  SaveGPVerifiedDate_Service(Model: any): Observable<any> {
    return this._httpClient.post(this.SaveGPVerifiedDate_Url, Model, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Resolve Concern
  ResolveConcern_Service(Model: any): Observable<any> {
    return this._httpClient.post(this.ResolveConcern_Url, Model, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }
}
