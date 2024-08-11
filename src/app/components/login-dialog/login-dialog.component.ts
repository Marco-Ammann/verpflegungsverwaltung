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
        let user: UserInterface | null = null;
        if (this.isClientLogin) {
          user = await this.authService.loginWithShortcode(emailOrShortcode, password);
        } else {
          user = await this.authService.loginWithEmail(emailOrShortcode, password);
        }
        if (user) {
          this.snackBar.open('Login erfolgreich', 'Schließen', { duration: 3000 });
          this.dialogRef.close();
          this.redirectUser(user);
        } else {
          this.snackBar.open('Login fehlgeschlagen', 'Schließen', { duration: 3000 });
        }
      } catch (error: any) {
        this.snackBar.open('Login fehlgeschlagen: ' + error.message, 'Schließen', { duration: 3000 });
      }
    }
  }

  redirectUser(user: UserInterface) {
    switch (user.role) {
      case 'Admin':
        this.router.navigate(['/admin']);
        break;
      case 'Kuechenchef':
        this.router.navigate(['/kuechenchef']);
        break;
      case 'Betreuer':
        this.router.navigate(['/mittagsdienst']);
        break;
      case 'Servicemitarbeiter':
        this.router.navigate(['/service']);
        break;
      case 'Klient':
        this.router.navigate(['/bestellen']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }
}
