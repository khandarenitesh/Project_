import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterRoutingModule } from './footer-routing.module';
import { FooterComponent } from './footer.component';
import { PolicyPrivacyComponent } from './policy-privacy/policy-privacy.component';


@NgModule({
  declarations: [
    FooterComponent,
    PolicyPrivacyComponent
  ],
  imports: [
    CommonModule,
    FooterRoutingModule
  ]
})
export class FooterModule { }
