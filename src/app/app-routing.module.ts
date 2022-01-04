import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberListComponent } from '../app/member-list/member-list.component';
import { MemberFormComponent } from '../app/member-form/member-form.component';
import { EventsComponent } from './events/events.component';
import { ToolsComponent } from './tools/tools.component';
import { ArticlesComponent } from './articles/articles.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
const routes: Routes = [
  {
    path: 'members',
    pathMatch: 'full',
    component: MemberListComponent,
  },
  {
    path: 'events',
    pathMatch: 'full',
    component: EventsComponent,
  },
  {
    path: 'tools',
    pathMatch: 'full',
    component: ToolsComponent,
  },
  {
    path: 'article',
    pathMatch: 'full',
    component: ArticlesComponent,
  },
  {
    path: 'dashboard',
    pathMatch: 'full',
    component: DashboardComponent,
  },
  {
    path: 'form',
    pathMatch: 'full',
    component: MemberFormComponent,
  },
  {
    path: ':id/edit',
    pathMatch: 'full',
    component: MemberFormComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
