import { Order, OrderItem } from '@/models/Order';
import { QUERY_KEY } from '@/query/queries/orders';
import { service } from '@/services/axios';
import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import { produce } from 'immer';
import { useMutation, useQueryClient } from 'react-query';

export default function useDecreaseQtyMutation() {
  const client = useQueryClient();
  return useMutation<
    AxiosResponse<OrderItem>,
    AxiosError,
    { odId: Order['id']; odItem: OrderItem }
  >({
    mutationFn({ odId, odItem }) {
      const order = client.getQueryData<Order>([QUERY_KEY, odId]) as Order;
      const odItemIdx = order?.items.findIndex(
        item => item.product.id === odItem.product.id,
      ) as number;

      const currentQty = order.items[odItemIdx].quantity;

      if (currentQty === 1) {
        return service.delete(`/order-items/${order?.items[odItemIdx].id}`);
      }

      return service.patch(`/order-items/${order?.items[odItemIdx].id}`, {
        ...order.items[odItemIdx],
        quantity: order.items[odItemIdx].quantity - 1,
      });
    },
    onSuccess(data, { odId, odItem }) {
      if (data.status === HttpStatusCode.NoContent) {
        client.setQueryData(
          QUERY_KEY,
          produce<Order[]>(orders => {
            const order = orders.find(od => od.id === odId);
            if (!order) {
              return;
            }
            const item = order.items.find(
              i => i.product.id === odItem.product.id,
            );
            if (!item) {
              return;
            }
            order.items = order.items.filter(
              item => item.product.id === odItem.product.id,
            );
          }),
        );
        client.setQueryData(
          [QUERY_KEY, odId],
          produce<Order>(order => {
            order.items = order.items.filter(
              item => item.product.id !== odItem.product.id,
            );
          }),
        );
        return;
      }

      client.setQueryData(
        [QUERY_KEY, odId],
        produce<Order>(order => {
          const item = order.items.find(
            i => i.product.id === odItem.product.id,
          );
          if (!item) {
            return;
          }
          item.quantity = data.data.quantity;
        }),
      );

      client.setQueryData(
        QUERY_KEY,
        produce<Order[]>(orders => {
          const order = orders.find(od => od.id === odId);
          if (!order) {
            return;
          }
          const item = order.items.find(
            i => i.product.id === odItem.product.id,
          );
          if (!item) {
            return;
          }
          item.quantity = item.quantity - 1;
        }),
      );
    },
  });
}
