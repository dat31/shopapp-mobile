import { Order, OrderItem } from '@/models/Order';
import { createCRUDService, service } from '../axios';

export default {
  ...createCRUDService<Order>('/orders'),
  complete(id: Order['id']) {
    return service.patch<Order>(`/orders/complete/${id}`);
  },
  cancel(id: Order['id']) {
    return service.patch<Order>(`/orders/cancel/${id}`);
  },
  createItem(orderId: Order['id'], item: OrderItem) {
    return service.post(`/orders/items/${orderId}`, item);
  },
};
