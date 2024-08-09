import { Order } from '@/models/Order';
import { ORDER_QUERY_KEY } from '@/query';
import { service } from '@/services/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { produce } from 'immer';
import { assign } from 'lodash';
import { useMutation, useQueryClient } from 'react-query';

export default function useUpdateMutation() {
  const client = useQueryClient();
  return useMutation<AxiosResponse<Order>, AxiosError, Partial<Order>>({
    mutationFn({ id, ...data }) {
      return service.patch(`/orders/${id}`, data);
    },
    onSuccess(_, newData) {
      client.setQueryData<Order[]>(
        ORDER_QUERY_KEY,
        produce(orders => {
          if (!orders) {
            return;
          }
          const idx = orders.findIndex(od => od.id === newData.id);
          if (idx === -1) {
            return;
          }
          orders[idx] = newData as Order;
        }),
      );

      client.setQueryData(
        [ORDER_QUERY_KEY, newData.id],
        produce(order => {
          order = assign(order, newData);
        }),
      );
    },
  });
}
