import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    MainMenuComponent,
    AdminDashboardComponent
  ]
})
export class AppComponent {
  title = 'verpflegungsverwaltung';
}
