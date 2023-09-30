import { Injectable } from '@angular/core';

// http
import { HttpClient } from '@angular/common/http';

// environment
import { environment } from '../../../../environments/environment';

// rxjs
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StockTransferService {
  private GetSendToList_Url = `${environment.apiUrl}Masters/GetOtherCNFList/`;
  private AddStockTransfer_Url = `${environment.apiUrl}StockTransfer/AddStockTransfer`;
  private GetStockTransferList_Url = `${environment.apiUrl}StockTransfer/GetStockTransferList/`;
  private CheckStockTransferInvNo_Url = `${environment.apiUrl}StockTransfer/CheckStockTransferInvNo/`;

  constructor(private _httpClient: HttpClient) { }

  // Get Send To List
  GetSendToList(BranchId: number, CompId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetSendToList_Url + BranchId + "/" + CompId + "/" + Status, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

  // Add Stock Transfer
  AddStockTransfer(DataModel: any): Observable<any> {
    return this._httpClient.post(this.AddStockTransfer_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Stock Transfer List
  GetStockTransferList(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetStockTransferList_Url + BranchId + "/" + CompId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

  // check Stock Transfer InvNo
  CheckStockTransferInvNo_Service(BranchId: number, CompId: number, InvNo: string): Observable<any> {
    return this._httpClient.get(this.CheckStockTransferInvNo_Url + BranchId + "/" + CompId + "/" + InvNo, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

}
