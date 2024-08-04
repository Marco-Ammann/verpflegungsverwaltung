import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { WeekPlan } from '../models/week-plan.model';

@Injectable({
  providedIn: 'root',
})
export class WeekPlanService {
  constructor(private firestore: Firestore) {}

  /**
   * Saves a week plan to Firestore.
   * @param weekPlan The week plan to save.
   * @returns A promise that resolves when the week plan is saved.
   */
  saveWeekPlan(weekPlan: WeekPlan): Promise<void> {
    const weekPlanDoc = this.getWeekPlanDoc(weekPlan.year, weekPlan.weekNumber);
    return setDoc(weekPlanDoc, weekPlan);
  }


  /**
   * Retrieves a week plan from Firestore.
   * @param year The year of the week plan.
   * @param weekNumber The week number of the week plan.
   * @returns A promise that resolves with the week plan, or undefined if it doesn't exist.
   */
  async getWeekPlan(year: number, weekNumber: number): Promise<WeekPlan | undefined> {
    const weekPlanDoc = this.getWeekPlanDoc(year, weekNumber);
    const docSnap = await getDoc(weekPlanDoc);
    return docSnap.exists() ? (docSnap.data() as WeekPlan) : undefined;
  }


  /**
   * Checks if a week plan exists in Firestore.
   * @param year The year of the week plan.
   * @param weekNumber The week number of the week plan.
   * @returns A promise that resolves with a boolean indicating whether the week plan exists.
   */
  async weekPlanExists(year: number, weekNumber: number): Promise<boolean> {
    const weekPlanDoc = this.getWeekPlanDoc(year, weekNumber);
    const docSnap = await getDoc(weekPlanDoc);
    return docSnap.exists();
  }
  

  /**
   * Gets a Firestore document reference for a week plan.
   * @param year The year of the week plan.
   * @param weekNumber The week number of the week plan.
   * @returns The document reference.
   */
  private getWeekPlanDoc(year: number, weekNumber: number) {
    return doc(this.firestore, `weekPlans/${year}-${weekNumber}`);
  }
}
