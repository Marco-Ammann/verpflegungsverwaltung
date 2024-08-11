import { Injectable } from '@angular/core';
import { Auth, signOut, User } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { UserInterface } from '../models/user.model';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(false);

  constructor(private auth: Auth, private firestore: Firestore) {
    this.auth.onAuthStateChanged((user: User | null) => {
      this.authStatus.next(!!user);
    });
  }

  /**
   * Returns an observable indicating whether the user is authenticated.
   */
  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  async loginWithEmail(email: string, password: string): Promise<UserInterface | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    this.authStatus.next(true);
    return userDoc.data() as UserInterface;
  }

  async loginWithShortcode(shortcode: string, password: string): Promise<UserInterface | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('shortcode', '==', shortcode), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    this.authStatus.next(true);
    return userDoc.data() as UserInterface;
  }

  logout(): Promise<void> {
    this.authStatus.next(false);
    return signOut(this.auth);
  }
}
