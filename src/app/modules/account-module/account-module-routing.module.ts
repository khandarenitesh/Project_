import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountModuleComponent } from './account-module.component';
import { AddComssionInvoiceComponent } from './add-comssion-invoice/add-comssion-invoice.component';
import { CommsionInvoiceListComponent } from './commsion-invoice-list/commsion-invoice-list.component';
import { ExpenceRegisterListComponent } from './expence-register-list/expence-register-list.component';
import { ExpenceRegisterAddComponent } from './expence-register-add/expence-register-add.component';

// Reimbursment Invoice
import { ReimbursmentInvoiceComponent } from './reimbursment-invoice/reimbursment-invoice.component';

// Reimbursment Invoice List
import { ReimbursmentInvoiceListComponent } from './reimbursment-invoice-list/reimbursment-invoice-list.component';
import { GatepassBillListComponent } from './gatepass-bill-list/gatepass-bill-list.component';
import { CheckInvoiceListComponent } from './check-invoice-list/check-invoice-list.component';
import { AccountantauthGuard } from 'src/app/Guards/accountantauth.guard';
import { GatesuprauthGuard } from 'src/app/Guards/gatesuprauth.guard';

const routes: Routes = [
  {
    path: '',
    component: AccountModuleComponent,
    children: [
      {
        path: 'expence-register',
        component: ExpenceRegisterListComponent,
        canActivate:[AccountantauthGuard]
      },
      {
        path: 'add-expence-register',
        component: ExpenceRegisterAddComponent,
        canActivate:[AccountantauthGuard]
      },
      {
        path: 'reimbursment-invoice-add',
        component: ReimbursmentInvoiceComponent,
        canActivate:[AccountantauthGuard]
      },
      {
        path: 'reimbursment-invoice-list',
        component: ReimbursmentInvoiceListComponent,
        canActivate:[AccountantauthGuard]
      },
      {
        path: 'add-comssion-invoice',
        component: AddComssionInvoiceComponent,
        canActivate:[AccountantauthGuard]
      },
      {
        path: 'commsion-invoice-list',
        component: CommsionInvoiceListComponent,
        canActivate:[AccountantauthGuard]
      },
      {
        path: 'gatepass-bill-list',
        component: GatepassBillListComponent,
        canActivate:[GatesuprauthGuard]
      },
      {
        path: 'check-invoice-list',
        component: CheckInvoiceListComponent,
        canActivate:[GatesuprauthGuard]
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountModuleRoutingModule { }
