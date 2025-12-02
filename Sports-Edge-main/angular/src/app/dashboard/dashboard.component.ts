import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userInfo: any = {};
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  loadUserInfo(): void {
    this.userInfo = {
      username: localStorage.getItem('username') || 'N/A',
      email: localStorage.getItem('email') || 'N/A',
      role: localStorage.getItem('role') || 'User',
      userId: localStorage.getItem('userId') || 'N/A'
    };
  }

  logout(): void {
    this.authService.logout();
  }
} 