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
import { User } from '../models/user.model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  createUser(user: User): Observable<void> {
    const userDoc = doc(this.firestore, `users/${user.id}`);
    return from(setDoc(userDoc, user));
  }

  saveUser(user: User): Promise<void> {
    const userDoc = doc(this.firestore, `users/${user.id}`);
    return setDoc(userDoc, user);
  }

  updateUser(user: User): Promise<void> {
    const userDoc = doc(this.firestore, `users/${user.id}`);
    const updatePromises = [updateDoc(userDoc, { ...user })];

    return Promise.all(updatePromises).then(() => {});
  }

  deleteUser(userId: string): Observable<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    return from(
      getDoc(userDoc).then((docSnap) => {
        if (docSnap.exists()) {
          console.log(`Deleting user document with ID: ${userId}`);
          return deleteDoc(userDoc).then(() => {
            const userAuth = this.auth.currentUser;
            console.log(
              `Current authenticated user ID: ${
                userAuth ? userAuth.uid : 'none'
              }`
            );
            if (userAuth && userAuth.uid === userId) {
              console.log(`Deleting authenticated user with ID: ${userId}`);
              return deleteUser(userAuth);
            }
            return Promise.resolve();
          });
        }
        return Promise.resolve();
      })
    );
  }

  getUser(userId: string): Observable<User | undefined> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    return from(
      getDoc(userDoc).then((docSnap) =>
        docSnap.exists() ? (docSnap.data() as User) : undefined
      )
    );
  }

  getUsers(): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'id' }) as Observable<
      User[]
    >;
  }
}
