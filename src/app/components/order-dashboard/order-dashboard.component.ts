import { Component, OnInit } from '@angular/core';
import {
  MatCardActions,
  MatCardModule,
  MatCardTitle,
} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { WeekPlanService } from '../../services/week-plan.service';
import { AuthService } from '../../services/auth.service';
import { Firestore } from '@angular/fire/firestore';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

type MenuType = 'bvMenu' | 'meatlessMenu' | 'dessert' | 'dinner' | 'noDinner';

@Component({
  selector: 'app-order-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './order-dashboard.component.html',
  styleUrls: ['./order-dashboard.component.scss'],
})
export class OrderDashboardComponent implements OnInit {
  daysOfTheWeek: any = [];
  selectedMenus: { [key: number]: string } = {};

  constructor(
    private weekPlanService: WeekPlanService,
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    this.getMealsFromFirestore();
  }

  async getMealsFromFirestore(year: number = 2024, weekNumber: number = 33) {
    const weekPlan = await this.weekPlanService.getWeekPlan(year, weekNumber);
    if (weekPlan && Array.isArray(weekPlan.days)) {
      console.log(`week ${year}`, weekPlan);
      this.daysOfTheWeek = weekPlan.days.map((day) => ({
        ...day,
        weekPlanId: `${year}-${weekNumber}`,
      }));
    } else {
      console.error(
        'Invalid weekPlan or weekPlan.days is not an array',
        weekPlan
      );
    }
  }

  selectMenu(dayIndex: number, menuType: MenuType) {
    this.selectedMenus[dayIndex] = menuType;
    console.log('selectMenu', dayIndex, menuType);
  }
}
