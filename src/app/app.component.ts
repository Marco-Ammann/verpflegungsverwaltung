import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AdminInitializationService } from './services/admin-initialization.service';
import { AuthService } from './services/auth.service';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
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
  isLoggedIn = false;

  constructor(
    private adminInitializationService: AdminInitializationService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeAdminAccount();
    this.checkAuthenticationStatus();
  }

  private initializeAdminAccount(): void {
    this.adminInitializationService.initializeAdmin()
      .then(() => {
        console.log('Admin account initialized if no users existed.');
      })
      .catch((error: any) => {
        console.error('Error initializing admin account:', error);
        this.snackBar.open('Error initializing admin account.', 'Close', { duration: 3000 });
      });
  }

  private checkAuthenticationStatus(): void {
    this.authService.isAuthenticated().subscribe({
      next: (authenticated: boolean) => {
        this.isLoggedIn = authenticated;
        console.log('is logged in = ', this.isLoggedIn);
      },
      error: (error: any) => {
        console.error('Error checking authentication status:', error);
      }
    });
  }

  openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent);
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.isLoggedIn = false;
      this.snackBar.open('Sie wurden abgemeldet.', 'Close', { duration: 3000 });
    }).catch((error: any) => {
      console.error('Error during logout:', error);
      this.snackBar.open('Error during logout.', 'Close', { duration: 3000 });
    });
  }
}