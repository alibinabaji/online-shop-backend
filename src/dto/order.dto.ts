export class OrderDto {
    orderItems: Array<{ productId: number; quantity: number; price: number }>;
    totalAmount: number;
    orderStatus: string;
    shippingMethod: string;
    deliveryDate: Date;
    invoiceNumber: string;
    paymentMethod: string;
    shippingAddress: {
      address: string;
      city: string;
      state: string;
      postalCode: string;
      phone: string;
    };
  }
  