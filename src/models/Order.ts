import { PaginatedRequest, SortDirection } from './common';
import { Product } from './Product';
import { User } from './User';

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
  creator: User;
  table: string;
};

export type OrderItem = {
  id: number;
  product: Product;
  quantity: number;
  price: Product['price'];
  order: Pick<Order, 'id'>;
  note: string;
};

export type OrderDateFilter = {
  from: Date;
  to: Date;
};

export type OrderFilter = PaginatedRequest<Order & OrderDateFilter>;
