import { CustomPaginatorModule } from './../../custom-paginator.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';

import { CardsModule, DropdownMenusModule, WidgetsModule, } from '../../_metronic/partials';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MasterFormsRoutingModule } from './master-forms-routing.module';
import { MasterFormsComponent } from './master-forms.component';


// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatRippleModule } from '@angular/material/core';
// Add Branch
import { AddBranchComponent } from './add-branch/add-branch.component';

// Branch List
import { BranchListComponent } from './branch-list/branch-list.component';

import { GeneralMasterComponent } from './general-master/general-master.component';
import { StockistMasterComponent } from './stockist-master/stockist-master.component';
import { TransporterListComponent } from './transporter-list/transporter-list.component';
import { CartingAgentAddComponent } from './carting-agent-add/carting-agent-add.component';
import { CartingAgentListComponent } from './carting-agent-list/carting-agent-list.component';

// Employee Add
import { EmployeeAddComponent } from './employee-add/employee-add.component';
import { MatNativeDateModule } from '@angular/material/core';

// Employee List
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyAddComponent } from './company-add/company-add.component';
import { TransporterAddComponent } from './transporter-add/transporter-add.component';
import { CurierAddComponent } from './curier-add/curier-add.component';

// Stockist Transporter Mapping Add
import { StockistTransporterMappingAddComponent } from './stockist-transporter-mapping-add/stockist-transporter-mapping-add.component';

// Stockist Transporter Mapping List
import { StockistTransporterMappingListComponent } from './stockist-transporter-mapping-list/stockist-transporter-mapping-list.component';
import { CompanyDivisionAddComponent } from './company-division-add/company-division-add.component';
import { StockistAddComponent } from './stockist-add/stockist-add.component';

// Courier List
import { CourierListComponent } from './courier-list/courier-list.component';
import { StockistBranchRelationComponent } from './stockist-branch-relation/stockist-branch-relation.component';
import { StockistCompanyRelationComponent } from './stockist-company-relation/stockist-company-relation.component';
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
import { CompanyVendorMappingComponent } from './company-vendor-mapping/company-vendor-mapping.component';
import { PercentageDirectiveDirective } from './percentage-directive.directive';
import { VendorBranchMappingComponent } from './vendor-branch-mapping/vendor-branch-mapping.component';
import { StockistDataVerifyComponent } from './stockist-data-verify/stockist-data-verify.component';
import { CdkTableModule } from '@angular/cdk/table';
import { ImportDynamicallyComponent } from './import-dynamically/import-dynamically.component';

const modules = [
  MatInputModule, MatButtonModule, MatListModule, MatSelectModule, MatTableModule,
  MatSortModule, MatPaginatorModule, MatProgressSpinnerModule, MatFormFieldModule,
  MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, MatAutocompleteModule, MatRippleModule, CdkTableModule
];

@NgModule({
  declarations: [
    AddBranchComponent,
    BranchListComponent,
    MasterFormsComponent,
    GeneralMasterComponent,
    StockistMasterComponent,
    TransporterListComponent,
    EmployeeAddComponent,
    EmployeeListComponent,
    CompanyAddComponent,
    CompanyListComponent,
    TransporterAddComponent,
    CartingAgentAddComponent,
    CartingAgentListComponent,
    StockistTransporterMappingAddComponent,
    StockistTransporterMappingListComponent,
    CurierAddComponent,
    CompanyDivisionAddComponent,
    StockistAddComponent,
    CourierListComponent,
    StockistBranchRelationComponent,
    StockistCompanyRelationComponent,
    UserMasterComponent,
    CityMasterComponent,
    ThresholdValueMasterComponent,
    CheckListMasterComponent,
    OtherCnfAddComponent,
    BranchCompanyRelationComponent,
    TaxMasterComponent,
    HeadMasterComponent,
    VendorMasterComponent,
    VendorMasterAddComponent,
    TransportParentMasterComponent,
    TransportParentMappingComponent,
    CurierParentMasterComponent,
    CourierParentMappingComponent,
    CompanyVendorMappingComponent,
    PercentageDirectiveDirective,
    VendorBranchMappingComponent,
    StockistDataVerifyComponent,
    ImportDynamicallyComponent
  ],
  imports: [
    CommonModule,
    MasterFormsRoutingModule,
    modules,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    DropdownMenusModule,
    WidgetsModule,
    CardsModule,
    CustomPaginatorModule
  ]
})
export class MasterFormsModule { }
