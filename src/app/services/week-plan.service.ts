import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { WeekPlan } from '../models/week-plan.model';

@Injectable({
  providedIn: 'root',
})
export class WeekPlanService {
  constructor(private firestore: Firestore) {}

  /**
   * Saves the given week plan.
   * 
   * @param weekPlan - The week plan to be saved.
   * @returns A promise that resolves when the week plan is saved successfully.
   */
  saveWeekPlan(weekPlan: WeekPlan): Promise<void> {
    const weekPlanDoc = this.getWeekPlanDoc(weekPlan.year, weekPlan.weekNumber);
    return setDoc(weekPlanDoc, weekPlan);
  }

  /**
   * Saves the given menu plan.
   * 
   * @param weekPlan - The week plan to be saved.
   * @returns A promise that resolves when the menu plan is saved successfully.
   */
  saveMenuPlan(weekPlan: WeekPlan): Promise<void> {
    const weekPlanDoc = this.getWeekPlanDoc(weekPlan.year, weekPlan.weekNumber);
    return setDoc(weekPlanDoc, weekPlan);
  }


  /**
   * Increments the amount of a menu item for a specific day in a week plan.
   * 
   * @param year - The year of the week plan.
   * @param weekNumber - The week number of the week plan.
   * @param date - The date of the day in the week plan.
   * @param menuType - The type of the menu (bvMenu, meatlessMenu, dessert, dinner).
   * @param menuId - The ID of the menu item to increment.
   * @returns A promise that resolves when the amount is incremented successfully.
   */
  async incrementMenuAmount(year: number, weekNumber: number, date: string, menuType: 'bvMenu' | 'meatlessMenu' | 'dessert', menuId: string): Promise<void> {
    const weekPlanDoc = this.getWeekPlanDoc(year, weekNumber);
    const docSnap = await getDoc(weekPlanDoc);

    if (docSnap.exists()) {
      const weekPlan = docSnap.data() as WeekPlan;
      const dayPlan = weekPlan.days.find(day => day.date === date);

      if (dayPlan && dayPlan[menuType] && dayPlan[menuType].id === menuId) {
        dayPlan[menuType].amount += 1;
        await setDoc(weekPlanDoc, weekPlan);
      }
    }
  }


  /**
   * Retrieves the week plan for a specific year and week number.
   * 
   * @param year - The year of the week plan.
   * @param weekNumber - The week number of the week plan.
   * @returns A promise that resolves to the WeekPlan object if it exists, otherwise undefined.
   */
  async getWeekPlan(year: number, weekNumber: number): Promise<WeekPlan | undefined> {
    const weekPlanDoc = this.getWeekPlanDoc(year, weekNumber);
    const docSnap = await getDoc(weekPlanDoc);
    return docSnap.exists() ? (docSnap.data() as WeekPlan) : undefined;
  }


  /**
   * Checks if a week plan exists for the given year and week number.
   * 
   * @param year - The year of the week plan.
   * @param weekNumber - The week number of the week plan.
   * @returns A promise that resolves to a boolean indicating whether the week plan exists or not.
   */
  async weekPlanExists(year: number, weekNumber: number): Promise<boolean> {
    const weekPlanDoc = this.getWeekPlanDoc(year, weekNumber);
    const docSnap = await getDoc(weekPlanDoc);
    return docSnap.exists();
  }

  
  /**
   * Retrieves the week plan for a specific year and week number.
   * 
   * @param year - The year of the week plan.
   * @param weekNumber - The week number of the week plan.
   * @returns A promise that resolves with the week plan.
   */
  getWeekPlanDoc(year: number, weekNumber: number) {
    return doc(this.firestore, `weekPlans/${year}_${weekNumber}`);
  }
}