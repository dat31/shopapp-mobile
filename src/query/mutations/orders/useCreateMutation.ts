import { Order } from '@/models/Order';
import { ORDER_QUERY_KEY } from '@/query';
import { useSetOrdersQueryData } from '@/query/queries/orders';
import orderService from '@/services/order-service';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useCreateMutation() {
  const setQueryData = useSetOrdersQueryData();
  const client = useQueryClient();
  return useMutation<Order, AxiosError, Partial<Order>>({
    mutationFn(order) {
      return orderService.create(order).then(({ data }) => data);
    },
    onSuccess(data) {
      client.invalidateQueries([ORDER_QUERY_KEY]);
      // setQueryData(
      //   produce<Order[]>(orders => {
      //     orders.unshift({
      //       ...data,
      //     });
      //   }),
      // );
    },
  });
}
