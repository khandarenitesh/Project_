import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderDispatchComponent } from './order-dispatch.component';

// Picklist Add
import { PicklistAddComponent } from './picklist-add/picklist-add.component';
// Picklist Verify
import { PicklistVerifyComponent } from './picklist-verify/picklist-verify.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { ImportInvoiceComponent } from './import-invoice/import-invoice.component';
import { ReadyToDispatchComponent } from './ready-to-dispatch/ready-to-dispatch.component';
import { AssignTransportModeComponent } from './assign-transport-mode/assign-transport-mode.component';
import { InvoiceCancelComponent } from './invoice-cancel/invoice-cancel.component';
import { ImportLRDetailsComponent } from './import-lr-details/import-lr-details.component';
import { ReAllotPickerComponent } from './re-allot-picker/re-allot-picker.component';
import { GenerateStickerComponent } from './generate-sticker/generate-sticker.component';
import { ResolveConcernComponent } from './resolve-concern/resolve-concern.component';
import { ResolveConcernInvoiceComponent } from './resolve-concern-invoice/resolve-concern-invoice.component';
import { AssignTransportEditComponent } from './assign-transport-edit/assign-transport-edit.component'
import { PriorityInvoiceListComponent } from './priority-invoice-list/priority-invoice-list.component';
import { AdminauthGuard } from '../../Guards/adminauth.guard';
import { OperatorauthGuard } from '../../Guards/operatorauth.guard';
import { SupervisorauthGuard } from '../../Guards/supervisorauth.guard';
import { IsadminonlyGuard } from '../../Guards/isadminonly.guard';
import { IsAdminIsOperatorIsSupervisorGuard } from '../../Guards/is-admin-is-operator-is-supervisor.guard';

export const routes: Routes = [
  {
    path: '',
    component: OrderDispatchComponent,
    children: [
      {
        path: 'picklist-add',
        component: PicklistAddComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'picklist-operation',
        component: PicklistVerifyComponent,
        canActivate: [IsAdminIsOperatorIsSupervisorGuard]
      },
      {
        path: 'picklist-operation-stocktransfer/:id',
        component: PicklistVerifyComponent,
        canActivate: [IsAdminIsOperatorIsSupervisorGuard]
      },
      {
        path: 'Re-Allot-picklist',
        component: ReAllotPickerComponent,
        canActivate: [SupervisorauthGuard]
      },
      {
        path: 'ReAllot-picklist/:id',
        component: ReAllotPickerComponent,
        canActivate: [SupervisorauthGuard]
      },
      {
        path: 'invoice-list',
        component: InvoiceListComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'import-invoice',
        component: ImportInvoiceComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'ready-to-dispatch',
        component: ReadyToDispatchComponent,
        canActivate: [SupervisorauthGuard]
      },
      {
        path: 'assign-transport-mode',
        component: AssignTransportModeComponent,
        canActivate: [SupervisorauthGuard]
      },
      {
        path: 'assign-transport-edit',
        component: AssignTransportEditComponent,
        canActivate: [SupervisorauthGuard]
      },
      {
        path: 'edit-assign-transport/:id',
        component: AssignTransportEditComponent,
        canActivate: [SupervisorauthGuard]
      },
      {
        path: 'invoice-cancel-list',
        component: InvoiceCancelComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'invoice-cancel/:id',
        component: InvoiceCancelComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'import-lr',
        component: ImportLRDetailsComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'import-lr-stock-transfer/:id',
        component: ImportLRDetailsComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'print-sticker',
        component: GenerateStickerComponent,
        canActivate: [SupervisorauthGuard]
      },
      {
        path: 'print-sticker-stocktransfer/:id',
        component: GenerateStickerComponent,
        canActivate: [SupervisorauthGuard]
      },
      {
        path: 'resolve-concern',
        component: ResolveConcernComponent,
        canActivate: [SupervisorauthGuard]
      },
      {
        path: 'resolve-concern-stocktransfer/:id',
        component: ResolveConcernComponent,
        canActivate: [SupervisorauthGuard]
      },
      {
        path: 'resolve-invoice',
        component: ResolveConcernInvoiceComponent,
        canActivate: [SupervisorauthGuard]
      },
      {
        path: 'resolve-invoice-stocktransfer/:id',
        component: ResolveConcernInvoiceComponent,
        canActivate: [SupervisorauthGuard]
      },
      {
        path: 'priority-invoice-list',
        component: PriorityInvoiceListComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'priority-invoice/:id',
        component: PriorityInvoiceListComponent,
        canActivate: [OperatorauthGuard]
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderDispatchRoutingModule { }
