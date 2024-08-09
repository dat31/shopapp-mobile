import { Product } from '@/models/Product';
import { createCRUDService } from '../axios';

export default createCRUDService<Product>('/products');
