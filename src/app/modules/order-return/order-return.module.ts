import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderReturnRoutingModule } from './order-return-routing.module';
import { OrderReturnComponent } from './order-return.component';
import { ResolveClaimConcernComponent } from './resolve-claim-concern/resolve-claim-concern.component';
import { ClaimSrsMappingComponent } from './claim-srs-mapping/claim-srs-mapping.component';
import { ClaimSrsMappedListComponent } from './claim-srs-mapped-list/claim-srs-mapped-list.component';
import { SrsListPendingCnComponent } from './srs-list-pending-cn/srs-list-pending-cn.component';


import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableExporterModule } from 'mat-table-exporter';
import { AuditorCheckComponent } from './auditor-check/auditor-check.component';

import { ImportCreditNoteComponent } from './import-credit-note/import-credit-note.component';
import { ImportSrsComponent } from './import-srs/import-srs.component';
import { UploadDestructCertificateComponent } from './upload-destruct-certificate/upload-destruct-certificate.component';
import { DestructionCertificateListComponent } from './destruction-certificate-list/destruction-certificate-list.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { CardsModule, DropdownMenusModule, WidgetsModule } from 'src/app/_metronic/partials';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LrMismatchListComponent } from './lr-mismatch-list/lr-mismatch-list.component';

const modules = [
  MatInputModule, MatButtonModule, MatListModule, MatSelectModule, MatTableModule,ReactiveFormsModule,FormsModule,
  MatSortModule, MatPaginatorModule, MatProgressSpinnerModule, MatFormFieldModule,MatCheckboxModule,
  MatDatepickerModule, MatNativeDateModule, MatIconModule, MatCardModule,MatDividerModule,MatAutocompleteModule,MatTableExporterModule

];

@NgModule({
  declarations: [
    OrderReturnComponent,
    ResolveClaimConcernComponent,
    ImportCreditNoteComponent,
    AuditorCheckComponent,
    ClaimSrsMappingComponent,
    ClaimSrsMappedListComponent,
    SrsListPendingCnComponent,
    ImportSrsComponent,
    UploadDestructCertificateComponent,
    DestructionCertificateListComponent,
    LrMismatchListComponent
  ],
  imports: [
    CommonModule,
    OrderReturnRoutingModule,
    modules,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    DropdownMenusModule,
    WidgetsModule,
    CardsModule
  ]
})
export class OrderReturnModule { }
