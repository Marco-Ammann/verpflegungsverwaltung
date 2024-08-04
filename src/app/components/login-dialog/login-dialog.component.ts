import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class LoginDialogComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
        .then(user => {
          if (user) {
            this.snackBar.open('Login erfolgreich', 'Close', { duration: 3000 });
            this.dialogRef.close();
            this.redirectUser(user.role);
          }
        })
        .catch(error => {
          this.snackBar.open('Login fehlgeschlagen: ' + error.message, 'Close', { duration: 3000 });
        });
    }
  }

  /**
   * Redirects the user based on their role.
   * @param role - The role of the user.
   */
  redirectUser(role: string) {
    switch (role) {
      case 'Admin':
        this.router.navigate(['/admin']);
        break;
      case 'Chef':
        this.router.navigate(['/chef']);
        break;
      case 'Server':
        this.router.navigate(['/schopfdienst']);
        break;
      case 'Caretaker':
        this.router.navigate(['/mittagsdienst']);
        break;
      case 'Client':
        this.router.navigate(['/bestellen']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }
}
