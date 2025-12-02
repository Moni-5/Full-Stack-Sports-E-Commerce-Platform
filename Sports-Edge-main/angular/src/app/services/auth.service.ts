import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5233/api/auth';
  public isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password });
    
  }

  // ✅ Register method added here
  register(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }


    
  storeUserData(token: string, username: string, role: string, userId: number, email?: string) {
  if (userId === undefined || userId === null) {
    console.error('User ID is undefined or null.');
    return;
  }

  localStorage.setItem('token', token);
  localStorage.setItem('username', username);
  localStorage.setItem('role', role);
  localStorage.setItem('userId', userId.toString());
  if (email) {
    localStorage.setItem('email', email);
  }
  console.log('Storing userId:', userId);
}


  logout() {
    localStorage.clear();
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return this.isLoggedInSubject.asObservable();
  }
}
