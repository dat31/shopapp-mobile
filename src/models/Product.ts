import { Category } from './Category';

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: Category;
};
