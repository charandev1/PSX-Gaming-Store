import { CartListType } from 'contexts/cart.context';

export type OrderType = {
  _id: string;
  paymentStatus: 'pending' | 'succeeded';
  amount: number;
  items: CartListType[];
  shippingAddress: {
    name: string;
    country: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
  };
  billingAddress: {
    name: string;
    country: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
  };
  orderStatus: 'pending' | 'placed';
  createdAt: { timestamp: number };
};
