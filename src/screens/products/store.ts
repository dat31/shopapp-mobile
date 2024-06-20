import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';

type State = {
  filteredProducts: Category[];
  products: Category[];
  onFilter: (text: string) => void;
  setProducts: (products: Category[]) => void;
};

export const useProductStore = create<State>()(
  devtools((set, get) => ({
    filteredProducts: [],
    products: [],
    onFilter(text) {
      console.log('onFilter', text);

      if (text === '') {
        set({ filteredProducts: get().products });
        return;
      }
      const filterPrdFn = (p: Product) =>
        p.name.toLocaleLowerCase().includes(text);
      set({
        filteredProducts: get()
          .products.filter(p => p.products.some(filterPrdFn))
          .map(cat => ({
            ...cat,
            products: cat.products.filter(p =>
              p.name.toLocaleLowerCase().includes(text),
            ),
          })),
      });
    },
    setProducts(products) {
      set({ products, filteredProducts: products });
    },
  })),
);
