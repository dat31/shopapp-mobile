import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { service } from '@/services/axios';
import { Order, OrderFilter, OrderItem } from '@/models/Order';
import { produce } from 'immer';
import { defaultFilter } from '@/constants/order';

type Pagination = {
  total: number;
  next?: number;
  previous?: number;
};

type OrderState = {
  filter: Partial<OrderFilter>;
  setFilter: (filter: Partial<OrderFilter>) => void;
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
