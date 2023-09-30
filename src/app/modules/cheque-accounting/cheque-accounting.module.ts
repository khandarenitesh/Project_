import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import { MatTableExporterModule } from 'mat-table-exporter';

import { ChequeAccountingRoutingModule } from './cheque-accounting-routing.module';
import { ChequeAccountingComponent } from './cheque-accounting.component';
import { ChequeRegisterComponent } from './cheque-register/cheque-register.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { CardsModule, DropdownMenusModule, WidgetsModule } from 'src/app/_metronic/partials';
import { ChequeRegisterListComponent } from './cheque-register-list/cheque-register-list.component';
import { ImportStockistOutstandingComponent } from './import-stockist-outstanding/import-stockist-outstanding.component';
import { EmailConfigurationComponent } from './email-configuration/email-configuration.component';
import { StockistOutstandingDetailsComponent } from './stockist-outstanding-details/stockist-outstanding-details.component';
import { ImportDepositedChequeComponent } from './import-deposited-cheque/import-deposited-cheque.component';
import { ChequeRegisterSummaryReportComponent } from './cheque-register-summary-report/cheque-register-summary-report.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// Cheque Summary of Previous Month/Week
import { ChequeSummaryReportComponent } from './cheque-summary-report/cheque-summary-report.component';
import { ChequeStatusReportComponent } from './cheque-status-report/cheque-status-report.component';

import { CustomPaginatorModule } from '../../custom-paginator.module';

const modules = [
  MatInputModule, MatButtonModule, MatListModule, MatSelectModule, MatTableModule,
  MatSortModule, MatPaginatorModule, MatProgressSpinnerModule, MatFormFieldModule,
  MatCheckboxModule, MatDatepickerModule, MatIconModule,MatNativeDateModule, MatAutocompleteModule,MatTableExporterModule
];
@NgModule({
  declarations: [
    ChequeAccountingComponent,
    ChequeRegisterComponent,
    ChequeRegisterListComponent,
    ImportStockistOutstandingComponent,
    ImportDepositedChequeComponent,
    EmailConfigurationComponent,
    StockistOutstandingDetailsComponent,
    ChequeRegisterSummaryReportComponent,
    ChequeSummaryReportComponent,
    ChequeStatusReportComponent
  ],
  imports: [
    CommonModule,
    ChequeAccountingRoutingModule,
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
export class ChequeAccountingModule { }
