import { Injectable } from '@angular/core';

// http
import { HttpClient, HttpHeaders } from '@angular/common/http';

// models
import { ApproveVehicleModel, ResolveRaisedConcernModel } from '../models/ApproveVehicleModel';
import { InsuranceModel } from '../models/InsuranceModel';

// environment
import { environment } from '../../../../environments/environment';

// rxjs
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VehiclchlList} from '../models/vehiclchl-list.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryInwardService {
  private ImportTransitData_Url = `${environment.apiUrl}InventoryInward/ImportTransitData/`;
  private GetTransitDataList_Url = `${environment.apiUrl}InventoryInward/GetTransitDataList/`;
  private InsuranceData_Url = `${environment.apiUrl}InventoryInward/RaiseInsuranceClaim/`;
  private GetInsuranceDataList_Url = `${environment.apiUrl}InventoryInward/GetRaiseInsuranceClaimList/`;
  private GetInsuranceClaimTypesList_Url = `${environment.apiUrl}InventoryInward/InsuranceClaimTypeList/`;
  private GetMapInwardVehicleRaiseCncrnList_Url = `${environment.apiUrl}InventoryInward/GetMapInwardVehicleRaiseCncrnList/`;
  private ResolveVehicleIssue_Url = `${environment.apiUrl}InventoryInward/ResolveVehicleIssue/`;
  private GetMappedInwardLRList_Url = `${environment.apiUrl}InventoryInward/GetMappedInwardLRList/`;
  private ApproveSANAdd_Url = `${environment.apiUrl}InventoryInward/ApproveSANAdd/`;
  private ApproveClaimAdd_Url = `${environment.apiUrl}InventoryInward/ApproveClaimAdd/`;
  private GetInvInwardAllCounts_Url = `${environment.apiUrl}InventoryInward/GetInvInwardPagesAllCount`;
  private GetRaisedConcernList_Url = `${environment.apiUrl}InventoryInward/GetRaiseConcernListForMob/`;
  private ResolveRaisedConcern_Url = `${environment.apiUrl}InventoryInward/ResolveRaisedConcernAtOpLevel/`;
  private InventoryInwardlistForFilter_Url = `${environment.apiUrl}InventoryInward/GetListForDashboardInventoryInwrd/`;
  private GetVehicleChkList_Url = `${environment.apiUrl}InventoryInward/TransitVhcleChkLstForViewImg`;


  constructor(private _httpClient: HttpClient) { }

  // Import Transit Data through Excel
  ImportTransitData(BranchId: number, CompanyId: number, Addedby: string, formData: FormData) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers };
    return this._httpClient.post(this.ImportTransitData_Url + BranchId + '/' + CompanyId + '/' + Addedby, formData, httpOptions);
  }

  // Get Imported Transit Data List
  GetTransitDataList(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetTransitDataList_Url + BranchId + "/" + CompId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

  // Save Insurance Data
  SaveInsuranceData_Service(DataModel: InsuranceModel): Observable<InsuranceModel[] | null | undefined> {
    return this._httpClient.post<InsuranceModel[]>(this.InsuranceData_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Insurance Claim List
  getInsuranceClaimList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetInsuranceDataList_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Insurance Claim Types List
  getClaimTypesList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetInsuranceClaimTypesList_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Vehicle CheckList
  GetMapInwardVehicleRaiseCncrnList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetMapInwardVehicleRaiseCncrnList_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Save Update Vehicle Issue
  ResolveVehicleIssue_Url_Service(DataModel: any): Observable<InsuranceModel[] | null | undefined> {
    return this._httpClient.post<InsuranceModel[]>(this.ResolveVehicleIssue_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Mapped Inward LR List
  GetMappedInwardLRList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetMappedInwardLRList_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Save Insurance Data
  ApproveSANAdd_Url_Service(DataModel: InsuranceModel): Observable<InsuranceModel[] | null | undefined> {
    return this._httpClient.post<InsuranceModel[]>(this.ApproveSANAdd_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Approve Claim Add
  ApproveClaimAdd_Url_Service(DataModel: InsuranceModel): Observable<InsuranceModel[] | null | undefined> {
    return this._httpClient.post<InsuranceModel[]>(this.ApproveClaimAdd_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Inventory Inward All Count Mapping Counts
  GetInvInwardAllCounts(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetInvInwardAllCounts_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Raised Concern List
  GetRaisedConcernList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetRaisedConcernList_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

    // Save Update Vehicle Issue
    ResolveRaisedConcern_Url_Service(DataModel: ResolveRaisedConcernModel): Observable<ResolveRaisedConcernModel[] | null | undefined> {
      return this._httpClient.post<ResolveRaisedConcernModel[]>(this.ResolveRaisedConcern_Url, DataModel, { observe: 'response' }).pipe(
        map(result => {
          // login successful if there's a jwt token in the response
          if (result) {
          }
          return result.body;
        }));
    }

      // Get dashboard filtered list for count
    InventoryInwardlistForFilter_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.InventoryInwardlistForFilter_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
  
  getVehicleChkList_Service(DataModel: VehiclchlList): Observable<VehiclchlList[] | null | undefined> {
    return this._httpClient.post<VehiclchlList[]>(this.GetVehicleChkList_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        if (result) {

        }
        return result.body;
      }),
    );
  }
}

