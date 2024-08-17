import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, setDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { UserInterface } from '../models/user.model';
import { environment } from '../enviroment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AdminInitializationService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  /**
   * Initializes the admin by checking if there are any existing users in the collection.
   * If there are no users, it creates an admin user and saves the admin data.
   * 
   * @returns A Promise that resolves to void.
   */
  async initializeAdmin(): Promise<void> {
    try {
      const usersCollection = collection(this.firestore, 'users');
      const userDocs = await getDocs(usersCollection);

      if (userDocs.empty) {
        const adminData = await this.createAdminUser();
        await this.saveAdminData(adminData);
      }
    } catch (error) {
      console.error('Error initializing admin:', error);
    }
  }
  

  /**
   * Creates an admin user.
   * 
   * @returns A promise that resolves to a UserInterface object representing the created admin user.
   */
  private async createAdminUser(): Promise<UserInterface> {
    const { adminEmail, adminPassword } = environment;
    const userCredential = await createUserWithEmailAndPassword(this.auth, adminEmail, adminPassword);

    return {
      id: userCredential.user.uid,
      shortcode: 'Admin',
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      password: adminPassword,
      role: 'Admin',
    };
  }


  /**
   * Saves the admin data to the Firestore database.
   * 
   * @param adminData - The admin data to be saved.
   * @returns A promise that resolves when the data is successfully saved.
   */
  private async saveAdminData(adminData: UserInterface): Promise<void> {
    const userDoc = doc(this.firestore, `users/${adminData.id}`);
    await setDoc(userDoc, adminData);
  }
}