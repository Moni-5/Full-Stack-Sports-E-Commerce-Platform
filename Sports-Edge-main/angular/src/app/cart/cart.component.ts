import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MainserviceService } from '../services/mainservice.service';
import { CurrencyPipe, Location, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, NgIf, CurrencyPipe, NgFor],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cart_items: any[] = [];

  constructor(
    private service: MainserviceService,
    private location: Location,
    private products: ProductsService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadCartItems();
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.background = "url('/assets/homebackground2.jpg') no-repeat center center fixed";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundColor = "#312f2f";
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.background = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundColor = '';
    }
  }

  loadCartItems() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    if (!userId || userId <= 0) {
      const shouldLogin = confirm('You need to login to view your cart. Would you like to login now?');
      if (shouldLogin) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/home']);
      }
      return;
    }

    this.products.getCart().subscribe({
      next: (data) => {
        this.cart_items = data;
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
      }
    });
  }

  remove(index: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const item = this.cart_items[index];
    const productId = item.productId;

    this.products.deleteFromCart(productId).subscribe({
      next: () => {
        this.cart_items.splice(index, 1);
        alert("Your item has been removed 😔");
      },
      error: (error) => {
        console.error('Error removing item:', error);
        alert("Failed to remove item. Please try again.");
      }
    });
  }

  placeorder(index: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const item = { ...this.cart_items[index] };

    this.products.deleteFromCart(item.productId).subscribe({
      next: () => {
        this.service.placeorder(item); 
        this.router.navigate(['/place_order']);
        this.cart_items.splice(index, 1);
      },
      error: (error) => {
        console.error('Error placing order:', error);
        alert("Failed to place order. Please try again.");
      }
    });
  }

  resetCart() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const confirmReset = confirm("Are you sure you want to clear the entire cart?");
    if (!confirmReset) return;

    this.products.deleteAllCartItemsForUser().subscribe({
      next: () => {
        this.cart_items = [];
        alert('Cart has been reset successfully!');
      },
      error: (error) => {
        console.error('Error resetting cart:', error);
        alert('Failed to reset cart. Please try again.');
      }
    });
  }

  icon_click() {
    this.location.back();
  }
}
