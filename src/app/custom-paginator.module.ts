import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomPaginatorDirective } from './custom-paginator.directive';

@NgModule({
  declarations: [
    CustomPaginatorDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [ CustomPaginatorDirective ]
})
export class CustomPaginatorModule { }