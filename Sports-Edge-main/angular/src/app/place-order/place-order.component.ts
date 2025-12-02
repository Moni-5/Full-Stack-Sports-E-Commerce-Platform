import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MainserviceService } from '../services/mainservice.service';

interface UPIOption {
  id: string;
  name: string;
  icon: string;
  qrCode: string;
}

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent {
  order_item: any;
  count: number = 1;
  orderPlaced: boolean = false;
  orderForm: FormGroup;
  selectedPaymentMethod: string = 'cod';
  upiOptions: UPIOption[] = [
    { 
      id: 'phonepe',
      name: 'PhonePe',
      icon: 'assets/payment-icons/phonepe.png',
      qrCode: 'assets/qr-codes/qr.png'
    },
    { 
      id: 'paytm',
      name: 'Paytm',
      icon: 'assets/payment-icons/paytm.png',
      qrCode: 'assets/qr-codes/qr.png'
    },
    { 
      id: 'gpay',
      name: 'Google Pay',
      icon: 'assets/payment-icons/gpay.webp',
      qrCode: 'assets/qr-codes/qr.png'
    },
    { 
      id: 'paypal',
      name: 'PayPal',
      icon: 'assets/payment-icons/paypal.png',
      qrCode: 'assets/qr-codes/qr.png'
    }
  ];
  showQRCode: boolean = false;
  handlingFee: number = 0;
  selectedUPIProvider: string = '';
  paymentVerified: boolean = false;

  constructor(
    
    private service: MainserviceService,
    private router: Router,
    private fb: FormBuilder
    
  ) {
    

    this.orderForm = this.fb.group({
      fullName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      deliveryType: ['standard', [Validators.required]],
      paymentMethod: ['cod', [Validators.required]],
      // Card payment fields
      cardNumber: [''],
      cardExpiry: [''],
      cardCVV: [''],
      // UPI payment fields
      upiProvider: [''],
      upiId: ['']
    });

    // Subscribe to payment method changes
    this.orderForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.selectedPaymentMethod = method;
      this.paymentVerified = method === 'cod'; // COD is always verified
      this.updateValidators();
      this.updateHandlingFee();
    });
  }
ngOnInit(): void {
  // Check if user is logged in
  const userId = localStorage.getItem('userId');
  if (!userId) {
    const shouldLogin = confirm('You need to login to place an order. Would you like to login now?');
    if (shouldLogin) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/home']);
    }
    return;
  }

  this.service.order.subscribe((item) => {
    this.order_item = item;
    if (!item) this.router.navigate(['/cart']);
  });
}

  private updateValidators() {
    // Reset all payment-related fields
    const cardFields = ['cardNumber', 'cardExpiry', 'cardCVV'];
    const upiFields = ['upiProvider', 'upiId'];
    [...cardFields, ...upiFields].forEach(field => {
      const control = this.orderForm.get(field);
      control?.clearValidators();
      control?.updateValueAndValidity();
    });

    // Set validators based on payment method
    if (this.selectedPaymentMethod === 'card') {
      this.orderForm.get('cardNumber')?.setValidators([
        Validators.required,
        Validators.pattern('^[0-9]{16}$')
      ]);
      this.orderForm.get('cardExpiry')?.setValidators([
        Validators.required,
        Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')
      ]);
      this.orderForm.get('cardCVV')?.setValidators([
        Validators.required,
        Validators.pattern('^[0-9]{3,4}$')
      ]);
    } else if (this.selectedPaymentMethod === 'upi') {
      this.orderForm.get('upiProvider')?.setValidators([Validators.required]);
      this.orderForm.get('upiId')?.setValidators([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9.\\-_]{2,49}@[a-zA-Z._]{2,49}$')
      ]);
    }

    // Update validity
    this.orderForm.updateValueAndValidity();
  }

  private updateHandlingFee() {
    this.handlingFee = this.selectedPaymentMethod === 'cod' ? 50 : 0;
  }

  selectUPIProvider(providerId: string) {
    this.selectedUPIProvider = providerId;
    this.orderForm.patchValue({ upiProvider: providerId });
    this.showQRCode = true;
    this.paymentVerified = false; // Reset verification when provider changes
  }

  getSelectedUPIOption(): UPIOption | undefined {
    return this.upiOptions.find(option => option.id === this.selectedUPIProvider);
  }

  verifyPayment() {
    const paymentMethod = this.selectedPaymentMethod;
    
    if (paymentMethod === 'card') {
      const cardNumber = this.orderForm.get('cardNumber')?.value;
      const cardExpiry = this.orderForm.get('cardExpiry')?.value;
      const cardCVV = this.orderForm.get('cardCVV')?.value;

      if (this.isValidCardNumber(cardNumber) && 
          this.isValidExpiry(cardExpiry) && 
          this.isValidCVV(cardCVV)) {
        this.paymentVerified = true;
        alert('Card details verified successfully!');
      } else {
        this.paymentVerified = false;
        alert('Invalid card details. Please check and try again.');
      }
    } else if (paymentMethod === 'upi') {
      const upiId = this.orderForm.get('upiId')?.value;
      if (this.isValidUPIId(upiId)) {
        this.paymentVerified = true;
        alert('UPI ID verified successfully!');
      } else {
        this.paymentVerified = false;
        alert('Invalid UPI ID. Please check and try again.');
      }
    }
  }

  private isValidCardNumber(cardNumber: string): boolean {
    return /^[0-9]{16}$/.test(cardNumber);
  }

  private isValidExpiry(expiry: string): boolean {
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/');
    const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const today = new Date();
    return expDate > today;
  }

  private isValidCVV(cvv: string): boolean {
    return /^[0-9]{3,4}$/.test(cvv);
  }

  private isValidUPIId(upiId: string): boolean {
    return /^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z._]{2,49}$/.test(upiId);
  }

  getCardError(field: string): string {
    const control = this.orderForm.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${field} is required`;
      if (control.errors['pattern']) {
        switch (field) {
          case 'cardNumber': return 'Invalid card number (16 digits required)';
          case 'cardExpiry': return 'Invalid expiry date (MM/YY format required)';
          case 'cardCVV': return 'Invalid CVV (3-4 digits required)';
          default: return 'Invalid format';
        }
      }
    }
    return '';
  }

  getUPIError(field: string): string {
    const control = this.orderForm.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${field} is required`;
      if (control.errors['pattern']) return 'Invalid UPI ID format (e.g., username@upi)';
    }
    return '';
  }

  calculateTotal(): number {
    const basePrice = this.count === 1 ? this.order_item.price + 100 : this.order_item.price * this.count + 100;
    const expressDeliveryCharge = this.orderForm.get('deliveryType')?.value === 'express' ? 50 : 0;
    return basePrice + expressDeliveryCharge + this.handlingFee;
  }

//   placeOrder() {
//     if (!this.orderForm.valid) {
//       Object.keys(this.orderForm.controls).forEach(key => {
//         const control = this.orderForm.get(key);
//         control?.markAsTouched();
//       });
//       alert('Please fill in all required fields correctly.');
//       return;
//     }

//     if (this.selectedPaymentMethod !== 'cod' && !this.paymentVerified) {
//       alert('Please verify your payment details before placing the order.');
//       return;
//     }

//     // Create order object
//     const order = {
//       productId: this.order_item.id,
//       productName: this.order_item.name,
//       productImage: this.order_item.img,
//       price: this.order_item.price,
//       quantity: this.count,
//       totalPrice: this.calculateTotal(),
//       fullName: this.orderForm.value.fullName,
//       phone: this.orderForm.value.phone,
//       street: this.orderForm.value.street,
//       city: this.orderForm.value.city,
//       pincode: this.orderForm.value.pincode,
//       deliveryType: this.orderForm.value.deliveryType,
//       paymentMethod: this.orderForm.value.paymentMethod,
//       status: 'Pending',
//       orderDate: new Date()
//     };

//     // Call the service to place the order
//     this.service.ordered(order).subscribe({
//       next: (response) => {
//         this.orderPlaced = true;
//         this.order_item = null;
//         this.orderForm.reset({
//           deliveryType: 'standard',
//           paymentMethod: 'cod'
//         });
//         setTimeout(() => {
//           this.router.navigate(['/orders']);
//         }, 2000);
//       },
//       error: (error) => {
//         console.error('Error placing order:', error);
//         alert('Failed to place order. Please try again.');
//       }
//     });
//   }
// }


placeOrder() {
  if (!this.orderForm.valid) {
    Object.keys(this.orderForm.controls).forEach(key => {
      const control = this.orderForm.get(key);
      control?.markAsTouched();
    });
    alert('Please fill in all required fields correctly.');
    return;
  }

  if (this.selectedPaymentMethod !== 'cod' && !this.paymentVerified) {
    alert('Please verify your payment details before placing the order.');
    return;
  }

  const order = {
    ProductId: this.order_item.id,
    ProductName: this.order_item.name,
    ProductImage: this.order_item.img,
    Price: this.order_item.price,
    Quantity: this.count,
    TotalPrice: this.calculateTotal(),
    FullName: this.orderForm.value.fullName,
    Phone: this.orderForm.value.phone,
    Street: this.orderForm.value.street,
    City: this.orderForm.value.city,
    Pincode: this.orderForm.value.pincode,
    DeliveryType: this.orderForm.value.deliveryType,
    PaymentMethod: this.orderForm.value.paymentMethod,
    Status: 'Pending',
    OrderDate: new Date().toISOString() // ISO format
  };

  this.service.ordered(order).subscribe({
    next: (response) => {
      console.log('Order placed:', response);
      this.orderPlaced = true;
      this.order_item = null;
      this.orderForm.reset({
        deliveryType: 'standard',
        paymentMethod: 'cod'
      });
      setTimeout(() => {
        this.router.navigate(['/orders']);
      }, 2000);
    },
    error: (error) => {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  });
}
}