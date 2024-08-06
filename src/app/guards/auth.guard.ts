import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Determines if a route can be activated based on the user's authentication state.
   * @returns An observable that resolves with a boolean indicating if the route can be activated.
   */
  canActivate(): Observable<boolean> {
    return this.authState$.pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }

  /**
   * Returns an observable of the authentication state.
   */
  private get authState$() {
    return new Observable((subscriber) => {
      this.auth.onAuthStateChanged((user) => subscriber.next(user));
    });
  }
}
