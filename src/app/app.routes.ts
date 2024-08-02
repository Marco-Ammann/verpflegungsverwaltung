import { provideRouter, Route } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ChefDashboardComponent } from './components/chef-dashboard/chef-dashboard.component';
import { MittagsdienstDashboardComponent } from './components/mittagsdienst-dashboard/mittagsdienst-dashboard.component';
import { SchopfdienstDashboardComponent } from './components/schopfdienst-dashboard/schopfdienst-dashboard.component';
import { OrderDashboardComponent } from './components/order-dashboard/order-dashboard.component';

const routes: Route[] = [
  { path: '', component: MainMenuComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'chef', component: ChefDashboardComponent },
  { path: 'mittagsdienst', component: MittagsdienstDashboardComponent },
  { path: 'schopfdienst', component: SchopfdienstDashboardComponent },
  { path: 'bestellen', component: OrderDashboardComponent }
];

export const appRoutes = provideRouter(routes);
