import { Order, OrderItem } from '@/models/Order';
import { QUERY_KEY, useSetOrdersQueryData } from '@/query/queries/orders';
import { service } from '@/services/axios';
import { AxiosError } from 'axios';
import { produce } from 'immer';
import { useMutation, useQueryClient } from 'react-query';

export default function useDeleteMutation() {
  const client = useQueryClient();
  const setQueryData = useSetOrdersQueryData();
  return useMutation<
    void,
    AxiosError,
    { orderId: Order['id']; id: OrderItem['id'] }
  >({
    mutationFn({ id }) {
      return service.delete(`/order-items/${id}`);
    },
    onSuccess(_, { orderId, id }) {
      client.setQueryData(
        [QUERY_KEY, orderId],
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
