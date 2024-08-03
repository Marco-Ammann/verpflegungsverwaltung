import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, deleteDoc, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) {}

  createUser(user: User): Promise<void> {
    return setDoc(doc(this.firestore, 'users', user.id), user);
  }

  getUser(id: string): Observable<User | undefined> {
    // Temporary placeholder, you need to use AngularFire to get the actual data
    return new Observable(subscriber => {
      subscriber.next(undefined);
      subscriber.complete();
    });
  }

  updateUser(user: User): Promise<void> {
    return setDoc(doc(this.firestore, 'users', user.id), user);
  }

  deleteUser(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'users', id));
  }

  async getUsers(): Promise<User[]> {
    const userCollection = collection(this.firestore, 'users');
    const snapshot = await getDocs(userCollection);
    return snapshot.docs.map(doc => doc.data() as User);
  }
}
