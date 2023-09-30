import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';

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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableExporterModule } from 'mat-table-exporter';

import { InlineSVGModule } from 'ng-inline-svg';
import { CardsModule, DropdownMenusModule, WidgetsModule } from '../../_metronic/partials';

import { AccountModuleRoutingModule } from './account-module-routing.module';
import { AccountModuleComponent } from './account-module.component';
import { ExpenceRegisterListComponent } from './expence-register-list/expence-register-list.component';
import { ExpenceRegisterAddComponent } from './expence-register-add/expence-register-add.component';

import { ReimbursmentInvoiceListComponent } from './reimbursment-invoice-list/reimbursment-invoice-list.component';
import { ReimbursmentInvoiceComponent } from './reimbursment-invoice/reimbursment-invoice.component';
import { GatepassBillListComponent } from './gatepass-bill-list/gatepass-bill-list.component';

import { AddComssionInvoiceComponent } from './add-comssion-invoice/add-comssion-invoice.component';
import { CommsionInvoiceListComponent } from './commsion-invoice-list/commsion-invoice-list.component';
import { CheckInvoiceListComponent } from './check-invoice-list/check-invoice-list.component';

import { CustomPaginatorModule } from '../../custom-paginator.module';

const modules = [
  MatInputModule, MatButtonModule, MatListModule, MatSelectModule, MatTableModule,
  MatSortModule, MatPaginatorModule, MatProgressSpinnerModule, MatFormFieldModule,
  MatCheckboxModule, MatDatepickerModule, MatIconModule,MatNativeDateModule, MatAutocompleteModule,MatTableExporterModule
];
@NgModule({
  declarations: [
    AccountModuleComponent,
    ExpenceRegisterListComponent,
    ExpenceRegisterAddComponent,
    ReimbursmentInvoiceListComponent,
    ReimbursmentInvoiceComponent,
    AddComssionInvoiceComponent,
    CommsionInvoiceListComponent,
    GatepassBillListComponent,
    CheckInvoiceListComponent
  ],
  imports: [
    CommonModule,
    AccountModuleRoutingModule,
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
export class AccountModule { }
