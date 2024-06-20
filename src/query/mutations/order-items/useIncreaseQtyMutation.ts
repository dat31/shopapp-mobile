import { Order, OrderItem } from '@/models/Order';
import { QUERY_KEY } from '@/query/queries/orders';
import { service } from '@/services';
import { AxiosError, AxiosResponse } from 'axios';
import { produce } from 'immer';
import { useMutation, useQueryClient } from 'react-query';

export default function useIncreaseQtyMutation() {
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

      if (odItemIdx === -1) {
        client.setQueryData(
          [QUERY_KEY, odId],
          produce(order => {
            order.items.push(odItem);
          }),
        );
        return service.post(`/orders/items/${odId}`, odItem);
      }

      client.setQueryData(
        [QUERY_KEY, odId],
        produce<Order>(order => {
          if (odItemIdx === -1) {
            return;
          }
          order.items[odItemIdx].quantity = order.items[odItemIdx].quantity + 1;
        }),
      );

      return service.patch(`/order-items/${order?.items[odItemIdx].id}`, {
        ...odItem,
        quantity: order.items[odItemIdx].quantity + 1,
      });
    },
    onSuccess({ data }, { odId, odItem }) {
      client.setQueryData<Order>(
        [QUERY_KEY, odId],
        produce(order => {
          const odItemIdx = (order as Order).items.findIndex(
            item => item.product.id === odItem.product.id,
          );
          (order as Order).items[odItemIdx] = data;
        }),
      );
    },
  });
}
