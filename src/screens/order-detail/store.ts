import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { service } from '@/services';
import { Order, OrderItem } from '@/models/Order';
import { produce } from 'immer';

type OrderState = {
  fetchOrderDetail: (id: Order['id']) => void;
  order?: Order;
  activeOrderItem?: OrderItem;
  increaseQty: (od: OrderItem) => void;
  decreaseQty: (od: OrderItem) => void;
  removeItem: (od: OrderItem) => void;
};

export const useOrderStore = create<OrderState>()(
  devtools((set, get) => ({
    fetchOrderDetail: async (id: Order['id']) => {
      const order = await service
        .get<Order>(`/orders/${id}`)
        .then(res => res.data);
      set({ order });
    },
    removeItem(od) {
      set(
        produce<OrderState>(state => {
          if (state.order) {
            state.order.items = state.order?.items.filter(
              item => item.product.id !== od.product.id,
            );
          }
        }),
      );
    },
    increaseQty: async (od: OrderItem) => {
      const idx = get().order?.items.findIndex(
        e => e.product.id === od.product.id,
      ) as number;
      if (idx === -1) {
        const odItem = { quantity: 1, product: od.product };
        set(
          produce(state => {
            state.order.items.push(odItem);
          }),
        );
        const itemResponse = await service.post(
          `/orders/items/${get().order?.id}`,
          odItem,
        );
        set(
          produce<OrderState>(state => {
            const idx = state.order?.items.findIndex(
              e => e.product.id === od.product.id,
            );
            (state.order?.items as OrderItem[])[idx as number] =
              itemResponse.data;
          }),
        );
        return;
      }
      const item = get()?.order?.items[idx];
      if (!item) {
        return;
      }
      set(
        produce(state => {
          state.order.items[idx].quantity = state.order.items[idx].quantity + 1;
        }),
      );
      await service.patch(`order-items/${item.id}`, {
        ...item,
        quantity: item.quantity + 1,
      });
    },
    decreaseQty: (od: OrderItem) => {
      const idx = get().order?.items.findIndex(
        e => e.product.id === od.product.id,
      ) as number;
      if (idx === -1) {
        return;
      }
      const orderItemState = get()?.order?.items[idx] as OrderItem;
      if (orderItemState.quantity === 1) {
        set(
          produce<OrderState>(state => {
            if (state.order) {
              state.order.items = state.order?.items.filter(
                item => item.product.id !== od.product.id,
              );
            }
          }),
        );
        return;
      }
      set(
        produce(state => {
          state.order.items[idx].quantity = state.order.items[idx].quantity - 1;
        }),
      );
    },
  })),
);
