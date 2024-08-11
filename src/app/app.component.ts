import { Component, OnInit } from '@angular/core';
import { AdminInitializationService } from './services/admin-initialization.service';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    AdminDashboardComponent,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatChipsModule,
    MatDivider,
    RouterLink,
    RouterLinkActive
  ],
})
export class AppComponent implements OnInit {
  title = 'Choscht.';
  isLoggedIn: boolean = false;
  constructor(
    private adminInitializationService: AdminInitializationService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.adminInitializationService
      .initializeAdmin()
      .then(() => {
        console.log('Admin account initialized if no users existed.');
      })
      .catch((error) => {
        console.error('Error initializing admin account:', error);
      });

    this.authService.isAuthenticated().subscribe((authenticated) => {
      this.isLoggedIn = authenticated;
      console.log('is logged in = ', this.isLoggedIn);
    });
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent);
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.isLoggedIn = false;
      this.snackBar.open('Sie wurden abgemeldet.', 'Close', { duration: 3000 });
    });
  }
}
