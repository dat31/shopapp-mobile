import { Order, OrderItem } from '@/models/Order';
import { ORDER_QUERY_KEY } from '@/query';
import { useSetOrdersQueryData } from '@/query/queries/orders';
import orderItemService from '@/services/order-item-service';
import { AxiosError, AxiosResponse } from 'axios';
import { produce } from 'immer';
import { useMutation, useQueryClient } from 'react-query';

export default function useDeleteMutation() {
  const client = useQueryClient();
  const setQueryData = useSetOrdersQueryData();
  return useMutation<
    AxiosResponse<void>,
    AxiosError,
    { orderId: Order['id']; id: OrderItem['id'] }
  >({
    mutationFn({ id }) {
      return orderItemService.delete(id);
    },
    onSuccess(_, { orderId, id }) {
      client.setQueryData(
        [ORDER_QUERY_KEY, orderId],
        produce<Order>(order => {
          order.items = order.items.filter(item => item.id !== id);
        }),
      );
      // setQueryData(
      //   produce<Order[]>(orders => {
      //     const order = orders.find(item => item.id === orderId);
      //     if (!order) {
      //       return;
      //     }
      //     order.items = order.items.filter(item => item.id !== id);
      //   }),
      // );
    },
  });
}
