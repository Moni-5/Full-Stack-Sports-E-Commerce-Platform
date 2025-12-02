import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import this

@Component({
  selector: 'app-header',
  standalone: true, // ✅ If you're using standalone components
  imports: [CommonModule], // ✅ Add CommonModule here
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  username: string | null = '';

  constructor() {
    this.username = localStorage.getItem('username');
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login'; // Or use router if injected
  }
}
