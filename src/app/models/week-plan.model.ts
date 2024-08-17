import { Menu } from "./menu.model";

export interface DayPlan {
  date: string;
  bvMenu: Menu;
  meatlessMenu: Menu;
  dinner: string;
  dessert?: Menu;
}

export interface WeekPlan {
  weekNumber: number;
  year: number;
  days: DayPlan[];
}
