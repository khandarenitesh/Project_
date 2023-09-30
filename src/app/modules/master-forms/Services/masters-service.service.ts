import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth';
import { BranchList } from '../Models/BranchModel';
import { CompanyDivisionModel } from '../Models/Company-Devision';
import { GeneralModel } from '../Models/general-model';
import { AddEmployeeModel, EmployeeActiveModel } from '../Models/EmployeeModel';
import { TransporterModel, TransporterParentModel } from '../Models/TransporterModel';
import { CompanyList } from '../Models/CompanyList';
import { CartingAgentModel } from '../Models/carting-agent-list';
import { StockistModel } from '../Models/stockist-master';
import { CourierParentModel, CurierModel } from '../Models/curier-add';

import { StokistTransportModel } from '../Models/StokistTransportModel';
import { StockistBranchModel } from '../Models/Stockist-Branch-Model';
import { CityMaster } from '../Models/city-master.model';
import { Companythreshold } from '../Models/companythreshold.model';
import { ChecklistMasterModel } from '../Models/ChecklistMasterModel';
import { OtherCnfModel } from '../Models/other-cnf-model.Model';
import { BranchcompanyModel } from '../Models/branchcompany-model.model';
import { VendorModel } from '../Models/VendorModel';

import { TaxModel } from '../../master-forms/Models/TaxModel';
import { courierList } from '../Models/courierList';
import { ExpHeadModal } from '../head-master/head-master.component';
import { CompanyVendorMapping } from '../Models/company-vendor-mapping.model';
import { VendorBranchMappingModal } from '../vendor-branch-mapping/vendor-branch-mapping.component';
import { ImportDynamicSaveModel } from '../Models/import-dynami.model';

@Injectable({
  providedIn: 'root'
})
export class MastersServiceService {

  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private _httpClient: HttpClient, private _AuthService: AuthService) { }

  private GetCity_Url = `${environment.apiUrl}Masters/GetCityList/`;
  private SaveBranch_Url = `${environment.apiUrl}Masters/BranchMasterAddEdit`;
  private GetBranchList_Url = `${environment.apiUrl}Masters/GetBranchList`;
  private GetCategory_Url = `${environment.apiUrl}Masters/GetCategoryList`;
  private SaveGeneral_Url = `${environment.apiUrl}Masters/AddEditGeneralMaster`;
  private GetGeneralMasterList_Url = `${environment.apiUrl}Masters/GetGeneralMasterList/`;
  private SaveCompanyDivision_Url = `${environment.apiUrl}Masters/AddEditDivisionMaster`;
  private GetDivisionList_Url = `${environment.apiUrl}Masters/GetDivisionMasterList`;
  private GetStockistList_Url = `${environment.apiUrl}Masters/GetStockistList/`;
  private GetTransporterList_Url = `${environment.apiUrl}Masters/GetTransporterMasterList/`;
  private GetTransporterListForBranch_Url = `${environment.apiUrl}Masters/GetTransporterMasterListForBranch/`;
  private GetRoleList_Url = `${environment.apiUrl}Masters/GetRoleList`;
  private GetCompanyList_Url = `${environment.apiUrl}Masters/GetCompanyList`;
  private SaveEmployee_Url = `${environment.apiUrl}Masters/AddEmployeeDtls`;
  private GetEmployeeMasterList_Url = `${environment.apiUrl}Masters/GetEmployeeMasterList/`;
  private GetEmployeeDtls_Url = `${environment.apiUrl}Masters/GetEmpCmpDtls`;
  private EmployeeMasterActivate_Url = `${environment.apiUrl}Masters/EmployeeMasterActivate`;
  private EditEmployee_Url = `${environment.apiUrl}Masters/EditEmployeeDtls`;
  private UserActiveDeactive_Url = `${environment.apiUrl}Masters/UserActiveDeactive`;
  private SaveCompany_Url = `${environment.apiUrl}Masters/CompanyDtlsAddEdit/`;
  private SaveTransporter_Url = `${environment.apiUrl}Masters/AddEditTransporterMaster/`;
  private GetRegion_Url = `${environment.apiUrl}Masters/GetStateList/`;
  private GetDistrict_Url = `${environment.apiUrl}Masters/GetDistrictList/`;
  private GetCartingAgentList_Url = `${environment.apiUrl}Masters/GetCartingAgentLst`;
  private SaveCartingAgent_Url = `${environment.apiUrl}Masters/CartingAgentMasterAddEdit`;
  private GetStokistTransportMappingList_Url = `${environment.apiUrl}Masters/GetStokistTransportMappingList/`;
  private StokistTransportMappingAddEdit_Url = `${environment.apiUrl}Masters/StokistTransportMappingAddEdit/`;
  private SaveStockist_Url = `${environment.apiUrl}Masters/StockistDtlsAddEdit/`;
  private SaveCurier_Url = `${environment.apiUrl}Masters/AddEditCourierMaster`;
  private GetCourierMasterList_Url = `${environment.apiUrl}Masters/GetCourierMasterList/`;
  private GetStockistById_Url = `${environment.apiUrl}Masters/StockistById/`;
  private GetGetStockistBankList_Url = `${environment.apiUrl}Masters/GetStockistBankList/`;
  private GetTransporterById_Url = `${environment.apiUrl}Masters/TransporterById/`;
  private GetBranchById_Url = `${environment.apiUrl}Masters/GetBranchByIdDtls/`;
  private StockistBranchAdd_Url = `${environment.apiUrl}Masters/AddEditStockistBranchRelation`;
  private StockistCompanyAdd_Url = `${environment.apiUrl}Masters/AddEditStockistCompanyRelation`;
  private GetStockistBranchList_Url = `${environment.apiUrl}Masters/GetStockistBranchRelationList`;
  private GetStockistCompanyList_Url = `${environment.apiUrl}Masters/GetStockistCompanyRelationList`;
  private GetCheckUsernameAvailable_Url = `${environment.apiUrl}Masters/GetCheckUsernameAvailable/`;
  private GetStockistListByCompany_Url = `${environment.apiUrl}Masters/GetStockistListByCompany/`;
  private GetStockistListBranch_Url = `${environment.apiUrl}Masters/GetStockistListByBranch/`;
  private GetRolesDtls_Url = `${environment.apiUrl}Masters/GetRolesdls`;
  private CreateUser_Url = `${environment.apiUrl}Masters/CreateUser`;
  private GetStockistNoAvailable_Url = `${environment.apiUrl}Masters/GetStockistNoAvailable/`;
  private GetTransporterNo_Url = `${environment.apiUrl}Masters/GetTransporterNoAvailable/`;
  private GetEmpNumAvailable_Url = `${environment.apiUrl}Masters/GetCheckEmployeeNumberAvilable`;
  private GetCarAgentAvl_Url = `${environment.apiUrl}Masters/GetCheckCartingAgentAvilable`;
  private GetCourierNameAvl_Url = `${environment.apiUrl}Masters/GetCheckCourierNameAvilable`;
  private SaveCityMaster_Url = `${environment.apiUrl}Masters/AddEditCityMaster`;
  private GetMaster_Url = `${environment.apiUrl}Masters/GetGeneralMasterList/`;
  private GetThresholdValueList_Url = `${environment.apiUrl}Masters/GetThresholdvalueDtls/`;
  private SaveThresholdValue_Url = `${environment.apiUrl}Masters/AddEditThresholdValueMaster`;
  private ChecklistMaster_Url = `${environment.apiUrl}Masters/ChecklistMastersAddEdit/`;
  private GetCheckList_Url = `${environment.apiUrl}Masters/GetChecklistMasterList/`;
  private GetSequenceNoAvailable_Url = `${environment.apiUrl}Masters/checkSequenceNo/`;
  private SaveOtherCNF_Url = `${environment.apiUrl}Masters/OtherCNFMasterAddEdit/`;
  private GetOtherCNF_Url = `${environment.apiUrl}Masters/GetOtherCNFList`;
  private GetCompanyBranchList_Url = `${environment.apiUrl}Masters/GetCompanyBranchRelationList`;
  private GetComapnyListBranch_Url = `${environment.apiUrl}Masters/GetCompanyListByBranch/`;
  private CompanyBranchAdd_Url = `${environment.apiUrl}Masters/AddEditComapanyBranchRelation`;
  private GetTaxLst_Url = `${environment.apiUrl}Masters/GetTaxMasterList`;
  private AddEditTax_Url = `${environment.apiUrl}Masters/AddEditTaxMaster`;
  private SaveVendor_Url = `${environment.apiUrl}Masters/AddVendorDetails`;
  private GetVendorList_Url = `${environment.apiUrl}Masters/GetVendorList/`;
  private VendorDeleteDeactivate_Url = `${environment.apiUrl}Masters/VendorDeleteDeactivate`;
  private GetHeadMasterList_Url = `${environment.apiUrl}Masters/HeadMasterList`;
  private SaveHeadMaster_Url = `${environment.apiUrl}Masters/HeadMasterAddEdit`;
  private GetTransporterParentList_Url = `${environment.apiUrl}Masters/GetTransporterParentList/`;
  private ChangeTransoprtStatus_Url = `${environment.apiUrl}Masters/TransporterParentAddEdit/`;
  private SaveTransporterParent_Url = `${environment.apiUrl}Masters/TransporterParentAddEdit/`;
  private GetParentTransportMappedList_Url = `${environment.apiUrl}Masters/GetParentTransportMappedList/`;
  private SaveTransportParentMapping_Url = `${environment.apiUrl}Masters/ParentTransporterMappingAddEdit`;
  private SaveCourierParent_Url = `${environment.apiUrl}Masters/CourierParentAddEdit/`;
  private GetTransporterParent_Url = `${environment.apiUrl}Masters/GetTransporterParent/`;
  private GetCourierParentList_Url = `${environment.apiUrl}Masters/GetCourierParentList/`;
  private GetCourierParent_Url = `${environment.apiUrl}Masters/GetCourierParent/`;
  private GetParentCourierMappedList_Url = `${environment.apiUrl}Masters/GetParentCourierMappedList/`;
  private SaveCourierParentMapping_Url = `${environment.apiUrl}Masters/ParentCourierMappingAddEdit`;
  private GetVendorListByCompany_Url = `${environment.apiUrl}Masters/GetVendorListByCompany/`;
  private CompanyVendorAdd_Url = `${environment.apiUrl}Masters/AddEditCompanyVendorMapping`;
  private GetVendorListByBranch_Url = `${environment.apiUrl}Masters/GetVendorListByBranch/`;
  private BranchVendorAdd_Url = `${environment.apiUrl}Masters/AddEditBranchVendorMapping`;
  private GetExpiryStockistNotiCnt_Url = `${environment.apiUrl}Masters/ExpiryStockistNotificationDashboard/`;
  private GetExpiryStockistNotiList_Url = `${environment.apiUrl}Masters/ExpiryListForNotificationList/`;
  private GetGSTTypeList_Url = `${environment.apiUrl}Masters/GetGSTTypeList/`;
  private GetCompanyListByBranchEmp_Url = `${environment.apiUrl}Masters/GetCompanyListByBRIdForEMP`;
  private GetStockistDataForVerifyList_Url = `${environment.apiUrl}Masters/GetStockistListByBranchCompany/`;
  private getStockistForVerifyList_Url = `${environment.apiUrl}Masters/GetStockistListforVerifyData/`;
  private getImportTypeList_Url = `${environment.apiUrl}Masters/GetImportTypeList`;
  private GetImportFileandColumnRelList_Url = `${environment.apiUrl}Masters/GetImportFileandColumnRelList/`;
  private GetOnChangeColFieldList_Url = `${environment.apiUrl}Masters/OnChangeColFieldList`;
  private ImportDynamic_Url = `${environment.apiUrl}Masters/ImportDymAddEdit/`;
  private GetImporDynaLst_Url = `${environment.apiUrl}Masters/GetImportDyanamically/`;
  
  
  getCityList_Service(StateCode: string, districtCode: string, Flag: string): Observable<any> {
    return this._httpClient.get(this.GetCity_Url + StateCode + '/' + districtCode + '/' + Flag, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  SaveBranch_Service(DataModel: BranchList): Observable<BranchList[] | null | undefined> {
    return this._httpClient.post<BranchList[]>(this.SaveBranch_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

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

  getCategoryList_Service(): Observable<any> {
    return this._httpClient.get(this.GetCategory_Url, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }
  SaveGeneral_Service(DataModel: GeneralModel): Observable<GeneralModel[] | null | undefined> {
    return this._httpClient.post<GeneralModel[]>(this.SaveGeneral_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }
  GetGeneralMasterList_Service(CategoryName: string, Status: string): Observable<any> {
    return this._httpClient.get(this.GetGeneralMasterList_Url + CategoryName + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  getStockistList_Service(BranchId: number, CompanyId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetStockistList_Url + BranchId + '/' + CompanyId + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  getGetTransporterList_Service(DistrictCode: string, Status: string, BranchId: number): Observable<any> {
    return this._httpClient.get(this.GetTransporterList_Url + DistrictCode + '/' + Status + '/' + BranchId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  GetTransporterListForBranch_Service(DistrictCode: string, Status: string, BranchId: number): Observable<any> {
    return this._httpClient.get(this.GetTransporterListForBranch_Url + DistrictCode + '/' + Status + '/' + BranchId, { observe: 'response' })
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

  // Get Company List
  getCompanyList_Service(Status: string): Observable<any> {
    return this._httpClient.get(this.GetCompanyList_Url + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        return result.body;
      }));
  }

  // Save Employee
  SaveEmployee_Service(DataModel: AddEmployeeModel): Observable<AddEmployeeModel[] | null | undefined> {
    return this._httpClient.post<AddEmployeeModel[]>(this.SaveEmployee_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Employee Master List
  getEmployeeMasterList_Service(BranchId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetEmployeeMasterList_Url + BranchId + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Employee Company Details - EmpId Wise List
  getEmployeeDtls_Service(EmpId: number): Observable<any> {
    return this._httpClient.get(this.GetEmployeeDtls_Url + '/' + EmpId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Employee Master Activate
  EmployeeMasterActivate_Service(DataModel: EmployeeActiveModel): Observable<EmployeeActiveModel[] | null | undefined> {
    return this._httpClient.post<EmployeeActiveModel[]>(this.EmployeeMasterActivate_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Update Employee
  UpdateEmployee_Service(DataModel: AddEmployeeModel): Observable<AddEmployeeModel[] | null | undefined> {
    return this._httpClient.post<AddEmployeeModel[]>(this.EditEmployee_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Employee Master - User Activate
  UserActiveDeactive_Service(DataModel: EmployeeActiveModel): Observable<EmployeeActiveModel[] | null | undefined> {
    return this._httpClient.post<EmployeeActiveModel[]>(this.UserActiveDeactive_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Save Transporter
  SaveTransporter_Service(DataModel: TransporterModel): Observable<TransporterModel[] | null | undefined> {
    return this._httpClient.post<TransporterModel[]>(this.SaveTransporter_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }
  // Save company
  SaveCompany_Service(DataModel: CompanyList): Observable<CompanyList[] | null | undefined> {
    return this._httpClient.post<CompanyList[]>(this.SaveCompany_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  getRegionList_Service(Flag: string): Observable<any> {
    return this._httpClient.get(this.GetRegion_Url + Flag, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }
  getDistrictList_Service(StateCode: string, Flag: string): Observable<any> {
    return this._httpClient.get(this.GetDistrict_Url + StateCode + '/' + Flag, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Carting Agent List
  getCartingAgenList_Service(Status: string, BranchId: number): Observable<any> {
    return this._httpClient.get(this.GetCartingAgentList_Url + '/' + Status + '/' + BranchId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  SaveCartingAgent_Service(DataModel: CartingAgentModel): Observable<BranchList[] | null | undefined> {
    return this._httpClient.post<BranchList[]>(this.SaveCartingAgent_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Stokist Transport Mapping List
  getStokistTransportMappingList_Service(BranchId: number, CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetStokistTransportMappingList_Url + '/' + BranchId + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Stokist Transport Mapping Add/Delete
  StokistTransportMappingAddEdit_Service(DataModel: StokistTransportModel): Observable<StokistTransportModel[] | null | undefined> {
    return this._httpClient.post<StokistTransportModel[]>(this.StokistTransportMappingAddEdit_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // SaveCurier
  SaveCurier_Service(DataModel: CurierModel): Observable<CurierModel[] | null | undefined> {
    return this._httpClient.post<CurierModel[]>(this.SaveCurier_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Save Company Division
  SaveCompanyDivision_Service(DataModel: CompanyDivisionModel): Observable<CompanyDivisionModel[] | null | undefined> {
    return this._httpClient.post<CompanyDivisionModel[]>(this.SaveCompanyDivision_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // get master CourierList
  getGetCourierList_Service(BranchId: number, DistrictCode: string, Status: string): Observable<any> {
    return this._httpClient.get(this.GetCourierMasterList_Url + BranchId + '/' + DistrictCode + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  GeDivisionMasterList_Service(Status: string): Observable<any> {
    return this._httpClient.get(this.GetDivisionList_Url + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  SaveStockist_Service(DataModel: StockistModel): Observable<StockistModel[] | null | undefined> {
    return this._httpClient.post<StockistModel[]>(this.SaveStockist_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  GetStockistBankList_Service(StockistId: number): Observable<any> {
    return this._httpClient.get(this.GetGetStockistBankList_Url + StockistId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // getStockistById_Service(StockistId: number): Observable<any> {
  //   return this._httpClient.get(this.GetStockistById_Url + StockistId, { observe: 'response' })
  //     .pipe(map(result => {
  //       // login successful if there's a jwt token in the response
  //       if (result) {
  //       }
  //       return result.body;
  //     }));
  // }

  getTransporterById_Service(TransporterId: number): Observable<any> {
    return this._httpClient.get(this.GetTransporterById_Url + TransporterId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  getBranchById_Service(BranchId: number): Observable<any> {
    return this._httpClient.get(this.GetBranchById_Url + BranchId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Stockist Branch Relation save/Add Serivce
  StockistBranchAdd_Service(DataModel: StockistBranchModel): Observable<StockistBranchModel[] | null | undefined> {
    return this._httpClient.post<StockistBranchModel[]>(this.StockistBranchAdd_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Stockist Branch Relation save/Add Serivce
  StockistCompanyAdd_Service(DataModel: StockistBranchModel): Observable<StockistBranchModel[] | null | undefined> {
    return this._httpClient.post<StockistBranchModel[]>(this.StockistCompanyAdd_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Stockist Branch Relation List
  getStockistBranch_Service(StockiestId: number): Observable<any> {
    return this._httpClient.get(this.GetStockistBranchList_Url + '/' + StockiestId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Stockist Company Relation List
  getStockistCompany_Service(StockiestId: number): Observable<any> {
    return this._httpClient.get(this.GetStockistCompanyList_Url + '/' + StockiestId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
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


  //stockist branch relation (stockist list)
  getStockistListByBranch_Service(BranchId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetStockistListBranch_Url + BranchId + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //stockist company relation (stockist list)
  getStockistListByCompany_Service(CompanyId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetStockistListByCompany_Url + CompanyId + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //get Roles Details Emp Id
  getRolesDtls_Service(EmpId: number): Observable<any> {
    return this._httpClient.get(this.GetRolesDtls_Url + '/' + EmpId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
  // Save Employee
  CreateUser_Service(DataModel: AddEmployeeModel): Observable<AddEmployeeModel[] | null | undefined> {
    return this._httpClient.post<AddEmployeeModel[]>(this.CreateUser_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Check Stockist is Available
  getStockistNoChange_Service(StockistNo: string): Observable<any> {
    return this._httpClient.get(this.GetStockistNoAvailable_Url + StockistNo, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Check TransporterNo is Available
  getTransporterNo_Service(TransporterNo: string): Observable<any> {
    return this._httpClient.get(this.GetTransporterNo_Url + TransporterNo, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get check Employee Available
  getCheckEmpNumAvl_Service(model: any): Observable<any> {
    return this._httpClient.post(this.GetEmpNumAvailable_Url, model, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Get Check Carting Agent Available
  getCheckCarAgentAvl_Service(model: any): Observable<any> {
    return this._httpClient.post(this.GetCarAgentAvl_Url, model, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

  //check Courier Name Available
  getCheckCourierNameAvl_Service(model: any): Observable<any> {
    return this._httpClient.post(this.GetCourierNameAvl_Url, model, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

  //City Master
  SaveCityMaster_Service(DataModel: CityMaster): Observable<CityMaster[] | null | undefined> {
    return this._httpClient.post<CityMaster[]>(this.SaveCityMaster_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  getMastersList_Service(CategoryName: string, Status: string): Observable<any> {
    return this._httpClient.get(this.GetMaster_Url + CategoryName + '/' + Status, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  //Get Threshold Value Master
  getThresholdvalueMasterList_Service(BranchId: number, CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetThresholdValueList_Url + BranchId + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body
      }));
  }

  SaveThresholdValue_Service(DataModel: Companythreshold): Observable<CompanyList[] | null | undefined> {
    return this._httpClient.post<CompanyList[]>(this.SaveThresholdValue_Url, DataModel, { observe: 'response' }).pipe(map(result => {
      // login successful if there's a jwt token in the response
      if (result) {
      }
      return result.body;
    }));
  }

  //Save Checklist master
  SaveChecklist_Service(DataModel: ChecklistMasterModel): Observable<ChecklistMasterModel[] | null | undefined> {
    return this._httpClient.post<ChecklistMasterModel[]>(this.ChecklistMaster_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  GetCheckList_Service(BranchId: number, CompanyId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetCheckList_Url + BranchId + '/' + CompanyId + '/' + Status, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Check Sequence No is Available
  getSequenceNoChange_Service(SequenceNo: number, BranchId: number, CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetSequenceNoAvailable_Url + SequenceNo + '/' + BranchId + '/' + CompanyId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Save company
  SaveOtherCNF_Service(DataModel: OtherCnfModel): Observable<OtherCnfModel[] | null | undefined> {
    return this._httpClient.post<OtherCnfModel[]>(this.SaveOtherCNF_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }
  // Get Company List
  GetOtherCNFList_Service(BranchId: number, CompanyId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetOtherCNF_Url + '/' + BranchId + '/' + CompanyId + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
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


  //stockist branch relation (stockist list)
  getCompanyListByBranch_Service(BranchId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetComapnyListBranch_Url + BranchId + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Company Branch Relation Save/Add Service
  CompanyBranchAdd_Service(DataModel: BranchcompanyModel): Observable<BranchcompanyModel[] | null | undefined> {
    return this._httpClient.post<BranchcompanyModel[]>(this.CompanyBranchAdd_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }))
  }

  //Save Vendor service
  SaveVendor_Service(DataModel: VendorModel): Observable<VendorModel[] | null | undefined> {
    return this._httpClient.post<VendorModel[]>(this.SaveVendor_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  //Get Vendor List
  getVendorList_Service(BranchId: number, CompanyId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetVendorList_Url + BranchId + '/' + CompanyId + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Save Vendor service
  VendorDeleteDeactivate_Service(DataModel: VendorModel): Observable<VendorModel[] | null | undefined> {
    return this._httpClient.post<VendorModel[]>(this.VendorDeleteDeactivate_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Tax Master List
  getTaxList_Service(): Observable<any> {
    return this._httpClient.get(this.GetTaxLst_Url, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  //Add,Edit,delete of Tax Master
  AddEditTax_Service(DataModel: TaxModel): Observable<TaxModel[] | null | undefined> {
    return this._httpClient.post<TaxModel[]>(this.AddEditTax_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }
  // Get Head Master List
  GetHeadMasterList_Service(BranchId: number): Observable<any> {
    return this._httpClient.get(this.GetHeadMasterList_Url + '/' + BranchId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  SaveHeadMaster_Service(DataModel: ExpHeadModal): Observable<ExpHeadModal[] | null | undefined> {
    return this._httpClient.post<ExpHeadModal[]>(this.SaveHeadMaster_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  GetTransporterParentList_Service(BranchId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetTransporterParentList_Url + BranchId + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
  // Change Transport Parent Status
  ChangeTransportStatus_Service(DataModel: TransporterParentModel): Observable<TransporterParentModel[] | null | undefined> {
    return this._httpClient.post<TransporterParentModel[]>(this.ChangeTransoprtStatus_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }
  // Save Transporter Parent
  SaveTransporterParent_Service(DataModel: TransporterParentModel): Observable<TransporterParentModel[] | null | undefined> {
    return this._httpClient.post<TransporterParentModel[]>(this.SaveTransporterParent_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }
  GetParentTransportMappedList_Service(Tid: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetParentTransportMappedList_Url + Tid + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
  //Company Branch Relation Save/Add Service
  SaveTransportParentMapping_Service(DataModel: TransporterParentModel): Observable<TransporterParentModel[] | null | undefined> {
    return this._httpClient.post<TransporterParentModel[]>(this.SaveTransportParentMapping_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }))
  }

  //Get Parent Transporter
  GetTransporterParent_Service(Tpid: number): Observable<any> {
    return this._httpClient.get(this.GetTransporterParent_Url + Tpid, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Save Courier Parent
  SaveCourierParent_Service(DataModel: CourierParentModel): Observable<CourierParentModel[] | null | undefined> {
    return this._httpClient.post<CourierParentModel[]>(this.SaveCourierParent_Url, DataModel, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  //Get Parent Courier List
  GetParentCourierList_Service(BranchId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetCourierParentList_Url + BranchId + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Get Parent Courier
  GetParentCourier_Service(Cpid: number): Observable<any> {
    return this._httpClient.get(this.GetCourierParent_Url + Cpid, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  // Get Courier Parent Mapping
  GetParentCourierMappedList_Service(CPid: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetParentCourierMappedList_Url + CPid + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Company Branch Relation Save/Add Service
  SaveCourierParentMapping_Service(DataModel: CourierParentModel): Observable<CourierParentModel[] | null | undefined> {
    return this._httpClient.post<CourierParentModel[]>(this.SaveCourierParentMapping_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }))
  }

  //Company Vendor Mapping List
  GetVendorListByCompany_Service(CompanyId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetVendorListByCompany_Url + CompanyId + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Company Vendor Mapping Save/Add Service
  CompanyVendorAdd_Service(DataModel: CompanyVendorMapping): Observable<CompanyVendorMapping[] | null | undefined> {
    return this._httpClient.post<CompanyVendorMapping[]>(this.CompanyVendorAdd_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }))
  }

  BranchVendorAdd_Service(DataModel: VendorBranchMappingModal): Observable<VendorBranchMappingModal[] | null | undefined> {
    return this._httpClient.post<VendorBranchMappingModal[]>(this.BranchVendorAdd_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }))
  }

  //Branch Vendor Mapping List
  GetVendorListByBranch_Service(BranchId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetVendorListByBranch_Url + BranchId + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Expiry Stockist Notification Dashboard Count
  GetExpiryStockistNotiCnt_Service(BranchId: number, CompId: number, Flag: string): Observable<any> {
    return this._httpClient.get(this.GetExpiryStockistNotiCnt_Url + BranchId + '/' + CompId + '/' + Flag, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  //Expiry Stockist Notification List For Filter Data
  GetExpiryStockistNotiFilList_Service(BranchId: number, CompId: number): Observable<any> {
    return this._httpClient.get(this.GetExpiryStockistNotiList_Url + BranchId + '/' + CompId, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }
  GetGSTTypeList_Service(TaxId: number): Observable<any> {
    return this._httpClient.get(this.GetGSTTypeList_Url + TaxId, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  // Get Company List
  getCompanyListByBranchEmp_Service(BranchId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.GetCompanyListByBranchEmp_Url + '/' + BranchId + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        return result.body;
      }));
  }

  GetStockistDataForVerifyList_Service(BranchId: any, CompanyId: any, Status: string): Observable<any> {
    return this._httpClient.get(this.GetStockistDataForVerifyList_Url + BranchId + '/' + CompanyId + '/' + Status, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }

  getStockistForVerifyList_Service(BranchId: number, CompanyId: number, Status: string): Observable<any> {
    return this._httpClient.get(this.getStockistForVerifyList_Url + BranchId + '/' + CompanyId + '/' + Status, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

    // Get Import Type List
    getImportTypeList_Service(): Observable<any> {
      return this._httpClient.get(this.getImportTypeList_Url, { observe: 'response' })
        .pipe(map(result => {
          // login successful if there's a jwt token in the response
          if (result) {
          }
          return result.body;
        }));
    }
  
     // Get Import File and Column List Relation
     GetImportFileandColumnRelList_Serive(BranchId : number ,CompanyId: number, ImportId :number): Observable<any> {
    return this._httpClient.get(this.GetImportFileandColumnRelList_Url + '/' + BranchId+ '/' + CompanyId+ '/' + ImportId, { observe: 'response' })
      .pipe(map(result => {
        if (result) {
        }
        return result.body;
      }));
  }

    // Get Import File and Column List Relation
    OnChangeColFieldList_Serive(BranchId : number ,CompanyId: number, ImpId :number): Observable<any> {
      return this._httpClient.get(this.GetOnChangeColFieldList_Url + '/' + BranchId+ '/' + CompanyId+ '/' + ImpId, { observe: 'response' })
        .pipe(map(result => {
          if (result) {
          }
          return result.body;
        }));
    }

  //Save Checklist master
  ImportDynaSave_Service(DataModel: ImportDynamicSaveModel): Observable<ImportDynamicSaveModel[] | null | undefined> {
    return this._httpClient.post<ImportDynamicSaveModel[]>(this.ImportDynamic_Url, DataModel, { observe: 'response' })
      .pipe(map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }));
  }

  GetImportDyna_Service(BranchId: number, CompanyId: number): Observable<any> {
    return this._httpClient.get(this.GetImporDynaLst_Url + BranchId + '/' + CompanyId, { observe: 'response' }).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if (result) {
        }
        return result.body;
      }),
    );
  }




}

