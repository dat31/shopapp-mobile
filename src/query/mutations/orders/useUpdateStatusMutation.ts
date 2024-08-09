import { Order, Status } from '@/models/Order';
import { ORDER_QUERY_KEY } from '@/query';
import { useSetOrdersQueryData } from '@/query/queries/orders';
import orderService from '@/services/order-service';
import { AxiosError, AxiosResponse } from 'axios';
import { produce } from 'immer';
import { useMutation, useQueryClient } from 'react-query';

export default function useUpdateStatusMutation() {
  const client = useQueryClient();
  const setQueryData = useSetOrdersQueryData();
  return useMutation<AxiosResponse<Order>, AxiosError, Partial<Order>>({
    mutationFn({ id, status }) {
      if (status === Status.CANCELED) {
        return orderService.cancel(id as number);
      }
      return orderService.complete(id as number);
    },
    onSuccess({ data }, { id }) {
      setQueryData(
        produce(orders => {
          if (!orders) {
            return;
          }
          const idx = orders.findIndex(od => od.id === id);
          if (idx === -1) {
            return;
          }
          orders[idx].status = data.status;
        }),
      );
      client.setQueryData(
        [ORDER_QUERY_KEY, id],
        produce(od => {
          od.status = data.status;
        }),
      );
    },
  });
}
