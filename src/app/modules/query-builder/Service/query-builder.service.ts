import { Injectable } from '@angular/core';

// http
import { HttpClient, HttpHeaders } from '@angular/common/http';

// environment
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryBuilderModel } from '../QueryPage/query-builder/query-builder.component';

@Injectable({
  providedIn: 'root'
})
export class QueryBuilderService {

  constructor(private _httpClient: HttpClient) { }

  private Querydata_Url = `${environment.apiUrl}Masters/Savequerybuilder`;
  private GetDataUsingSelectList_Url = `${environment.apiUrl}Masters/PostQueryBuilder`;
  // Save Query data
  Querydata_Service(DataModel: QueryBuilderModel): Observable<QueryBuilderModel[] | null | undefined> {
    return this._httpClient.post<QueryBuilderModel[]>(this.Querydata_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Save Query data
  GetDataUsingSelectList_Service(DataModel: QueryBuilderModel): Observable<QueryBuilderModel[] | null | undefined> {
    return this._httpClient.post<QueryBuilderModel[]>(this.GetDataUsingSelectList_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }
}
