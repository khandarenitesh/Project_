import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DelayReasonModel } from '../models/DelayReasonModel';
import { ClaimSrsMappingModel } from '../models/ClaimSrsMappingModel';
import { UpdateLRMismatchModel } from '../models/UpdateLRMismatchModel';

@Injectable({
  providedIn: 'root'
})
export class OrderReturnService {

  constructor(private _httpClient: HttpClient) { }

  private GetPhysicalCheck1List_Url = `${environment.apiUrl}OrderReturn/GetPhysicalCheck1List/`;
  private resolveClaimConcern_Url = `${environment.apiUrl}OrderReturn/PhysicalCheck1Concern`;
  private ImportCreditNote_Url = `${environment.apiUrl}OrderReturn/ImportCNData/`;
  private GetCreditNoteList_Url = `${environment.apiUrl}OrderReturn/GetImportCNDataList/`;
  private GetAuditorCheckList_Url = `${environment.apiUrl}OrderReturn/GetSRSClaimListForVerifyList/`;
  private ImportSRSData_Url = `${environment.apiUrl}OrderReturn/ImportSRSData/`;
  private GetLRmisMatchList_Url = `${environment.apiUrl}OrderReturn/GetLrMisMatchList/`;
  private UploadImg_Url = `${environment.apiUrl}OrderReturn/UploadImages/`;
  private GetDestructionCerList_Url = `${environment.apiUrl}OrderReturn/GetDestructionCertificateList/`;
  private AddDestrCertificate_Url = `${environment.apiUrl}OrderReturn/UploadDestructionCertifiAdd/`;
  private GetCNUPLoadDestructionCerList_Url = `${environment.apiUrl}OrderReturn/GetCreaditNoteUploadList/`;
  private GetCNDestructionCerList_Url = `${environment.apiUrl}OrderReturn/GetCreaditNoteDestructionList/`;
  private SaveclaimsrsMapping_Url = `${environment.apiUrl}OrderReturn/ClaimSRSMappingAddEdit`;
  private GetClaimNoList_Url = `${environment.apiUrl}OrderReturn/GetClaimNoList/`;
  private GetClaimSrsMappedList_Url = `${environment.apiUrl}OrderReturn/GetSRSClaimMappedList/`;
  private GetClaimByIdList_Url = `${environment.apiUrl}OrderReturn/ClaimSRSMappingList/`;
  private AddDelayReasonSave_Url = `${environment.apiUrl}OrderReturn/AddDelayReasonOfPendingCN`;
  private GetSrsPendingCnList_Url = `${environment.apiUrl}OrderReturn/ClaimSRSMappingList/`
  private GetLrMismatchList_Url = `${environment.apiUrl}OrderReturn/GetLRReceivedOpList/`
  private SaveUpdateLRMismatch_Url = `${environment.apiUrl}OrderReturn/UpdateInwrdGtpassRecved`;
  private GetLRmisMatchCounts_Url = `${environment.apiUrl}OrderReturn/GetLRSRSMappingCounts/`;
  private GetLRPageCounts_Url = `${environment.apiUrl}OrderReturn/GetLRPageCounts/`;
  private GetSRSCNMappingCounts_Url = `${environment.apiUrl}OrderReturn/GetSRSCNMappingCounts/`;


  // Get Physical Check1 List
  getPhysicalCheck1List_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetPhysicalCheck1List_Url + BranchId + '/' + CompId, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  resolveClaimConcern_service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.resolveClaimConcern_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Import SRS Data through Excel
  ImportSRSData(BranchId: number, CompanyId: number, Addedby: string, formData: FormData) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/from-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers };
    return this._httpClient.post(this.ImportSRSData_Url + BranchId + '/' + CompanyId + '/' + Addedby, formData, httpOptions);
  }

  //Get Imported LR Mismatch List
  GetLRmisMatchList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetLRmisMatchList_Url + BranchId + "/" + CompId, { observe: 'response' }).pipe(map(result => {
      if (result) {
      }
      return result.body;
    }));
  }

  // Import Credit Data through Excel
  ImportCreditNoteData(BranchId: number, CompanyId: number, Addedby: string, formData: FormData) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/from-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers };
    return this._httpClient.post(this.ImportCreditNote_Url + BranchId + '/' + CompanyId + '/' + Addedby, formData, httpOptions);
  }

  //Get Imported SRS Data List
  GetCreditNoteList(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetCreditNoteList_Url + BranchId + "/" + CompId, { observe: 'response' }).pipe(map(result => {
      if (result) {
      }
      return result.body;
    }));
  }


  // Save claim srs Mapping
  saveclaimsrsMapping_Service(DataModel: ClaimSrsMappingModel): Observable<ClaimSrsMappingModel[] | null | undefined> {
    return this._httpClient.post<ClaimSrsMappingModel[]>(this.SaveclaimsrsMapping_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get claim no List
  GetClaimNoList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetClaimNoList_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Claim Srs Mapped List
  GetClaimSrsMappedList(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetClaimSrsMappedList_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get  Claim No By Id List
  GetClaimNoById_Service(BranchId: number, CompId: number, LRIdGPId: number): Observable<any> {
    return this._httpClient.get(this.GetClaimByIdList_Url + BranchId + '/' + CompId + '/' + LRIdGPId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Get SRS Pending list for CN
  GetSrsPendingCnList_Service(BranchId: number, CompId: number, SRSId: number): Observable<any> {
    return this._httpClient.get(this.GetSrsPendingCnList_Url + BranchId + '/' + CompId + '/' + SRSId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
  //Get Upload Destruction Certificate
  UploadImage(CNIdStr: string, BranchId: number, CompanyId: number, DestrCertFile: string, AddedBy: string, formData: FormData) {
    let headers = new HttpHeaders();
    headers.append('image', 'multipart/from-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers };
    return this._httpClient.post(this.UploadImg_Url + CNIdStr + "/" + BranchId + "/" + CompanyId + "/" + DestrCertFile + "/" + AddedBy, formData, httpOptions);
  }

  //Destruction Certificate List
  GetDestructionCerList(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetDestructionCerList_Url + BranchId + "/" + CompId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

  //Add Destruction Certificate

  UploadDestructionCertifiAdd_Service(model: any): Observable<any> {
    return this._httpClient.post(this.AddDestrCertificate_Url, model, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  //Get Credit note Upload Destruction Certificate List
  GetCNUPLDestructionCerList(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetCNUPLoadDestructionCerList_Url + BranchId + "/" + CompId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

  //Get Credit note Destruction Certificate List
  GetCNDestructionCerList(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetCNDestructionCerList_Url + BranchId + "/" + CompId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

  //Add Delay Reason Save
  AddDelayReasonSave_Service(DataModel: DelayReasonModel): Observable<DelayReasonModel[] | null | undefined> {
    return this._httpClient.post<DelayReasonModel[]>(this.AddDelayReasonSave_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  getauditorchecklist_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetAuditorCheckList_Url + BranchId + '/' + CompId, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  //Get LR mismatch List
  GetLrMismatchList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetLrMismatchList_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Save Update LR Mismatch
  SaveUpdateLRMismatch_Service(DataModel: UpdateLRMismatchModel): Observable<UpdateLRMismatchModel[] | null | undefined> {
    return this._httpClient.post<UpdateLRMismatchModel[]>(this.SaveUpdateLRMismatch_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }
  // Get LR misMatch Counts
  GetLRmisMatchCounts_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetLRmisMatchCounts_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //  Get LR Page Count List
  GetLRCounts_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetLRPageCounts_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get SRSCN Mapping Counts
  GetSRSCNMappingCounts(DataModel: any): Observable<any> {
    return this._httpClient.post(this.GetSRSCNMappingCounts_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }


}
