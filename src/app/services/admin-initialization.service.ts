import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, setDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { User } from '../models/user.model';
import { environment } from '../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AdminInitializationService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  async initializeAdmin(): Promise<void> {
    const usersCollection = collection(this.firestore, 'users');
    const userDocs = await getDocs(usersCollection);
    if (userDocs.empty) {
      const adminEmail = environment.adminEmail;
      const adminPassword = environment.adminPassword;
      const adminData: User = {
        id: '',
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        password: adminPassword,
        role: 'Admin'
      };

      const userCredential = await createUserWithEmailAndPassword(this.auth, adminEmail, adminPassword);
      adminData.id = userCredential.user.uid;

      const userDoc = doc(this.firestore, `users/${userCredential.user.uid}`);
      await setDoc(userDoc, adminData);
    }
  }
}
