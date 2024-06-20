import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { service } from '@/services';
import { Order } from '@/models/Order';

type OrderState = {
  fetchOrders: () => void;
  orders?: Order[];
};

export const useBearStore = create<OrderState>()(
  devtools(set => ({
    fetchOrders: async () => {
      const orders = await service
        .get<Order[]>('/orders')
        .then(res => res.data);
      set({ orders });
    },
  })),
);
