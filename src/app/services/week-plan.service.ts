import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { WeekPlan } from '../models/week-plan.model';

@Injectable({
  providedIn: 'root',
})
export class WeekPlanService {
  constructor(private firestore: Firestore) {}

  saveWeekPlan(weekPlan: WeekPlan): Promise<void> {
    const weekPlanDoc = doc(
      this.firestore,
      `weekPlans/${weekPlan.year}-${weekPlan.weekNumber}`
    );
    return setDoc(weekPlanDoc, weekPlan);
  }

  async getWeekPlan(
    year: number,
    weekNumber: number
  ): Promise<WeekPlan | undefined> {
    const weekPlanDoc = doc(this.firestore, `weekPlans/${year}-${weekNumber}`);
    const docSnap = await getDoc(weekPlanDoc);
    return docSnap.exists() ? (docSnap.data() as WeekPlan) : undefined;
  }

  async weekPlanExists(year: number, weekNumber: number): Promise<boolean> {
    const weekPlanDoc = doc(this.firestore, `weekPlans/${year}-${weekNumber}`);
    const docSnap = await getDoc(weekPlanDoc);
    return docSnap.exists();
  }
}
