import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MainserviceService } from '../services/mainservice.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  currentUser: any = {};
  users: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private mainService: MainserviceService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadAllUsers();
  }

  loadCurrentUser(): void {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    this.currentUser = {
      id: userId,
      username: username,
      email: email,
      role: role
    };

    this.profileForm.patchValue({
      username: username || '',
      email: email || ''
    });
  }

  loadAllUsers(): void {
    this.mainService.getusers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.profileForm.invalid) {
      return;
    }

    const formData = this.profileForm.value;
    const userId = parseInt(localStorage.getItem('userId') || '0');

    // Check if email is already taken by another user
    const emailExists = this.users.find(user => 
      user.email === formData.email && user.id !== userId
    );

    if (emailExists) {
      this.errorMessage = 'Email is already taken by another user.';
      return;
    }

    // Find current user in the users array
    const currentUserData = this.users.find(user => user.id === userId);
    
    if (!currentUserData) {
      this.errorMessage = 'User not found.';
      return;
    }

    // Prepare updated user data
    const updatedUser = {
      ...currentUserData,
      Username: formData.username,
      Email: formData.email
    };

    // Update user data
    this.mainService.updateUserPassword(userId, updatedUser).subscribe({
      next: (response) => {
        this.successMessage = 'Profile updated successfully!';
        
        // Update localStorage with new data
        localStorage.setItem('username', formData.username);
        localStorage.setItem('email', formData.email);
        
        // Update current user object
        this.currentUser.username = formData.username;
        this.currentUser.email = formData.email;
        
        // Reset form submission state
        this.submitted = false;
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = 'Failed to update profile. Please try again.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
} 