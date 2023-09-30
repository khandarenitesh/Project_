import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigurationComponent } from './configuration.component';

//App Configuration
import { AppConfigurationComponent } from './app-configuration/app-configuration.component';

// Version Details
import { VersionDetailsComponent } from './version-details/version-details.component';
import { SuperAdminauthGuard } from 'src/app/Guards/superadminauth.guard';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [
      {
        path: 'app-configuration',
        component: AppConfigurationComponent,
        canActivate: [SuperAdminauthGuard]
      },
      {
        path: 'version-details',
        component: VersionDetailsComponent,
        canActivate: [SuperAdminauthGuard]
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
