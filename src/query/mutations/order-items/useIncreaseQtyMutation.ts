import { Order, OrderItem } from '@/models/Order';
import { QUERY_KEY } from '@/query/queries/orders';
import { service } from '@/services';
import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
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
      console.log('mutate', { odId, odItem });

      const order = client.getQueryData<Order>([QUERY_KEY, odId]) as Order;
      const odItemIdx = order?.items.findIndex(
        item => item.product.id === odItem.product.id,
      ) as number;

      if (odItemIdx === -1) {
        return service.post(`/orders/items/${odId}`, odItem);
      }

      return service.patch(`/order-items/${order?.items[odItemIdx].id}`, {
        ...odItem,
        quantity: order.items[odItemIdx].quantity + 1,
      });
    },
    onSuccess({ data, status }, { odId }) {
      if (status === HttpStatusCode.Created) {
        client.setQueryData(
          [QUERY_KEY, odId],
          produce(order => {
            order.items.push(data);
          }),
        );
        client.setQueryData(
          QUERY_KEY,
          produce<Order[]>(orders => {
            const order = orders.find(item => item.id === data.order.id);
            if (!order) {
              return;
            }
            order.items.push(data);
          }),
        );
        return;
      }

      client.setQueryData(
        [QUERY_KEY, odId],
        produce<Order>(order => {
          const index = order.items.findIndex(item => item.id === data.id);
          order.items[index].quantity = data.quantity;
        }),
      );

      client.setQueryData(
        QUERY_KEY,
        produce<Order[]>(orders => {
          const orderIndex = orders.findIndex(item => item.id === odId);
          if (orderIndex === -1) {
            return;
          }
          const orderItemIndex = orders[orderIndex].items.findIndex(
            item => item.id === data.id,
          );
          if (orderItemIndex === -1) {
            return;
          }

          orders[orderIndex].items[orderItemIndex].quantity =
            orders[orderIndex].items[orderItemIndex].quantity + 1;
        }),
      );
    },
  });
}
