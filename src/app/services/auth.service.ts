import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  async loginWithEmail(email: string, password: string): Promise<User | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    return userDoc.data() as User;
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

  logout(): Promise<void> {
    return signOut(this.auth);
  }
}
