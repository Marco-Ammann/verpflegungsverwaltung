import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { UserInterface } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Firestore, doc, collection } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
  private readonly SNACKBAR_DURATION = 3000;

  userForm: FormGroup;
  users: UserInterface[] = [];
  editingUserId: string | null = null;
  currentUser: string | null = null;
  isLoggedIn: boolean = false;


  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private firestore: Firestore,
    private authService: AuthService,
    private router: Router
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

  /**
   * Initializes the component.
   * - Loads users.
   * - Checks authentication.
   */
  ngOnInit(): void {
    this.loadUsers();
    this.checkAuthentication();
  }


  /**
   * Checks if the user is authenticated.
   * If the user is not authenticated, it shows a snackbar message and navigates to the home page.
   */
  private checkAuthentication(): void {
    this.authService.isAuthenticated().subscribe((authenticated) => {
      this.isLoggedIn = authenticated;
      if (!this.isLoggedIn) {
        this.showSnackBar('Sie müssen angemeldet sein, um diese Aktion durchzuführen.');
        this.router.navigate(['/']);
      }
    });
  }


  /**
   * Creates a new user.
   * 
   * @remarks
   * This function validates the user form and generates a unique ID for the user. If the user's role is "Klient", it generates a password based on the user's shortcode and birth year. It also sets the user's email to an empty string since clients do not have an email. After saving the user data, it displays a success message, resets the form, and reloads the users. If there is an error, it handles the error and displays an error message.
   * 
   * @returns void
   */
  createUser(): void {
    if (this.userForm.valid) {
      const userData: UserInterface = this.userForm.value;
      if (userData.role === 'Klient') {
        userData.password = this.generatePassword(userData.shortcode!, userData.birthYear?.toString() || '');
        userData.email = ''; // Keine Email für Klienten
      }
      userData.id = doc(collection(this.firestore, 'users')).id; // Generiere eine eindeutige ID
      this.userService.saveUser(userData)
        .then(() => {
          this.showSnackBar(`Benutzer erstellt: ${userData.shortcode} / ${userData.password}`, 5000);
          this.resetForm();
          this.loadUsers();
        })
        .catch(error => this.handleError('Fehler beim Erstellen des Benutzers', error));
    } else {
      console.error('Form is invalid:', this.userForm);
    }
  }  
  
  
  /**
   * Updates the user information.
   * 
   * @remarks
   * This method validates the user form and the editing user ID before updating the user data.
   * If the form is valid and the editing user ID is not null, the user data is saved using the UserService.
   * After successfully updating the user, a snackbar is shown, the form is reset, and the user list is reloaded.
   * If there is an error while updating the user, an error message is logged.
   * 
   * @returns void
   */
  updateUser(): void {
    if (this.userForm.valid && this.editingUserId) {
      const userData: UserInterface = { ...this.userForm.value, id: this.editingUserId };
      this.userService.saveUser(userData)
        .then(() => {
          this.showSnackBar('Benutzer erfolgreich aktualisiert');
          this.resetForm();
          this.loadUsers();
          this.editingUserId = null;
        })
        .catch(error => this.handleError('Fehler beim Aktualisieren des Benutzers', error));
    } else {
      console.error('Form is invalid or editingUserId is null:', this.userForm, this.editingUserId);
    }
  }


  /**
   * Deletes a user.
   * 
   * @param userId - The ID of the user to delete.
   */
  deleteUser(userId: string): void {
    if (this.currentUser !== userId) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.showSnackBar('Benutzer erfolgreich gelöscht');
        this.loadUsers();
      }, error => this.handleError('Fehler beim Löschen des Benutzers', error));
    } else {
      this.showSnackBar('Du kannst dich nicht selbst löschen!');
    }
  }


  /**
   * Edits a user.
   * 
   * @param user - The user to be edited.
   */
  editUser(user: UserInterface): void {
    this.editingUserId = user.id;
    this.userForm.patchValue(user);
  }

  /**
   * Loads the users by making a request to the userService.
   */
  private loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }


  /**
   * Resets the user form to its initial state.
   * - Resets all form controls to their default values.
   * - Marks the form as pristine (not modified).
   * - Marks the form as untouched (not interacted with).
   * - Clears any validation errors on the form controls.
   */
  private resetForm(): void {
    this.userForm.reset();
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.setErrors(null);
    });
  }


  /**
   * Generates a password based on the given shortcode and birth year.
   * 
   * @param shortcode - The shortcode to be used in the password.
   * @param birthYear - The birth year to be used in the password.
   * @returns The generated password.
   */
  private generatePassword(shortcode: string, birthYear: string): string {
    const birthYearShort = birthYear.toString().slice(-2);
    return shortcode.toLowerCase() + birthYearShort;
  }


  private showSnackBar(message: string, duration: number = this.SNACKBAR_DURATION): void {
    this.snackBar.open(message, 'Close', { duration });
  }


  /**
   * Handles an error by displaying a snackbar with the error message and logging the error to the console.
   * 
   * @param message - The error message to display.
   * @param error - The error object.
   */
  private handleError(message: string, error: any): void {
    this.showSnackBar(`${message}: ${error.message}`);
    console.error(message, error);
  }
}