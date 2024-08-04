export interface DayPlan {
  date: string;
  bvMenu: string;
  meatlessMenu: string;
  dinner: string;
  dessert?: string;
}

export interface WeekPlan {
  weekNumber: number;
  year: number;
  days: DayPlan[];
}
