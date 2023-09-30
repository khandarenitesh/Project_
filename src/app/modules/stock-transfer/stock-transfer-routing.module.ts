import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StockTransferComponent } from './stock-transfer.component';

// Add Stock Transfer
import { AddStockTransferComponent } from './add-stock-transfer/add-stock-transfer.component';
import { OperatorauthGuard } from '../../Guards/operatorauth.guard';

const routes: Routes = [
  {
    path: '',
    component: StockTransferComponent,
    children: [
      {
        path: 'add-stock-transfer',
        component: AddStockTransferComponent,
        canActivate: [OperatorauthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockTransferRoutingModule { }
