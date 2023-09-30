import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyPrivacyComponent } from './policy-privacy/policy-privacy.component';
import { FooterComponent } from './footer.component';

const routes: Routes = [
  {
    path: '',
    component: FooterComponent,
    children: [
      {
        path: '',
        redirectTo: 'footer',
        pathMatch: 'full',
      },
      {
        path: 'privacy-policy',
        component: PolicyPrivacyComponent,
      },
     
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FooterRoutingModule { }
