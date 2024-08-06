import { Component, OnInit } from '@angular/core';
import { AdminInitializationService } from './services/admin-initialization.service';
import { RouterModule } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, MainMenuComponent, AdminDashboardComponent],
})
export class AppComponent implements OnInit {
  title = 'verpflegungsverwaltung';

  constructor(private adminInitializationService: AdminInitializationService) {}

  ngOnInit(): void {
    this.adminInitializationService
      .initializeAdmin()
      .then(() => {
        console.log('Admin account initialized if no users existed.');
      })
      .catch((error) => {
        console.error('Error initializing admin account:', error);
      });
  }
}
