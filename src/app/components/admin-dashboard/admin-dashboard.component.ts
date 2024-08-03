import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Firestore, collection, doc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  userForm: FormGroup;
  users: User[] = [];
  editingUserId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private firestore: Firestore
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', [this.emailRequiredValidator(), Validators.pattern('[a-zA-Z0-9._%+-äöüÄÖÜ]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}')]],
      password: ['', Validators.required]
    });

    this.userForm.get('role')?.valueChanges.subscribe(role => {
      const emailControl = this.userForm.get('email');
      if (role === 'Client') {
        emailControl?.disable();
      } else {
        emailControl?.enable();
      }
      emailControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.users = await this.userService.getUsers();
  }

  async createUser(): Promise<void> {
    if (this.userForm.valid) {
      const newUser: User = {
        id: doc(collection(this.firestore, 'users')).id,
        ...this.userForm.value
      };
      try {
        await this.userService.createUser(newUser);
        this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
        this.resetForm();
        this.loadUsers();
      } catch (error) {
        this.snackBar.open('Error creating user: ' + (error as Error).message, 'Close', { duration: 3000 });
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  async updateUser(): Promise<void> {
    if (this.userForm.valid) {
      const updatedUser: User = {
        id: this.editingUserId,
        ...this.userForm.value
      };
      try {
        await this.userService.updateUser(updatedUser);
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
        this.resetForm();
        this.loadUsers();
      } catch (error) {
        this.snackBar.open('Error updating user: ' + (error as Error).message, 'Close', { duration: 3000 });
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.userService.deleteUser(userId);
      this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
      this.loadUsers();
    } catch (error) {
      this.snackBar.open('Error deleting user: ' + (error as Error).message, 'Close', { duration: 3000 });
    }
  }

  editUser(user: User): void {
    this.resetForm();
    this.editingUserId = user.id;
    this.userForm.patchValue(user);
    const emailControl = this.userForm.get('email');
    if (user.role === 'Client') {
      emailControl?.disable();
    } else {
      emailControl?.enable();
    }
  }

  resetForm(): void {
    this.userForm.reset();
    this.editingUserId = null;
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control) {
        control.setErrors(null);
      }
    });
  }

  emailRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const role = this.userForm?.get('role')?.value;
      if (role !== 'Client' && !control.value) {
        return { required: true };
      }
      return null;
    };
  }
}
