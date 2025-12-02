import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainserviceService {
  private baseUrl = 'http://localhost:5233/api';
private orderSubject = new BehaviorSubject<any>(null);
order = this.orderSubject.asObservable();
  constructor(private http:HttpClient) { }
  orders:any=[]
  place_order:any
  cart_items:any=[]
  products:any=[]

  get():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/sports`)
  }

  getusers():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/auth`)
  }

  updateUserPassword(id: number, updatedUser: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/auth/${id}`, updatedUser, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  // cart(item:any){
  //   this.cart_items.push(item)
  // }
  placeorder(item:any){
    this.orderSubject.next(item);
  }
  ordered(order: any): Observable<any> {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);

if (!userId || userId <= 0) {
  throw new Error('User not authenticated or invalid ID');
}
console.log(userId)

    const orderWithUserId = {
      ...order,
      UserId: userId,
      OrderDate: new Date().toISOString()
    };
    
    return this.http.post(`${this.baseUrl}/orders`, orderWithUserId, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getOrders(): Observable<any> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.http.get(`${this.baseUrl}/orders/user/${userId}`);
  }

  cancelOrder(orderId: string | number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/orders/${orderId}`, { status: 'Cancelled' }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
