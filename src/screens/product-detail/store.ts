import { Product } from '@/models/Product';
import { service } from '@/services';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  product?: Product;
  fetchProductDetail: (id: Product['id']) => void;
};

export const useProductDetailStore = create<State>()(
  devtools(set => ({
    fetchProductDetail: async id => {
      const product = await service
        .get<Product>(`/products/${id}`)
        .then(res => res.data);
      set({ product });
    },
  })),
);
