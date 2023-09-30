import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

// Models
import { PickistModel } from '../Models/picklist-model';
import { InvoiceModel } from '../Models/invoice-model';
import { AssignTransportModel } from '../Models/assign-transport-model';

@Injectable({
  providedIn: 'root'
})
export class OrderDispatchService {
  constructor(private _httpClient: HttpClient) { }

  private SavePicklist_Url = `${environment.apiUrl}OrderDispatch/PickListHeaderAddEdit`;
  private GetPicklist_Url = `${environment.apiUrl}OrderDispatch/GetPickList/`;
  private GetPicklistByPicker_Url = `${environment.apiUrl}OrderDispatch/GetPicklistByPickerStatus/`;
  private GetPicklistCounts_Url = `${environment.apiUrl}OrderDispatch/GetPickListSummaryCounts/`;
  private GetPickListDetailsById_Url = `${environment.apiUrl}OrderDispatch/GetPickListDetailsById/`;
  private InvoiceAddEdit_Url = `${environment.apiUrl}OrderDispatch/GetPickListDetailsById/`;
  private GetInvoiceHeaderList_Url = `${environment.apiUrl}OrderDispatch/GetInvoiceHeaderList/`;
  private GetDivision_Url = `${environment.apiUrl}OrderDispatch/GetDivisionDtls`;
  private ImportInvoiceData_Url = `${environment.apiUrl}OrderDispatch/ImportInvoiceData/`;
  private GetInvoice_Url = `${environment.apiUrl}OrderDispatch/GetPickListDetailsById/`;
  private GetUserListByRoleId_Url = `${environment.apiUrl}Login/UserListByRole/`;
  private AddAllotmet_Url = `${environment.apiUrl}OrderDispatch/PicklistAllotmentAdd`;
  private AddReAllotmet_Url = `${environment.apiUrl}OrderDispatch/PicklistReAllotmentAdd`;
  private InvoiceHeaderStatusUpdate_Url = `${environment.apiUrl}OrderDispatch/InvoiceHeaderStatusUpdate`;
  private AssignTransportMode_Url = `${environment.apiUrl}OrderDispatch/AssignTransportMode`;
  private GetInvoiceHeaderListForAssignTransMode_Url = `${environment.apiUrl}OrderDispatch/InvoiceHeaderListForAssignTransMode/`;
  private ImportLRData_Url = `${environment.apiUrl}OrderDispatch/ImportLrData/`;
  private GetLRList_Url = `${environment.apiUrl}OrderDispatch/GetLRDataList/`;
  private GetPickListGenerateNewNo_Url = `${environment.apiUrl}OrderDispatch/GetPickListGenerateNewNo/`;
  private GetPicklistReallotment_Url = `${environment.apiUrl}OrderDispatch/GetPickForReAllotment/`;
  private GetInvCnts_Url = `${environment.apiUrl}OrderDispatch/GetInvoiceSummaryCounts/`;
  private GetInvoiceDetailsForSticker_Url = `${environment.apiUrl}OrderDispatch/GetInvoiceDetailsForSticker/`;
  private GenerateSticker_Url = `${environment.apiUrl}OrderDispatch/GeneratePDF/`;
  private PickListHeaderDelete_Url = `${environment.apiUrl}OrderDispatch/PickListHeaderDelete/`;
  private ResolveConern_Url = `${environment.apiUrl}OrderDispatch/ResolveConcernAdd`;
  private ResolveConvernList_Url = `${environment.apiUrl}OrderDispatch/ResolveConcernList`;
  private GetInvoiceHeaderResolveCncrnList_Url = `${environment.apiUrl}OrderDispatch/GetInvoiceHeaderLstResolveCnrn`;
  private ResolveInvConern_Url = `${environment.apiUrl}OrderDispatch/ResolveInvConcernAdd`;
  private GetAssignTransportList_Url = `${environment.apiUrl}OrderDispatch/GetAssignedTransporterList/`;
  private UpdateAssignTransportMode_Url = `${environment.apiUrl}OrderDispatch/EditAssignedTransportMode`;
  private PriorityFlagUpdate_Url = `${environment.apiUrl}OrderDispatch/PriorityInvoiceFlagUpdate/`;
  private GetInvoiCount_Url = `${environment.apiUrl}OrderDispatch/AllInvoiceCounts/`;
  private GetLRPendingList_Url = `${environment.apiUrl}OrderDispatch/PendingLRDetails`;
  private GetLRSRSCNListforFilterDataOrdrRtrn_service_Url = `${environment.apiUrl}OrderReturn/GetOrderReturnFilterNewList/`;
  private GetStockTransferdashboardFilteredList_service_Url = `${environment.apiUrl}StockTransfer/GetStockTransferdashboardFilteredList/`;
  private GetDashboardInvoice_Url = `${environment.apiUrl}OrderDispatch/DashboardFilterListforOrderdispatch/`;
  private GetDashboardPLInvoice_Url = `${environment.apiUrl}OrderDispatch/GetOrderDispPLFilterListNew/`;
  private GetPicklistCountsStocktrans_Url = `${environment.apiUrl}OrderDispatch/GetPickListSummaryCountsForStockTrans/`;
  private GetInvoiCountStkTrans_Url = `${environment.apiUrl}OrderDispatch/AllInvoiceCountsStkCount/`;
  private GetPendingCN_Url = `${environment.apiUrl}OrderReturn/GetOrderReturnPendingCN/`;
  private GetSaleableCnt_Url = `${environment.apiUrl}OrderReturn/GetOrderReturnSaleable/`;
  

  // Picklist - Add, Edit and Verify
  SavePiclist_Service(DataModel: PickistModel): Observable<PickistModel[] | null | undefined> {
    return this._httpClient.post<PickistModel[]>(this.SavePicklist_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Pick list
  getPickList_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetPicklist_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Pick list
  getPickListByPicker_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetPicklistByPicker_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Pick list
  getPickListCounts_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetPicklistCounts_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {

        }
        return result.body;
      }),
    );
  }

  // Get PickList Details By Id
  getPickListDetailsById_Service(Picklistid: number): Observable<any> {
    return this._httpClient.get(this.GetPickListDetailsById_Url + Picklistid, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get User By Role Id
  getUserList_Service(BranchId: number, CompId: number, RoleId: number): Observable<any> {
    return this._httpClient.get(this.GetUserListByRoleId_Url + BranchId + '/' + CompId + '/' + RoleId, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Add Allotment List
  AddAllotList_Service(model: any): Observable<any> {
    return this._httpClient.post(this.AddAllotmet_Url, model, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Add ReAllotment List
  AddReAllotList_Service(model: any): Observable<any> {
    return this._httpClient.post(this.AddReAllotmet_Url, model, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Picklist - Add, Edit and Verify
  SaveInvoice_Service(DataModel: InvoiceModel): Observable<InvoiceModel[] | null | undefined> {
    return this._httpClient.post<InvoiceModel[]>(this.SavePicklist_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }


  InvoiceAddEdit_Service(DataModel: InvoiceModel): Observable<InvoiceModel[] | null | undefined> {
    return this._httpClient.post<InvoiceModel[]>(this.InvoiceAddEdit_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  getInvoice_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetInvoiceHeaderList_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Division Details - InvId Wise List
  getInvdivisionDtls_Service(InvId: number): Observable<any> {
    return this._httpClient.get(this.GetDivision_Url + '/' + InvId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Import Invoice Data through Excel
  ImportInvoiceData(BranchId: number, CompanyId: number, Addedby: string, formData: FormData) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers };
    return this._httpClient.post(this.ImportInvoiceData_Url + BranchId + '/' + CompanyId + '/' + Addedby, formData, httpOptions);
  }

  // Invoice Ready To Dispatch
  InvoiceHeaderStatusUpdate_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.InvoiceHeaderStatusUpdate_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  SaveAssignedTransportMode_Service(DataModel: AssignTransportModel): Observable<AssignTransportModel[] | null | undefined> {
    return this._httpClient.post<AssignTransportModel[]>(this.AssignTransportMode_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }
  getInvoiceList_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetInvoiceHeaderListForAssignTransMode_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Import LR Data through Excel
  ImportLRData(Addedby: string, formData: FormData) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers };
    return this._httpClient.post(this.ImportLRData_Url + Addedby, formData, httpOptions);
  }

  // Get Imported LR Data List
  getLR_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetLRList_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  GetPickListGenerateNewNo_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetPickListGenerateNewNo_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Pick list Re-Allotment
  getPickListReAllotment_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetPicklistReallotment_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Pick list Re-Allotment
  getInvCnts_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetInvCnts_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  //Get Invoice List
  getInvoiceListForSticker_Service(BranchId: number, CompanyId: number, InvId: number): Observable<any> {
    return this._httpClient.get(this.GetInvoiceDetailsForSticker_Url + BranchId + '/' + CompanyId + '/' + InvId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Print PDF and Sticker
  printSticker_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GenerateSticker_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Stokist Transport Mapping Add/Delete
  PickListHeaderDelete_Service(DataModel: PickistModel): Observable<PickistModel[] | null | undefined> {
    return this._httpClient.post<PickistModel[]>(this.PickListHeaderDelete_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Add Resolve Concern
  ResolveConern_Service(model: any): Observable<any> {
    return this._httpClient.post(this.ResolveConern_Url, model, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Resolve Convern List
  getResolveConvernList_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.ResolveConvernList_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  getInvoiceLstResolveCncrn_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetInvoiceHeaderResolveCncrnList_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
  // Add Invoice Resolve Concern
  ResolveInvConern_Service(model: any): Observable<any> {
    return this._httpClient.post(this.ResolveInvConern_Url, model, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  getAssignTransportList_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetAssignTransportList_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
  UpdateAssignedTransportMode_Service(DataModel: AssignTransportModel): Observable<AssignTransportModel[] | null | undefined> {
    return this._httpClient.post<AssignTransportModel[]>(this.UpdateAssignTransportMode_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Update Priority Flag
  UpdatePriorityFlag_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.PriorityFlagUpdate_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Get Invoice Count
  GetInvoiceCounts_Service(DataModelCounts: any): Observable<any> {
    return this._httpClient.post(this.GetInvoiCount_Url, DataModelCounts, { observe: 'response' }).pipe(
      map(result => {
        if (result) {

        }
        return result.body;
      }),
    );
  }

  // Get Imported LR Data List
  getLRPending_Service(): Observable<any> {
    return this._httpClient.get(this.GetLRPendingList_Url)
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result;
      }));
  }

  GetLRSRSCNListforFilterDataOrdrRtrn_service(BranchId: number, CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetLRSRSCNListforFilterDataOrdrRtrn_service_Url + BranchId + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  GetStockTransferdashboardFilteredList_service(BranchId: number, CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetStockTransferdashboardFilteredList_service_Url + BranchId + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  getDashboardInvoice_Service(BranchId: number, CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetDashboardInvoice_Url + BranchId + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
  getDashboardPLInvoice_Service(BranchId: number, CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetDashboardPLInvoice_Url + BranchId + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Pick list For Stock Transfer
  getPickListCountsstck_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetPicklistCountsStocktrans_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {

        }
        return result.body;
      }),
    );
  }

  //Get Invoice Count For Stock Transfer
  GetInvForStkCnt_Service(DataModelCounts: any): Observable<any> {
    return this._httpClient.post(this.GetInvoiCountStkTrans_Url, DataModelCounts, { observe: 'response' }).pipe(
      map(result => {
        if (result) {

        }
        return result.body;
      }),
    );
  }

  GetPendingCN_service(BranchId: number, CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetPendingCN_Url + BranchId + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  GetSaleableCnt_Service(BranchId: number, CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetSaleableCnt_Url + BranchId + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

}
