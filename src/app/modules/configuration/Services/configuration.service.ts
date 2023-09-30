import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from '../../auth';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { AppConfiguration } from '../models/app-configuration.model';

// Version Details Model Added
import { VersionDetailsModel } from '../models/version-details-model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private _httpClient: HttpClient, private _AuthService: AuthService) { }

  private GetAppConfiguration_Url = `${environment.apiUrl}Configuration/GetAppConfigurationList`;
  private SaveAppConfiguration_Url = `${environment.apiUrl}Configuration/AddEditAppConfiguration`;
    
  // Get Version Details
  private GetVersionDetails_Url = `${environment.apiUrl}Masters/GetVersionDetails/`;

  // To Check Version Number
  private CheckVersionNo_Url = `${environment.apiUrl}Masters/CheckVersionNo/`;

  // Add/Edit Version Details
  private AddVersionDetailsForWeb_Url = `${environment.apiUrl}Masters/AddVersionDetails`;

  //App Configuration Get List Service
  GetAppConfigurationList_Service(): Observable<any> {
    return this._httpClient.get(this.GetAppConfiguration_Url, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
      );
  }

  SaveAppConfiguration_Service(DataModel: AppConfiguration): Observable<AppConfiguration[] | null | undefined> {
    return this._httpClient.post<AppConfiguration[]>(this.SaveAppConfiguration_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Version Details
  GetVersionDetails_Service(): Observable<any> {
    return this._httpClient.get(this.GetVersionDetails_Url, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Add/Edit Version Details
  SaveVersionDetails_Service(DataModel: VersionDetailsModel): Observable<VersionDetailsModel[] | null | undefined> {
    return this._httpClient.post<VersionDetailsModel[]>(this.AddVersionDetailsForWeb_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // To Check Version Number
  CheckVersionNo_Service(DataModel: any): Observable<any> {
    return this._httpClient.post(this.CheckVersionNo_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

}

