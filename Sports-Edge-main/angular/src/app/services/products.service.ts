import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl = 'http://localhost:5233/api';
  name: string = '';

  constructor(private http: HttpClient) {}

  
  get(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products`).pipe(
      map(products => products.map((product: any) => ({
        ...product,

        rating: product.rating || Math.floor(Math.random() * 2) + 4,
        ratingCount: product.ratingCount || Math.floor(Math.random() * 100) + 50
      })))
    );
  }

  items(name: string) {
    this.name = name;
  }


  addToCart(item: any): Observable<any> {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    return this.http.post(`${this.baseUrl}/cartitems/user/${userId}`, item);
  }

  
  toggleWishlist(item: any): Observable<any> {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    return this.http.post(`${this.baseUrl}/wishlistitems/user/${userId}`, item);
  }


  getCart(): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.get(`${this.baseUrl}/cartitems/user/${userId}`);
  }

  
  deleteFromCart(productId: number): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.delete(`${this.baseUrl}/cartitems/user/${userId}/product/${productId}`);
  }


  getWishlist(): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.get(`${this.baseUrl}/wishlistitems/user/${userId}`);
  }

  deleteFromWishlist(productId: number): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.delete(`${this.baseUrl}/wishlistitems/user/${userId}/product/${productId}`);
  }

  resetAllCartStatuses(): Observable<any> {
    return this.http.post(`${this.baseUrl}/products/resetcart`, {});
  }

  deleteAllCartItemsForUser(): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.delete(`${this.baseUrl}/cartitems/user/${userId}`);
  }
}
