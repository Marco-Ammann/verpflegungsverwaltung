import { Component, OnInit } from '@angular/core';
import { AdminInitializationService } from './services/admin-initialization.service';
import { RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from "./header/header.component";


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterModule,
    AdminDashboardComponent,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    HeaderComponent,
],
})
export class AppComponent implements OnInit {
  title = 'Choscht.';

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
