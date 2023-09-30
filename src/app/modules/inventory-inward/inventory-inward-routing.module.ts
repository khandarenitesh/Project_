import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InventoryInwardComponent } from './inventory-inward.component';

// Inventory Inward related to Component added
import { ImportTransitReportComponent } from './import-transit-report/import-transit-report.component';
import { AddInsuranceClaimComponent } from './add-insurance-claim/add-insurance-claim.component';
import { InsuranceClaimListComponent } from './insurance-claim-list/insurance-claim-list.component';
import { AddApprovalClaimComponent } from './add-approval-claim/add-approval-claim.component';
import { ApproveVehicleIssueComponent } from './approve-vehicle-issue/approve-vehicle-issue.component';
import { RaisedConcernListComponent } from './raised-concern-list/raised-concern-list.component';
import { OperatorauthGuard } from '../../Guards/operatorauth.guard';
import { IsadminonlyGuard } from '../../Guards/isadminonly.guard';
import { VehicleChecklistImgComponent } from './vehicle-checklist-img/vehicle-checklist-img.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryInwardComponent,
    children: [
      {
        path: 'import-transit-report',
        component: ImportTransitReportComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path: 'add-insurance-claim',
        component: AddInsuranceClaimComponent,
        canActivate: [IsadminonlyGuard]
      },
      {
        path: 'insurance-claim-list',
        component: InsuranceClaimListComponent,
        canActivate: [IsadminonlyGuard]
      },
      {
        path: 'approval-claim',
        component: AddApprovalClaimComponent,
        canActivate: [IsadminonlyGuard]
      },
      {
        path: 'approve-vehicle-issue',
        component: ApproveVehicleIssueComponent,
        canActivate: [IsadminonlyGuard]
      },
      {
        path: 'raised-concern-list',
        component: RaisedConcernListComponent,
        canActivate: [OperatorauthGuard]
      },
      {
        path:'vehicle-checklist-img',
        component:VehicleChecklistImgComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryInwardRoutingModule { }
