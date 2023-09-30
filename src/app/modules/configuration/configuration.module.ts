import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';

import {
  CardsModule,
  DropdownMenusModule,
  WidgetsModule,
} from '../../_metronic/partials';

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
import { MatNativeDateModule } from '@angular/material/core';

//App configuration
import { AppConfigurationComponent } from './app-configuration/app-configuration.component';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';

// Version Details
import { VersionDetailsComponent } from './version-details/version-details.component';

const modules = [
  MatInputModule,
  MatButtonModule,
  MatListModule,
  MatSelectModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatIconModule,
  MatNativeDateModule
];

@NgModule({
  declarations: [AppConfigurationComponent, ConfigurationComponent, VersionDetailsComponent],
  imports: [
    CommonModule,
    modules,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    DropdownMenusModule,
    WidgetsModule,
    CardsModule,
    ConfigurationRoutingModule,
  ],
})
export class ConfigureModule {}
