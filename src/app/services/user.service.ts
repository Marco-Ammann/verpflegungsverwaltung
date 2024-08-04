import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, collection, collectionData, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Auth, updateEmail, updatePassword, createUserWithEmailAndPassword, deleteUser } from '@angular/fire/auth';
import { User } from '../models/user.model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  createUser(user: User): Observable<void> {
    return from(
      createUserWithEmailAndPassword(this.auth, user.email, user.password).then((userCredential) => {
        const userDoc = doc(this.firestore, `users/${userCredential.user.uid}`);
        const userData: User = {
          ...user,
          id: userCredential.user.uid
        };
        return setDoc(userDoc, userData);
      })
    );
  }

  saveUser(user: User): Promise<void> {
    const userDoc = doc(this.firestore, `users/${user.id}`);
    return setDoc(userDoc, user);
  }

  updateUser(user: User): Promise<void> {
    const userDoc = doc(this.firestore, `users/${user.id}`);
    const updatePromises = [updateDoc(userDoc, { ...user })];

    if (user.email && user.password) {
      const userAuth = this.auth.currentUser;
      if (userAuth && userAuth.uid === user.id) {
        updatePromises.push(updateEmail(userAuth, user.email));
        updatePromises.push(updatePassword(userAuth, user.password));
      }
    }

    return Promise.all(updatePromises).then(() => {});
  }

  deleteUser(userId: string): Observable<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    return from(
      getDoc(userDoc).then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          return deleteDoc(userDoc).then(() => {
            const userAuth = this.auth.currentUser;
            if (userAuth && userAuth.uid === userId) {
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
    return from(getDoc(userDoc).then((docSnap) => (docSnap.exists() ? (docSnap.data() as User) : undefined)));
  }

  getUsers(): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'id' }) as Observable<User[]>;
  }
}
