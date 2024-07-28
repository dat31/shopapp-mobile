import { Order } from '@/models/Order';
import { QUERY_KEY, useSetOrdersQueryData } from '@/query/queries/orders';
import { useOrderStore } from '@/screens/orders/store';
import { service } from '@/services/axios';
import { AxiosError } from 'axios';
import { produce } from 'immer';
import { useMutation, useQueryClient } from 'react-query';

export default function useCreateMutation() {
  const setQueryData = useSetOrdersQueryData();
  const client = useQueryClient();
  return useMutation<Order, AxiosError, Partial<Order>>({
    mutationFn(order) {
      return service.post<Order>('/orders', order).then(({ data }) => data);
    },
    onSuccess(data) {
      client.invalidateQueries([QUERY_KEY]);
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
