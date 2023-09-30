import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { WidgetsModule } from '../../_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg';
import { CardsModule, DropdownMenusModule } from '../../_metronic/partials';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DashboardComponent } from './dashboard.component';


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
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableExporterModule } from 'mat-table-exporter';

import { CdkTableModule } from '@angular/cdk/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CustomPaginatorModule } from '../../custom-paginator.module';

const modules = [
  MatInputModule, MatButtonModule, MatListModule, MatSelectModule, MatTableModule,
  MatSortModule, MatPaginatorModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule,
  DropdownMenusModule, MatFormFieldModule, MatTableExporterModule, MatAutocompleteModule, MatCheckboxModule, CdkTableModule,
  MatIconModule, NgbModule
];

@NgModule({
  imports: [
    CommonModule, CardsModule,

    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      }
    ]),
    InlineSVGModule, WidgetsModule,
    FormsModule, ReactiveFormsModule, // # do not change
    modules,
    CustomPaginatorModule
  ],
  declarations: [
    DashboardComponent
  ]
})
export class DashboardModule { }
