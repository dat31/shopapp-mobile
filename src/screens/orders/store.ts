import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { service } from '@/services/axios';
import { Order, OrderItem } from '@/models/Order';

type OrderState = {
  activeItem?: OrderItem;
  setActiveItem(item?: OrderItem): void;
};

export const useOrderStore = create<OrderState>()(
  devtools(set => ({
    setActiveItem(item) {
      set({ activeItem: item });
    },
  })),
);
