import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChequeAccountingComponent } from './cheque-accounting.component';
import { ChequeRegisterComponent } from './cheque-register/cheque-register.component';
import { ChequeRegisterListComponent } from './cheque-register-list/cheque-register-list.component';
import { ImportStockistOutstandingComponent } from './import-stockist-outstanding/import-stockist-outstanding.component';
// import { EmailConfigurationComponent } from './email-configuration/email-configuration.component';
import { StockistOutstandingDetailsComponent } from './stockist-outstanding-details/stockist-outstanding-details.component';
import { ImportDepositedChequeComponent } from './import-deposited-cheque/import-deposited-cheque.component';
import { ChequeRegisterSummaryReportComponent } from './cheque-register-summary-report/cheque-register-summary-report.component';

// Cheque Summary of Previous Month/Week
import { ChequeSummaryReportComponent } from './cheque-summary-report/cheque-summary-report.component';
import { OperatorauthGuard } from 'src/app/Guards/operatorauth.guard';
import { ChequeStatusReportComponent } from './cheque-status-report/cheque-status-report.component';

const routes: Routes = [
  {
    path: '',
    component: ChequeAccountingComponent,
    children: [
      {
        path: 'cheque-register',
        component: ChequeRegisterComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'cheque-register-list',
        component: ChequeRegisterListComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'stockist-outstanding',
        component: ImportStockistOutstandingComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'stockist-outstandingdtls',
        component: StockistOutstandingDetailsComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'import-depositedcheque',
        component: ImportDepositedChequeComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'Rptrgst-summry',
        component: ChequeRegisterSummaryReportComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'cheque-summary-report',
        component: ChequeSummaryReportComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'cheque-status-report',
        component: ChequeStatusReportComponent,
        canActivate: [OperatorauthGuard]
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChequeAccountingRoutingModule { }
