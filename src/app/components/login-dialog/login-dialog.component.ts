import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserInterface } from '../../models/user.model';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatIconModule
  ]
})
export class LoginDialogComponent implements OnInit {
  private readonly SNACKBAR_DURATION = 3000;

  loginForm: FormGroup;
  isClientLogin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      loginType: [false],
      emailOrShortcode: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loginForm.get('loginType')?.valueChanges.subscribe(value => {
      this.isClientLogin = value;
      this.loginForm.get('emailOrShortcode')?.reset();
      this.loginForm.get('password')?.reset();
    });
  }

  async login() {
    if (this.loginForm.valid) {
      const { emailOrShortcode, password, loginType } = this.loginForm.value;
      try {
        const user = await this.authenticateUser(emailOrShortcode, password);
        if (user) {
          this.handleLoginSuccess(user);
        } else {
          this.handleLoginFailure('Login fehlgeschlagen');
        }
      } catch (error: any) {
        this.handleLoginFailure('Login fehlgeschlagen: ' + error.message);
      }
    }
  }

  private async authenticateUser(emailOrShortcode: string, password: string): Promise<UserInterface | null> {
    return this.isClientLogin
      ? this.authService.loginWithShortcode(emailOrShortcode, password)
      : this.authService.loginWithEmail(emailOrShortcode, password);
  }

  private handleLoginSuccess(user: UserInterface) {
    this.snackBar.open('Login erfolgreich', 'Schließen', { duration: this.SNACKBAR_DURATION });
    this.dialogRef.close();
    this.redirectUser(user);
  }

  private handleLoginFailure(message: string) {
    this.snackBar.open(message, 'Schließen', { duration: this.SNACKBAR_DURATION });
  }

  private redirectUser(user: UserInterface) {
    const routes = {
      'Admin': '/admin',
      'Kuechenchef': '/kuechenchef',
      'Betreuer': '/mittagsdienst',
      'Servicemitarbeiter': '/service',
      'Klient': '/bestellen'
    };
    this.router.navigate([routes[user.role] || '/']);
  }
}