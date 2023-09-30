import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OCRRoutingModule } from './ocr-routing.module';
import { WebcamModule } from 'ngx-webcam';
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
import { OcrIntegrationComponent } from './ocr-integration/ocr-integration.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { OcrIntegrationService } from './Services/ocr-integration.service';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { PredictionComponent } from './prediction/prediction.component';
import { SqlQueryValidatorDirective } from './sql-query-validator.directive';
import { KeysPipe } from './query-builder/keys.pipe';
import { MatTableExporterModule } from 'mat-table-exporter';

const modules = [
  MatInputModule, MatButtonModule, MatListModule, MatSelectModule, MatTableModule,
  MatSortModule, MatPaginatorModule, MatProgressSpinnerModule, MatFormFieldModule,
  MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, MatAutocompleteModule, MatRippleModule,
  ReactiveFormsModule, FormsModule
];

@NgModule({
  declarations: [
    OcrIntegrationComponent,
    QueryBuilderComponent,
    PredictionComponent,
    SqlQueryValidatorDirective,
    KeysPipe
  ],
  imports: [
    CommonModule,
    OCRRoutingModule,
    WebcamModule,
    ImageCropperModule,
    MatTableExporterModule,
    modules
  ],
  providers: [OcrIntegrationService, DatePipe]
})
export class OCRModule { }
