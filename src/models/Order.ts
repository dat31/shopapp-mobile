import { Product } from './Product';

export enum Status {
  CREATED = 'CREATED',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export type Order = {
  id: number;
  orderDate: string;
  status: Status;
  items: OrderItem[];
};

export type OrderItem = {
  id: number;
  product: Product;
  quantity: number;
  price: Product['price'];
};
