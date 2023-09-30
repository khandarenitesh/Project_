import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MasterFormsComponent } from './master-forms.component';
// Add Branch
import { AddBranchComponent } from './add-branch/add-branch.component';
// Branch List
import { BranchListComponent } from './branch-list/branch-list.component';
import { GeneralMasterComponent } from './/general-master/general-master.component';
import { StockistMasterComponent } from './stockist-master/stockist-master.component';
import { TransporterListComponent } from './transporter-list/transporter-list.component';
import { CompanyAddComponent } from './company-add/company-add.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { TransporterAddComponent } from './transporter-add/transporter-add.component';
import { CartingAgentListComponent } from './carting-agent-list/carting-agent-list.component';

// Employee Add
import { EmployeeAddComponent } from './employee-add/employee-add.component';

// Employee List
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { CartingAgentAddComponent } from './carting-agent-add/carting-agent-add.component';
import { CurierAddComponent } from './curier-add/curier-add.component';

// Add Stockist Transporter Mapping
import { StockistTransporterMappingAddComponent } from './stockist-transporter-mapping-add/stockist-transporter-mapping-add.component';

// Stockist Transporter Mapping List
import { StockistTransporterMappingListComponent } from './stockist-transporter-mapping-list/stockist-transporter-mapping-list.component';
import { StockistAddComponent } from './stockist-add/stockist-add.component';
import { CompanyDivisionAddComponent } from './company-division-add/company-division-add.component';

// Courier List
import { CourierListComponent } from './courier-list/courier-list.component';
import { StockistBranchRelationComponent } from './stockist-branch-relation/stockist-branch-relation.component';
import { StockistCompanyRelationComponent } from './stockist-company-relation/stockist-company-relation.component';

import { EmailConfigurationComponent } from '../cheque-accounting/email-configuration/email-configuration.component'
import { UserMasterComponent } from './user-master/user-master.component';
import { CityMasterComponent } from './city-master/city-master.component';
import { ThresholdValueMasterComponent } from './threshold-value-master/threshold-value-master.component';
import { CheckListMasterComponent } from './check-list-master/check-list-master.component';
import { OtherCnfAddComponent } from './other-cnf-add/other-cnf-add.component';
import { BranchCompanyRelationComponent } from './branch-company-relation/branch-company-relation.component';
import { TaxMasterComponent } from './tax-master/tax-master.component';
import { HeadMasterComponent } from './head-master/head-master.component';
import { VendorMasterComponent } from './vendor-master/vendor-master.component';
import { VendorMasterAddComponent } from './vendor-master-add/vendor-master-add.component';
import { TransportParentMasterComponent } from './transport-parent-master/transport-parent-master.component';
import { TransportParentMappingComponent } from './transport-parent-mapping/transport-parent-mapping.component';
import { CurierParentMasterComponent } from './curier-parent-master/curier-parent-master.component';
import { CourierParentMappingComponent } from './courier-parent-mapping/courier-parent-mapping.component';
import { SuperAdminauthGuard } from 'src/app/Guards/superadminauth.guard';
import { AdminauthGuard } from 'src/app/Guards/adminauth.guard';
import { AccountAdminAuthGuard } from 'src/app/Guards/account-admin-auth.guard';
import { CompanyVendorMappingComponent } from './company-vendor-mapping/company-vendor-mapping.component';
import { VendorBranchMappingComponent } from './vendor-branch-mapping/vendor-branch-mapping.component';
import { StockistDataVerifyComponent } from './stockist-data-verify/stockist-data-verify.component';
import { ImportDynamicallyComponent } from './import-dynamically/import-dynamically.component';

const routes: Routes = [
  {
    path: '',
    component: MasterFormsComponent,
    children: [
      {
        path: 'add-branch',
        component: AddBranchComponent,
        canActivate: [SuperAdminauthGuard]
      },
      {
        path: 'branch-list',
        component: BranchListComponent,
        canActivate: [SuperAdminauthGuard]
      },
      {
        path: 'general-master',
        component: GeneralMasterComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'company-division',
        component: CompanyDivisionAddComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'stockist-master',
        component: StockistMasterComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'transporter-add',
        component: TransporterAddComponent,
        canActivate: [AccountAdminAuthGuard]
      },

      {
        path: 'transporter-list',
        component: TransporterListComponent,
        canActivate: [AccountAdminAuthGuard]
      },
      {
        path: 'employee-add',
        component: EmployeeAddComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'employee-list',
        component: EmployeeListComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'company-add',
        component: CompanyAddComponent,
        canActivate: [SuperAdminauthGuard]
      },
      {
        path: 'company-list',
        component: CompanyListComponent,
        canActivate: [SuperAdminauthGuard]
      },
      {
        path: 'carting-agent-add',
        component: CartingAgentAddComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'carting-agent-list',
        component: CartingAgentListComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'stockist-transporter-mapping-add',
        component: StockistTransporterMappingAddComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'stockist-transporter-mapping-list',
        component: StockistTransporterMappingListComponent,
        canActivate: [AdminauthGuard]
      },

      {
        path: 'courier-add',
        component: CurierAddComponent,
        canActivate: [AccountAdminAuthGuard]
      },
      {
        path: 'add-stockist',
        component: StockistAddComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'courier-list',
        component: CourierListComponent,
        canActivate: [AccountAdminAuthGuard]
      },
      {
        path: 'stockist-branch-relation',
        component: StockistBranchRelationComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'stockist-company-relation',
        component: StockistCompanyRelationComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'email-configuration',
        component: EmailConfigurationComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'user-master',
        component: UserMasterComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'city-master',
        component: CityMasterComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'threshold-value-master',
        component: ThresholdValueMasterComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'checklist-master',
        component: CheckListMasterComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'other-cnf-add',
        component: OtherCnfAddComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'branch-company-relation',
        component: BranchCompanyRelationComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'tax-master',
        component: TaxMasterComponent,
        canActivate: [AccountAdminAuthGuard]
      },
      {
        path: 'head-master',
        component: HeadMasterComponent,
        canActivate: [AccountAdminAuthGuard]
      },
      {
        path: 'vendor-master',
        component: VendorMasterComponent,
        canActivate: [AccountAdminAuthGuard]
      },
      {
        path: 'add-vendor',
        component: VendorMasterAddComponent,
        canActivate: [AccountAdminAuthGuard]
      },
      {
        path: 'transport-parent-master',
        component: TransportParentMasterComponent,
        canActivate: [AccountAdminAuthGuard]
      },
      {
        path: 'transport-parent-mapping',
        component: TransportParentMappingComponent,
        canActivate: [AccountAdminAuthGuard]
      },
      {
        path: 'curier-parent-master',
        component: CurierParentMasterComponent,
        canActivate: [AccountAdminAuthGuard]
      },
      {
        path: 'courier-parent-mapping',
        component: CourierParentMappingComponent,
        canActivate: [AccountAdminAuthGuard]
      },
      {
        path: 'company-vendor-mapping',
        component: CompanyVendorMappingComponent,
        canActivate: [AccountAdminAuthGuard]
      },
      {
        path: 'vendor-branch-mapping',
        component: VendorBranchMappingComponent
      },
      {
        path: 'stockist-data-verify',
        component: StockistDataVerifyComponent,
        canActivate: [AdminauthGuard]
      },
      {
        path: 'import-dynamically',
        component: ImportDynamicallyComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterFormsRoutingModule { }
