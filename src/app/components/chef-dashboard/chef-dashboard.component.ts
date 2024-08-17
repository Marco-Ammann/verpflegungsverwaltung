import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { WeekPlanService } from '../../services/week-plan.service';
import { WeekPlan } from '../../models/week-plan.model';
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
    MatIconModule
  ]
})
export class ChefDashboardComponent implements OnInit {
  weekPlanForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private weekPlanService: WeekPlanService
  ) {
    this.weekPlanForm = this.createForm();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  createForm(): FormGroup {
    const currentDate = new Date();
    return this.fb.group({
      weekInfo: this.fb.group({
        year: [currentDate.getFullYear()],
        weekNumber: [getISOWeek(currentDate)],
      }),
      days: this.fb.array([])
    });
  }

  initializeForm(): void {
    this.addDaysControls();
    this.subscribeToWeekInfoChanges();
    this.updateDates();
  }

  get days(): FormArray {
    return this.weekPlanForm.get('days') as FormArray;
  }

  addDaysControls(): void {
    const daysInWeek = 7;
    for (let i = 0; i < daysInWeek; i++) {
      this.days.push(this.createDayFormGroup());
    }
  }

  createDayFormGroup(): FormGroup {
    return this.fb.group({
      date: [''],
      bvMenu: this.createMenuFormGroup(),
      meatlessMenu: this.createMenuFormGroup(),
      dessert: this.createMenuFormGroup(),
      dinner: this.createMenuFormGroup()
    });
  }


  
  createMenuFormGroup(): FormGroup {
    return this.fb.group({
      id: [''],
      name: [''],
      description: [''],
      price: [0],
      amount: [0]
    });
  }

  updateDates(): void {
    const year = this.weekPlanForm.get('weekInfo')?.get('year')?.value;
    const weekNumber = this.weekPlanForm.get('weekInfo')?.get('weekNumber')?.value;
    if (year && weekNumber) {
      const startDate = startOfWeek(new Date(year, 0, (weekNumber - 1) * 7 + 1), { weekStartsOn: 1, locale: de });
      for (let i = 0; i < 7; i++) {
        this.setDateControl(i, addDays(startDate, i));
      }
    }
  }

  setDateControl(index: number, date: Date): void {
    const formattedDate = format(date, 'dd/MM/yyyy');
    const dayName = format(date, 'EEEE', { locale: de });
    const dayControl = this.days.at(index);
    dayControl.get('date')?.setValue(`${dayName} ${formattedDate}`, { emitEvent: false });
  }

  saveWeekPlan(): void {
    const weekPlan = this.getWeekPlanFromForm();
    this.weekPlanService.saveWeekPlan(weekPlan)
      .then(() => {
        this.showSnackBar('Wochenplan erfolgreich gespeichert');
      })
      .catch(error => {
        this.showSnackBar('Fehler beim Speichern des Wochenplans');
        console.error(error);
      });
  }

  getWeekPlanFromForm(): WeekPlan {
    const weekInfo = this.weekPlanForm.get('weekInfo')?.value;
    const days = this.weekPlanForm.get('days')?.value;
    return { ...weekInfo, days: days };
  }

  resetForm(): void {
    const year = this.weekPlanForm.get('weekInfo')?.get('year')?.value;
    const weekNumber = this.weekPlanForm.get('weekInfo')?.get('weekNumber')?.value;

    this.weekPlanForm.reset({ weekInfo: { year, weekNumber } });

    while (this.days.length) {
      this.days.removeAt(0);
    }
    this.addDaysControls();
    this.updateDates();
    this.markFormPristineAndUntouched();
  }

  markFormPristineAndUntouched(): void {
    this.weekPlanForm.markAsPristine();
    this.weekPlanForm.markAsUntouched();
    this.days.controls.forEach(control => {
      control.markAsPristine();
      control.markAsUntouched();
    });
  }

  async loadWeekPlan(): Promise<void> {
    const year = this.weekPlanForm.get('weekInfo')?.get('year')?.value;
    const weekNumber = this.weekPlanForm.get('weekInfo')?.get('weekNumber')?.value;

    this.resetForm();

    if (await this.weekPlanService.weekPlanExists(year, weekNumber)) {
      const weekPlan = await this.weekPlanService.getWeekPlan(year, weekNumber);
      if (weekPlan) {
        this.populateFormWithWeekPlan(weekPlan);
      }
    } else {
      this.showSnackBar('No week plan found for the selected week');
    }
  }

  populateFormWithWeekPlan(weekPlan: WeekPlan): void {
    this.weekPlanForm.patchValue({ weekInfo: { year: weekPlan.year, weekNumber: weekPlan.weekNumber }, days: weekPlan.days });
    this.days.clear();
    weekPlan.days.forEach(day => {
      const dayFormGroup = this.fb.group({
        date: [day.date],
        bvMenu: this.fb.group(day.bvMenu),
        meatlessMenu: this.fb.group(day.meatlessMenu),
        dinner: this.fb.group(day.dinner),
        dessert: [day.dessert]
      });
      this.days.push(dayFormGroup);
    });
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private subscribeToWeekInfoChanges(): void {
    this.weekPlanForm.get('weekInfo')?.get('weekNumber')?.valueChanges.subscribe(() => {
      this.updateDates();
    });
    this.weekPlanForm.get('weekInfo')?.get('year')?.valueChanges.subscribe(() => {
      this.updateDates();
    });
  }
}