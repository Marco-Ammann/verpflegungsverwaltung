import { provideRouter, Route, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ChefDashboardComponent } from './components/chef-dashboard/chef-dashboard.component';
import { MittagsdienstDashboardComponent } from './components/mittagsdienst-dashboard/mittagsdienst-dashboard.component';
import { ServiceDashboardComponent } from './components/service-dashboard/service-dashboard.component';
import { OrderDashboardComponent } from './components/order-dashboard/order-dashboard.component';
import { Title } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    resolve: { title: () => inject(Title).setTitle('Choscht.') }
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    resolve: { title: () => inject(Title).setTitle('Admin | Choscht.') }
  },
  {
    path: 'kuechenchef',
    component: ChefDashboardComponent,
    resolve: { title: () => inject(Title).setTitle('Chuchischeff | Choscht.') }
  },
  {
    path: 'mittagsdienst',
    component: MittagsdienstDashboardComponent,
    resolve: { title: () => inject(Title).setTitle('Mittagsdiänscht | Choscht.') }
  },
  {
    path: 'service',
    component: ServiceDashboardComponent,
    resolve: { title: () => inject(Title).setTitle('Service | Choscht.') }
  },
  {
    path: 'bestellen',
    component: OrderDashboardComponent,
    resolve: { title: () => inject(Title).setTitle('Bsteuuä | Choscht.') }
  },
  { path: '**', redirectTo: '' }
];
export const appRoutes = provideRouter(routes);
