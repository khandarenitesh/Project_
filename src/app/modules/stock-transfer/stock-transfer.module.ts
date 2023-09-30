import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';

import { CardsModule, DropdownMenusModule, WidgetsModule, } from '../../_metronic/partials';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

import { StockTransferRoutingModule } from './stock-transfer-routing.module';
import { StockTransferComponent } from './stock-transfer.component';
import { RouterModule, Routes } from '@angular/router';
import { AddStockTransferComponent } from './add-stock-transfer/add-stock-transfer.component';

const modules = [
  MatInputModule, MatButtonModule, MatListModule, MatSelectModule, MatTableModule,
  MatSortModule, MatPaginatorModule, MatProgressSpinnerModule, MatFormFieldModule,
  MatCheckboxModule, MatDatepickerModule,MatNativeDateModule, MatIconModule , MatAutocompleteModule
];

@NgModule({
  declarations: [
    StockTransferComponent,
    AddStockTransferComponent
  ],
  imports: [
    CommonModule,
    StockTransferRoutingModule,
    modules,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    DropdownMenusModule,
    WidgetsModule,
    CardsModule
  ],
  exports: [RouterModule]
})
export class StockTransferModule { }
