import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { QueryBuilderRoutingModule } from './query-builder-routing.module';
import { QueryBuilderComponent } from './QueryPage/query-builder/query-builder.component';
import { KeysPipe } from './pipes/keys.pipe';
import { SqlQueryValidatorDirective } from './directive/sql-query-validator.directive';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableExporterModule } from 'mat-table-exporter';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';

const modules = [
  MatInputModule, MatButtonModule, MatListModule, MatSelectModule, MatTableModule,
  MatSortModule, MatPaginatorModule, MatProgressSpinnerModule, MatFormFieldModule,
  MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, MatAutocompleteModule, MatRippleModule,
  ReactiveFormsModule, FormsModule, HttpClientModule, MatProgressBarModule, MatMenuModule,
];

@NgModule({
  declarations: [
    QueryBuilderComponent,
    KeysPipe,
    SqlQueryValidatorDirective
  ],
  imports: [
    CommonModule,
    QueryBuilderRoutingModule,
    MatTableExporterModule,
    modules
  ],
  providers: [DatePipe]
})
export class QueryBuilderModule { }
