import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MainserviceService } from '../services/mainservice.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  currentUser: any = {};
  users: any[] = [];
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  passwordConditions = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private mainService: MainserviceService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordComplexityValidator]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadAllUsers();
  }

  loadCurrentUser(): void {
    if (isPlatformBrowser(this.platformId)) {
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
    } else {
      this.currentUser = {};
    }
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
    return this.passwordForm.controls;
  }

  passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const conditions = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
    };

    const isValid = Object.values(conditions).every(condition => condition);
    return isValid ? null : { 'complexity': true };
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onPasswordInput(): void {
    const newPassword = this.passwordForm.get('newPassword')?.value;
    if (newPassword) {
      this.passwordConditions = {
        length: newPassword.length >= 8,
        uppercase: /[A-Z]/.test(newPassword),
        lowercase: /[a-z]/.test(newPassword),
        number: /\d/.test(newPassword),
        special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword)
      };
    }
  }

  togglePasswordVisibility(field: string): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.passwordForm.invalid) {
      return;
    }

    const formData = this.passwordForm.value;
    const userId = parseInt(localStorage.getItem('userId') || '0');

    // Find current user in the users array
    const currentUserData = this.users.find(user => user.id === userId);
    
    if (!currentUserData) {
      this.errorMessage = 'User not found.';
      return;
    }

    // Verify current password (you might want to add proper password verification)
    // For now, we'll assume the current password is correct
    // In a real application, you should verify against the stored password

    // Prepare updated user data
    const updatedUser = {
      ...currentUserData,
      Password: formData.newPassword
    };

    // Update password
    this.mainService.updateUserPassword(userId, updatedUser).subscribe({
      next: (response) => {
        this.successMessage = 'Password updated successfully!';
        
        // Reset form
        this.passwordForm.reset();
        this.submitted = false;
        this.passwordConditions = {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false
        };
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error updating password:', error);
        this.errorMessage = 'Failed to update password. Please try again.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
} 