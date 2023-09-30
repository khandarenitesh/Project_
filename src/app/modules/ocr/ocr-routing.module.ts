import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OcrIntegrationComponent } from './ocr-integration/ocr-integration.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { PredictionComponent } from './prediction/prediction.component';
import { SuperAdminauthGuard } from 'src/app/Guards/superadminauth.guard';

const routes: Routes = [
  {
    path: 'ocr-integration',
    component: OcrIntegrationComponent
  },
  {
    path: 'query-builder',
    component: QueryBuilderComponent,
    canActivate: [SuperAdminauthGuard]
  },
  {
    path: 'ocr2',
    component: PredictionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OCRRoutingModule { }
