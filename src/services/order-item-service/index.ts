import { OrderItem } from '@/models/Order';
import { createCRUDService } from '../axios';

export default createCRUDService<OrderItem>('/order-items');
