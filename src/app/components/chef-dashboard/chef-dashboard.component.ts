import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { WeekPlan } from '../../models/week-plan.model';
import { WeekPlanService } from '../../services/week-plan.service';
import { startOfWeek, addDays, format, getISOWeek } from 'date-fns';
import { de } from 'date-fns/locale';

@Component({
  selector: 'app-chef-dashboard',
  standalone: true,
  templateUrl: './chef-dashboard.component.html',
  styleUrls: ['./chef-dashboard.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
  ],
})
export class ChefDashboardComponent implements OnInit {
  weekPlanForm: FormGroup;
  weekPlan: WeekPlan | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private weekPlanService: WeekPlanService
  ) {
    const currentDate = new Date();
    this.weekPlanForm = this.fb.group({
      year: [currentDate.getFullYear(), Validators.required],
      weekNumber: [getISOWeek(currentDate), Validators.required],
      days: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.addDaysControls();
    this.weekPlanForm.get('weekNumber')?.valueChanges.subscribe(() => {
      this.updateDates();
    });
    this.weekPlanForm.get('year')?.valueChanges.subscribe(() => {
      this.updateDates();
    });
    this.updateDates(); // Initiales Update der Daten
  }

  get days(): FormArray {
    return this.weekPlanForm.get('days') as FormArray;
  }

  addDaysControls(): void {
    const daysInWeek = 7;
    for (let i = 0; i < daysInWeek; i++) {
      this.days.push(
        this.fb.group({
          date: ['', Validators.required],
          bvMenu: ['', Validators.required],
          meatlessMenu: ['', Validators.required],
          dinner: ['', Validators.required],
          dessert: [''],
        })
      );
    }
    this.updateDates();
  }

  updateDates(): void {
    const year = this.weekPlanForm.get('year')?.value;
    const weekNumber = this.weekPlanForm.get('weekNumber')?.value;
    if (year && weekNumber) {
      const startDate = startOfWeek(
        new Date(year, 0, (weekNumber - 1) * 7 + 1),
        { weekStartsOn: 1, locale: de }
      );
      for (let i = 0; i < 7; i++) {
        const date = addDays(startDate, i);
        const formattedDate = format(date, 'dd/MM/yyyy');
        const dayName = format(date, 'EEEE', { locale: de });
        const dayControl = this.days.at(i);
        dayControl
          .get('date')
          ?.setValue(`${dayName} ${formattedDate}`, { emitEvent: false });
      }
    }
  }

  saveWeekPlan(): void {
    if (this.weekPlanForm.valid) {
      const weekPlan: WeekPlan = this.weekPlanForm.value;
      this.weekPlanService
        .saveWeekPlan(weekPlan)
        .then(() => {
          this.snackBar.open('Week plan saved successfully', 'Close', {
            duration: 3000,
          });
          this.resetForm();
        })
        .catch((error) => {
          this.snackBar.open(
            'Error saving week plan: ' + error.message,
            'Close',
            { duration: 3000 }
          );
        });
    } else {
      this.weekPlanForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    const year = this.weekPlanForm.get('year')?.value;
    const weekNumber = this.weekPlanForm.get('weekNumber')?.value;

    this.weekPlanForm.reset({ year, weekNumber });

    // Remove all controls from days FormArray and add them again
    while (this.days.length) {
      this.days.removeAt(0);
    }
    this.addDaysControls();
    this.updateDates();

    // Mark controls as pristine and untouched
    this.weekPlanForm.markAsPristine();
    this.weekPlanForm.markAsUntouched();
    this.days.controls.forEach((control) => {
      control.markAsPristine();
      control.markAsUntouched();
    });
  }

  async loadWeekPlan(): Promise<void> {
    const year = this.weekPlanForm.get('year')?.value;
    const weekNumber = this.weekPlanForm.get('weekNumber')?.value;

    this.resetForm();

    const weekPlanExists = await this.weekPlanService.weekPlanExists(
      year,
      weekNumber
    );

    if (weekPlanExists) {
      const weekPlan = await this.weekPlanService.getWeekPlan(year, weekNumber);
      if (weekPlan) {
        this.weekPlan = weekPlan;
        this.weekPlanForm.patchValue(weekPlan);
        this.days.clear();
        weekPlan.days.forEach((day) => this.days.push(this.fb.group(day)));
      }
    } else {
      this.snackBar.open('No week plan found for the selected week', 'Close', {
        duration: 3000,
      });
    }
  }
}
