import { QueryBuilderModule } from './../modules/query-builder/query-builder.module';
import { Routes } from '@angular/router';
import { OCRModule } from '../modules/ocr/ocr.module';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'modules/masters',
    loadChildren: () =>
      import('../modules/master-forms/master-forms.module').then((m) => m.MasterFormsModule),
  },
  {
    path: 'modules/order-dispatch',
    loadChildren: () =>
      import('../modules/order-dispatch/order-dispatch.module').then((o) => o.OrderDispatchModule),
  },
  {
    path: 'modules/cheque-accounting',
    loadChildren: () =>
      import('../modules/cheque-accounting/cheque-accounting.module').then((c) => c.ChequeAccountingModule),
  },
  {
    path: 'modules/inventory-inward',
    loadChildren: () =>
      import('../modules/inventory-inward/inventory-inward.module').then((inv) => inv.InventoryInwardModule),
  },
  {
    path: 'modules/order-return',
    loadChildren: () =>
      import('../modules/order-return/order-return.module').then((o) => o.OrderReturnModule),
  },
  {
    path: 'modules/ocr',
    loadChildren: () =>
      import('../modules/ocr/ocr.module').then((o) => o.OCRModule),
  },
  {
    path: 'modules/query',
    loadChildren: () =>
      import('../modules/query-builder/query-builder.module').then((o) => o.QueryBuilderModule),
  },
  {
    path: 'modules/stock-transfer',
    loadChildren: () =>
      import('../modules/stock-transfer/stock-transfer.module').then((s) => s.StockTransferModule),
  },
  {
    path: 'modules/configuration',
    loadChildren: () =>
      import('../modules/configuration/configuration.module').then((c) => c.ConfigureModule),
  },
  {
    path: 'modules/account-module',
    loadChildren: () =>
      import('../modules/account-module/account-module.module').then((c) => c.AccountModule),
  },
  {
    path: 'builder',
    loadChildren: () =>
      import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'modules/profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
  },

  {
    path: 'crafted/account',
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
