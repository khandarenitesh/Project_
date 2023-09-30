import { SuperAdminauthGuard } from './../../Guards/superadminauth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueryBuilderComponent } from './QueryPage/query-builder/query-builder.component';

const routes: Routes = [
  {
    path: "query-builder", component: QueryBuilderComponent,
    canActivate: [SuperAdminauthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueryBuilderRoutingModule { }
