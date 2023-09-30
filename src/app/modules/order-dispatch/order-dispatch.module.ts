import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';

import { CardsModule, DropdownMenusModule, WidgetsModule, } from '../../_metronic/partials';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OrderDispatchRoutingModule } from './order-dispatch-routing.module';
import { OrderDispatchComponent } from './order-dispatch.component';

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
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";

// Picklist Add
import { PicklistAddComponent } from './picklist-add/picklist-add.component';

// Picklist Verify
import { PicklistVerifyComponent } from './picklist-verify/picklist-verify.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { ImportInvoiceComponent } from './import-invoice/import-invoice.component';
import { MatDividerModule } from '@angular/material/divider';
import { ReadyToDispatchComponent } from './ready-to-dispatch/ready-to-dispatch.component';
import { AssignTransportModeComponent } from './assign-transport-mode/assign-transport-mode.component';
import { InvoiceCancelComponent } from './invoice-cancel/invoice-cancel.component';
import { ImportLRDetailsComponent } from './import-lr-details/import-lr-details.component';
import { ReAllotPickerComponent } from './re-allot-picker/re-allot-picker.component';
import { GenerateStickerComponent } from './generate-sticker/generate-sticker.component';
import { ResolveConcernComponent } from './resolve-concern/resolve-concern.component';
import { ResolveConcernInvoiceComponent } from './resolve-concern-invoice/resolve-concern-invoice.component';
import { AssignTransportEditComponent } from './assign-transport-edit/assign-transport-edit.component';
import { PriorityInvoiceListComponent } from './priority-invoice-list/priority-invoice-list.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const modules = [
  MatInputModule, MatButtonModule, MatListModule, MatSelectModule, MatTableModule, ReactiveFormsModule, FormsModule,
  MatSortModule, MatPaginatorModule, MatProgressSpinnerModule, MatFormFieldModule,
  MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, MatCardModule, MatDividerModule,MatAutocompleteModule
];

@NgModule({
  declarations: [
    OrderDispatchComponent,
    PicklistAddComponent,
    PicklistVerifyComponent,
    InvoiceListComponent,
    ImportInvoiceComponent,
    ReadyToDispatchComponent,
    AssignTransportModeComponent,
    InvoiceCancelComponent,
    ImportLRDetailsComponent,
    ReAllotPickerComponent,
    GenerateStickerComponent,
    ResolveConcernComponent,
    ResolveConcernInvoiceComponent,
    AssignTransportEditComponent,
    PriorityInvoiceListComponent
  ],
  imports: [
    CommonModule,
    OrderDispatchRoutingModule,
    modules,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    DropdownMenusModule,
    WidgetsModule,
    CardsModule
  ]
})
export class OrderDispatchModule { }
