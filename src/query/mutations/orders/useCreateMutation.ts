import { Order } from '@/models/Order';
import { QUERY_KEY } from '@/query/queries/orders';
import { service } from '@/services/axios';
import { AxiosError } from 'axios';
import { produce } from 'immer';
import { useMutation, useQueryClient } from 'react-query';

export default function useCreateMutation() {
  const client = useQueryClient();
  return useMutation<Order, AxiosError, Partial<Order>>({
    mutationFn(order) {
      return service.post<Order>('/orders', order).then(({ data }) => data);
    },
    onSuccess(data) {
      console.log('useCreateMutation', data);

      client.setQueryData(
        QUERY_KEY,
        produce<Order[]>(orders => {
          orders.push(data);
        }),
      );
    },
  });
}
