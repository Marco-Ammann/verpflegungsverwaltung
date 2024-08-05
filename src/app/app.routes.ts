import { provideRouter, Route } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ChefDashboardComponent } from './components/chef-dashboard/chef-dashboard.component';
import { MittagsdienstDashboardComponent } from './components/mittagsdienst-dashboard/mittagsdienst-dashboard.component';
import { SchopfdienstDashboardComponent } from './components/schopfdienst-dashboard/schopfdienst-dashboard.component';
import { OrderDashboardComponent } from './components/order-dashboard/order-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Route[] = [
  { path: '', component: MainMenuComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'chef', component: ChefDashboardComponent, canActivate: [AuthGuard] },
  { path: 'mittagsdienst', component: MittagsdienstDashboardComponent, canActivate: [AuthGuard] },
  { path: 'schopfdienst', component: SchopfdienstDashboardComponent, canActivate: [AuthGuard] },
  { path: 'order-dashboard', component: OrderDashboardComponent, canActivate: [AuthGuard] } // Füge diese Zeile hinzu
];

export const appRoutes = provideRouter(routes);
