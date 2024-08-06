import { provideRouter, Route } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ChefDashboardComponent } from './components/chef-dashboard/chef-dashboard.component';
import { MittagsdienstDashboardComponent } from './components/mittagsdienst-dashboard/mittagsdienst-dashboard.component';
import { ServiceDashboardComponent } from './components/service-dashboard/service-dashboard.component';
import { OrderDashboardComponent } from './components/order-dashboard/order-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Route[] = [
  { path: '', component: MainMenuComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'kuechenchef',
    component: ChefDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'mittagsdienst',
    component: MittagsdienstDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'service',
    component: ServiceDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bestellen',
    component: OrderDashboardComponent,
    canActivate: [AuthGuard],
  },
];

export const appRoutes = provideRouter(routes);
