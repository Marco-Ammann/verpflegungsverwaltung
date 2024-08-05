import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Firestore, doc, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatListModule,
    MatIconModule
  ]
})
export class AdminDashboardComponent implements OnInit {
  userForm: FormGroup;
  users: User[] = [];
  editingUserId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private firestore: Firestore
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
      email: [''],
      password: [''],
      birthYear: [''],
      shortcode: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  createUser(): void {
    if (this.userForm.valid) {
      const userData: User = this.userForm.value;
      if (userData.role === 'Klient') {
        const password = this.generatePassword(userData.shortcode!, userData.birthYear?.toString() || '');
        userData.email = ''; // Keine Email für Klienten
        userData.password = password;
        userData.id = doc(collection(this.firestore, 'users')).id; // Generiere eine eindeutige ID
        this.userService.saveUser(userData)
          .then(() => {
            this.snackBar.open(`Benutzer erstellt: ${userData.shortcode} / ${password}`, 'Close', { duration: 5000 });
            this.resetForm();
            this.loadUsers();
          })
          .catch(error => {
            this.snackBar.open('Fehler beim Erstellen des Benutzers: ' + error.message, 'Close', { duration: 3000 });
          });
      } else {
        this.authService.registerUser(userData.email, userData.password, userData)
          .then(() => {
            this.snackBar.open('Benutzer erfolgreich erstellt', 'Close', { duration: 3000 });
            this.resetForm();
            this.loadUsers();
          })
          .catch(error => {
            this.snackBar.open('Fehler beim Erstellen des Benutzers: ' + error.message, 'Close', { duration: 3000 });
          });
      }
    }
  }

  updateUser(): void {
    if (this.userForm.valid && this.editingUserId) {
      const userData: User = { ...this.userForm.value, id: this.editingUserId };
      if (userData.role === 'Klient') {
        this.userService.saveUser(userData)
          .then(() => {
            this.snackBar.open('Benutzer erfolgreich aktualisiert', 'Close', { duration: 3000 });
            this.resetForm();
            this.loadUsers();
            this.editingUserId = null;
          })
          .catch(error => {
            this.snackBar.open('Fehler beim Aktualisieren des Benutzers: ' + error.message, 'Close', { duration: 3000 });
          });
      } else {
        this.authService.updateUser(userData.email, userData.password)
          .then(() => {
            return this.userService.updateUser(userData);
          })
          .then(() => {
            this.snackBar.open('Benutzer erfolgreich aktualisiert', 'Close', { duration: 3000 });
            this.resetForm();
            this.loadUsers();
            this.editingUserId = null;
          })
          .catch(error => {
            this.snackBar.open('Fehler beim Aktualisieren des Benutzers: ' + error.message, 'Close', { duration: 3000 });
          });
      }
    }
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(() => {
      this.snackBar.open('Benutzer erfolgreich gelöscht', 'Close', { duration: 3000 });
      this.loadUsers();
    }, error => {
      this.snackBar.open('Fehler beim Löschen des Benutzers: ' + error.message, 'Close', { duration: 3000 });
    });
  }

  editUser(user: User): void {
    this.editingUserId = user.id;
    this.userForm.patchValue(user);
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  private resetForm(): void {
    this.userForm.reset();
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.setErrors(null);
    });
  }

  private generatePassword(shortcode: string, birthYear: string): string {
    const birthYearShort = birthYear.toString().slice(-2);
    return shortcode.toLowerCase() + birthYearShort;
  }
}
