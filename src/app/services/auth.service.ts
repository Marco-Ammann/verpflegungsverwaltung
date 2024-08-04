import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateEmail, updatePassword, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  async login(email: string, password: string): Promise<User | null> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;
    return this.getUserData(user);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  async registerUser(email: string, password: string, userData: User): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    userData.id = userCredential.user.uid;
    await this.saveUserData(userData);
  }

  async saveClientData(userData: User): Promise<void> {
    const userDoc = doc(this.firestore, `users/${userData.id}`);
    await setDoc(userDoc, userData);
  }

  private async getUserData(user: FirebaseUser): Promise<User | null> {
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      return null;
    }
  }

  saveUserData(user: User): Promise<void> {
    const userDoc = doc(this.firestore, `users/${user.id}`);
    return setDoc(userDoc, user);
  }

  /**
   * Updates the email and password of a user in Firebase Authentication.
   * @param email - The new email address of the user.
   * @param password - The new password of the user.
   * @returns A promise that resolves when the email and password are updated.
   */
  async updateUser(email: string, password: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      await updateEmail(user, email);
      await updatePassword(user, password);
    }
  }
}
