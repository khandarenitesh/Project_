import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditorCheckComponent } from './auditor-check/auditor-check.component';
import { OrderReturnComponent } from './order-return.component';
import { ResolveClaimConcernComponent } from './resolve-claim-concern/resolve-claim-concern.component';
import { ImportCreditNoteComponent } from './import-credit-note/import-credit-note.component';
import { ClaimSrsMappingComponent } from './claim-srs-mapping/claim-srs-mapping.component';
import { ClaimSrsMappedListComponent } from './claim-srs-mapped-list/claim-srs-mapped-list.component';
import { SrsListPendingCnComponent } from './srs-list-pending-cn/srs-list-pending-cn.component';

import { ImportSrsComponent } from './import-srs/import-srs.component';
import { UploadDestructCertificateComponent } from './upload-destruct-certificate/upload-destruct-certificate.component';
import { DestructionCertificateListComponent } from './destruction-certificate-list/destruction-certificate-list.component';
import { LrMismatchListComponent } from './lr-mismatch-list/lr-mismatch-list.component';
import { OperatorauthGuard } from 'src/app/Guards/operatorauth.guard';

const routes: Routes = [
  {
    path: '',
    component: OrderReturnComponent,
    children: [
      {
        path: 'resolve-claim-concern',
        component: ResolveClaimConcernComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'import-credit-note',
        component: ImportCreditNoteComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'claim-srs-mapping',
        component: ClaimSrsMappingComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'claim-srs-mapped-list',
        component: ClaimSrsMappedListComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'srs-pending-cn',
        component: SrsListPendingCnComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'auditor-check-list',
        component: AuditorCheckComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'import-srs',
        component: ImportSrsComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'upload-destruct-certificate',
        component: UploadDestructCertificateComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'destruction-certificate-list',
        component: DestructionCertificateListComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'lr-received-list',
        component: LrMismatchListComponent,
        canActivate: [OperatorauthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderReturnRoutingModule { }
