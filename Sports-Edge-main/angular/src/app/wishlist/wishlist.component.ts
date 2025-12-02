import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { MainserviceService } from '../services/mainservice.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  wishlistItems: any[] = [];

  constructor(
    private productsService: ProductsService,
    private mainService: MainserviceService
  ) {
    this.loadWishlistItems();
  }

  loadWishlistItems() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      const shouldLogin = confirm('You need to login to view your wishlist. Would you like to login now?');
      if (shouldLogin) {
        window.location.href = '/login';
      } else {
        window.location.href = '/home';
      }
      return;
    }

    this.productsService.getWishlist().subscribe({
      next: (data) => {
        this.wishlistItems = data;
      },
      error: (err) => {
        console.error('Error loading wishlist:', err);
      }
    });
  }

  removeFromWishlist(item: any) {
    this.productsService.deleteFromWishlist(item.productId).subscribe({
      next: () => {
        this.loadWishlistItems();
      },
      error: (err) => {
        console.error('Failed to remove from wishlist:', err);
        alert('Failed to remove item from wishlist.');
      }
    });
  }

  addToCart(item: any) {
    const cartItem = {
      name: item.name,
      category: item.category,
      img: item.img,
      price: item.price,
      productId: item.productId,
      userId: parseInt(localStorage.getItem('userId') || '0', 10)
    };

    this.productsService.addToCart(cartItem).subscribe({
      next: () => {
        this.removeFromWishlist(item);
        alert('Item moved to cart.');
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        alert('Failed to add item to cart.');
      }
    });
  }
}
