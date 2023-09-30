import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { changePassword } from '../model/ChangePassword';

@Injectable({
  providedIn: 'root'
})
export class ChangepasswordService {

  constructor(private _httpClient: HttpClient) { }

  private getPasswordChange_Url = `${environment.apiUrl}Login/ChangePassword`;
  private getUserProfile_url = `${environment.apiUrl}Masters/GetUserDtls`;

  ChangePassword_Service(DataModel: changePassword): Observable<changePassword[] | null | undefined> {
    return this._httpClient.post<changePassword[]>(this.getPasswordChange_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        if (result) {
        }
        return result.body;
      }),
    );
  }

  getuserProfile(userId: number): Observable<any> {
    return this._httpClient.get(this.getUserProfile_url + '/' + userId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
}
