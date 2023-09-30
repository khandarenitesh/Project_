import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EmailConfig } from '../email-configuration/email-configuration.component';
import { ChequeRegister } from '../models/cheque-register';

// Get Cheque Summary of previous month/Week
import { ChqSummaryForMonthlyModel } from '../models/cheque-summary-report.model';
import { ChequeStatusReportModel } from '../models/cheque-status-report-model.model';

@Injectable({
  providedIn: 'root'
})
export class ChequeAccountingService {

  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private _httpClient: HttpClient) { }

  private SaveChequeRegisterDetails_Url = `${environment.apiUrl}ChequeAccounting/ChequeRegisterAdd`;
  private UpdateChequeRegisterDetails_Url = `${environment.apiUrl}ChequeAccounting/ChequeRegisterEditDelete`;
  private GetChequeList_Url = `${environment.apiUrl}ChequeAccounting/ChequeRegisterList/`;
  private GetChequeCount_Url = `${environment.apiUrl}ChequeAccounting/ChequeSummyCount/`;
  private UpdateChequeSts_Url = `${environment.apiUrl}ChequeAccounting/UpdateChequeStatus`;
  private GetStockistOutStandingList_Url = `${environment.apiUrl}ChequeAccounting/StockistOutStandingList`;
  private ImportStockistOutStanding_Url = `${environment.apiUrl}ChequeAccounting/ImportStockistOutStanding/`;
  private GetAdminDetails_Url = `${environment.apiUrl}ChequeAccounting/GetAdminDetails/`;
  private GetCCEmailandPurposeDetails_Url = `${environment.apiUrl}ChequeAccounting/GetCCEmailandPurposeDetails/`;
  private SaveEmailConfiguration_Url = `${environment.apiUrl}ChequeAccounting/EmailConfigurationAdd`;
  private GetEmailConfiglist_Url = `${environment.apiUrl}ChequeAccounting/GetEmailConfigList`;
  private GetInvForChkBlock_Url = `${environment.apiUrl}ChequeAccounting/GetInvoiceForChqBlockLst/`;
  private GetSOReportLst_Url = `${environment.apiUrl}ChequeAccounting/OsdocTypesReport`;
  private ImportDepositedCheque_Url = `${environment.apiUrl}ChequeAccounting/ImportDepositedCheque/`;
  private GetDepositedChequeList_Url = `${environment.apiUrl}ChequeAccounting/DepoChequeReceiptList`;
  private GetChequeRegistersmryLst_Url = `${environment.apiUrl}ChequeAccounting/RpchequeSmmryRepoList`;
  private GetStkOutstandingDtlsForEmail_Url = `${environment.apiUrl}ChequeAccounting/GetStkOutstandingDtlsForEmail`;
  private GetChqSummaryForMonthlyList_Url = `${environment.apiUrl}ChequeAccounting/GetChqSummaryForMonthlyList`;
  private GetDashChequeList_Url = `${environment.apiUrl}ChequeAccounting/DashbordChequeRegList/`;
  private GetOutStandingStkList_Url = `${environment.apiUrl}ChequeAccounting/OverDueStockistList/`;
  private GetCheqStatusReportList_Url =`${environment.apiUrl}ChequeAccounting/GetChequeStatusReportList/`


  // Save Cheque Details
  SaveCheque_Service(DataModel: ChequeRegister): Observable<ChequeRegister[] | null | undefined> {
    return this._httpClient.post<ChequeRegister[]>(this.SaveChequeRegisterDetails_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Update Cheque Details
  UpdateCheque_Service(DataModel: ChequeRegister): Observable<ChequeRegister[] | null | undefined> {
    return this._httpClient.post<ChequeRegister[]>(this.UpdateChequeRegisterDetails_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Cheque Register List
  getChequeList_Service(BranchId: number, CompId: number, StockistId: number): Observable<any> {
    return this._httpClient.get(this.GetChequeList_Url + BranchId + '/' + CompId + '/' + StockistId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Cheque Register Counts
  getChequeCount_Service(BranchId: number, CompId: number, StockistId: number): Observable<any> {
    return this._httpClient.get(this.GetChequeCount_Url + BranchId + '/' + CompId + '/' + StockistId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Cheque Register Counts
  getInvList_Service(StockistId: number, CompId: number, FromDate: Date, ToDate: Date): Observable<any> {
    return this._httpClient.get(this.GetInvForChkBlock_Url + StockistId + '/' + CompId + '/' + FromDate + '/' + ToDate, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Update Cheque Status
  UpdateChequeSts_Service(DataModel: any): Observable<any> {
    return this._httpClient.post<any>(this.UpdateChequeSts_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Import Import Stockist Outstanding Excel
  ImportStockistOutstandingData(BranchId: number, CompanyId: number, Addedby: string, formData: FormData) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers };
    return this._httpClient.post(this.ImportStockistOutStanding_Url + BranchId + '/' + CompanyId + '/' + Addedby, formData, httpOptions);
  }

  //Get Import Stockist Outstanding  List
  getStockistOutstanding_Service(BranchId: any, CompanyId: any): Observable<any> {
    return this._httpClient.get(this.GetStockistOutStandingList_Url + '/' + BranchId + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Admin Details
  getAdminDetails(EmailFor: number): Observable<any> {
    return this._httpClient.get(this.GetAdminDetails_Url + '/' + EmailFor, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Email Purpose Details
  getEmailPurposeDetails_Service(): Observable<any> {
    return this._httpClient.get(this.GetCCEmailandPurposeDetails_Url, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
  // Get Email Purpose Details
  SaveEmailConfiguration_Service(DataModel: EmailConfig): Observable<any> {
    return this._httpClient.post<EmailConfig[]>(this.SaveEmailConfiguration_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Email Configuration List
  getEmailConfigurationData(BranchId: number, CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetEmailConfiglist_Url + '/' + BranchId + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Get Stockist Outstanding Report List
  GetOsReportLst(BranchId: number, CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetSOReportLst_Url + '/' + BranchId + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        //login successful if there's a jwt token in the response
        if (result) {
          return result.body
        }
      }))
  }

  // Import Deposited Cheque Through Excel
  ImportDepositedChequeData(BranchId: number, CompanyId: number, Addedby: string, formData: FormData) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers };
    return this._httpClient.post(this.ImportDepositedCheque_Url + BranchId + '/' + CompanyId + '/' + Addedby, formData, httpOptions);
  }

  //Get Import Deposited Cheque List
  getDepositedCheque_Service(BranchId: number, CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetDepositedChequeList_Url + '/' + BranchId + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Get Cheque Register Summary Reports List
  getChequeRegistersmryLst_Service(BranchId: any, CompId: any): Observable<any> {
    return this._httpClient.get(this.GetChequeRegistersmryLst_Url + '/' + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //
  SendEmails_Service(BranchId: number, CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetStkOutstandingDtlsForEmail_Url + '/' + BranchId + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Cheque Summary of previous month/Week
  getChqSummaryForMonthlyList_Service(DataModel: ChqSummaryForMonthlyModel): Observable<ChqSummaryForMonthlyModel[] | null | undefined> {
    return this._httpClient.post<ChqSummaryForMonthlyModel[]>(this.GetChqSummaryForMonthlyList_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Cheque Register List
  getDashBoardChequeList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetDashChequeList_Url + BranchId + '/' + CompId , { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
  // Get Cheque Register List
  GetOutStandingStkList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetOutStandingStkList_Url + BranchId + '/' + CompId , { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  getChqStatusReport_Service(DataModel: ChequeStatusReportModel): Observable<ChequeStatusReportModel[] | null | undefined> {
    return this._httpClient.post<ChequeStatusReportModel[]>(this.GetCheqStatusReportList_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        if (result) {

        }
        return result.body;
      }),
    );
  }

}
