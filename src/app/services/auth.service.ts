import { Injectable } from '@angular/core';
import { Auth, signOut, User } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { UserInterface } from '../models/user.model';
import { Observable, BehaviorSubject } from 'rxjs';

/**
 * Service responsible for handling authentication.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USERS_COLLECTION = 'users';
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


  /**
   * Logs in a user with email and password.
   * 
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns A promise that resolves to a UserInterface object if the login is successful, otherwise null.
   */
  async loginWithEmail(email: string, password: string): Promise<UserInterface | null> {
    return this.login({ email, password });
  }


  /**
   * Logs in a user with a shortcode and password.
   * 
   * @param shortcode - The shortcode of the user.
   * @param password - The password of the user.
   * @returns A Promise that resolves to a UserInterface object if the login is successful, otherwise null.
   */
  async loginWithShortcode(shortcode: string, password: string): Promise<UserInterface | null> {
    return this.login({ shortcode, password });
  }


  /**
   * Logs out the user.
   * 
   * @returns A promise that resolves when the user is successfully logged out.
   */
  async logout(): Promise<void> {
    this.authStatus.next(false);
    return signOut(this.auth);
  }


  /**
   * Logs in a user with the provided credentials.
   * 
   * @param credentials - The login credentials.
   * @returns A Promise that resolves to a UserInterface object if the login is successful, or null if the login fails.
   */
  private async login(credentials: { email?: string; shortcode?: string; password: string }): Promise<UserInterface | null> {
    try {
      const usersRef = collection(this.firestore, this.USERS_COLLECTION);
      const q = query(usersRef, ...this.buildQueryConditions(credentials));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      const userDoc = querySnapshot.docs[0];
      this.authStatus.next(true);
      return userDoc.data() as UserInterface;
    } catch (error) {
      console.error('Login failed', error);
      return null;
    }
  }


  /**
   * Builds query conditions based on the provided credentials.
   * @param credentials - The credentials used to build the query conditions.
   * @returns An array of query conditions.
   */
  private buildQueryConditions(credentials: { email?: string; shortcode?: string; password: string }) {
    const conditions = [];
    if (credentials.email) {
      conditions.push(where('email', '==', credentials.email));
    }
    if (credentials.shortcode) {
      conditions.push(where('shortcode', '==', credentials.shortcode));
    }
    conditions.push(where('password', '==', credentials.password));
    return conditions;
  }
}