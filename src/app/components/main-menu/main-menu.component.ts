import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatCardModule],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  constructor(public dialog: MatDialog) {}

  openLoginDialog(role: string): void {
    this.dialog.open(LoginDialogComponent, {
      data: { role: role }
    });
  }
}
