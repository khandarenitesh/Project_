import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private _httpClient: HttpClient) { }

  private GetBranchList_Url = `${environment.apiUrl}Masters/GetBranchList`;
  private GetCompanyBranchList_Url = `${environment.apiUrl}Masters/GetCompanyBranchRelationList`;
  private GetOrderdiscount_Url = `${environment.apiUrl}OrderDispatch/AllOrderDispatchCountNew`;
  private GetInvenInwardcount_Url = `${environment.apiUrl}InventoryInward/InventoryCountForallLogin`;
  private GetChequeAccountingCount_Url = `${environment.apiUrl}ChequeAccounting/GetDashbordCnt`;
  private StockTranscountdashbord_Url = `${environment.apiUrl}StockTransfer/GetStockTransferDashbordCount`;
  private GetOrderReturnCountNew_Url = `${environment.apiUrl}OrderReturn/GetDashBordCount`;
  private GetStockTransferListForFilter_Url = `${environment.apiUrl}StockTransfer/GetStockTransferFilteredList/`;
  private Getlistcummpicklistfilter_Url = `${environment.apiUrl}OrderDispatch/GetOrderDispCummPLListNew/`;
  private GetlistcummInvoicefilter_Url = `${environment.apiUrl}OrderDispatch/GetOrderDispatchCummInvList/`;
  private GetFilterCummdeposited_Url = `${environment.apiUrl}ChequeAccounting/ChqRegCummDepositedList/`
  private GetFilterCummVehicle_Url = `${environment.apiUrl}InventoryInward/GetInvInwardCummVehicleList/`;
  private GetOrderDispatchSummaryCountFilter_Url = `${environment.apiUrl}OrderDispatch/GetOrderDispatchSummaryCount/`;
  private GetStockTrnsfrSummaryCountFilter_Url = `${environment.apiUrl}StockTransfer/GetStkTrnsferSummaryCount/`;
  private GetOwnerLoginDashCount_Url = `${environment.apiUrl}Masters/GetOwnerDashboardCountList`;
  private GetLRPendingList_Url = `${environment.apiUrl}OrderDispatch/GetLRDetailsListForDashNew/`;
  private GetStkLRPendingList_Url = `${environment.apiUrl}StockTransfer/GetStkLRDetailsListForDashNew/`;
  private GetPrioPendInvList_Url = `${environment.apiUrl}OrderDispatch/GetPrioPendingInvForDashNew/`;

  //Owner Dash List
  private GetOwnODInvSmmryList_Url = `${environment.apiUrl}OrderDispatch/GetOwnerOrderDispDashInvSmmryList`;
  private GetOwnODBoxesSmmryList_Url = `${environment.apiUrl}OrderDispatch/GetOwnerOrderDispDashBoxesSmmryList`;
  private GetOwnChqAccSmmryList_Url = `${environment.apiUrl}ChequeAccounting/GetOwnerChqAccDashSmmryList`;
  private GetOwnInvInwardSmmryList_Url = `${environment.apiUrl}InventoryInward/GetOwnerInvInwardDashSmmryList`;
  private GetOwnORPendConsigList_Url = `${environment.apiUrl}OrderReturn/GetOwnerORPendConsigDashSmmryList`;
  private GetOwnSaleableCNList_Url = `${environment.apiUrl}OrderReturn/GetOwnerSaleableCNDashSmmryList`;
  private GetOwnStkTrnsfrInvList_Url = `${environment.apiUrl}StockTransfer/GetOwnerStkTrnsfrDashInvSmmryList`;
  private GetOwnStkTrnsfrBoxesList_Url = `${environment.apiUrl}StockTransfer/GetOwnerStkTrnsfrDashBoxesSmmryList`;


  // Get Branch List
  getBranchList_Service(Status: string): Observable<any> {
    return this._httpClient.get(this.GetBranchList_Url + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Company Branch Relation List
  getCompanyBranch_Serive(CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetCompanyBranchList_Url + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

  //Get Order dispatch count for supervisor
  GetOrderDisCount(DataModelCounts: any): Observable<any> {
    return this._httpClient.post(this.GetOrderdiscount_Url, DataModelCounts, { observe: 'response' }).pipe(
      map(result => {
        if (result) {

        }
        return result.body;
      }),
    );
  }


  //Get Inventory Inward count for supervisor
  GetInvenInwardCount(DataModelCount: any): Observable<any> {
    return this._httpClient.post(this.GetInvenInwardcount_Url, DataModelCount, { observe: 'response' }).pipe(
      map(result => {
        if (result) {

        }
        return result.body;
      }),
    );
  }

  //Get Order Return Count New
  GetOrderReturnNewDashbord(DataModelCount: any): Observable<any> {
    return this._httpClient.post(this.GetOrderReturnCountNew_Url, DataModelCount, { observe: 'response' }).pipe(
      map(result => {
        if (result) {

        }
        return result.body;
      }),
    );
  }

  //Get Cheque Accounting Count for Operator
  GetChequeAccountingDashbord(DataModelCount: any): Observable<any> {
    return this._httpClient.post(this.GetChequeAccountingCount_Url, DataModelCount, { observe: 'response' }).pipe(
      map(result => {
        if (result) {

        }
        return result.body;
      })
    )
  }

  //Get Stock Transfer count for Operaator
  GetstocktransferCountdashbord(DataModelCount: any): Observable<any> {
    return this._httpClient.post(this.StockTranscountdashbord_Url, DataModelCount, { observe: 'response' }).pipe(
      map(result => {
        if (result) {

        }
        return result.body;
      })
    )
  }
  // Get Cheque Register List
  GetStockTransferListForFilter_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetStockTransferListForFilter_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //get list cumm picklist filter
  Getlistcummpicklistfilter_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.Getlistcummpicklistfilter_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //get list cumm Invoice filter
  GetlistcummInvoicefilter_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetlistcummInvoicefilter_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  GetFilterCummdeposited_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetFilterCummdeposited_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

  OrderRtrnCummVehicleFilterList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetFilterCummVehicle_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }
  GetOrderDispatchSummaryCountList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetOrderDispatchSummaryCountFilter_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

  GetStockTransferSummaryCountList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetStockTrnsfrSummaryCountFilter_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }
  //Get Order dispatch count for supervisor
  GetOwnerLoginDashCount_Service(DataModelCounts: any): Observable<any> {
    return this._httpClient.post(this.GetOwnerLoginDashCount_Url, DataModelCounts, { observe: 'response' }).pipe(
      map(result => {
        if (result) {

        }
        return result.body;
      }),
    );
  }

  // Owner Login Services
  GetOwnODInvSmmryList_Service(): Observable<any> {
    return this._httpClient.get(this.GetOwnODInvSmmryList_Url, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

  GetOwnODBoxesSmmryList_Service(): Observable<any> {
    return this._httpClient.get(this.GetOwnODBoxesSmmryList_Url, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

  GetOwnChqAccSmmryList_Service(): Observable<any> {
    return this._httpClient.get(this.GetOwnChqAccSmmryList_Url, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }
  GetOwnInvInwardSmmryList_Service(): Observable<any> {
    return this._httpClient.get(this.GetOwnInvInwardSmmryList_Url, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }
  GetOwnORPendConsigList_Service(): Observable<any> {
    return this._httpClient.get(this.GetOwnORPendConsigList_Url, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }
  GetOwnSaleableCNList_Service(): Observable<any> {
    return this._httpClient.get(this.GetOwnSaleableCNList_Url, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }
  GetOwnStkTrnsfrInvList_Service(): Observable<any> {
    return this._httpClient.get(this.GetOwnStkTrnsfrInvList_Url, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }
  GetOwnStkTrnsfrBoxesList_Service(): Observable<any> {
    return this._httpClient.get(this.GetOwnStkTrnsfrBoxesList_Url, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

   // Get LR Pending List
   GetLRPendingList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetLRPendingList_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }
  // Get Stk LR Pending List
  GetStkLRPendingList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetStkLRPendingList_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Stk LR Pending List
  GetPrioPendInvList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetPrioPendInvList_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }
  
}
