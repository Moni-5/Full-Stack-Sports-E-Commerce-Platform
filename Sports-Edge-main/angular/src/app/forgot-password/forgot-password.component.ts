import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MainserviceService } from '../services/mainservice.service';

@Component({
  selector: 'app-forgot-password',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email = '';
  newPassword = '';
  successMessage = '';
  errorMessage = '';
  users: any[] = [];

  constructor(private service: MainserviceService, private router: Router) {
    this.service.getusers().subscribe(
      (data) => {
        this.users = data;
        console.log(this.users);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  onSubmit() {
    const user = this.users.find(u => u.email === this.email);

    if (!user) {
      this.errorMessage = 'Email not found!';
      this.successMessage = '';
      return;
    }

    // Prepare updated user data
    const updatedUser = {
      ...user,
      Password: this.newPassword
    };

    // Call PUT API
    this.service.updateUserPassword(user.id, updatedUser).subscribe(
      () => {
        this.successMessage = 'Password updated successfully!';
        this.errorMessage = '';
      },
      (err) => {
        console.error(err);
        this.errorMessage = 'Failed to update password.';
        this.successMessage = '';
      }
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

