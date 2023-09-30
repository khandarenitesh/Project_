import { Injectable } from '@angular/core';

// http
import { HttpClient, HttpHeaders } from '@angular/common/http';

// models
import { OCRDataModel } from '../models/OCRDataModel';

// environment
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class OcrIntegrationService {
  private GetOCRImageTextData_Url = `${environment.apiUrl}OCR/GetOCRImageTextData/`;
  private GetProductDetailsByBatchNo_Url = `${environment.apiUrl}OCR/GetProductDetailsByBatchNo/`;
  private SaveOCRData_Url = `${environment.apiUrl}OCR/SaveOCRTextData`;
  private GetOCRTextDataList_Url = `${environment.apiUrl}OCR/GetOCRTextData/`;
  private SaveRGBData_Url = `${environment.apiUrl}OCR/SaveRGBData`;


  constructor(private _httpClient: HttpClient) { }

  GetOCRImageTextData(formData: FormData) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers };
    return this._httpClient.post(this.GetOCRImageTextData_Url, formData, httpOptions);
  }

  GetProductDetailsByBatchNo_Service(BatchNo: any, BranchId: number, CompId: number, AddedBy: any): Observable<any> {
    return this._httpClient.get(this.GetProductDetailsByBatchNo_Url + BatchNo + '/' + BranchId + '/' + CompId + '/' + AddedBy, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Save OCR Data
  SaveOCRData_Service(DataModel: OCRDataModel): Observable<OCRDataModel[] | null | undefined> {
    return this._httpClient.post<OCRDataModel[]>(this.SaveOCRData_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  GetOCRTextDataList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetOCRTextDataList_Url + '/' + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Save RGB Data
  SaveRGBData_Service(DataModel: OCRDataModel): Observable<OCRDataModel[] | null | undefined> {
    return this._httpClient.post<OCRDataModel[]>(this.SaveRGBData_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }


}