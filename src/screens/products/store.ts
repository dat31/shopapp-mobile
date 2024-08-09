import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { Product } from '@/models/Product';

type State = {
  filteredProducts: Product[];
  products: Product[];
  onFilter: (text: string) => void;
  setProducts: (products: Product[]) => void;
};

export const useProductStore = create<State>()(
  devtools((set, get) => ({
    filteredProducts: [],
    products: [],
    onFilter(text) {
      if (text === '') {
        set({ filteredProducts: get().products });
        return;
      }

      set({
        filteredProducts: get().products.filter(p =>
          p.name.toLocaleLowerCase().includes(text),
        ),
      });
    },
    setProducts(products) {
      set({ products, filteredProducts: products });
    },
  })),
);
