import { CurrencyPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MainserviceService } from '../services/mainservice.service';
import { ProductsComponent } from '../products/products.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, RouterLink, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  sports: any;
  name = "";
  
  constructor(private service: MainserviceService, private productsservice: ProductsService) {
    this.service.get().subscribe(
      (data) => { this.sports = data }
    );
  }

  add(index: any) {
    this.name = this.sports[index].name;
    this.productsservice.items(this.name);
  }
}
