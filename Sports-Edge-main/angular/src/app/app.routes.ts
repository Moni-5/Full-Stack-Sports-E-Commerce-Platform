import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { OrdersComponent } from './orders/orders.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { BestsellersComponent } from './bestsellers/bestsellers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'register', pathMatch: 'full'
    },
    {
        path: 'register', component: RegisterComponent
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'forgot-password', component: ForgotPasswordComponent
    },
    {
        path: 'home', component: HomeComponent
    },
    {
        path: 'bestsellers', component: BestsellersComponent
    },
    {
        path: 'products', component: ProductsComponent
    },
    {
        path: 'wishlist', component: WishlistComponent
    },
    {
        path: 'cart', component: CartComponent
    },
    {
        path: 'place_order', component: PlaceOrderComponent
    },
    {
        path: 'orders', component: OrdersComponent
    },
    {
        path: 'dashboard', component: DashboardComponent
    },
    {
        path: 'profile/edit', component: ProfileEditComponent
    },
    {
        path: 'profile/change-password', component: ChangePasswordComponent
    }
];
