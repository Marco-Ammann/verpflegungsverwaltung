import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  collectionData,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Auth, deleteUser } from '@angular/fire/auth';
import { UserInterface } from '../models/user.model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USERS_COLLECTION = 'users';

  constructor(private firestore: Firestore, private auth: Auth) { }

  /**
   * Creates a new user.
   * 
   * @param user - The user object to be created.
   * @returns An Observable that emits void when the user is created.
   */
  createUser(user: UserInterface): Observable<void> {
    const userDoc = this.getUserDoc(user.id);
    return from(setDoc(userDoc, user));
  }


  /**
   * Saves a user to the database.
   * 
   * @param user - The user object to be saved.
   * @returns A promise that resolves when the user is successfully saved.
   */
  saveUser(user: UserInterface): Promise<void> {
    const userDoc = this.getUserDoc(user.id);
    return setDoc(userDoc, user);
  }


  /**
   * Updates a user in the system.
   * 
   * @param user - The user object to be updated.
   * @returns A promise that resolves when the user is successfully updated.
   */
  updateUser(user: UserInterface): Promise<void> {
    const userDoc = this.getUserDoc(user.id);
    return updateDoc(userDoc, { ...user });
  }


  /**
   * Deletes a user by their ID.
   * 
   * @param userId - The ID of the user to delete.
   * @returns An Observable that resolves to void.
   */
  deleteUser(userId: string): Observable<void> {
    const userDoc = this.getUserDoc(userId);
    return from(
      getDoc(userDoc).then((docSnap) => {
        if (docSnap.exists()) {
          console.log(`Deleting user document with ID: ${userId}`);
          return deleteDoc(userDoc).then(() => this.deleteAuthUser(userId));
        }
        return Promise.resolve();
      })
    );
  }


  /**
   * Retrieves a list of users from the database.
   * @returns An observable that emits an array of UserInterface objects.
   */
  getUsers(): Observable<UserInterface[]> {
    const usersCollection = collection(this.firestore, this.USERS_COLLECTION);
    return collectionData(usersCollection, { idField: 'id' }) as Observable<UserInterface[]>;
  }


  /**
   * Retrieves the document reference for a specific user.
   * 
   * @param userId - The ID of the user.
   * @returns The document reference for the user.
   */
  private getUserDoc(userId: string) {
    return doc(this.firestore, `${this.USERS_COLLECTION}/${userId}`);
  }


  /**
   * Deletes an authenticated user with the specified user ID.
   * 
   * @param userId - The ID of the user to be deleted.
   * @returns A promise that resolves when the user is deleted, or resolves immediately if the user is not authenticated or the user ID does not match the authenticated user.
   */
  private deleteAuthUser(userId: string): Promise<void> {
    const userAuth = this.auth.currentUser;
    console.log(`Current authenticated user ID: ${userAuth ? userAuth.uid : 'none'}`);
    if (userAuth && userAuth.uid === userId) {
      console.log(`Deleting authenticated user with ID: ${userId}`);
      return deleteUser(userAuth);
    }
    return Promise.resolve();
  }
}