import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { DocumentsComponent } from './documents/documents.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProfileComponent } from './profile.component';
import { ConnectionsComponent } from './connections/connections.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyProfileComponent } from './my-profile/my-profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      // {
      //   path: 'overview',
      //   component: OverviewComponent,
      // },
      {
        path: 'projects',
        component: ProjectsComponent,
      },
      {
        path: 'campaigns',
        component: CampaignsComponent,
      },
      {
        path: 'documents',
        component: DocumentsComponent,
      },
      {
        path:'myprofile',
        component:MyProfileComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      {
        path: 'connections',
        component: ConnectionsComponent,
      },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule { }
