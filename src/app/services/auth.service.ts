import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateEmail, updatePassword, User as FirebaseUser, getAuth } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
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
    const tempAuth = getAuth(); // Temporäre Authentifizierungsinstanz
    await signOut(tempAuth); // Abmelden, falls ein Benutzer angemeldet ist

    const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);
    userData.id = userCredential.user.uid;
    await this.saveUserData(userData);

    await signOut(tempAuth); // Temporären Benutzer abmelden
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

  async updateUser(email: string, password: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      await updateEmail(user, email);
      await updatePassword(user, password);
    }
  }

  async loginWithShortcode(shortcode: string, password: string): Promise<User | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('shortcode', '==', shortcode), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    return userDoc.data() as User;
  }
}
