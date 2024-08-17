import { provideRouter, Routes } from '@angular/router';
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
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    resolve: { title: () => inject(Title).setTitle('Admin | Choscht.') }
  },
  {
    path: 'kuechenchef',
    loadComponent: () => import('./components/chef-dashboard/chef-dashboard.component').then(m => m.ChefDashboardComponent),
    resolve: { title: () => inject(Title).setTitle('Chuchischeff | Choscht.') }
  },
  {
    path: 'mittagsdienst',
    loadComponent: () => import('./components/mittagsdienst-dashboard/mittagsdienst-dashboard.component').then(m => m.MittagsdienstDashboardComponent),
    resolve: { title: () => inject(Title).setTitle('Mittagsdiänscht | Choscht.') }
  },
  {
    path: 'service',
    loadComponent: () => import('./components/service-dashboard/service-dashboard.component').then(m => m.ServiceDashboardComponent),
    resolve: { title: () => inject(Title).setTitle('Service | Choscht.') }
  },
  {
    path: 'bestellen',
    loadComponent: () => import('./components/order-dashboard/order-dashboard.component').then(m => m.OrderDashboardComponent),
    resolve: { title: () => inject(Title).setTitle('Bsteuuä | Choscht.') }
  },
  { path: '**', redirectTo: '' }
];

export const appRoutes = provideRouter(routes);