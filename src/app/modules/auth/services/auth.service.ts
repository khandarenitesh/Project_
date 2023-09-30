import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import * as CryptoJS from 'crypto-js';
import { PermissionsModel } from '../models/permissions.model';
import { AddEmployeeModel } from '../../master-forms/Models/EmployeeModel';
import { AppCode } from 'src/app/app.code';

export type UserType = UserModel | undefined;
export type Permissions = PermissionsModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  private _LoginApi = `${environment.apiUrl}Login/LoginDetails2`;
  // private _LoginApi = `${environment.apiUrl}Login/LogInSession`;
  private _ChangePasswordApi = `${environment.apiUrl}Login/ChangePassword`;
  private _getForgotPassword_Url = `${environment.apiUrl}Login/ForgotPassword`;
  private GetCompanyList_Url = `${environment.apiUrl}Master/GetCompanyListForLogIn`;
  private GetRoleList_Url = `${environment.apiUrl}Masters/GetRoleListForLogIn`;
  private GetUserPermission_Url = `${environment.apiUrl}Login/GetUserPermissions/`;
  private SaveUserRegistration_Url = `${environment.apiUrl}Login/UserRegistration/`;
  private GetCheckUsernameAvailable_Url = `${environment.apiUrl}login/GetCheckUsernameAvailable/`;
  private GetBranchList_Url = `${environment.apiUrl}Masters/GetBranchListForLogin/`;


  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;
  UserInfo: UserModel;
  private datafordashboard = new BehaviorSubject('');
  currentData = this.datafordashboard.asObservable()

  //For Notification 
  private datafordashboardCountNoti = new BehaviorSubject('');
  CountData = this.datafordashboardCountNoti.asObservable()

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }


  private permissions = new BehaviorSubject<Permissions>(undefined);
  currentPermissions = this.permissions.asObservable();

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private _httpClient: HttpClient
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }


  PostSignIn(userName: string, Password: string, role: number, Company: number, Branch: number): Observable<any> {
    let enpPwd = this.encryptData(Password);
    return this._httpClient.post<any>(this._LoginApi, { Username: userName, Password: enpPwd, CompanyId: Company, RoleId: role, BranchId: Branch, GrantType: "password" })
      .pipe(
        map((auth: AuthModel) => {
          const result = this.setAuthFromLocalStorage(auth);
          return result;
        }),
        switchMap(() => this.getUserByToken()),
        catchError((err) => {
          console.error('err', err);
          return of(undefined);
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  GetUserPermissions(RoleId: number) {
    return this._httpClient.get(this.GetUserPermission_Url + RoleId, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      })
    )
  }

  GetPermissions(permissions: PermissionsModel) {
    this.permissions.next(permissions);
  }

  ChangePassword(model: any): Observable<any> {
    model.Password = this.encryptData(model.Password);
    model.NewPassword = this.encryptData(model.NewPassword);
    return this._httpClient.post<any>(this._ChangePasswordApi, model, { observe: 'response' })
      .pipe(
        map(result => {
          // login successful if there's a jwt token in the response
          if (result) {
          }
          return result;
        }),
        tap(data => { // Add Thid Tap to all services
          this.ReadStatusCode(data.status);
        },
          (error: any) => {
            // console.log(error);
            if (error.status === '401') {
              // logout
              this.logout();
            }
          }
        )
      );
  }

  // to encrypt password
  encryptData(data: string) {
    try {
      const key = CryptoJS.enc.Utf8.parse('8080808080808080');
      const ivi = CryptoJS.enc.Utf8.parse('8080808080808080');
      let encryptedlogin = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key,
        {
          keySize: 128 / 8,
          iv: ivi,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
      return encryptedlogin.toString();
    } catch (e) {
      console.log(e);
    }
  }

  // public methods
  login(email: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: AuthModel) => {
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    // localStorage.removeItem('authToken');
    // localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.Token) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    const user: any = sessionStorage.getItem('SessionLoginData');
    this.UserInfo = JSON.parse(user);
    if (user) {
      this.currentUserSubject.next(user);
    }
    else {
      this.logout();
    }
    return of(this.UserInfo);
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.authToken) {
      // localStorage.setItem('authToken', JSON.stringify(auth.authToken));
      sessionStorage.setItem('SessionLoginData', JSON.stringify(auth.authToken));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = sessionStorage.getItem('SessionLoginData');
      if (!lsValue) {
        return undefined;
      }
      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  // According to received status code perform actions.
  ReadStatusCode(statusCode: number) {
    // Error 401 : Un autherized : try sending refresh token and update tokens . if invalid then destroy all sessions, logout
    // If RefreshCode 400 BadRequest : then Logout
    switch (statusCode) {
      case 401: {
        // RefreshToken
        // this.RefreshToken();
        break;
      }
      case 400: {
        // Logout
        // console.log(statusCode);
        // this.logout();
        break;
      }
      case 500: {
        // Logout
        // console.log(statusCode);
        // this.logout();
        break;
      }
      default: {
        console.log('Invalid Header choice');
        break;
      }
    }
  }

  GetLocalData(): UserModel {
    const user: any = sessionStorage.getItem('authToken');
    this.UserInfo = JSON.parse(user);
    return this.UserInfo;
  }

  RefreshToken() {
    this.ClearSessionIfExpired();
    let userDtls = this.GetLocalData().UserInfo;
    let username = this.GetLocalData().UserInfo.UserName;
    let refreshToken = this.GetLocalData().refreshToken;
    let _userId = this.GetLocalData().UserInfo.UserId;
    const grantType = 'refresh_token';
    // pipe() let you combine multiple functions into a single function.
    // pipe() runs the composed functions in sequence.
    return this._httpClient.post<any>(this._LoginApi, { UserDtls: userDtls, UserName: username, UserId: _userId, RefreshToken: refreshToken, GrantType: grantType })
      .pipe(
        map((auth: AuthModel) => {
          const result = this.setAuthFromLocalStorage(auth);
          return result;
        }),
        switchMap(() => this.getUserByToken()),
        catchError((err) => {
          console.error('err', err);
          return of(undefined);
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  ClearSessionIfExpired() {
    if (this.getAuthFromLocalStorage() !== null && this.getAuthFromLocalStorage() !== undefined) {
      if (this.GetLocalData().expiration !== null &&
        this.GetLocalData().expiration !== undefined &&
        this.GetLocalData().expiration.length > 0) {
        let tokenExpDate = this.GetLocalData().expiration;

        let ExpDateFromServ = new Date(tokenExpDate);
        let CheckDate = new Date();
        ExpDateFromServ.setMinutes(ExpDateFromServ.getMinutes() + 10);
        if (CheckDate > ExpDateFromServ === true) {
          // this.toastr.error('Session.', 'Time Out');
          this.logout();
        }
      } else {
        // this.toastr.error('Session.', 'Time Out');
        this.logout();
      }
    } else {
      // this.toastr.error('Session.', 'Time Out');
      this.logout();
    }
  }

  //only for super admin
  isSuperAdmin(): boolean {
    let obj = AppCode.getUser();
    if (obj.RoleId == 1) {
      return true;
    }
    return false;
  }

  //only for admin
  isAdminOnly(): boolean {
    let obj = AppCode.getUser();
    if (obj.RoleId == 2) {
      return true;
    }
    return false;
  }

  //superadmin and branch admin
  isAdmin(): boolean {
    let obj = AppCode.getUser();
    if (obj.RoleId == 1 || obj.RoleId == 2) {
      return true;
    }
    return false;
  }

  IsAdminIsOperatorIsSupervisor(): boolean {
    let obj = AppCode.getUser();
    if (obj.RoleId == 2 || obj.RoleId == 3 || obj.RoleId == 4) {
      return true;
    }
    return false;
  }

  //Branch admin and operator
  isOperator(): boolean {
    let obj = AppCode.getUser();
    if (obj.RoleId == 2 || obj.RoleId == 3) {
      return true;
    }
    return false;
  }

  //operator and supervisor
  isSupervisor(): boolean {
    let obj = AppCode.getUser();
    if (obj.RoleId == 2 || obj.RoleId == 4) {
      return true;
    }
    return false;
  }

  isAccountant(): boolean {
    let obj = AppCode.getUser();
    if (obj.RoleId == 2 ||obj.RoleId == 10) {
      return true;
    }
    return false;
  }

  isGatesupr(): boolean {
    let obj = AppCode.getUser();
    if (obj.RoleId == 7 || obj.RoleId == 10 || obj.RoleId == 2) {
      return true;
    }
    return false;
  }

  isAccountantAdmin(): boolean {
    let obj = AppCode.getUser();
    if (obj.RoleId == 1 || obj.RoleId == 2 || obj.RoleId == 10) {
      return true;
    }
    return false;
  }

  //forgot pass
  ForgotPassword(model: any): Observable<string> {
    return this._httpClient.post<string>(this._getForgotPassword_Url, model).pipe(
      map(result => {
        if (result) {
        }
        return result;
      }),
    );
  }

  // Get Company List
  getCompanyList_Service(Status: string): Observable<any> {
    return this._httpClient.get(this.GetCompanyList_Url + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Role List
  getRoleList_Service(): Observable<any> {
    return this._httpClient.get(this.GetRoleList_Url, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Branch List
  getBranchList_Service(Status: string): Observable<any> {
    return this._httpClient.get(this.GetBranchList_Url + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Save User Registration
  UserRegistration_Service(DataModel: AddEmployeeModel): Observable<AddEmployeeModel[] | null | undefined> {
    return this._httpClient.post<AddEmployeeModel[]>(this.SaveUserRegistration_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Check Username Available
  getCheckUsernameAvailable_Service(Username: string): Observable<any> {
    return this._httpClient.get(this.GetCheckUsernameAvailable_Url + Username, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  SendToDashboard(item: any) {
    this.datafordashboard.next(item);
  }

  SendToDashboardNotification(item: any) {
    this.datafordashboardCountNoti.next(item);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
