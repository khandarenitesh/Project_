import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';

import { CardsModule, DropdownMenusModule, WidgetsModule, } from '../../_metronic/partials';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InventoryInwardRoutingModule } from './inventory-inward-routing.module';
import { InventoryInwardComponent } from './inventory-inward.component';
import { MatTableExporterModule } from 'mat-table-exporter';

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
import { MatNativeDateModule } from '@angular/material/core';

// Inventory Inward related to Component added
import { ImportTransitReportComponent } from './import-transit-report/import-transit-report.component';
import { AddInsuranceClaimComponent } from './add-insurance-claim/add-insurance-claim.component';
import { InsuranceClaimListComponent } from './insurance-claim-list/insurance-claim-list.component';
import { AddApprovalClaimComponent } from './add-approval-claim/add-approval-claim.component';
import { ApproveVehicleIssueComponent } from './approve-vehicle-issue/approve-vehicle-issue.component';
import { RaisedConcernListComponent } from './raised-concern-list/raised-concern-list.component';
import { VehicleChecklistImgComponent } from './vehicle-checklist-img/vehicle-checklist-img.component';

const modules = [
  MatInputModule, MatButtonModule, MatListModule, MatSelectModule, MatTableModule,
  MatSortModule, MatPaginatorModule, MatProgressSpinnerModule, MatFormFieldModule,
  MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, MatAutocompleteModule,MatTableExporterModule
];

@NgModule({
  declarations: [
    InventoryInwardComponent, ImportTransitReportComponent, AddInsuranceClaimComponent,
    InsuranceClaimListComponent, AddApprovalClaimComponent, ApproveVehicleIssueComponent, RaisedConcernListComponent, VehicleChecklistImgComponent,
  ],
  imports: [
    CommonModule, InventoryInwardRoutingModule, modules, FormsModule, ReactiveFormsModule,
    InlineSVGModule, DropdownMenusModule, WidgetsModule, CardsModule ,MatTableExporterModule
  ]
})
export class InventoryInwardModule { }
