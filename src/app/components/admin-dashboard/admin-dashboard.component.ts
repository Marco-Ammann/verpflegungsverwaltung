import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Firestore, doc, collection } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

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
  currentUser: string | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private firestore: Firestore,
    private auth: Auth
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
      email: [''],
      password: [''],
      birthYear: [''],
      shortcode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user?.uid || null;
      console.log('Current authenticated user ID:', this.currentUser);
    });
  }

  createUser(): void {
    console.log('Creating user with data:', this.userForm.value);
    if (this.userForm.valid) {
      const userData: User = this.userForm.value;
      if (userData.role === 'Klient') {
        const password = this.generatePassword(userData.shortcode!, userData.birthYear?.toString() || '');
        userData.email = ''; // Keine Email für Klienten
        userData.password = password;
      }
      userData.id = doc(collection(this.firestore, 'users')).id; // Generiere eine eindeutige ID
      this.userService.saveUser(userData)
        .then(() => {
          this.snackBar.open(`Benutzer erstellt: ${userData.shortcode} / ${userData.password}`, 'Close', { duration: 5000 });
          console.log('User created:', userData);
          this.resetForm();
          this.loadUsers();
        })
        .catch(error => {
          this.snackBar.open('Fehler beim Erstellen des Benutzers: ' + error.message, 'Close', { duration: 3000 });
          console.error('Error creating user:', error);
        });
    } else {
      console.error('Form is invalid:', this.userForm);
    }
  }

  updateUser(): void {
    console.log('Updating user with ID:', this.editingUserId, 'with data:', this.userForm.value);
    if (this.userForm.valid && this.editingUserId) {
      const userData: User = { ...this.userForm.value, id: this.editingUserId };
      this.userService.saveUser(userData)
        .then(() => {
          this.snackBar.open('Benutzer erfolgreich aktualisiert', 'Close', { duration: 3000 });
          console.log('User updated:', userData);
          this.resetForm();
          this.loadUsers();
          this.editingUserId = null;
        })
        .catch(error => {
          this.snackBar.open('Fehler beim Aktualisieren des Benutzers: ' + error.message, 'Close', { duration: 3000 });
          console.error('Error updating user:', error);
        });
    } else {
      console.error('Form is invalid or editingUserId is null:', this.userForm, this.editingUserId);
    }
  }

  deleteUser(userId: string): void {
    console.log('Attempting to delete user with ID:', userId);
    console.log('Current authenticated user ID:', this.currentUser);
    if (this.currentUser !== userId) {
      console.log('Deleting user with ID:', userId);
      this.userService.deleteUser(userId).subscribe(() => {
        console.log('User with ID:', userId, 'deleted successfully');
        this.snackBar.open('Benutzer erfolgreich gelöscht', 'Close', { duration: 3000 });
        this.loadUsers();
      }, error => {
        console.error('Error deleting user with ID:', userId, 'Error:', error);
        this.snackBar.open('Fehler beim Löschen des Benutzers: ' + error.message, 'Close', { duration: 3000 });
      });
    } else {
      console.log('Cannot delete the current authenticated user');
      this.snackBar.open('Du kannst dich nicht selbst löschen!', 'Close', { duration: 3000 });
    }
  }

  editUser(user: User): void {
    console.log('Editing user:', user);
    this.editingUserId = user.id;
    this.userForm.patchValue(user);
  }

  private loadUsers(): void {
    console.log('Loading users...');
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      console.log('Users loaded:', users);
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
