import type {} from '@redux-devtools/extension'; // required for devtools typing
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { OrderFilter } from '@/models/Order';
import { defaultFilter } from '@/constants/order';

type OrderState = {
  filter: OrderFilter;
  setFilter: (filter: OrderFilter) => void;
  isRefreshing: boolean;
  setIsRefreshing: (isRefreshing: boolean) => void;
};

export const useOrderStore = create<OrderState>()(
  devtools(set => ({
    isRefreshing: false,
    setIsRefreshing(isRefreshing) {
      set({
        isRefreshing,
      });
    },
    filter: defaultFilter,
    setFilter(filter) {
      set(state => ({
        filter,
      }));
    },
  })),
);
